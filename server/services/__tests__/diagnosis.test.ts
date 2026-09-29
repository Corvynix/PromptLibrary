import { describe, expect, it } from "vitest";
import { runDiagnosis } from "../diagnosis";

const baseline = {
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
};

describe("runDiagnosis", () => {
  it("starts with a live-product check when the product is not live", () => {
    expect(runDiagnosis({ ...baseline, isLive: false }).recommendedDay).toBe(0);
  });

  it("recommends real outreach when there are no replies", () => {
    expect(runDiagnosis(baseline).recommendedDay).toBe(3);
  });

  it("does not call an initial diagnosis proof of product-market fit", () => {
    expect(runDiagnosis({ ...baseline, paidCount: 1 }).disclaimer).toContain("فرضية");
  });
});
