import type {
  User,
  Profile,
  Project,
  Post,
  Comment,
  Payment,
  RadarItem,
  Resource,
  SprintEntry,
  Prospect,
  OutreachLog,
  RepoItem,
} from "../../shared/schema";

// Override and expand types for client usage
export type PopulatedUser = User & { profile?: Profile };

export type PopulatedPost = Post & {
  author: Pick<User, "id" | "displayName" | "avatarUrl">;
  isLiked?: boolean;
  isBookmarked?: boolean;
};

export type PopulatedComment = Comment & {
  author: Pick<User, "id" | "displayName" | "avatarUrl">;
};

export type PopulatedPayment = Payment & {
  user?: Pick<User, "id" | "displayName" | "email">;
};

export type SprintDay = {
  id: string;
  sprintProductId: string;
  dayNumber: number;
  titleAr: string;
  titleEn?: string | null;
  missionAr: string;
  missionEn?: string | null;
  whyAr?: string | null;
  taskDescriptionAr?: string | null;
  templateAr?: string | null;
  exampleAr?: string | null;
  outputLabelAr?: string | null;
  reflectionPromptAr?: string | null;
};

export type DiagnosisResult = {
  id: string;
  bottleneck: string;
  bottleneckAr: string;
  bottleneckDescAr: string;
  recommendedDay: number;
  confidence: string;
  disclaimer: string;
};

// Expose schema types
export type {
  User,
  Profile,
  Project,
  Post,
  Comment,
  Payment,
  RadarItem,
  Resource,
  SprintEntry,
  Prospect,
  OutreachLog,
  RepoItem,
};
