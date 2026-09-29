import { Router, type Response } from "express";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { analyticsEvents, diagnosisResults, salesExperiments } from "@shared/schema";
import { authenticate, type AuthRequest } from "../middleware/auth";
import { writeRateLimit } from "../middleware/rateLimit";

const router = Router();
const createSchema = z.object({
  diagnosisId: z.string().uuid().optional(),
  hypothesis: z.string().trim().min(5).max(1000),
  audience: z.string().trim().min(2).max(500),
  channel: z.string().trim().min(2).max(100),
  message: z.string().trim().min(2).max(4000),
  sampleSize: z.number().int().min(1).max(10000),
  metric: z.string().trim().min(2).max(500),
});
const updateSchema = z.object({
  status: z.enum(["planned", "active", "completed", "cancelled"]).optional(),
  actualResult: z.string().trim().max(4000).optional(),
  interpretation: z.string().trim().max(2000).optional(),
  nextDecision: z.string().trim().max(2000).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).refine((value) => Object.keys(value).length > 0);

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const experiments = await db.select().from(salesExperiments)
      .where(eq(salesExperiments.userId, req.user!.id))
      .orderBy(desc(salesExperiments.createdAt)).limit(100);
    return res.json({ experiments });
  } catch (error) {
    console.error("list experiments error", error);
    return res.status(500).json({ error: "Could not load experiments" });
  }
});

router.post("/", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Check the experiment fields and try again." });
  try {
    const data = parsed.data;
    if (data.diagnosisId) {
      const [owned] = await db.select({ id: diagnosisResults.id }).from(diagnosisResults)
        .where(and(eq(diagnosisResults.id, data.diagnosisId), eq(diagnosisResults.userId, req.user!.id))).limit(1);
      if (!owned) return res.status(404).json({ error: "Diagnosis not found" });
    }
    const [experiment] = await db.insert(salesExperiments).values({ ...data, userId: req.user!.id }).returning();
    await db.insert(analyticsEvents).values({ userId: req.user!.id, event: "experiment_created" }).catch(() => {});
    return res.status(201).json({ experiment });
  } catch (error) {
    console.error("create experiment error", error);
    return res.status(500).json({ error: "Could not save experiment" });
  }
});

router.patch("/:id", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  if (!z.string().uuid().safeParse(req.params.id).success) return res.status(404).json({ error: "Experiment not found" });
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Check the experiment update and try again." });
  try {
    const updates = parsed.data;
    const [experiment] = await db.update(salesExperiments).set({
      ...updates,
      startDate: updates.startDate ? new Date(updates.startDate) : undefined,
      endDate: updates.endDate ? new Date(updates.endDate) : undefined,
      updatedAt: new Date(),
    }).where(and(eq(salesExperiments.id, req.params.id), eq(salesExperiments.userId, req.user!.id))).returning();
    if (!experiment) return res.status(404).json({ error: "Experiment not found" });
    if (experiment.status === "completed") await db.insert(analyticsEvents).values({ userId: req.user!.id, event: "experiment_completed" }).catch(() => {});
    return res.json({ experiment });
  } catch (error) {
    console.error("update experiment error", error);
    return res.status(500).json({ error: "Could not update experiment" });
  }
});

export default router;
