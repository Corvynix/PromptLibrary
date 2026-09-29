import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  boolean,
  timestamp,
  serial,
  integer,
  uniqueIndex,
  index,
  uuid,
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const projectStageEnum = pgEnum("project_stage", [
  "idea",
  "building",
  "live",
  "trying_to_sell",
  "first_sale",
  "growing",
]);

export const postTypeEnum = pgEnum("post_type", [
  "build",
  "stuck",
  "sell",
  "feedback",
  "win",
  "tool",
  "ai",
  "general",
]);

export const contentStatusEnum = pgEnum("content_status", [
  "published",
  "hidden",
  "removed",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "submitted",
  "verified",
  "rejected",
]);

export const paymentTypeEnum = pgEnum("payment_type", [
  "sprint",
  "membership",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "cancelled",
  "expired",
  "pending",
]);

export const sprintEnrollmentStatusEnum = pgEnum("sprint_enrollment_status", [
  "active",
  "completed",
  "abandoned",
]);

export const radarCategoryEnum = pgEnum("radar_category", [
  "ai_models",
  "ai_coding",
  "ai_agents",
  "ai_tools",
  "github",
  "apis",
  "product_opportunities",
  "useful_releases",
]);

export const resourceTypeEnum = pgEnum("resource_type", [
  "prompt",
  "template",
  "checklist",
  "tool",
  "workflow",
  "starter",
  "component",
  "guide",
  "github_repo",
]);

export const reportTargetEnum = pgEnum("report_target_type", [
  "post",
  "comment",
  "user",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "reviewed",
  "resolved",
]);

export const salesLeadStatusEnum = pgEnum("sales_lead_status", [
  "interested",
  "demo",
  "proposal",
  "paid",
  "rejected",
  "follow_up",
]);

export const entitlementTypeEnum = pgEnum("entitlement_type", [
  "sprint_access",
  "membership",
  "admin",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "payment_verified",
  "payment_rejected",
  "comment",
  "like",
  "report_resolved",
  "general",
]);

// ─── Core User Tables ─────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    roles: text("roles").default(sql`'["user"]'::text`).notNull(),
    karmaScore: text("karma_score").default("0").notNull(),
    isBanned: boolean("is_banned").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({ emailIdx: uniqueIndex("users_email_idx").on(table.email) })
);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  username: text("username").unique(),
  location: text("location"),
  builderStatus: text("builder_status"), // e.g. "building", "trying_to_sell"
  aiTools: text("ai_tools").array().default(sql`'{}'::text[]`),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    url: text("url"),
    category: text("category"),
    stage: projectStageEnum("stage").default("building").notNull(),
    technologies: text("technologies").array().default(sql`'{}'::text[]`),
    aiToolsUsed: text("ai_tools_used").array().default(sql`'{}'::text[]`),
    targetAudience: text("target_audience"),
    monetizationModel: text("monetization_model"),
    price: text("price"),
    salesCount: integer("sales_count").default(0).notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    status: text("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("projects_user_idx").on(table.userId),
    slugIdx: index("projects_slug_idx").on(table.slug),
  })
);

export const projectUpdates = pgTable(
  "project_updates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({ projectIdx: index("project_updates_project_idx").on(table.projectId) })
);

// ─── Sprint ───────────────────────────────────────────────────────────────────

export const sprintProducts = pgTable("sprint_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sprintDays = pgTable(
  "sprint_days",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sprintProductId: uuid("sprint_product_id")
      .notNull()
      .references(() => sprintProducts.id, { onDelete: "cascade" }),
    dayNumber: integer("day_number").notNull(), // 0 = Day 0 (reality check), 1–7
    titleAr: text("title_ar").notNull(),
    titleEn: text("title_en"),
    missionAr: text("mission_ar").notNull(),
    missionEn: text("mission_en"),
    whyAr: text("why_ar"),
    taskDescriptionAr: text("task_description_ar"),
    templateAr: text("template_ar"),
    exampleAr: text("example_ar"),
    outputLabelAr: text("output_label_ar"),
    reflectionPromptAr: text("reflection_prompt_ar"),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => ({
    sprintIdx: index("sprint_days_product_idx").on(table.sprintProductId),
  })
);

export const sprintEnrollments = pgTable(
  "sprint_enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sprintProductId: uuid("sprint_product_id")
      .notNull()
      .references(() => sprintProducts.id),
    paymentId: uuid("payment_id"),
    currentDay: integer("current_day").default(0).notNull(),
    status: sprintEnrollmentStatusEnum("status").default("active").notNull(),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => ({
    userIdx: index("sprint_enrollments_user_idx").on(table.userId),
  })
);

export const sprintEntries = pgTable(
  "sprint_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => sprintEnrollments.id, { onDelete: "cascade" }),
    dayNumber: integer("day_number").notNull(),
    inputData: jsonb("input_data").default(sql`'{}'::jsonb`),
    outputData: jsonb("output_data").default(sql`'{}'::jsonb`),
    isCompleted: boolean("is_completed").default(false).notNull(),
    completedAt: timestamp("completed_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    enrollmentIdx: index("sprint_entries_enrollment_idx").on(table.enrollmentId),
  })
);

