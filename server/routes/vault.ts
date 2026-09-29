import { Router, type Response, type Request } from "express";
import { db } from "../db";
import { resources, analyticsEvents } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { optionalAuth, type AuthRequest } from "../middleware/auth";

const router = Router();
const PAGE_SIZE = 20;

// GET /api/vault
router.get("/", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    const category = req.query.category as string | undefined;
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10));
    const offset = (page - 1) * PAGE_SIZE;

    const VALID_TYPES = ["prompt", "template", "checklist", "tool", "workflow", "starter", "component", "guide", "github_repo"];

    const items = await db
      .select()
      .from(resources)
      .where(
        and(
          eq(resources.isPublished, true),
          type && VALID_TYPES.includes(type) ? eq(resources.resourceType, type as any) : undefined,
          category ? eq(resources.category, category) : undefined
        )
      )
      .orderBy(desc(resources.isFeatured), desc(resources.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset);

    await db.insert(analyticsEvents).values({
      userId: req.user?.id ?? null,
      event: "vault_viewed",
      properties: { type: type ?? "all", category: category ?? "all" },
    }).catch(() => {});

    return res.json({ resources: items, page, hasMore: items.length === PAGE_SIZE });
  } catch (err) {
    console.error("vault list error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/vault/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(resources).where(eq(resources.id, req.params.id));
    if (rows.length === 0) return res.status(404).json({ error: "المورد غير موجود." });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

export default router;
