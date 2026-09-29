import { Router, type Response, type Request } from "express";
import { db } from "../db";
import { repoItems, analyticsEvents } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { optionalAuth, type AuthRequest } from "../middleware/auth";

const router = Router();
const PAGE_SIZE = 20;

// GET /api/repos
router.get("/", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10));
    const offset = (page - 1) * PAGE_SIZE;

    const items = await db
      .select()
      .from(repoItems)
      .orderBy(desc(repoItems.isFeatured), desc(repoItems.dateDiscovered ?? repoItems.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset);

    await db.insert(analyticsEvents).values({
      userId: req.user?.id ?? null,
      event: "repos_viewed",
    }).catch(() => {});

    return res.json({ items, page, hasMore: items.length === PAGE_SIZE });
  } catch (err) {
    console.error("repos list error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/repos/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(repoItems).where(eq(repoItems.id, req.params.id));
    if (rows.length === 0) return res.status(404).json({ error: "الـ Repository غير موجود." });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

export default router;
