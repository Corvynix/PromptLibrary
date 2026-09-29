import { Router, type Response } from "express";
import { z } from "zod";
import { db } from "../db";
import {
  sprintProducts,
  sprintDays,
  sprintEnrollments,
  sprintEntries,
  prospects,
  outreachLogs,
  salesLeads,
  analyticsEvents,
  entitlements,
} from "@shared/schema";
import { eq, and, asc, inArray, isNull } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middleware/auth";
import { writeRateLimit } from "../middleware/rateLimit";
import { getSiteSetting } from "../services/featureFlags";
import { checkSprintAccess } from "../services/entitlements";
import { hasSprintReflection } from "../services/sprintProgress";

const router = Router();

// GET /api/sprint — sprint product info + current price
router.get("/", async (_req, res: Response) => {
  try {
    const products = await db
      .select()
      .from(sprintProducts)
      .where(eq(sprintProducts.isActive, true));

    const priceEgp = await getSiteSetting("sprint_price_egp", "199");
    const membershipPriceEgp = await getSiteSetting("membership_price_egp", "10");
    const instapayPhone = await getSiteSetting("instapay_phone", "");
    const instapayName = await getSiteSetting("instapay_name", "");

    return res.json({
      products,
      pricing: { sprintPriceEgp: priceEgp, membershipPriceEgp, instapayPhone, instapayName },
    });
  } catch (err) {
    console.error("sprint info error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/sprint/days — all day definitions
router.get("/days", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!(await checkSprintAccess(req.user!.id))) return res.status(403).json({ error: "Sprint access required" });
    const products = await db
      .select()
      .from(sprintProducts)
      .where(eq(sprintProducts.isActive, true));

    if (products.length === 0) {
      return res.json({ days: [] });
    }

    const days = await db
      .select()
      .from(sprintDays)
      .where(eq(sprintDays.sprintProductId, products[0].id))
      .orderBy(asc(sprintDays.dayNumber));

    return res.json({ days });
  } catch (err) {
    console.error("sprint days error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/sprint/enrollment — my enrollment
router.get("/enrollment", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await db
      .select()
      .from(sprintEnrollments)
      .where(
        and(
          eq(sprintEnrollments.userId, req.user!.id),
          inArray(sprintEnrollments.status, ["active", "completed"])
        )
      ).orderBy(asc(sprintEnrollments.startedAt)).limit(1);

    if (enrollments.length === 0) {
      return res.json({ enrollment: null });
    }

    const enrollment = enrollments[0];
    const entries = await db
      .select()
      .from(sprintEntries)
      .where(eq(sprintEntries.enrollmentId, enrollment.id));

    return res.json({ enrollment, entries });
  } catch (err) {
    console.error("enrollment error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/sprint/access — check sprint access
router.get("/access", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const hasAccess = await checkSprintAccess(req.user!.id);
    return res.json({ hasAccess });
  } catch (err) {
    console.error("access check error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/sprint/start — start sprint (requires entitlement)
router.post("/start", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const hasAccess = await checkSprintAccess(req.user!.id);
    if (!hasAccess) {
      return res.status(403).json({ error: "يجب شراء التحدي أولاً." });
    }

    // Check if already enrolled
    const existing = await db
      .select()
      .from(sprintEnrollments)
      .where(
        and(
          eq(sprintEnrollments.userId, req.user!.id),
          inArray(sprintEnrollments.status, ["active", "completed"])
        )
      );
    if (existing.length > 0) {
      return existing[0].status === "active"
        ? res.json({ enrollment: existing[0] })
        : res.status(409).json({ error: "The sprint has already been completed" });
    }

    const products = await db
      .select()
      .from(sprintProducts)
      .where(eq(sprintProducts.isActive, true));
    if (products.length === 0) {
      return res.status(404).json({ error: "التحدي غير متاح حالياً." });
    }

    const [enrollment] = await db
      .insert(sprintEnrollments)
      .values({
        userId: req.user!.id,
        sprintProductId: products[0].id,
        currentDay: 0,
        status: "active",
      })
      .returning();

    await db.insert(analyticsEvents).values({
      userId: req.user!.id,
      event: "sprint_started",
      properties: { enrollmentId: enrollment.id },
    }).catch(() => {});

    return res.status(201).json({ enrollment });
  } catch (err) {
    console.error("sprint start error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/sprint/entry/:day
router.get("/entry/:day", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const parsedDay = z.coerce.number().int().min(0).max(7).safeParse(req.params.day);
    if (!parsedDay.success) return res.status(400).json({ error: "Invalid sprint day" });
    const dayNum = parsedDay.data;

    const enrollments = await db
      .select()
      .from(sprintEnrollments)
      .where(
        and(
          eq(sprintEnrollments.userId, req.user!.id),
          eq(sprintEnrollments.status, "active")
        )
      );
    if (enrollments.length === 0) {
      return res.status(404).json({ error: "لم يتم الانضمام للتحدي." });
    }

    const entries = await db
      .select()
      .from(sprintEntries)
      .where(
        and(
          eq(sprintEntries.enrollmentId, enrollments[0].id),
          eq(sprintEntries.dayNumber, dayNum)
        )
      );

    return res.json({ entry: entries[0] ?? null, enrollment: enrollments[0] });
  } catch (err) {
    console.error("get entry error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST/PATCH /api/sprint/entry/:day — save entry (autosave)
router.post("/entry/:day", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const parsedDay = z.coerce.number().int().min(0).max(7).safeParse(req.params.day);
    if (!parsedDay.success) return res.status(400).json({ error: "Invalid sprint day" });
    const dayNum = parsedDay.data;

    const schema = z.object({
      inputData: z.record(z.unknown()).optional(),
      outputData: z.record(z.unknown()).optional(),
      isCompleted: z.boolean().optional(),
    });
    const data = schema.parse(req.body);

    const enrollments = await db
      .select()
      .from(sprintEnrollments)
      .where(
        and(
          eq(sprintEnrollments.userId, req.user!.id),
          eq(sprintEnrollments.status, "active")
        )
      );
    if (enrollments.length === 0) {
      return res.status(404).json({ error: "لم يتم الانضمام للتحدي." });
    }

    const enrollment = enrollments[0];
    if (dayNum !== enrollment.currentDay) return res.status(409).json({ error: "Complete the current day before changing another day" });

    // Upsert entry
    const existing = await db
      .select()
      .from(sprintEntries)
      .where(
        and(
          eq(sprintEntries.enrollmentId, enrollment.id),
          eq(sprintEntries.dayNumber, dayNum)
        )
      );

    const savedInput = data.inputData ?? existing[0]?.inputData ?? {};
    if (data.isCompleted && !hasSprintReflection(savedInput)) {
      return res.status(400).json({ error: "Add a short reflection before completing this day." });
    }

    let entry;
    if (existing.length > 0) {
      const [updated] = await db
        .update(sprintEntries)
        .set({
          inputData: savedInput,
          outputData: data.outputData ?? existing[0].outputData,
          isCompleted: data.isCompleted ?? existing[0].isCompleted,
          completedAt:
            data.isCompleted && !existing[0].isCompleted ? new Date() : existing[0].completedAt,
          updatedAt: new Date(),
        })
        .where(eq(sprintEntries.id, existing[0].id))
        .returning();
      entry = updated;
    } else {
      const [created] = await db
        .insert(sprintEntries)
        .values({
          enrollmentId: enrollment.id,
          dayNumber: dayNum,
          inputData: savedInput,
          outputData: data.outputData ?? {},
          isCompleted: data.isCompleted ?? false,
          completedAt: data.isCompleted ? new Date() : null,
        })
        .returning();
      entry = created;
    }

    // Advance current day if completing
    if (data.isCompleted) {
      await db
        .update(sprintEnrollments)
        .set({
          currentDay: dayNum + 1,
          ...(dayNum === 7 ? { status: "completed" as const, completedAt: new Date() } : {}),
        })
        .where(eq(sprintEnrollments.id, enrollment.id));

      await db.insert(analyticsEvents).values({
        userId: req.user!.id,
        event: "sprint_day_completed",
        properties: { day: dayNum, enrollmentId: enrollment.id },
      }).catch(() => {});
    }

    return res.json({ entry });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error("save entry error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/sprint/prospects
router.get("/prospects", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await db
      .select()
      .from(sprintEnrollments)
      .where(and(eq(sprintEnrollments.userId, req.user!.id), eq(sprintEnrollments.status, "active")));
    if (enrollments.length === 0) return res.json({ prospects: [] });

    const list = await db
      .select()
      .from(prospects)
      .where(eq(prospects.enrollmentId, enrollments[0].id))
      .orderBy(asc(prospects.createdAt));

    return res.json({ prospects: list });
  } catch (err) {
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/sprint/prospects
router.post("/prospects", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      business: z.string().optional(),
      segment: z.string().optional(),
      location: z.string().optional(),
      reasonToCare: z.string().optional(),
      contactChannel: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const enrollments = await db
      .select()
      .from(sprintEnrollments)
      .where(and(eq(sprintEnrollments.userId, req.user!.id), eq(sprintEnrollments.status, "active")));
    if (enrollments.length === 0) return res.status(403).json({ error: "انضم للتحدي أولاً." });

    const [prospect] = await db
      .insert(prospects)
      .values({ ...data, enrollmentId: enrollments[0].id })
      .returning();

    await db.insert(analyticsEvents).values({
      userId: req.user!.id,
      event: "prospect_added",
    }).catch(() => {});

    return res.status(201).json({ prospect });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// PATCH /api/sprint/prospects/:id
router.patch("/prospects/:id", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      name: z.string().optional(),
      business: z.string().optional(),
      segment: z.string().optional(),
      location: z.string().optional(),
      reasonToCare: z.string().optional(),
      contactChannel: z.string().optional(),
      status: z.string().optional(),
      response: z.string().optional(),
    });
    const data = schema.parse(req.body);

    // Verify ownership via enrollment
    const rows = await db.select().from(prospects).where(eq(prospects.id, req.params.id));
    if (rows.length === 0) return res.status(404).json({ error: "لم يتم العثور على العميل المحتمل." });

    const enrollment = await db
      .select()
      .from(sprintEnrollments)
      .where(and(eq(sprintEnrollments.id, rows[0].enrollmentId), eq(sprintEnrollments.userId, req.user!.id)));
    if (enrollment.length === 0) return res.status(403).json({ error: "ليس لديك صلاحية." });

    const [updated] = await db
      .update(prospects)
      .set({ ...data, contactedAt: data.status === "contacted" ? new Date() : rows[0].contactedAt })
      .where(eq(prospects.id, req.params.id))
      .returning();

    return res.json({ prospect: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/sprint/outreach
router.get("/outreach", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await db
      .select()
      .from(sprintEnrollments)
      .where(and(eq(sprintEnrollments.userId, req.user!.id), eq(sprintEnrollments.status, "active")));
    if (enrollments.length === 0) return res.json({ logs: [] });

    const logs = await db
      .select()
      .from(outreachLogs)
      .where(eq(outreachLogs.enrollmentId, enrollments[0].id));

    return res.json({ logs });
  } catch (err) {
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/sprint/outreach
router.post("/outreach", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      prospectId: z.string().uuid().optional(),
      response: z.string().optional(),
      pain: z.string().optional(),
      currentSolution: z.string().optional(),
      moneySpent: z.string().optional(),
      interested: z.boolean().optional(),
      nextStep: z.string().optional(),
      objection: z.string().optional(),
      priceDiscussed: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const enrollments = await db
      .select()
      .from(sprintEnrollments)
      .where(and(eq(sprintEnrollments.userId, req.user!.id), eq(sprintEnrollments.status, "active")));
    if (enrollments.length === 0) return res.status(403).json({ error: "انضم للتحدي أولاً." });

    const [log] = await db
      .insert(outreachLogs)
      .values({ ...data, enrollmentId: enrollments[0].id })
      .returning();

    await db.insert(analyticsEvents).values({
      userId: req.user!.id,
      event: "outreach_logged",
    }).catch(() => {});

    return res.status(201).json({ log });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/sprint/leads
router.get("/leads", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await db
      .select()
      .from(sprintEnrollments)
      .where(and(eq(sprintEnrollments.userId, req.user!.id), eq(sprintEnrollments.status, "active")));
    if (enrollments.length === 0) return res.json({ leads: [] });

    const leads = await db
      .select()
      .from(salesLeads)
      .where(eq(salesLeads.enrollmentId, enrollments[0].id));

    return res.json({ leads });
  } catch (err) {
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/sprint/leads
router.post("/leads", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      status: z.enum(["interested", "demo", "proposal", "paid", "rejected", "follow_up"]).optional(),
      notes: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const enrollments = await db
      .select()
      .from(sprintEnrollments)
      .where(and(eq(sprintEnrollments.userId, req.user!.id), eq(sprintEnrollments.status, "active")));
    if (enrollments.length === 0) return res.status(403).json({ error: "انضم للتحدي أولاً." });

    const [lead] = await db
      .insert(salesLeads)
      .values({ ...data, enrollmentId: enrollments[0].id })
      .returning();

    if (data.status === "paid") {
      await db.insert(analyticsEvents).values({
        userId: req.user!.id,
        event: "sale_logged",
      }).catch(() => {});
    }

    return res.status(201).json({ lead });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// PATCH /api/sprint/leads/:id
router.patch("/leads/:id", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      status: z.enum(["interested", "demo", "proposal", "paid", "rejected", "follow_up"]).optional(),
      notes: z.string().optional(),
      demoDate: z.string().datetime().optional(),
      proposalDate: z.string().datetime().optional(),
    });
    const data = schema.parse(req.body);

    const rows = await db.select().from(salesLeads).where(eq(salesLeads.id, req.params.id));
    if (rows.length === 0) return res.status(404).json({ error: "لم يتم العثور على العميل." });

    const enrollment = await db
      .select()
      .from(sprintEnrollments)
      .where(and(eq(sprintEnrollments.id, rows[0].enrollmentId), eq(sprintEnrollments.userId, req.user!.id)));
    if (enrollment.length === 0) return res.status(403).json({ error: "ليس لديك صلاحية." });

    const [updated] = await db
      .update(salesLeads)
      .set({
        ...data,
        demoDate: data.demoDate ? new Date(data.demoDate) : rows[0].demoDate,
        proposalDate: data.proposalDate ? new Date(data.proposalDate) : rows[0].proposalDate,
        paidAt: data.status === "paid" ? new Date() : rows[0].paidAt,
        rejectedAt: data.status === "rejected" ? new Date() : rows[0].rejectedAt,
      })
      .where(eq(salesLeads.id, req.params.id))
      .returning();

    return res.json({ lead: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

export default router;
