import { Router, Request, Response } from "express";
import { insertApplicationSchema } from "@shared/schema";
import { storage } from "../storage";

const router = Router();

const applyBodySchema = insertApplicationSchema.omit({ id: true, createdAt: true });

router.post("/", async (req: Request, res: Response) => {
  const parsed = applyBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid application data", details: parsed.error.flatten() });
    return;
  }
  try {
    const app = await storage.createApplication(parsed.data);
    res.status(201).json({ ok: true, id: app.id });
  } catch (err) {
    console.error("Application submission error:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

export default router;
