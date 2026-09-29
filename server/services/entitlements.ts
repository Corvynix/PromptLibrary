import { db } from "../db";
import { entitlements, subscriptions, payments, notifications, auditLogs } from "@shared/schema";
import { eq, and, isNull, gt } from "drizzle-orm";

/**
 * Centralized entitlement service.
 * 
 * SECURITY RULE: Entitlements are ONLY granted here, on the server,
 * after admin verification of a payment. The client can never self-grant.
 */

export async function checkSprintAccess(userId: number): Promise<boolean> {
  const rows = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, userId),
        eq(entitlements.type, "sprint_access"),
        isNull(entitlements.revokedAt)
      )
    );
  return rows.length > 0;
}

export async function checkMembershipAccess(userId: number): Promise<boolean> {
  const now = new Date();
  const rows = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, userId),
        eq(entitlements.type, "membership"),
        isNull(entitlements.revokedAt)
      )
    );

  if (rows.length === 0) return false;
  const entitlement = rows[0];
  // If there's an expiry, check it
  if (entitlement.expiresAt && entitlement.expiresAt < now) return false;
  return true;
}

export async function grantSprintAccess(
  userId: number,
  paymentId: string,
  sprintProductId: string,
  adminId: number
): Promise<void> {
  await db.insert(entitlements).values({
    userId,
    type: "sprint_access",
    resourceId: sprintProductId,
    grantedAt: new Date(),
  });

  // Send in-app notification
  await db.insert(notifications).values({
    userId,
    type: "payment_verified",
    title: "تم تأكيد دفعتك! ✅",
    body: "دفعتك اتأكدت. تقدر دلوقتي تبدأ تحدي أول بيعة.",
    link: "/sprint",
  });

  // Audit log
  await db.insert(auditLogs).values({
    actorId: adminId,
    action: "grant_sprint_access",
    targetType: "user",
    targetId: String(userId),
    metadata: { paymentId, sprintProductId },
  });
}

export async function grantMembership(
  userId: number,
  paymentId: string,
  adminId: number,
  durationDays = 30
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  // Upsert subscription
  await db.insert(subscriptions).values({
    userId,
    plan: "founding",
    status: "active",
    paymentId,
    startedAt: new Date(),
    expiresAt,
  });

  // Grant entitlement
  await db.insert(entitlements).values({
    userId,
    type: "membership",
    grantedAt: new Date(),
    expiresAt,
  });

  // Notification
  await db.insert(notifications).values({
    userId,
    type: "payment_verified",
    title: "أهلاً بك في المجتمع! 🎉",
    body: "انضممت لمجتمع أول بيعة. استمتع بالوصول الكامل.",
    link: "/community",
  });

  // Audit log
  await db.insert(auditLogs).values({
    actorId: adminId,
    action: "grant_membership",
    targetType: "user",
    targetId: String(userId),
    metadata: { paymentId, durationDays },
  });
}

export async function revokeEntitlement(
  userId: number,
  type: "sprint_access" | "membership",
  adminId: number
): Promise<void> {
  await db
    .update(entitlements)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(entitlements.userId, userId),
        eq(entitlements.type, type),
        isNull(entitlements.revokedAt)
      )
    );

  await db.insert(auditLogs).values({
    actorId: adminId,
    action: `revoke_${type}`,
    targetType: "user",
    targetId: String(userId),
    metadata: {},
  });
}

export async function rejectPayment(
  paymentId: string,
  userId: number,
  adminId: number,
  note?: string
): Promise<void> {
  await db
    .update(payments)
    .set({
      status: "rejected",
      reviewedBy: adminId,
      reviewedAt: new Date(),
      reconciliationNotes: note,
    })
    .where(eq(payments.id, paymentId));

  await db.insert(notifications).values({
    userId,
    type: "payment_rejected",
    title: "لم يتم تأكيد الدفع",
    body: note
      ? `مشكلة في الدفع: ${note}. راجع تفاصيل الدفع وحاول تاني.`
      : "للأسف مقدرناش نأكد الدفع. تواصل معنا للمساعدة.",
    link: "/payment",
  });

  await db.insert(auditLogs).values({
    actorId: adminId,
    action: "reject_payment",
    targetType: "payment",
    targetId: paymentId,
    metadata: { userId, note },
  });
}
