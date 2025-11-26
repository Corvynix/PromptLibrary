// Database storage layer - from javascript_database blueprint
import {
  users,
  prompts,
  promptVersions,
  comments,
  workflows,
  badges,
  userBadges,
  follows,
  votes,
  notifications,
  usageLogs,
  referrals,
  remixes,
  executionLogs,
  adminSettings,
  type User,
  type InsertUser,
  type Prompt,
  type InsertPrompt,
  type PromptVersion,
  type InsertPromptVersion,
  type Comment,
  type InsertComment,
  type Workflow,
  type InsertWorkflow,
  type Badge,
  type Follow,
  type Vote,
  type Notification,
  type InsertNotification,
  type UsageLog,
  type Referral,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, sql, like, ilike, inArray } from "drizzle-orm";

// Comprehensive storage interface for all database operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Prompt operations
  getPrompt(id: number): Promise<Prompt | undefined>;
  getPromptBySlug(slug: string): Promise<Prompt | undefined>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: number, updates: Partial<Prompt>): Promise<Prompt | undefined>;
  getPrompts(filters?: { ownerId?: number; limit?: number; offset?: number }): Promise<Prompt[]>;
  getPromptsWithAuthors(filters?: { limit?: number; offset?: number }): Promise<any[]>;
  searchPrompts(query: string, filters?: any): Promise<Prompt[]>;

  // Prompt Version operations
  getPromptVersion(id: number): Promise<PromptVersion | undefined>;
  createPromptVersion(version: InsertPromptVersion): Promise<PromptVersion>;
  getPromptVersions(promptId: number): Promise<PromptVersion[]>;
  updatePromptVersion(id: number, updates: Partial<PromptVersion>): Promise<PromptVersion | undefined>;

  // Comment operations
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  getComments(promptId: number): Promise<any[]>; // Returns comments with user data
  getCommentsWithUsers(promptId: number): Promise<any[]>;
  updateCommentVotes(id: number, upvotes: number, downvotes: number): Promise<void>;

  // Workflow operations
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  getWorkflow(id: number): Promise<Workflow | undefined>;
  getWorkflows(userId?: number): Promise<Workflow[]>;

  // Social operations
  followUser(followerId: number, followingId: number): Promise<void>;
  unfollowUser(followerId: number, followingId: number): Promise<void>;
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
  getFollowers(userId: number): Promise<number>;
  getFollowing(userId: number): Promise<number>;

  // Vote operations
  vote(userId: number, votableType: string, votableId: number, voteType: 'up' | 'down'): Promise<void>;
  unvote(userId: number, votableType: string, votableId: number): Promise<void>;
  getVote(userId: number, votableType: string, votableId: number): Promise<Vote | undefined>;

  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotifications(userId: number, unreadOnly?: boolean): Promise<Notification[]>;
  markNotificationRead(id: number): Promise<void>;
  markAllNotificationsRead(userId: number): Promise<void>;

  // Usage log operations
  logUsage(userId: number | undefined, promptVersionId: number | undefined, action: string, metadata?: any): Promise<void>;

  // Badge operations
  getBadges(): Promise<Badge[]>;
  getUserBadges(userId: number): Promise<Badge[]>;
  awardBadge(userId: number, badgeId: number): Promise<void>;

  // Referral operations
  generateReferralCode(userId: number): Promise<string>;
  getReferralByCode(code: string): Promise<Referral | undefined>;
  trackReferralConversion(code: string, referredUserId: number): Promise<void>;

  // Activity operations
  getFollowingActivity(userId: number, limit?: number): Promise<any[]>;

  // Execution logs
  createExecutionLog(workflowId: number, userId: number | undefined): Promise<any>;
  updateExecutionLog(id: number, status: string, results?: any): Promise<void>;
  getExecutionLogs(workflowId: number): Promise<any[]>;

  // Statistics for karma/badges
  getUserPromptStats(userId: number): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Prompt operations
  async getPrompt(id: number): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id));
    return prompt || undefined;
  }

  async getPromptBySlug(slug: string): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.slug, slug));
    return prompt || undefined;
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const [prompt] = await db
      .insert(prompts)
      .values(insertPrompt)
      .returning();
    return prompt;
  }

  async updatePrompt(id: number, updates: Partial<Prompt>): Promise<Prompt | undefined> {
    const [prompt] = await db
      .update(prompts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(prompts.id, id))
      .returning();
    return prompt || undefined;
  }

  async getPrompts(filters?: { ownerId?: number; limit?: number; offset?: number }): Promise<Prompt[]> {
    let query = db.select().from(prompts);

    if (filters?.ownerId) {
      query = query.where(eq(prompts.ownerId, filters.ownerId)) as any;
    }

    query = query.orderBy(desc(prompts.createdAt)) as any;

    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }

    if (filters?.offset) {
      query = query.offset(filters.offset) as any;
    }

    return await query;
  }

  async getPromptsWithAuthors(filters?: { limit?: number; offset?: number }): Promise<any[]> {
    const query = db
      .select({
        prompt: prompts,
        author: {
          id: users.id,
          username: users.displayName,
          avatar: users.avatarUrl,
        }
      })
      .from(prompts)
      .innerJoin(users, eq(prompts.ownerId, users.id))
      .orderBy(desc(prompts.createdAt))
      .limit(filters?.limit || 20)
      .offset(filters?.offset || 0);

    return await query;
  }

  async searchPrompts(query: string, filters?: any): Promise<Prompt[]> {
    // Simple search implementation - can be enhanced with full-text search
    return await db
      .select()
      .from(prompts)
      .where(
        or(
          ilike(prompts.title, `%${query}%`),
          ilike(prompts.shortDesc, `%${query}%`)
        )
      )
      .orderBy(desc(prompts.popularityScore))
      .limit(filters?.limit || 20);
  }

  // Prompt Version operations
  async getPromptVersion(id: number): Promise<PromptVersion | undefined> {
    const [version] = await db.select().from(promptVersions).where(eq(promptVersions.id, id));
    return version || undefined;
  }

  async createPromptVersion(insertVersion: InsertPromptVersion): Promise<PromptVersion> {
    const [version] = await db
      .insert(promptVersions)
      .values(insertVersion)
      .returning();
    return version;
  }

  async getPromptVersions(promptId: number): Promise<PromptVersion[]> {
    return await db
      .select()
      .from(promptVersions)
      .where(eq(promptVersions.promptId, promptId))
      .orderBy(desc(promptVersions.versionNumber));
  }

  async updatePromptVersion(id: number, updates: Partial<PromptVersion>): Promise<PromptVersion | undefined> {
    const [version] = await db
      .update(promptVersions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(promptVersions.id, id))
      .returning();
    return version || undefined;
  }

  // Comment operations
  async getComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment || undefined;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async getComments(promptId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.promptId, promptId))
      .orderBy(desc(comments.createdAt));
  }

  async updateCommentVotes(id: number, upvotes: number, downvotes: number): Promise<void> {
    await db
      .update(comments)
      .set({ upvotes, downvotes })
      .where(eq(comments.id, id));
  }

  // Workflow operations
  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const [workflow] = await db
      .insert(workflows)
      .values(insertWorkflow)
      .returning();
    return workflow;
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow || undefined;
  }

  async getWorkflows(userId?: number): Promise<Workflow[]> {
    if (userId) {
      return await db
        .select()
        .from(workflows)
        .where(eq(workflows.createdBy, userId))
        .orderBy(desc(workflows.createdAt));
    }
    return await db.select().from(workflows).orderBy(desc(workflows.createdAt)).limit(20);
  }

  // Social operations
  async followUser(followerId: number, followingId: number): Promise<void> {
    await db
      .insert(follows)
      .values({ followerId, followingId })
      .onConflictDoNothing();
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    await db
      .delete(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ));
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const [follow] = await db
      .select()
      .from(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ));
    return !!follow;
  }

  async getFollowers(userId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followingId, userId));
    return Number(result[0]?.count || 0);
  }

  async getFollowing(userId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followerId, userId));
    return Number(result[0]?.count || 0);
  }

  // Vote operations
  async vote(userId: number, votableType: string, votableId: number, voteType: 'up' | 'down'): Promise<void> {
    await db
      .insert(votes)
      .values({ userId, votableType, votableId, voteType })
      .onConflictDoUpdate({
        target: [votes.userId, votes.votableType, votes.votableId],
        set: { voteType }
      });
  }

  async unvote(userId: number, votableType: string, votableId: number): Promise<void> {
    await db
      .delete(votes)
      .where(and(
        eq(votes.userId, userId),
        eq(votes.votableType, votableType),
        eq(votes.votableId, votableId)
      ));
  }

  async getVote(userId: number, votableType: string, votableId: number): Promise<Vote | undefined> {
    const [vote] = await db
      .select()
      .from(votes)
      .where(and(
        eq(votes.userId, userId),
        eq(votes.votableType, votableType),
        eq(votes.votableId, votableId)
      ));
    return vote || undefined;
  }

  // Notification operations
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  async getNotifications(userId: number, unreadOnly?: boolean): Promise<Notification[]> {
    let query = db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId));

    if (unreadOnly) {
      query = query.where(eq(notifications.read, false)) as any;
    }

    return await query.orderBy(desc(notifications.createdAt)).limit(50);
  }

  async markNotificationRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));
  }

  async markAllNotificationsRead(userId: number): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, userId));
  }

  // Usage log operations
  async logUsage(userId: number | undefined, promptVersionId: number | undefined, action: string, metadata?: any): Promise<void> {
    await db
      .insert(usageLogs)
      .values({
        userId: userId || null,
        promptVersionId: promptVersionId || null,
        action,
        metadata: metadata || null
      });
  }

  // Badge operations
  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges);
  }

  async getUserBadges(userId: number): Promise<Badge[]> {
    const userBadgesList = await db
      .select({
        badge: badges
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId));

    return userBadgesList.map(ub => ub.badge);
  }

  async awardBadge(userId: number, badgeId: number): Promise<void> {
    await db
      .insert(userBadges)
      .values({ userId, badgeId })
      .onConflictDoNothing();
  }

  // Referral operations implementation
  async generateReferralCode(userId: number): Promise<string> {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    await db.insert(referrals).values({
      referrerId: userId,
      referralCode: code,
      referredUserId: null,
      converted: false,
    });
    return code;
  }

  async getReferralByCode(code: string): Promise<Referral | undefined> {
    const [referral] = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referralCode, code));
    return referral || undefined;
  }

  async trackReferralConversion(code: string, referredUserId: number): Promise<void> {
    await db
      .update(referrals)
      .set({
        referredUserId,
        converted: true,
        convertedAt: new Date(),
      })
      .where(eq(referrals.referralCode, code));
  }

  // Activity feed operations
  async getFollowingActivity(userId: number, limit: number = 20): Promise<any[]> {
    // Get users that this user follows
    const followingList = await db
      .select({ followingId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, userId));

    const followingIds = followingList.map(f => f.followingId);
    if (followingIds.length === 0) return [];

    // Get recent prompts from following users
    const recentPrompts = await db
      .select({
        type: sql<string>`'prompt_created'`,
        id: prompts.id,
        userId: prompts.ownerId,
        timestamp: prompts.createdAt,
        data: sql`json_build_object('promptId', ${prompts.id}, 'title', ${prompts.title}, 'slug', ${prompts.slug})`,
      })
      .from(prompts)
      .where(inArray(prompts.ownerId, followingIds))
      .orderBy(desc(prompts.createdAt))
      .limit(limit);

    return recentPrompts;
  }

  // Execution logs implementation
  async createExecutionLog(workflowId: number, userId: number | undefined): Promise<any> {
    const [log] = await db
      .insert(executionLogs)
      .values({
        workflowId,
        userId: userId || null,
        status: 'pending',
      })
      .returning();
    return log;
  }

  async updateExecutionLog(id: number, status: string, results?: any): Promise<void> {
    await db
      .update(executionLogs)
      .set({
        status: status as any,
        results: results || null,
        completedAt: status === 'completed' || status === 'failed' ? new Date() : null,
      })
      .where(eq(executionLogs.id, id));
  }

  async getExecutionLogs(workflowId: number): Promise<any[]> {
    return await db
      .select()
      .from(executionLogs)
      .where(eq(executionLogs.workflowId, workflowId))
      .orderBy(desc(executionLogs.createdAt))
      .limit(10);
  }

  // Statistics for karma/badges
  async getUserPromptStats(userId: number): Promise<any> {
    const promptCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(prompts)
      .where(eq(prompts.ownerId, userId));

    const avgPQAS = await db
      .select({ avg: sql<number>`avg((pqas_score->>'composite')::numeric)` })
      .from(promptVersions)
      .innerJoin(prompts, eq(promptVersions.promptId, prompts.id))
      .where(and(
        eq(prompts.ownerId, userId),
        sql`pqas_score IS NOT NULL`
      ));

    const totalUses = await db
      .select({ sum: sql<number>`sum(total_uses)` })
      .from(prompts)
      .where(eq(prompts.ownerId, userId));

    const remixCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(remixes)
      .where(eq(remixes.userId, userId));

    return {
      promptCount: Number(promptCount[0]?.count || 0),
      avgPQAS: Number(avgPQAS[0]?.avg || 0),
      totalUses: Number(totalUses[0]?.sum || 0),
      remixCount: Number(remixCount[0]?.count || 0),
    };
  }

  // Get comments with user data
  async getCommentsWithUsers(promptId: number): Promise<any[]> {
    return await db
      .select({
        comment: comments,
        user: {
          id: users.id,
          email: users.email,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        }
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.promptId, promptId))
      .orderBy(desc(comments.createdAt));
  }
}

export const storage = new DatabaseStorage();
