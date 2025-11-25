/**
 * Badge Detection and Award Service
 * Automatically detects when users meet badge criteria and awards them
 */

import { db } from "../db";
import { badges, userBadges, prompts, promptVersions, remixes, votes, follows } from "@shared/schema";
import { sql, eq, and } from "drizzle-orm";
import { storage } from "../storage";

interface BadgeCriteria {
  type: string;
  operator: string;
  value: number;
  field?: string;
}

/**
 * Check if user meets a specific badge criteria
 */
async function checkBadgeCriteria(userId: number, criteria: BadgeCriteria): Promise<boolean> {
  const { type, operator, value, field } = criteria;
  
  let currentValue = 0;
  
  switch (type) {
    case 'prompt_count': {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(prompts)
        .where(eq(prompts.ownerId, userId));
      currentValue = Number(result[0]?.count || 0);
      break;
    }
    
    case 'remix_count': {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(remixes)
        .where(eq(remixes.userId, userId));
      currentValue = Number(result[0]?.count || 0);
      break;
    }
    
    case 'pqas_threshold': {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(promptVersions)
        .innerJoin(prompts, eq(promptVersions.promptId, prompts.id))
        .where(and(
          eq(prompts.ownerId, userId),
          sql`(pqas_score->>'composite')::numeric >= ${value}`
        ));
      currentValue = Number(result[0]?.count || 0);
      break;
    }
    
    case 'total_uses': {
      const result = await db
        .select({ sum: sql<number>`SUM(total_uses)` })
        .from(prompts)
        .where(eq(prompts.ownerId, userId));
      currentValue = Number(result[0]?.sum || 0);
      break;
    }
    
    case 'upvotes_received': {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(votes)
        .innerJoin(prompts, and(
          eq(votes.votableType, 'prompt'),
          eq(votes.votableId, prompts.id)
        ))
        .where(and(
          eq(prompts.ownerId, userId),
          eq(votes.voteType, 'up')
        ));
      currentValue = Number(result[0]?.count || 0);
      break;
    }
    
    case 'followers': {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(follows)
        .where(eq(follows.followingId, userId));
      currentValue = Number(result[0]?.count || 0);
      break;
    }
    
    case 'karma_score': {
      const user = await storage.getUser(userId);
      currentValue = user?.karmaScore || 0;
      break;
    }
    
    default:
      return false;
  }
  
  // Evaluate operator
  switch (operator) {
    case '>=':
      return currentValue >= value;
    case '>':
      return currentValue > value;
    case '=':
    case '==':
      return currentValue === value;
    case '<=':
      return currentValue <= value;
    case '<':
      return currentValue < value;
    default:
      return false;
  }
}

/**
 * Check all badges for a user and award new ones
 */
export async function checkAndAwardBadges(userId: number): Promise<void> {
  // Get all badges
  const allBadges = await storage.getBadges();
  
  // Get badges user already has
  const userBadgesList = await storage.getUserBadges(userId);
  const userBadgeIds = new Set(userBadgesList.map(b => b.id));
  
  // Check each badge
  for (const badge of allBadges) {
    // Skip if user already has this badge
    if (userBadgeIds.has(badge.id)) continue;
    
    const criteria = badge.criteria as any as BadgeCriteria;
    const meetsRequirement = await checkBadgeCriteria(userId, criteria);
    
    if (meetsRequirement) {
      // Award badge
      await storage.awardBadge(userId, badge.id);
      
      // Send notification
      await storage.createNotification({
        userId,
        type: 'badge_unlocked',
        title: 'New badge unlocked!',
        message: `You've earned the "${badge.name}" badge`,
        link: `/profile/${userId}`,
      });
      
      console.log(`Awarded badge "${badge.name}" to user ${userId}`);
    }
  }
}

/**
 * Seed initial badges
 */
export async function seedBadges(): Promise<void> {
  const initialBadges = [
    {
      name: 'First Prompt',
      description: 'Created your first prompt',
      icon: '🎯',
      tier: 'Bronze',
      criteria: { type: 'prompt_count', operator: '>=', value: 1 }
    },
    {
      name: 'Prolific Creator',
      description: 'Created 50 prompts',
      icon: '✨',
      tier: 'Silver',
      criteria: { type: 'prompt_count', operator: '>=', value: 50 }
    },
    {
      name: 'Prompt Master',
      description: 'Created 100 prompts',
      icon: '👑',
      tier: 'Gold',
      criteria: { type: 'prompt_count', operator: '>=', value: 100 }
    },
    {
      name: 'Viral Sensation',
      description: 'One of your prompts got 1000+ uses',
      icon: '🚀',
      tier: 'Gold',
      criteria: { type: 'total_uses', operator: '>=', value: 1000 }
    },
    {
      name: 'Quality Expert',
      description: 'Created 10+ prompts with Gold PQAS (85+)',
      icon: '⭐',
      tier: 'Gold',
      criteria: { type: 'pqas_threshold', operator: '>=', value: 85 }
    },
    {
      name: 'Remix Master',
      description: 'Created 50+ successful remixes',
      icon: '🎨',
      tier: 'Silver',
      criteria: { type: 'remix_count', operator: '>=', value: 50 }
    },
    {
      name: 'Community Champion',
      description: 'Received 500+ upvotes',
      icon: '💎',
      tier: 'Gold',
      criteria: { type: 'upvotes_received', operator: '>=', value: 500 }
    },
    {
      name: 'Rising Star',
      description: 'Gained 100+ followers',
      icon: '🌟',
      tier: 'Silver',
      criteria: { type: 'followers', operator: '>=', value: 100 }
    },
    {
      name: 'Karma Elite',
      description: 'Achieved 1000+ karma score',
      icon: '🏆',
      tier: 'Gold',
      criteria: { type: 'karma_score', operator: '>=', value: 1000 }
    },
  ];
  
  for (const badge of initialBadges) {
    try {
      await db.insert(badges).values(badge).onConflictDoNothing();
    } catch (error) {
      console.error(`Error seeding badge "${badge.name}":`, error);
    }
  }
  
  console.log(`Seeded ${initialBadges.length} badges`);
}
