import type { DiagnosisInput, DiagnosisResult } from "@shared/types";

export function runDiagnosis(answers: DiagnosisInput): DiagnosisResult {
  if (!answers.isLive) return {
    bottleneck: "no_live_product",
    bottleneckAr: "المنتج مش live",
    bottleneckDescAr: "خطوتك دلوقتي تطلع نسخة بسيطة يقدر عميل محتمل يجربها.",
    recommendedDay: 0,
    confidence: "فرضية أولية بناءً على إجاباتك",
    disclaimer: "دي فرضية أولية، مش تشخيص مؤكد. كلام العملاء الفعلي هو الدليل.",
  };

  if (!answers.talkedToRealPeople || answers.repliesCount === 0) return {
    bottleneck: "no_outreach",
    bottleneckAr: "لسه مفيش محادثات حقيقية كفاية",
    bottleneckDescAr: "ابدأ بتحديد ناس مناسبة واسألهم عن المشكلة قبل ما تزود خصائص المنتج.",
    recommendedDay: 3,
    confidence: "فرضية أولية بناءً على إجاباتك",
    disclaimer: "دي فرضية أولية، مش تشخيص مؤكد. كلام العملاء الفعلي هو الدليل.",
  };

  if (answers.paidCount > 0) return {
    bottleneck: "growth_phase",
    bottleneckAr: "عندك مبيعات؛ افهم سببها وكررها",
    bottleneckDescAr: "راجع مين اشترى وليه، وحدد تجربة واحدة تساعدك تكرر النتيجة.",
    recommendedDay: 7,
    confidence: "فرضية أولية بناءً على إجاباتك",
    disclaimer: "دي فرضية أولية، مش تشخيص مؤكد. كلام العملاء الفعلي هو الدليل.",
  };

  if (answers.trialRequests > 0) return {
    bottleneck: "interest_no_payment",
    bottleneckAr: "فيه اهتمام من غير دفع",
    bottleneckDescAr: "راجع السعر والثقة وخطوة الطلب، وبعدها اطلب قرار شراء واضح.",
    recommendedDay: 6,
    confidence: "فرضية أولية بناءً على إجاباتك",
    disclaimer: "دي فرضية أولية، مش تشخيص مؤكد. كلام العملاء الفعلي هو الدليل.",
  };

  if (answers.repliesCount < 3) return {
    bottleneck: "targeting_or_message",
    bottleneckAr: "محتاج تراجع الناس اللي بتكلمها أو رسالتك",
    bottleneckDescAr: "اختبر شريحة أضيق ورسالة مرتبطة بمشكلة حصلت مؤخرًا.",
    recommendedDay: 2,
    confidence: "فرضية أولية بناءً على إجاباتك",
    disclaimer: "دي فرضية أولية، مش تشخيص مؤكد. كلام العملاء الفعلي هو الدليل.",
  };

  if (answers.trialRequests === 0) return {
    bottleneck: "positioning_problem",
    bottleneckAr: "العرض أو المشكلة مش واضحين كفاية",
    bottleneckDescAr: "اسأل الناس عن آخر مرة واجهوا المشكلة، واكتب النتيجة اللي عايزينها بكلامهم.",
    recommendedDay: 2,
    confidence: "فرضية أولية بناءً على إجاباتك",
    disclaimer: "دي فرضية أولية، مش تشخيص مؤكد. كلام العملاء الفعلي هو الدليل.",
  };

  return {
    bottleneck: "unclear_offer",
    bottleneckAr: "العرض محتاج اختبار أوضح",
    bottleneckDescAr: "حوّل افتراضاتك لتجربة بيع واحدة وسجل رد الفعل.",
    recommendedDay: 1,
    confidence: "فرضية أولية بناءً على إجاباتك",
    disclaimer: "دي فرضية أولية، مش تشخيص مؤكد. كلام العملاء الفعلي هو الدليل.",
  };
}
