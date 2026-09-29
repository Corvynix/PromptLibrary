import { z } from "zod";

export const diagnosisInputSchema = z.object({
  whatBuilt: z.string().trim().min(1).max(300),
  targetBuyer: z.string().trim().min(1).max(300),
  isLive: z.boolean(),
  talkedToRealPeople: z.boolean(),
  repliesCount: z.number().int().min(0).max(10000),
  trialRequests: z.number().int().min(0).max(10000),
  paidCount: z.number().int().min(0).max(10000),
  topAction: z.string().trim().min(1).max(500),
  spentMoney: z.boolean(),
  whereStuck: z.string().trim().min(1).max(500),
  sessionId: z.string().max(100).optional(),
});

export type DiagnosisInput = z.infer<typeof diagnosisInputSchema>;

export type DiagnosisResult = {
  bottleneck: "no_live_product" | "no_outreach" | "targeting_or_message" | "positioning_problem" | "interest_no_payment" | "growth_phase" | "unclear_offer";
  bottleneckAr: string;
  bottleneckDescAr: string;
  recommendedDay: number;
  confidence: string;
  disclaimer: string;
};

export type ApiError = { error: string };