export const prospects = pgTable(
  "prospects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => sprintEnrollments.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    business: text("business"),
    segment: text("segment"),
    location: text("location"),
    reasonToCare: text("reason_to_care"),
    contactChannel: text("contact_channel"),
    status: text("status").default("not_contacted").notNull(),
    contactedAt: timestamp("contacted_at"),
    response: text("response"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    enrollmentIdx: index("prospects_enrollment_idx").on(table.enrollmentId),
  })
);

export const outreachLogs = pgTable(
  "outreach_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => sprintEnrollments.id, { onDelete: "cascade" }),
    prospectId: uuid("prospect_id").references(() => prospects.id),
    name: text("name").notNull(),
    response: text("response"),
    pain: text("pain"),
    currentSolution: text("current_solution"),
    moneySpent: text("money_spent"),
    interested: boolean("interested"),
    nextStep: text("next_step"),
    objection: text("objection"),
    priceDiscussed: text("price_discussed"),
    loggedAt: timestamp("logged_at").defaultNow().notNull(),
  },
  (table) => ({
    enrollmentIdx: index("outreach_logs_enrollment_idx").on(table.enrollmentId),
  })
);

export const salesLeads = pgTable(
  "sales_leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => sprintEnrollments.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: salesLeadStatusEnum("status").default("interested").notNull(),
    demoDate: timestamp("demo_date"),
    proposalDate: timestamp("proposal_date"),
    paidAt: timestamp("paid_at"),
    rejectedAt: timestamp("rejected_at"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    enrollmentIdx: index("sales_leads_enrollment_idx").on(table.enrollmentId),
  })
);

// ─── Community ────────────────────────────────────────────────────────────────

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    type: postTypeEnum("type").default("general").notNull(),
    title: text("title"),
    content: text("content").notNull(),
    status: contentStatusEnum("status").default("published").notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    commentCount: integer("comment_count").default(0).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("posts_user_idx").on(table.userId),
    typeIdx: index("posts_type_idx").on(table.type),
    statusIdx: index("posts_status_idx").on(table.status),
    createdIdx: index("posts_created_idx").on(table.createdAt),
  })
);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id"),
    content: text("content").notNull(),
    status: contentStatusEnum("status").default("published").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    postIdx: index("comments_post_idx").on(table.postId),
    userIdx: index("comments_user_idx").on(table.userId),
  })
);

export const postLikes = pgTable(
  "post_likes",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: uniqueIndex("post_likes_pk").on(table.postId, table.userId),
  })
);

export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: uniqueIndex("bookmarks_pk").on(table.userId, table.postId),
  })
);

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  color: text("color").default("#6366f1"),
});

export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: uniqueIndex("post_tags_pk").on(table.postId, table.tagId),
  })
);

// ─── AI Radar ─────────────────────────────────────────────────────────────────

export const radarItems = pgTable(
  "radar_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    source: text("source"),
    sourceUrl: text("source_url"),
    category: radarCategoryEnum("category").notNull(),
    publishedAt: timestamp("published_at"),
    summary: text("summary").notNull(),
    whyItMatters: text("why_it_matters"),
    tags: text("tags").array().default(sql`'{}'::text[]`),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
    authorId: integer("author_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index("radar_items_category_idx").on(table.category),
    featuredIdx: index("radar_items_featured_idx").on(table.isFeatured),
  })
);

// ─── Repo Radar ───────────────────────────────────────────────────────────────

export const repoItems = pgTable(
  "repo_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    repoUrl: text("repo_url").notNull().unique(),
    owner: text("owner").notNull(),
    repoName: text("repo_name").notNull(),
    description: text("description"),
    stars: integer("stars").default(0),
    language: text("language"),
    category: text("category"),
    whyItMatters: text("why_it_matters"),
    tags: text("tags").array().default(sql`'{}'::text[]`),
    isFeatured: boolean("is_featured").default(false).notNull(),
    dateDiscovered: timestamp("date_discovered").defaultNow(),
    lastFetched: timestamp("last_fetched"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    featuredIdx: index("repo_items_featured_idx").on(table.isFeatured),
  })
);

// ─── Builder Vault ────────────────────────────────────────────────────────────

export const resources = pgTable(
  "resources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    resourceType: resourceTypeEnum("resource_type").notNull(),
    category: text("category"),
    url: text("url"),
    fileUrl: text("file_url"),
    tags: text("tags").array().default(sql`'{}'::text[]`),
    difficulty: text("difficulty").default("beginner"), // beginner, intermediate, advanced
    isFeatured: boolean("is_featured").default(false).notNull(),
    isPublished: boolean("is_published").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    typeIdx: index("resources_type_idx").on(table.resourceType),
    publishedIdx: index("resources_published_idx").on(table.isPublished),
  })
);

