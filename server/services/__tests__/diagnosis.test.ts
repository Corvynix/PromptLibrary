import { describe, expect, it } from "vitest";
import { runDiagnosis } from "../diagnosis";

const base = {
  whatBuilt: "Inventory app",
  targetBuyer: "Small retailers",
  isLive: true,
  talkedToRealPeople: true,
  repliesCount: 0,
  trialRequests: 0,
  paidCount: 0,
  topAction: "Posted on social media",
  spentMoney: false,
  whereStuck: "Finding buyers",
  prospects: 8,
  contacted: 5,
  interested: 0,
  demos: 0,
  trials: 0,
  proposals: 0,
  activated: 0,
  retained: 0,
  customerEvidence: "",
  founderHypothesis: "",
};

describe("runDiagnosis", () => {
  it("reports insufficient evidence for a small outreach sample", () => {
    const report = runDiagnosis({ ...base, repliesCount: 0 });
    expect(report.primaryBottleneck).toBe("INSUFFICIENT_EVIDENCE");
    expect(report.confidenceLevel).toBe("low");
    expect(report.experiment.sampleSize).toBeGreaterThan(0);
  });

  it("calculates funnel rates without asking a model", () => {
    const report = runDiagnosis({
      ...base,
      prospects: 100,
      contacted: 80,
      repliesCount: 20,
      interested: 10,
      demos: 5,
      trials: 4,
      proposals: 3,
      paidCount: 2,
      activated: 1,
      retained: 1,
    });
    expect(report.funnel.replyRate).toBe(25);
    expect(report.funnel.interestRate).toBe(50);
    expect(report.funnel.trialToPaidRate).toBe(50);
  });

  it("does not treat a founder's theory as direct evidence", () => {
    const report = runDiagnosis({ ...base, founderHypothesis: "People think the price is too high" });
    expect(report.hypotheses).toContain("People think the price is too high");
    expect(report.evidence.some((item) => item.statement.includes("price is too high"))).toBe(false);
  });

  it("surfaces activation after paid users fail to activate", () => {
    const report = runDiagnosis({ ...base, prospects: 100, contacted: 80, repliesCount: 30, interested: 20, demos: 10, trials: 8, proposals: 5, paidCount: 4, activated: 1 });
    expect(report.primaryBottleneck).toBe("ACTIVATION");
    expect(report.evidence.length).toBeGreaterThan(0);
  });
});
