import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "../db";
import { users, profiles, analyticsEvents } from "@shared/schema";
import { eq } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middleware/auth";
import { authRateLimit, writeRateLimit } from "../middleware/rateLimit";
import { jwtSecret } from "../config";

const router = Router();
const registerSchema = z.object({
  email: z.string().trim().email("البريد الإلكتروني غير صالح").transform((email) => email.toLowerCase()),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 حروف على الأقل").refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Password is too long"),
  displayName: z.string().trim().min(2, "الاسم قصير جداً").max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(1).refine((password) => Buffer.byteLength(password, "utf8") <= 72, "Password is too long"),
});

function makeToken(user: { id: number; email: string; roles: string }) {
  const roles = (() => {
    try {
      return JSON.parse(user.roles) as string[];
    } catch {
      return ["user"];
    }
  })();
  return jwt.sign({ id: user.id, email: user.email, roles }, jwtSecret, {
    expiresIn: "7d",
  });
}

function safeUser(user: typeof users.$inferSelect) {
  const { password, ...rest } = user;
  void password;
  const roles = (() => {
    try {
      return JSON.parse(rest.roles) as string[];
    } catch {
      return ["user"];
    }
  })();
  return { ...rest, roles };
}

// POST /api/auth/register
router.post("/register", authRateLimit, async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await db.select().from(users).where(eq(users.email, data.email));
    if (existing.length > 0) {
      return res.status(400).json({ error: "البريد الإلكتروني مسجل بالفعل." });
    }

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await db.transaction(async (tx) => {
      const [created] = await tx.insert(users).values({
        email: data.email,
        password: hashed,
        displayName: data.displayName ?? null,
        roles: '["user"]',
      }).returning();
      await tx.insert(profiles).values({ userId: created.id, onboardingCompleted: false });
      return created;
    });

    // Analytics
    await db.insert(analyticsEvents).values({
      userId: user.id,
      event: "signup_completed",
      properties: { method: "email" },
    }).catch(() => {});

    const token = makeToken(user);
    return res.status(201).json({ user: safeUser(user), token });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    if (err?.code === "23505") return res.status(409).json({ error: "An account with this email already exists" });
    console.error("register error", err);
    return res.status(500).json({ error: "حدث خطأ. حاول مرة أخرى." });
  }
});

// POST /api/auth/login
router.post("/login", authRateLimit, async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const rows = await db.select().from(users).where(eq(users.email, data.email));
    if (rows.length === 0) {
      return res.status(401).json({ error: "البيانات غير صحيحة." });
    }

    const user = rows[0];
    if (user.isBanned) {
      return res.status(403).json({ error: "تم حظر هذا الحساب." });
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "البيانات غير صحيحة." });
    }

    const token = makeToken(user);
    return res.json({ user: safeUser(user), token });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "بيانات غير صالحة." });
    }
    console.error("login error", err);
    return res.status(500).json({ error: "حدث خطأ. حاول مرة أخرى." });
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(users).where(eq(users.id, req.user!.id));
    if (rows.length === 0) {
      return res.status(404).json({ error: "المستخدم غير موجود." });
    }
    const user = rows[0];
    if (user.isBanned) {
      return res.status(403).json({ error: "تم حظر هذا الحساب." });
    }

    // Also get profile
    const profileRows = await db.select().from(profiles).where(eq(profiles.userId, user.id));
    const profile = profileRows[0] ?? null;

    return res.json({ ...safeUser(user), profile });
  } catch (err) {
    console.error("me error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/auth/onboarding
router.post("/onboarding", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      whatBuilt: z.string().optional(),
      targetAudience: z.string().optional(),
      hasSales: z.boolean().optional(),
      biggestStruggle: z.string().optional(),
      aiTools: z.array(z.string()).optional(),
      builderStatus: z.string().optional(),
    });
    const data = schema.parse(req.body);

    await db
      .update(profiles)
      .set({
        builderStatus: data.builderStatus ?? "trying_to_sell",
        aiTools: data.aiTools ?? [],
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, req.user!.id));

    // Analytics
    await db.insert(analyticsEvents).values({
      userId: req.user!.id,
      event: "onboarding_completed",
      properties: { builderStatus: data.builderStatus, aiToolCount: data.aiTools?.length ?? 0 },
    }).catch(() => {});

    return res.json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error("onboarding error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

export default router;
