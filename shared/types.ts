import { z } from "zod";

export const diagnosisInputSchema = z.object({
  whatBuilt: z.string().trim().min(1).max(300),
  targetBuyer: z.string().trim().min(1).max(300),
  isLive: z.boolean(),
  talkedToRealPeople: z.boolean(),
  repliesCount: z.number().int().min(0).max(10000),
  trialRequests: z.number().int().min(0).max(10000),
  paidCount: z.number().int().min(0).max(10000),
  prospects: z.number().int().min(0).max(10000).default(0),
  contacted: z.number().int().min(0).max(10000).default(0),
  interested: z.number().int().min(0).max(10000).default(0),
  demos: z.number().int().min(0).max(10000).default(0),
  trials: z.number().int().min(0).max(10000).default(0),
  proposals: z.number().int().min(0).max(10000).default(0),
  activated: z.number().int().min(0).max(10000).default(0),
  retained: z.number().int().min(0).max(10000).default(0),
  customerEvidence: z.string().trim().max(4000).default(""),
  founderHypothesis: z.string().trim().max(1000).default(""),
  topAction: z.string().trim().min(1).max(500),
  spentMoney: z.boolean(),
  whereStuck: z.string().trim().min(1).max(500),
  sessionId: z.string().max(100).optional(),
}).superRefine((input, context) => {
  const stages: Array<[keyof typeof input, number]> = [
    ["prospects", input.prospects], ["contacted", input.contacted], ["repliesCount", input.repliesCount],
    ["interested", input.interested], ["demos", input.demos], ["trials", input.trials],
    ["proposals", input.proposals], ["paidCount", input.paidCount], ["activated", input.activated], ["retained", input.retained],
  ];
  for (let index = 1; index < stages.length; index += 1) {
    if (stages[index][1] > stages[index - 1][1]) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: [stages[index][0]], message: "Each later funnel stage must not exceed the previous stage." });
    }
  }
});

export type DiagnosisInput = z.infer<typeof diagnosisInputSchema>;

export type DiagnosisResult = {
  bottleneck: "no_live_product" | "no_outreach" | "targeting_or_message" | "positioning_problem" | "interest_no_payment" | "growth_phase" | "unclear_offer";
  bottleneckAr: string;
  bottleneckDescAr: string;
  recommendedDay: number;
  confidence: string;
  disclaimer: string;
  primaryBottleneck: Bottleneck;
  candidates: Bottleneck[];
  confidenceLevel: "low" | "medium" | "high";
  evidence: Array<{ statement: string; source: string; strength: "weak" | "medium" | "strong" }>;
  knownFacts: string[];
  hypotheses: string[];
  missingEvidence: string[];
  doNotChangeYet: string[];
  explanation: string;
  fix: { objective: string; actions: string[] };
  experiment: {
    hypothesis: string;
    target: string;
    action: string;
    sampleSize: number;
    metric: string;
    successCondition: string;
    failureCondition: string;
  };
  funnel: {
    replyRate: number | null;
    interestRate: number | null;
    demoRate: number | null;
    trialToPaidRate: number | null;
    closeRate: number | null;
    activationRate: number | null;
    retentionRate: number | null;
  };
};

export type Bottleneck =
  | "PRODUCT_PROBLEM" | "DEMAND" | "ICP" | "BUYER" | "POSITIONING"
  | "DIFFERENTIATION" | "OFFER" | "PRICE" | "TRUST" | "PROOF"
  | "ACQUISITION" | "MESSAGING" | "SALES_PROCESS" | "ACTIVATION"
  | "RETENTION" | "INSUFFICIENT_EVIDENCE";

export type ApiError = { error: string };
