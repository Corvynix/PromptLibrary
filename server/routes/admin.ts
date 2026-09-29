import { Router, type RequestHandler, type Response } from "express";
import { z } from "zod";
import { db } from "../db";
import {
  users,
  payments,
  sprintProducts,
  subscriptions,
  entitlements,
  notifications,
  reports,
  posts,
  comments,
  radarItems,
  repoItems,
  resources,
  sprintDays,
  featureFlags,
  siteSettings,
  auditLogs,
} from "@shared/schema";
import { and, eq, desc } from "drizzle-orm";
import { authenticate, requireRole, type AuthRequest } from "../middleware/auth";
import { writeRateLimit } from "../middleware/rateLimit";
import { clearCache } from "../services/featureFlags";

const router = Router();
router.use(authenticate, requireRole("admin"));
const asyncRoute = (handler: (req: AuthRequest, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) => { void handler(req as AuthRequest, res).catch(next); };

// ─── Users ────────────────────────────────────────────────────────────

router.get("/users", asyncRoute(async (_req, res) => {
  const list = await db.select({ id: users.id, email: users.email, displayName: users.displayName, isBanned: users.isBanned, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)).limit(100);
  res.json({ users: list });
}));

router.patch("/users/:id/ban", writeRateLimit, asyncRoute(async (req, res) => {
  const userId = z.coerce.number().int().positive().safeParse(req.params.id);
  if (!userId.success) return res.status(400).json({ error: "Invalid user id" });
  const user = await db.transaction(async (tx) => {
    const [updated] = await tx.update(users).set({ isBanned: true }).where(eq(users.id, userId.data)).returning({ id: users.id });
    if (updated) await tx.insert(auditLogs).values({ actorId: req.user!.id, action: "ban_user", targetId: String(userId.data) });
    return updated;
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ success: true });
}));

router.patch("/users/:id/unban", writeRateLimit, asyncRoute(async (req, res) => {
  const userId = z.coerce.number().int().positive().safeParse(req.params.id);
  if (!userId.success) return res.status(400).json({ error: "Invalid user id" });
  const user = await db.transaction(async (tx) => {
    const [updated] = await tx.update(users).set({ isBanned: false }).where(eq(users.id, userId.data)).returning({ id: users.id });
    if (updated) await tx.insert(auditLogs).values({ actorId: req.user!.id, action: "unban_user", targetId: String(userId.data) });
    return updated;
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ success: true });
}));

// ─── Payments (Verify/Reject) ─────────────────────────────────────────

router.get("/payments", asyncRoute(async (_req, res) => {
  const pending = await db
    .select({
      payment: payments,
      user: { id: users.id, email: users.email, displayName: users.displayName },
    })
    .from(payments)
    .leftJoin(users, eq(payments.userId, users.id))
    .where(eq(payments.status, "submitted"))
    .orderBy(desc(payments.createdAt));
  res.json({ payments: pending });
}));

router.get("/payments/:id/proof", asyncRoute(async (req, res) => {
  const id = z.string().uuid().safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ error: "Invalid payment id" });
  const [payment] = await db.select().from(payments).where(eq(payments.id, id.data));
  if (!payment?.proofUrl || !new RegExp(`^${payment.userId}/[0-9a-f-]{36}\\.(jpg|png|pdf)$`, "i").test(payment.proofUrl)) return res.status(404).json({ error: "Proof not found" });
  const base = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !serviceKey) return res.status(503).json({ error: "Proof storage is not configured" });
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/storage/v1/object/sign/payment-proofs/${payment.proofUrl}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey, "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 300 }),
    });
    if (!response.ok) return res.status(502).json({ error: "Unable to access proof" });
    const result = await response.json() as { signedURL?: string };
    if (!result.signedURL?.startsWith("/object/sign/")) return res.status(502).json({ error: "Unable to access proof" });
    return res.json({ signedUrl: `${base.replace(/\/$/, "")}/storage/v1${result.signedURL}` });
  } catch (error) {
    console.error("payment proof signing failed", error);
    return res.status(502).json({ error: "Unable to access proof" });
  }
}));

