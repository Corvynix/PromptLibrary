import { Router, type Response } from "express";
import { z } from "zod";
import { db } from "../db";
import {
  projects,
  projectUpdates,
  analyticsEvents,
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { authenticate, type AuthRequest } from "../middleware/auth";
import { writeRateLimit } from "../middleware/rateLimit";
import { getFeatureFlag } from "../services/featureFlags";

const router = Router();

const projectSchema = z.object({
  name: z.string().min(2, "الاسم قصير جداً").max(100),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "الـslug يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط")
    .optional(),
  description: z.string().max(1000).optional(),
  url: z.string().url().optional().or(z.literal("")),
  category: z.string().optional(),
  stage: z
    .enum(["idea", "building", "live", "trying_to_sell", "first_sale", "growing"])
    .default("building"),
  technologies: z.array(z.string()).optional(),
  aiToolsUsed: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
  monetizationModel: z.string().optional(),
  price: z.string().optional(),
  isPublic: z.boolean().default(false),
});

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50) + "-" + Date.now().toString(36);
}

// GET /api/projects — my projects
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const myProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, req.user!.id))
      .orderBy(desc(projects.updatedAt));

    return res.json({ projects: myProjects });
  } catch (err) {
    console.error("list projects error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/projects — create
router.post("/", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const data = projectSchema.parse(req.body);
    const slug = data.slug || generateSlug(data.name);

    const [project] = await db
      .insert(projects)
      .values({
        userId: req.user!.id,
        name: data.name,
        slug,
        description: data.description ?? null,
        url: data.url || null,
        category: data.category ?? null,
        stage: data.stage,
        technologies: data.technologies ?? [],
        aiToolsUsed: data.aiToolsUsed ?? [],
        targetAudience: data.targetAudience ?? null,
        monetizationModel: data.monetizationModel ?? null,
        price: data.price ?? null,
        isPublic: data.isPublic,
      })
      .returning();

    await db.insert(analyticsEvents).values({
      userId: req.user!.id,
      event: "project_created",
      properties: { projectId: project.id },
    }).catch(() => {});

    return res.status(201).json({ project });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error("create project error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/projects/:id
router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(projects).where(eq(projects.id, req.params.id));
    if (rows.length === 0) {
      return res.status(404).json({ error: "المشروع غير موجود." });
    }
    const project = rows[0];
    if (project.userId !== req.user!.id && !(await getFeatureFlag("PUBLIC_PROJECTS"))) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (project.userId !== req.user!.id && !project.isPublic) {
      return res.status(403).json({ error: "ليس لديك صلاحية." });
    }

    const updates = await db
      .select()
      .from(projectUpdates)
      .where(eq(projectUpdates.projectId, project.id))
      .orderBy(desc(projectUpdates.createdAt));

    return res.json({ project, updates });
  } catch (err) {
    console.error("get project error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// PATCH /api/projects/:id
router.patch("/:id", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(projects).where(eq(projects.id, req.params.id));
    if (rows.length === 0) return res.status(404).json({ error: "المشروع غير موجود." });
    if (rows[0].userId !== req.user!.id) return res.status(403).json({ error: "ليس لديك صلاحية." });

    const data = projectSchema.partial().parse(req.body);
    const [updated] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user!.id)))
      .returning();

    return res.json({ project: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error("update project error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(projects).where(eq(projects.id, req.params.id));
    if (rows.length === 0) return res.status(404).json({ error: "المشروع غير موجود." });
    if (rows[0].userId !== req.user!.id) return res.status(403).json({ error: "ليس لديك صلاحية." });

    await db.delete(projects).where(eq(projects.id, req.params.id));
    return res.json({ success: true });
  } catch (err) {
    console.error("delete project error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/projects/:id/updates
router.post("/:id/updates", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(projects).where(eq(projects.id, req.params.id));
    if (rows.length === 0) return res.status(404).json({ error: "المشروع غير موجود." });
    if (rows[0].userId !== req.user!.id) return res.status(403).json({ error: "ليس لديك صلاحية." });

    const { content } = z.object({ content: z.string().min(10).max(2000) }).parse(req.body);

    const [update] = await db
      .insert(projectUpdates)
      .values({ projectId: req.params.id, userId: req.user!.id, content })
      .returning();

    return res.status(201).json({ update });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

export default router;
