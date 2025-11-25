import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  boolean, 
  timestamp, 
  jsonb, 
  serial,
  index,
  uniqueIndex,
  pgEnum,
  doublePrecision,
  uuid
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const roleEnum = pgEnum('role', ['guest', 'user', 'moderator', 'curator', 'org_admin', 'super_admin']);
export const promptTypeEnum = pgEnum('prompt_type', ['text', 'image', 'video']);
export const visibilityEnum = pgEnum('visibility', ['public', 'private', 'unlisted', 'domain_restricted']);
export const licenseEnum = pgEnum('license', ['MIT', 'CC-BY', 'CC-BY-SA', 'CC-BY-NC', 'Proprietary']);
export const statusEnum = pgEnum('status', ['draft', 'reviewed', 'production', 'deprecated', 'flagged']);
export const difficultyEnum = pgEnum('difficulty', ['Beginner', 'Intermediate', 'Advanced', 'Expert']);
export const voteTypeEnum = pgEnum('vote_type', ['up', 'down']);
export const notificationTypeEnum = pgEnum('notification_type', [
  'follower_new', 'prompt_remixed', 'prompt_forked', 'comment_reply', 
  'comment_on_prompt', 'mention_in_comment', 'upvote_milestone', 
  'badge_unlocked', 'featured_by_curator', 'trending_prompt', 
  'pqas_completed', 'workflow_executed', 'admin_message'
]);
export const executionStatusEnum = pgEnum('execution_status', ['pending', 'running', 'completed', 'failed']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  roles: jsonb("roles").default(sql`'["user"]'::jsonb`).notNull(), // Array of roles
  karmaScore: doublePrecision("karma_score").default(0).notNull(),
  metrics: jsonb("metrics").default(sql`'{}'::jsonb`).notNull(), // Karma breakdown
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isBanned: boolean("is_banned").default(false).notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
}));

// Prompts table
export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDesc: text("short_desc"),
  type: promptTypeEnum("type").default('text').notNull(),
  industryTags: text("industry_tags").array().default(sql`ARRAY[]::text[]`).notNull(),
  socialTags: text("social_tags").array().default(sql`ARRAY[]::text[]`).notNull(),
  visibility: visibilityEnum("visibility").default('public').notNull(),
  license: licenseEnum("license").default('MIT').notNull(),
  ownerId: integer("owner_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  totalUses: integer("total_uses").default(0).notNull(),
  popularityScore: doublePrecision("popularity_score").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  featuredAt: timestamp("featured_at"),
  featureReason: text("feature_reason"),
  searchVector: text("search_vector"), // For full-text search
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('prompts_slug_idx').on(table.slug),
  ownerIdx: index('prompts_owner_idx').on(table.ownerId),
  industryTagsIdx: index('prompts_industry_tags_idx').on(table.industryTags),
  socialTagsIdx: index('prompts_social_tags_idx').on(table.socialTags),
  popularityIdx: index('prompts_popularity_idx').on(table.popularityScore),
  createdAtIdx: index('prompts_created_at_idx').on(table.createdAt),
}));

// Prompt Versions table
export const promptVersions = pgTable("prompt_versions", {
  id: serial("id").primaryKey(),
  promptId: integer("prompt_id").notNull().references(() => prompts.id, { onDelete: 'cascade' }),
  versionNumber: integer("version_number").notNull(),
  content: jsonb("content").notNull(), // {system, user, instructions, examples, imageParams, videoParams}
  modelCompatibility: text("model_compatibility").array().default(sql`ARRAY[]::text[]`).notNull(),
  pqasScore: jsonb("pqas_score"), // {quality, consistency, safety, efficiency, composite, timestamp}
  status: statusEnum("status").default('draft').notNull(),
  parentVersionId: integer("parent_version_id"), // For lineage tracking
  createdBy: integer("created_by").notNull().references(() => users.id),
  difficulty: difficultyEnum("difficulty"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  promptVersionIdx: index('prompt_versions_prompt_idx').on(table.promptId, table.versionNumber),
  parentIdx: index('prompt_versions_parent_idx').on(table.parentVersionId),
  statusIdx: index('prompt_versions_status_idx').on(table.status),
}));

// Workflows table
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  steps: jsonb("steps").notNull(), // [{step_number, prompt_version_id, input_mapping}]
  industry: text("industry"),
  visibility: visibilityEnum("visibility").default('public').notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  adoptedByCount: integer("adopted_by_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  createdByIdx: index('workflows_created_by_idx').on(table.createdBy),
}));

