/**
 * Karma Calculation Service
 * Calculates user karma score based on the published algorithm
 */

import { db } from "../db";
import { users, prompts, promptVersions, remixes, votes, referrals } from "@shared/schema";
import { sql, eq, and } from "drizzle-orm";

interface KarmaBreakdown {
  avgPQAS: number;
  remixSuccessRate: number;
  engagementScore: number;
  referralConversions: number;
  totalScore: number;
}

/**
 * Calculate karma score for a user
 * Formula: karma = w1×avg_pqas (0.40) + w2×remix_success (0.25) + w3×engagement (0.20) + w4×referrals (0.15)
 */
export async function calculateKarma(userId: number): Promise<KarmaBreakdown> {
  // 1. Average PQAS score (0.40 weight)
  const avgPQASResult = await db
    .select({
      avg: sql<number>`COALESCE(AVG((pqas_score->>'composite')::numeric), 0)`
    })
    .from(promptVersions)
    .innerJoin(prompts, eq(promptVersions.promptId, prompts.id))
    .where(and(
      eq(prompts.ownerId, userId),
      sql`pqas_score IS NOT NULL`
    ));
  const avgPQAS = Number(avgPQASResult[0]?.avg || 0);
  
  // 2. Remix success rate (0.25 weight) - % of remixes scoring >70 PQAS
  const remixStats = await db
    .select({
      total: sql<number>`COUNT(*)`,
      successful: sql<number>`COUNT(CASE WHEN (pqas_score->>'composite')::numeric > 70 THEN 1 END)`
    })
    .from(remixes)
    .innerJoin(promptVersions, eq(remixes.toVersionId, promptVersions.id))
    .where(eq(remixes.userId, userId));
  
  const totalRemixes = Number(remixStats[0]?.total || 0);
  const successfulRemixes = Number(remixStats[0]?.successful || 0);
  const remixSuccessRate = totalRemixes > 0 ? (successfulRemixes / totalRemixes) * 100 : 0;
  
  // 3. Engagement score (0.20 weight) - normalized upvotes + shares + helpful comments
  const engagementStats = await db
    .select({
      upvotes: sql<number>`COUNT(CASE WHEN vote_type = 'up' THEN 1 END)`,
      totalUses: sql<number>`SUM(total_uses)`
    })
    .from(prompts)
    .leftJoin(votes, and(
      eq(votes.votableType, 'prompt'),
      eq(votes.votableId, prompts.id)
    ))
    .where(eq(prompts.ownerId, userId));
  
  const upvotes = Number(engagementStats[0]?.upvotes || 0);
  const totalUses = Number(engagementStats[0]?.totalUses || 0);
  const engagementScore = Math.min(100, (upvotes * 0.5) + (totalUses * 0.1));
  
  // 4. Referral conversions (0.15 weight) - invited users who became active (3+ prompts)
  const referralStats = await db
    .select({
      count: sql<number>`COUNT(*)`
    })
    .from(referrals)
    .innerJoin(users, eq(referrals.referredUserId, users.id))
    .innerJoin(prompts, eq(users.id, prompts.ownerId))
    .where(and(
      eq(referrals.referrerId, userId),
      eq(referrals.converted, true)
    ))
    .groupBy(referrals.referredUserId)
    .having(sql`COUNT(${prompts.id}) >= 3`);
  
  const referralConversions = referralStats.length * 10; // 10 points per converted referral
  
  // Calculate total karma with weights
  const totalScore = 
    (avgPQAS * 0.40) +
    (remixSuccessRate * 0.25) +
    (engagementScore * 0.20) +
    (Math.min(100, referralConversions) * 0.15);
  
  return {
    avgPQAS,
    remixSuccessRate,
    engagementScore,
    referralConversions: Math.min(100, referralConversions),
    totalScore: Math.round(totalScore * 10) / 10, // Round to 1 decimal
  };
}

/**
 * Update karma for a specific user
 */
export async function updateUserKarma(userId: number): Promise<void> {
  const breakdown = await calculateKarma(userId);
  
  await db
    .update(users)
    .set({
      karmaScore: breakdown.totalScore,
      metrics: {
        avgPQAS: breakdown.avgPQAS,
        remixSuccessRate: breakdown.remixSuccessRate,
        engagementScore: breakdown.engagementScore,
        referralConversions: breakdown.referralConversions,
        lastUpdated: new Date().toISOString(),
      },
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

/**
 * Recalculate karma for all users (for nightly cron job)
 */
export async function recalculateAllKarma(): Promise<void> {
  const allUsers = await db.select({ id: users.id }).from(users);
  
  for (const user of allUsers) {
    try {
      await updateUserKarma(user.id);
    } catch (error) {
      console.error(`Error updating karma for user ${user.id}:`, error);
    }
  }
  
  console.log(`Karma recalculated for ${allUsers.length} users`);
}
