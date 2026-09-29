import express, { Router, type Response } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "../db";
import { analyticsEvents, payments, sprintProducts } from "@shared/schema";
import { authenticate, type AuthRequest } from "../middleware/auth";
import { writeRateLimit } from "../middleware/rateLimit";
import { getFeatureFlag, getSiteSetting } from "../services/featureFlags";

const router = Router();

router.post("/proof", authenticate, writeRateLimit, express.raw({ type: ["image/jpeg", "image/png", "application/pdf"], limit: "5mb" }), async (req: AuthRequest, res: Response) => {
  const file = Buffer.isBuffer(req.body) ? req.body : null;
  const contentType = req.headers["content-type"];
  if (!file?.length || typeof contentType !== "string") return res.status(400).json({ error: "Upload a JPEG, PNG, or PDF proof file" });
  const validSignature = contentType === "image/jpeg" ? file[0] === 0xff && file[1] === 0xd8 && file[2] === 0xff
    : contentType === "image/png" ? file.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : contentType === "application/pdf" && file.subarray(0, 5).toString("ascii") === "%PDF-";
  if (!validSignature) return res.status(400).json({ error: "File content does not match its type" });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(503).json({ error: "Payment proof storage is not configured" });
  const extension = contentType === "image/jpeg" ? "jpg" : contentType === "image/png" ? "png" : "pdf";
  const path = `${req.user!.id}/${randomUUID()}.${extension}`;
  try {
    const upload = await fetch(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/payment-proofs/${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey, "Content-Type": contentType, "x-upsert": "false" },
      body: file,
    });
    if (!upload.ok) {
      console.error("payment proof storage rejected upload", { status: upload.status });
      return res.status(502).json({ error: "Unable to store payment proof" });
    }
    return res.status(201).json({ proofKey: path });
  } catch (error) {
    console.error("payment proof storage request failed", error);
    return res.status(502).json({ error: "Unable to store payment proof" });
  }
});

router.get("/my", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.select().from(payments).where(eq(payments.userId, req.user!.id)).orderBy(desc(payments.createdAt));
    return res.json({ payments: result });
  } catch (error) {
    console.error("list payments failed", error);
    return res.status(500).json({ error: "Unable to load payments" });
  }
});

router.post("/initiate", authenticate, writeRateLimit, async (req: AuthRequest, res: Response) => {
  try {
    const schema = z.object({
      type: z.enum(["sprint", "membership"]),
      productId: z.string().uuid().optional(),
      referenceNumber: z.string().trim().min(6).max(64).regex(/^[A-Za-z0-9_-]+$/),
      proofUrl: z.string().regex(/^\d+\/[0-9a-f-]{36}\.(jpg|png|pdf)$/i),
    });
    const data = schema.parse(req.body);
    if (!(await getFeatureFlag("MANUAL_PAYMENTS"))) return res.status(503).json({ error: "Manual payments are unavailable" });
    if (data.type === "membership" && !(await getFeatureFlag("MEMBERSHIP"))) return res.status(503).json({ error: "Membership is unavailable" });
    if (data.type === "sprint" && !data.productId) return res.status(400).json({ error: "A sprint product is required" });
    if (!data.proofUrl.startsWith(`${req.user!.id}/`)) return res.status(400).json({ error: "Invalid payment proof" });
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return res.status(503).json({ error: "Payment proof storage is not configured" });
    const proofResponse = await fetch(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/payment-proofs/${data.proofUrl}`, {
      method: "HEAD",
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
    });
    if (!proofResponse.ok) return res.status(400).json({ error: "Payment proof file was not found" });

    if (data.productId) {
      const [product] = await db.select({ id: sprintProducts.id }).from(sprintProducts)
        .where(and(eq(sprintProducts.id, data.productId), eq(sprintProducts.isActive, true)));
      if (!product) return res.status(400).json({ error: "Sprint product is unavailable" });
    }

    const priceText = await getSiteSetting(data.type === "sprint" ? "sprint_price_egp" : "membership_price_egp", data.type === "sprint" ? "199" : "10");
    const amount = Number(priceText);
    if (!Number.isFinite(amount) || amount <= 0) return res.status(503).json({ error: "Payment pricing is not configured" });
    if (!(await getSiteSetting("instapay_phone", "")).trim()) return res.status(503).json({ error: "Payment instructions are not configured" });

    const result = await db.transaction(async (tx) => {
      // ponytail: advisory lock serializes reference reuse across app instances; replace with a unique DB index after duplicate legacy references are reviewed.
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${data.referenceNumber}))`);
      const [existing] = await tx.select().from(payments).where(eq(payments.referenceNumber, data.referenceNumber));
      if (existing) {
        if (existing.userId !== req.user!.id || existing.type !== data.type || existing.productId !== (data.productId ?? null)) return { conflict: true as const };
        if (existing.status === "verified") return { verified: true as const };
        const [payment] = await tx.update(payments).set({ status: "submitted", updatedAt: new Date(), proofUrl: data.proofUrl ?? existing.proofUrl })
          .where(and(eq(payments.id, existing.id), ne(payments.status, "verified"))).returning();
        return { payment, created: false as const };
      }

      const [payment] = await tx.insert(payments).values({
        userId: req.user!.id,
        type: data.type,
        productId: data.productId ?? null,
        amount: amount.toFixed(2),
        currency: "EGP",
        status: "submitted",
        referenceNumber: data.referenceNumber,
        proofUrl: data.proofUrl ?? null,
      }).returning();
      return { payment, created: true as const };
    });

    if ("conflict" in result) return res.status(409).json({ error: "Reference number is already associated with another payment" });
    if ("verified" in result) return res.status(409).json({ error: "This payment reference has already been verified" });
    if (!result.payment) return res.status(409).json({ error: "Payment is already being reviewed" });
    if (result.created) {
      await db.insert(analyticsEvents).values({ userId: req.user!.id, event: "payment_submitted", properties: { type: data.type, paymentId: result.payment.id } }).catch(() => {});
      return res.status(201).json({ payment: result.payment });
    }
    return res.json({ payment: result.payment });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: "Invalid payment details" });
    console.error("initiate payment failed", error);
    return res.status(500).json({ error: "Unable to submit payment" });
  }
});

export default router;
