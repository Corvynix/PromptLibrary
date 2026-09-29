export const landingData = {
  modules: [
    { id: "buyer", titleKey: "home.modules.buyer.title", icon: "Target", descriptionKey: "home.modules.buyer.description", outcomes: ["home.modules.buyer.output"] },
    { id: "problem", titleKey: "home.modules.problem.title", icon: "Boxes", descriptionKey: "home.modules.problem.description", outcomes: ["home.modules.problem.output"] },
    { id: "offer", titleKey: "home.modules.offer.title", icon: "TrendingUp", descriptionKey: "home.modules.offer.description", outcomes: ["home.modules.offer.output"] },
    { id: "evidence", titleKey: "home.modules.evidence.title", icon: "Users", descriptionKey: "home.modules.evidence.description", outcomes: ["home.modules.evidence.output"] },
  ],
  curriculum: [
    { quarter: "00", titleKey: "home.days.zero", modules: ["home.days.zeroTask"] },
    { quarter: "01–02", titleKey: "home.days.oneTwo", modules: ["home.days.oneTwoTask"] },
    { quarter: "03–05", titleKey: "home.days.threeFive", modules: ["home.days.threeFiveTask"] },
    { quarter: "06–07", titleKey: "home.days.sixSeven", modules: ["home.days.sixSevenTask"] },
  ],
};