// Execution Logs table
export const executionLogs = pgTable("execution_logs", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").notNull().references(() => workflows.id, { onDelete: 'cascade' }),
  userId: integer("user_id").references(() => users.id),
  status: executionStatusEnum("status").default('pending').notNull(),
  results: jsonb("results"), // Individual step results
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Remixes table (fork tracking)
export const remixes = pgTable("remixes", {
  id: serial("id").primaryKey(),
  originalPromptId: integer("original_prompt_id").notNull().references(() => prompts.id),
  fromVersionId: integer("from_version_id").notNull().references(() => promptVersions.id),
  toVersionId: integer("to_version_id").notNull().references(() => promptVersions.id),
  userId: integer("user_id").notNull().references(() => users.id),
  summaryOfChanges: text("summary_of_changes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  originalPromptIdx: index('remixes_original_prompt_idx').on(table.originalPromptId),
  userIdx: index('remixes_user_idx').on(table.userId),
}));

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  promptId: integer("prompt_id").notNull().references(() => prompts.id, { onDelete: 'cascade' }),
  promptVersionId: integer("prompt_version_id").references(() => promptVersions.id),
  content: text("content").notNull(),
  parentCommentId: integer("parent_comment_id"), // For threading
  upvotes: integer("upvotes").default(0).notNull(),
  downvotes: integer("downvotes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  promptIdx: index('comments_prompt_idx').on(table.promptId),
  userIdx: index('comments_user_idx').on(table.userId),
  parentIdx: index('comments_parent_idx').on(table.parentCommentId),
}));

// Badges definition table
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  criteria: jsonb("criteria").notNull(), // {type, operator, value}
  tier: text("tier"), // Bronze/Silver/Gold
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Badges junction table
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: integer("badge_id").notNull().references(() => badges.id, { onDelete: 'cascade' }),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
}, (table) => ({
  userBadgeIdx: uniqueIndex('user_badges_user_badge_idx').on(table.userId, table.badgeId),
}));

// Usage Logs table
export const usageLogs = pgTable("usage_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  promptVersionId: integer("prompt_version_id").references(() => promptVersions.id),
  action: text("action").notNull(), // 'copy', 'view', 'execute'
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index('usage_logs_user_idx').on(table.userId),
  promptVersionIdx: index('usage_logs_prompt_version_idx').on(table.promptVersionId),
  createdAtIdx: index('usage_logs_created_at_idx').on(table.createdAt),
}));

// Follows table
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  followingId: integer("following_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  followerFollowingIdx: uniqueIndex('follows_follower_following_idx').on(table.followerId, table.followingId),
  followerIdx: index('follows_follower_idx').on(table.followerId),
  followingIdx: index('follows_following_idx').on(table.followingId),
}));

// Votes table
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  votableType: text("votable_type").notNull(), // 'prompt' or 'comment'
  votableId: integer("votable_id").notNull(),
  voteType: voteTypeEnum("vote_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userVotableIdx: uniqueIndex('votes_user_votable_idx').on(table.userId, table.votableType, table.votableId),
  votableIdx: index('votes_votable_idx').on(table.votableType, table.votableId),
}));

// Referrals table
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull().references(() => users.id),
  referredUserId: integer("referred_user_id").references(() => users.id),
  referralCode: text("referral_code").notNull().unique(),
  converted: boolean("converted").default(false).notNull(),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  referrerIdx: index('referrals_referrer_idx').on(table.referrerId),
  codeIdx: uniqueIndex('referrals_code_idx').on(table.referralCode),
}));

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  readIdx: index('notifications_read_idx').on(table.read),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
}));

// Admin Settings table
export const adminSettings = pgTable("admin_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  prompts: many(prompts),
  comments: many(comments),
  followers: many(follows, { relationName: 'following' }),
  following: many(follows, { relationName: 'follower' }),
  badges: many(userBadges),
  notifications: many(notifications),
}));

export const promptsRelations = relations(prompts, ({ one, many }) => ({
  owner: one(users, {
    fields: [prompts.ownerId],
    references: [users.id],
  }),
  versions: many(promptVersions),
  comments: many(comments),
  remixes: many(remixes),
}));

export const promptVersionsRelations = relations(promptVersions, ({ one, many }) => ({
  prompt: one(prompts, {
    fields: [promptVersions.promptId],
    references: [prompts.id],
  }),
  creator: one(users, {
    fields: [promptVersions.createdBy],
    references: [users.id],
  }),
  parentVersion: one(promptVersions, {
    fields: [promptVersions.parentVersionId],
    references: [promptVersions.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [comments.promptId],
    references: [prompts.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  creator: one(users, {
    fields: [workflows.createdBy],
    references: [users.id],
  }),
  executions: many(executionLogs),
}));

// Insert & Select schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  karmaScore: true,
  metrics: true,
  isBanned: true,
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalUses: true,
  popularityScore: true,
  featured: true,
  featuredAt: true,
  featureReason: true,
  searchVector: true,
});

export const insertPromptVersionSchema = createInsertSchema(promptVersions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  upvotes: true,
  downvotes: true,
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  adoptedByCount: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  read: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;
export type InsertPromptVersion = z.infer<typeof insertPromptVersionSchema>;
export type PromptVersion = typeof promptVersions.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type UsageLog = typeof usageLogs.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type ExecutionLog = typeof executionLogs.$inferSelect;