router.get("/reports", asyncRoute(async (_req, res) => {
  const pending = await db.select({ report: reports, reporter: { email: users.email } })
    .from(reports).leftJoin(users, eq(reports.reporterId, users.id))
    .where(eq(reports.status, "pending")).orderBy(desc(reports.createdAt)).limit(100);
  res.json({ reports: pending });
}));

router.post("/reports/:id/review", writeRateLimit, asyncRoute(async (req, res) => {
  const id = z.string().uuid().safeParse(req.params.id);
  const body = z.object({ action: z.enum(["hide", "resolve", "dismiss"]), note: z.string().max(500).optional() }).safeParse(req.body);
  if (!id.success || !body.success) return res.status(400).json({ error: "Invalid moderation request" });
  const reviewed = await db.transaction(async (tx) => {
    const [report] = await tx.select().from(reports).where(and(eq(reports.id, id.data), eq(reports.status, "pending")));
    if (!report) return false;
    if (body.data.action === "hide" && report.targetType === "post") {
      await tx.update(posts).set({ status: "hidden", updatedAt: new Date() }).where(eq(posts.id, report.targetId));
    }
    if (body.data.action === "hide" && report.targetType === "comment") {
      await tx.update(comments).set({ status: "hidden", updatedAt: new Date() }).where(eq(comments.id, report.targetId));
    }
    await tx.update(reports).set({ status: body.data.action === "dismiss" ? "reviewed" : "resolved", reviewedBy: req.user!.id, reviewNote: body.data.note ?? body.data.action, resolvedAt: new Date() }).where(eq(reports.id, report.id));
    await tx.insert(auditLogs).values({ actorId: req.user!.id, action: "review_report", targetType: report.targetType, targetId: report.targetId, metadata: { reportId: report.id, action: body.data.action } });
    return true;
  });
  if (!reviewed) return res.status(409).json({ error: "Report has already been reviewed" });
  return res.json({ success: true });
}));

router.post("/payments/:id/verify", writeRateLimit, asyncRoute(async (req, res) => {
  const id = z.string().uuid().safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ error: "Invalid payment id" });
  const now = new Date();
  const result = await db.transaction(async (tx) => {
    const [payment] = await tx.update(payments).set({ status: "verified", reviewedBy: req.user!.id, reviewedAt: now })
      .where(and(eq(payments.id, id.data), eq(payments.status, "submitted"))).returning();
    if (!payment) return "not-submitted" as const;

    if (payment.type === "sprint") {
      if (!payment.productId) throw new Error("Sprint payment has no product");
      const [product] = await tx.select().from(sprintProducts).where(and(eq(sprintProducts.id, payment.productId), eq(sprintProducts.isActive, true)));
      if (!product) throw new Error("Sprint product unavailable");
      await tx.insert(entitlements).values({ userId: payment.userId, type: "sprint_access", resourceId: product.id });
      await tx.insert(notifications).values({ userId: payment.userId, type: "payment_verified", title: "Payment verified", body: "Your sprint access is ready.", link: "/sprint" });
    } else {
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const [subscription] = await tx.insert(subscriptions).values({ userId: payment.userId, plan: "founding", status: "active", paymentId: payment.id, startedAt: now, expiresAt }).returning({ id: subscriptions.id });
      await tx.insert(entitlements).values({ userId: payment.userId, type: "membership", resourceId: subscription.id, grantedAt: now, expiresAt });
      await tx.insert(notifications).values({ userId: payment.userId, type: "payment_verified", title: "Payment verified", body: "Your membership is active.", link: "/community" });
    }
    await tx.insert(auditLogs).values({ actorId: req.user!.id, action: "verify_payment", targetType: "payment", targetId: payment.id, metadata: { userId: payment.userId, type: payment.type } });
    return "verified" as const;
  });
  if (result !== "verified") return res.status(409).json({ error: "Payment is not awaiting review" });
  res.json({ success: true });
}));