// ─── Payments & Entitlements ──────────────────────────────────────────────────

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: paymentTypeEnum("type").notNull(),
    productId: uuid("product_id"), // sprint product id or null for membership
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").default("EGP").notNull(),
    status: paymentStatusEnum("status").default("pending").notNull(),
    referenceNumber: text("reference_number"), // InstaPay reference
    proofUrl: text("proof_url"), // uploaded screenshot
    notes: text("notes"),
    reviewedBy: integer("reviewed_by").references(() => users.id),
    reviewedAt: timestamp("reviewed_at"),
    reconciliationNotes: text("reconciliation_notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("payments_user_idx").on(table.userId),
    statusIdx: index("payments_status_idx").on(table.status),
  })
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plan: text("plan").default("founding").notNull(),
    status: subscriptionStatusEnum("status").default("pending").notNull(),
    paymentId: uuid("payment_id").references(() => payments.id),
    startedAt: timestamp("started_at"),
    expiresAt: timestamp("expires_at"),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("subscriptions_user_idx").on(table.userId),
  })
);

export const entitlements = pgTable(
  "entitlements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: entitlementTypeEnum("type").notNull(),
    resourceId: uuid("resource_id"), // sprint_product id or subscription id
    grantedAt: timestamp("granted_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),
    revokedAt: timestamp("revoked_at"),
  },
  (table) => ({
    userIdx: index("entitlements_user_idx").on(table.userId),
    typeIdx: index("entitlements_type_idx").on(table.type),
  })
);

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    link: text("link"),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("notifications_user_idx").on(table.userId),
    readIdx: index("notifications_read_idx").on(table.isRead),
  })
);

// ─── Reports / Moderation ─────────────────────────────────────────────────────

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reporterId: integer("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: reportTargetEnum("target_type").notNull(),
    targetId: text("target_id").notNull(), // post uuid, comment uuid, or user id
    reason: text("reason").notNull(),
    status: reportStatusEnum("status").default("pending").notNull(),
    reviewedBy: integer("reviewed_by").references(() => users.id),
    reviewNote: text("review_note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    resolvedAt: timestamp("resolved_at"),
  },
  (table) => ({
    statusIdx: index("reports_status_idx").on(table.status),
  })
);

// ─── Feature Flags & Settings ─────────────────────────────────────────────────

export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: boolean("value").default(true).notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: integer("actor_id").references(() => users.id),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    actorIdx: index("audit_logs_actor_idx").on(table.actorId),
    createdIdx: index("audit_logs_created_idx").on(table.createdAt),
  })
);

// ─── Analytics Events ─────────────────────────────────────────────────────────

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    sessionId: text("session_id"),
    event: text("event").notNull(),
    properties: jsonb("properties").default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    eventIdx: index("analytics_events_event_idx").on(table.event),
    createdIdx: index("analytics_events_created_idx").on(table.createdAt),
  })
);

// ─── Diagnosis Results ────────────────────────────────────────────────────────

export const diagnosisResults = pgTable(
  "diagnosis_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    sessionId: text("session_id"),
    answers: jsonb("answers").notNull(),
    result: jsonb("result").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("diagnosis_results_user_idx").on(table.userId),
  })
);

// ─── Zod Schemas & Types ──────────────────────────────────────────────────────

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);
export type Profile = z.infer<typeof selectProfileSchema>;

export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);
export type Project = z.infer<typeof selectProjectSchema>;

export const insertPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);
export type Post = z.infer<typeof selectPostSchema>;

export const insertCommentSchema = createInsertSchema(comments);
export const selectCommentSchema = createSelectSchema(comments);
export type Comment = z.infer<typeof selectCommentSchema>;

export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);
export type Payment = z.infer<typeof selectPaymentSchema>;

export const insertRadarItemSchema = createInsertSchema(radarItems);
export const selectRadarItemSchema = createSelectSchema(radarItems);
export type RadarItem = z.infer<typeof selectRadarItemSchema>;

export const insertResourceSchema = createInsertSchema(resources);
export const selectResourceSchema = createSelectSchema(resources);
export type Resource = z.infer<typeof selectResourceSchema>;

export const insertSprintEntrySchema = createInsertSchema(sprintEntries);
export const selectSprintEntrySchema = createSelectSchema(sprintEntries);
export type SprintEntry = z.infer<typeof selectSprintEntrySchema>;

export const insertProspectSchema = createInsertSchema(prospects);
export const selectProspectSchema = createSelectSchema(prospects);
export type Prospect = z.infer<typeof selectProspectSchema>;

export const insertOutreachLogSchema = createInsertSchema(outreachLogs);
export const selectOutreachLogSchema = createSelectSchema(outreachLogs);
export type OutreachLog = z.infer<typeof selectOutreachLogSchema>;

export const insertNotificationSchema = createInsertSchema(notifications);
export const selectNotificationSchema = createSelectSchema(notifications);
export type Notification = z.infer<typeof selectNotificationSchema>;

export const insertRepoItemSchema = createInsertSchema(repoItems);
export const selectRepoItemSchema = createSelectSchema(repoItems);
export type RepoItem = z.infer<typeof selectRepoItemSchema>;

// Legacy — keep for backward compatibility
export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  background: text("background").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const insertApplicationSchema = createInsertSchema(applications);
export const selectApplicationSchema = createSelectSchema(applications);
export type Application = z.infer<typeof selectApplicationSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
