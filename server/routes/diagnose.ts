import { Router, type Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { analyticsEvents, diagnosisResults } from "@shared/schema";
import { diagnosisInputSchema } from "@shared/types";
import { optionalAuth, type AuthRequest } from "../middleware/auth";
import { rateLimit } from "../middleware/rateLimit";
import { runDiagnosis } from "../services/diagnosis";

const router = Router();

router.post("/", optionalAuth, rateLimit(20, 60_000), async (req: AuthRequest, res: Response) => {
  const parsed = diagnosisInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "راجع إجابات التشخيص وحاول تاني." });

  try {
    const data = parsed.data;
    const result = runDiagnosis(data);
    const [saved] = await db.insert(diagnosisResults).values({
      userId: req.user?.id ?? null,
      sessionId: data.sessionId ?? null,
      answers: data,
      result,
    }).returning({ id: diagnosisResults.id });

    await db.insert(analyticsEvents).values({
      userId: req.user?.id ?? null,
      sessionId: data.sessionId ?? null,
      event: "diagnosis_completed",
      properties: { bottleneck: result.bottleneck },
    }).catch((error: unknown) => console.error("diagnosis analytics write failed", error));

    return res.status(201).json({ id: saved.id, result });
  } catch (error) {
    console.error("diagnose error", error);
    return res.status(500).json({ error: "حصل خطأ. حاول تاني بعد شوية." });
  }
});

router.get("/:id", async (req, res: Response) => {
  if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) return res.status(404).json({ error: "نتيجة التشخيص مش موجودة." });
  try {
    const [row] = await db.select({ id: diagnosisResults.id, result: diagnosisResults.result })
      .from(diagnosisResults).where(eq(diagnosisResults.id, req.params.id)).limit(1);
    if (!row) return res.status(404).json({ error: "نتيجة التشخيص مش موجودة." });
    return res.json(row);
  } catch (error) {
    console.error("get diagnosis error", error);
    return res.status(500).json({ error: "حصل خطأ. حاول تاني بعد شوية." });
  }
});

export default router;
