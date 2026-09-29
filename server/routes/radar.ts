import { Router, type Response, type Request } from "express";
import { z } from "zod";
import { db } from "../db";
import { radarItems, repoItems, resources, analyticsEvents } from "@shared/schema";
import { eq, and, desc, asc, or } from "drizzle-orm";
import { optionalAuth, type AuthRequest } from "../middleware/auth";

const router = Router();
const PAGE_SIZE = 20;

// ─── Radar ─────────────────────────────────────────────

// GET /api/radar
router.get("/", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10));
    const offset = (page - 1) * PAGE_SIZE;

    const VALID_CATEGORIES = [
      "ai_models", "ai_coding", "ai_agents", "ai_tools",
      "github", "apis", "product_opportunities", "useful_releases",
    ];

    const items = await db
      .select()
      .from(radarItems)
      .where(
        and(
          eq(radarItems.isArchived, false),
          category && VALID_CATEGORIES.includes(category)
            ? eq(radarItems.category, category as any)
            : undefined
        )
      )
      .orderBy(desc(radarItems.isFeatured), desc(radarItems.publishedAt ?? radarItems.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset);

    await db.insert(analyticsEvents).values({
      userId: req.user?.id ?? null,
      event: "radar_viewed",
      properties: { category: category ?? "all" },
    }).catch(() => {});

    return res.json({ items, page, hasMore: items.length === PAGE_SIZE });
  } catch (err) {
    console.error("radar list error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/radar/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(radarItems).where(eq(radarItems.id, req.params.id));
    if (rows.length === 0) return res.status(404).json({ error: "العنصر غير موجود." });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

export default router;