router.post("/payments/:id/reject", writeRateLimit, asyncRoute(async (req, res) => {
  const id = z.string().uuid().safeParse(req.params.id);
  const body = z.object({ note: z.string().trim().max(500).optional() }).safeParse(req.body);
  if (!id.success || !body.success) return res.status(400).json({ error: "Invalid request" });
  const result = await db.transaction(async (tx) => {
    const [payment] = await tx.update(payments).set({ status: "rejected", reviewedBy: req.user!.id, reviewedAt: new Date(), reconciliationNotes: body.data.note ?? null })
      .where(and(eq(payments.id, id.data), eq(payments.status, "submitted"))).returning();
    if (!payment) return false;
    await tx.insert(notifications).values({ userId: payment.userId, type: "payment_rejected", title: "Payment needs attention", body: body.data.note ?? "Your payment could not be confirmed. Please review the details and resubmit.", link: "/payment/status" });
    await tx.insert(auditLogs).values({ actorId: req.user!.id, action: "reject_payment", targetType: "payment", targetId: payment.id, metadata: { userId: payment.userId, note: body.data.note } });
    return true;
  });
  if (!result) return res.status(409).json({ error: "Payment is not awaiting review" });
  res.json({ success: true });
}));

// ─── Config / Feature Flags ───────────────────────────────────────────

router.get("/config", asyncRoute(async (_req, res) => {
  const flags = await db.select().from(featureFlags);
  const settings = await db.select().from(siteSettings);
  res.json({ featureFlags: flags, siteSettings: settings });
}));

router.patch("/feature-flags/:key", writeRateLimit, asyncRoute(async (req, res) => {
  const key = z.enum(["ENABLE_COMMUNITY", "ENABLE_MEMBERSHIP", "ENABLE_AI_OPERATOR", "ENABLE_RADAR", "ENABLE_VAULT", "ENABLE_PUBLIC_PROJECTS", "ENABLE_MANUAL_PAYMENTS"]).safeParse(req.params.key);
  const body = z.object({ value: z.boolean() }).safeParse(req.body);
  if (!key.success || !body.success) return res.status(400).json({ error: "Invalid feature flag" });
  const flag = await db.transaction(async (tx) => {
    const [updated] = await tx.update(featureFlags).set({ value: body.data.value, updatedAt: new Date() }).where(eq(featureFlags.key, key.data)).returning({ id: featureFlags.id });
    if (updated) await tx.insert(auditLogs).values({ actorId: req.user!.id, action: "update_flag", metadata: { key: key.data, value: body.data.value } });
    return updated;
  });
  if (!flag) return res.status(404).json({ error: "Feature flag not found" });
  clearCache();
  res.json({ success: true });
}));

router.patch("/site-settings/:key", writeRateLimit, asyncRoute(async (req, res) => {
  const key = z.enum(["sprint_price_egp", "membership_price_egp", "instapay_phone", "instapay_name"]).safeParse(req.params.key);
  const body = z.object({ value: z.string().trim().min(1).max(100) }).safeParse(req.body);
  if (!key.success || !body.success) return res.status(400).json({ error: "Invalid setting" });
  if (key.data.endsWith("_price_egp") && (!Number.isFinite(Number(body.data.value)) || Number(body.data.value) <= 0)) return res.status(400).json({ error: "Price must be a positive number" });
  const setting = await db.transaction(async (tx) => {
    const [updated] = await tx.update(siteSettings).set({ value: body.data.value, updatedAt: new Date() }).where(eq(siteSettings.key, key.data)).returning({ id: siteSettings.id });
    if (updated) await tx.insert(auditLogs).values({ actorId: req.user!.id, action: "update_setting", metadata: { key: key.data, value: body.data.value } });
    return updated;
  });
  if (!setting) return res.status(404).json({ error: "Setting not found" });
  clearCache();
  res.json({ success: true });
}));

export default router;
