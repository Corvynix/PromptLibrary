import { Router, type Response } from "express";
import { z } from "zod";
import { db } from "../db";
import {
  posts,
  comments,
  postLikes,
  bookmarks,
  reports,
  users,
  profiles,
  analyticsEvents,
} from "@shared/schema";
import { eq, and, desc, sql, inArray, not } from "drizzle-orm";
import { authenticate, optionalAuth, requireRole, type AuthRequest } from "../middleware/auth";
import { postRateLimit, writeRateLimit } from "../middleware/rateLimit";

const router = Router();

const POST_TYPES = ["build", "stuck", "sell", "feedback", "win", "tool", "ai", "general"] as const;
const PAGE_SIZE = 20;

// GET /api/posts — paginated feed
router.get("/", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10));
    const offset = (page - 1) * PAGE_SIZE;

    let query = db
      .select({
        post: posts,
        author: {
          id: users.id,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(
        and(
          eq(posts.status, "published"),
          type && POST_TYPES.includes(type as any)
            ? eq(posts.type, type as any)
            : undefined
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset);

    const rows = await query;

    // For authenticated users, check likes/bookmarks
    let likedIds: Set<string> = new Set();
    let bookmarkedIds: Set<string> = new Set();
    if (req.user) {
      const postIds = rows.map((r) => r.post.id);
      if (postIds.length > 0) {
        const likes = await db
          .select()
          .from(postLikes)
          .where(and(eq(postLikes.userId, req.user.id), inArray(postLikes.postId, postIds)));
        const bmarks = await db
          .select()
          .from(bookmarks)
          .where(and(eq(bookmarks.userId, req.user.id), inArray(bookmarks.postId, postIds)));
        likedIds = new Set(likes.map((l) => l.postId));
        bookmarkedIds = new Set(bmarks.map((b) => b.postId));
      }
    }

    return res.json({
      posts: rows.map((r) => ({
        ...r.post,
        author: r.author,
        isLiked: likedIds.has(r.post.id),
        isBookmarked: bookmarkedIds.has(r.post.id),
      })),
      page,
      hasMore: rows.length === PAGE_SIZE,
    });
  } catch (err) {
    console.error("list posts error", err);
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/posts — create post
router.post("/", authenticate, postRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      type: z.enum(POST_TYPES).default("general"),
      title: z.string().max(200).optional(),
      content: z.string().min(10, "المحتوى قصير جداً").max(5000),
      projectId: z.string().uuid().optional(),
    });
    const data = schema.parse(req.body);

    const [post] = await db
      .insert(posts)
      .values({ ...data, userId: req.user!.id })
      .returning();

    await db.insert(analyticsEvents).values({
      userId: req.user!.id,
      event: "post_created",
      properties: { type: data.type },
    }).catch(() => {});

    return res.status(201).json({ post });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// GET /api/posts/:id — single post with comments
router.get("/:id", optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select({
        post: posts,
        author: { id: users.id, displayName: users.displayName, avatarUrl: users.avatarUrl },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(and(eq(posts.id, req.params.id), eq(posts.status, "published")));

    if (rows.length === 0) return res.status(404).json({ error: "المنشور غير موجود." });

    const postRow = rows[0];

    const commentRows = await db
      .select({
        comment: comments,
        author: { id: users.id, displayName: users.displayName, avatarUrl: users.avatarUrl },
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(and(eq(comments.postId, req.params.id), eq(comments.status, "published")))
      .orderBy(desc(comments.createdAt));

    let isLiked = false;
    let isBookmarked = false;
    if (req.user) {
      const like = await db
        .select()
        .from(postLikes)
        .where(and(eq(postLikes.postId, req.params.id), eq(postLikes.userId, req.user.id)));
      const bmark = await db
        .select()
        .from(bookmarks)
        .where(and(eq(bookmarks.postId, req.params.id), eq(bookmarks.userId, req.user.id)));
      isLiked = like.length > 0;
      isBookmarked = bmark.length > 0;
    }

    return res.json({
      post: { ...postRow.post, author: postRow.author, isLiked, isBookmarked },
      comments: commentRows.map((c) => ({ ...c.comment, author: c.author })),
    });
  } catch (err) {
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// PATCH /api/posts/:id — edit own post
router.patch("/:id", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      content: z.string().min(10).max(5000).optional(),
      title: z.string().max(200).optional(),
    });
    const data = schema.parse(req.body);

    const rows = await db.select().from(posts).where(eq(posts.id, req.params.id));
    if (rows.length === 0) return res.status(404).json({ error: "المنشور غير موجود." });
    if (rows[0].userId !== req.user!.id) return res.status(403).json({ error: "ليس لديك صلاحية." });

    const [updated] = await db
      .update(posts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(posts.id, req.params.id))
      .returning();

    return res.json({ post: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// DELETE /api/posts/:id
router.delete("/:id", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(posts).where(eq(posts.id, req.params.id));
    if (rows.length === 0) return res.status(404).json({ error: "المنشور غير موجود." });

    const isOwner = rows[0].userId === req.user!.id;
    const isAdmin = req.user!.roles.includes("admin");
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "ليس لديك صلاحية." });

    await db.update(posts).set({ status: "removed", updatedAt: new Date() }).where(eq(posts.id, req.params.id));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/posts/:id/like — toggle like
router.post("/:id/like", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.user!.id;

    const existing = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));

    if (existing.length > 0) {
      await db.delete(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
      await db.update(posts).set({ likeCount: sql`${posts.likeCount} - 1` }).where(eq(posts.id, postId));
      return res.json({ liked: false });
    } else {
      await db.insert(postLikes).values({ postId, userId }).catch(() => {});
      await db.update(posts).set({ likeCount: sql`${posts.likeCount} + 1` }).where(eq(posts.id, postId));
      return res.json({ liked: true });
    }
  } catch (err) {
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/posts/:id/bookmark
router.post("/:id/bookmark", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.user!.id;

    const existing = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.postId, postId), eq(bookmarks.userId, userId)));

    if (existing.length > 0) {
      await db.delete(bookmarks).where(and(eq(bookmarks.postId, postId), eq(bookmarks.userId, userId)));
      return res.json({ bookmarked: false });
    } else {
      await db.insert(bookmarks).values({ postId, userId }).catch(() => {});
      return res.json({ bookmarked: true });
    }
  } catch (err) {
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/posts/:id/comments
router.post("/:id/comments", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      content: z.string().min(3, "التعليق قصير جداً").max(2000),
      parentId: z.string().uuid().optional(),
    });
    const data = schema.parse(req.body);

    const postRows = await db.select().from(posts).where(and(eq(posts.id, req.params.id), eq(posts.status, "published")));
    if (postRows.length === 0) return res.status(404).json({ error: "المنشور غير موجود." });

    const [comment] = await db
      .insert(comments)
      .values({ ...data, postId: req.params.id, userId: req.user!.id })
      .returning();

    await db.update(posts).set({ commentCount: sql`${posts.commentCount} + 1` }).where(eq(posts.id, req.params.id));

    await db.insert(analyticsEvents).values({
      userId: req.user!.id,
      event: "comment_created",
    }).catch(() => {});

    return res.status(201).json({ comment });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// DELETE /api/posts/:id/comments/:cid
router.delete("/:id/comments/:cid", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const rows = await db.select().from(comments).where(eq(comments.id, req.params.cid));
    if (rows.length === 0) return res.status(404).json({ error: "التعليق غير موجود." });

    const isOwner = rows[0].userId === req.user!.id;
    const isAdmin = req.user!.roles.includes("admin");
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "ليس لديك صلاحية." });

    await db.update(comments).set({ status: "removed", updatedAt: new Date() }).where(eq(comments.id, req.params.cid));
    await db.update(posts).set({ commentCount: sql`GREATEST(${posts.commentCount} - 1, 0)` }).where(eq(posts.id, req.params.id));

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

// POST /api/posts/:id/report
router.post("/:id/report", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({ reason: z.string().min(5).max(500) });
    const { reason } = schema.parse(req.body);

    await db.insert(reports).values({
      reporterId: req.user!.id,
      targetType: "post",
      targetId: req.params.id,
      reason,
    });

    return res.json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors[0].message });
    return res.status(500).json({ error: "حدث خطأ." });
  }
});

export default router;
