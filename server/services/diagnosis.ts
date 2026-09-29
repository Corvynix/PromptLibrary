import type { Bottleneck, DiagnosisInput, DiagnosisResult } from "@shared/types";

const MIN_OUTREACH_SAMPLE = 20;
const percent = (part: number, whole: number) => whole > 0 ? Math.round((part / whole) * 100) : null;

export function runDiagnosis(input: DiagnosisInput): DiagnosisResult {
  const evidence: DiagnosisResult["evidence"] = [];
  const knownFacts: string[] = [];
  const missingEvidence: string[] = [];
  const contacted = Math.max(input.contacted, input.repliesCount);
  const replies = input.repliesCount;
  const interested = input.interested;
  const paid = input.paidCount;

  const addFact = (statement: string, source: string, strength: "weak" | "medium" | "strong") => {
    evidence.push({ statement, source, strength });
    knownFacts.push(statement);
  };

  if (!input.isLive) addFact("المنتج غير متاح للتجربة حاليًا حسب إجابتك.", "إجابة صاحب المنتج", "medium");
  if (contacted > 0) addFact(`تم التواصل مع ${contacted} شخص، ووصل ${replies} رد.`, "عدادات قمع البيع المُدخلة", "strong");
  if (replies > 0) addFact(`معدل الرد المحسوب ${percent(replies, contacted)}% من الأشخاص الذين تم التواصل معهم.`, "حساب مباشر من الأرقام المدخلة", "strong");
  if (interested > 0) addFact(`أبدى ${interested} شخص اهتمامًا من أصل ${replies} ردود مسجلة.`, "عدادات قمع البيع المُدخلة", "strong");
  if (paid > 0) addFact(`تم تسجيل ${paid} عملية دفع.`, "عدادات قمع البيع المُدخلة", "strong");
  if (input.customerEvidence) addFact("أُرفق نص من محادثة أو ملاحظة مع عميل محتمل؛ لم يُحلل آليًا.", "نص أدخله المستخدم", "medium");

  const hypotheses = input.founderHypothesis ? [input.founderHypothesis] : [];
  const funnel = {
    replyRate: percent(replies, contacted),
    interestRate: percent(interested, replies),
    demoRate: percent(input.demos, interested),
    trialToPaidRate: percent(paid, input.trials),
    closeRate: percent(paid, input.proposals),
    activationRate: percent(input.activated, paid),
    retentionRate: percent(input.retained, input.activated),
  };

  let primaryBottleneck: Bottleneck = "INSUFFICIENT_EVIDENCE";
  let candidates: Bottleneck[] = ["INSUFFICIENT_EVIDENCE"];
  let confidenceLevel: DiagnosisResult["confidenceLevel"] = "low";
  let objective = "اجمع دليلًا مباشرًا قبل تغيير المنتج أو العرض.";
  let actions = [`تواصل مع ${MIN_OUTREACH_SAMPLE} مشترين محتملين محددين وسجّل الردود الفعلية.`];
  let experiment = {
    hypothesis: "إذا تواصلت مع مشترين محتملين محددين برسالة مرتبطة بمشكلة حديثة، سأحصل على ردود توضح مدى ملاءمة المشكلة.",
    target: input.targetBuyer,
    action: "أرسل رسالة شخصية تسأل عن طريقة تعاملهم الحالية مع المشكلة، دون عرض بيع مبكر.",
    sampleSize: MIN_OUTREACH_SAMPLE,
    metric: "عدد الردود ذات الصلة من الأشخاص الذين تم التواصل معهم",
    successCondition: "3 ردود أو أكثر تتضمن وصفًا واضحًا للمشكلة أو طريقة التعامل معها.",
    failureCondition: "أقل من 3 ردود ذات صلة؛ راجع الشريحة والرسالة بعد مراجعة العينة كاملة.",
  };

  if (!input.isLive) {
    missingEvidence.push("هل يستطيع مشترٍ محتمل استخدام المنتج أو مشاهدة نتيجة ملموسة؟");
    objective = "جهّز تجربة صغيرة يمكن لمشترٍ محتمل تقييمها.";
    actions = ["حدّد نتيجة واحدة يقدمها المنتج.", "جهّز نسخة أو عرضًا توضيحيًا صالحًا للتجربة.", "اختبره مع مشترٍ محتمل قبل إضافة خصائص جديدة."];
    experiment = { ...experiment, hypothesis: "إذا أصبح المنتج قابلًا للتجربة، يمكن لمشترٍ محتمل تقييم النتيجة بدل التخمين.", target: input.targetBuyer, action: "اعرض نسخة قابلة للتجربة على 5 مشترين محتملين واطلب منهم تنفيذ مهمة واحدة.", sampleSize: 5, metric: "عدد الأشخاص الذين أكملوا المهمة والنتيجة التي حققوها", successCondition: "3 من 5 يكملون المهمة دون تدخل منك.", failureCondition: "أقل من 3 يكملونها؛ راجع عائق الاستخدام قبل التسويق." };
  } else if (contacted < MIN_OUTREACH_SAMPLE) {
    missingEvidence.push(`نحتاج عينة أكبر من محاولات التواصل؛ المسجل حاليًا ${contacted} من ${MIN_OUTREACH_SAMPLE} كحد إرشادي.`);
  } else if (replies / contacted <= 0.1) {
    primaryBottleneck = "MESSAGING";
    candidates = ["MESSAGING", "ICP", "ACQUISITION"];
    confidenceLevel = "low";
    objective = "اختبر ملاءمة الشريحة والرسالة قبل تغيير المنتج.";
    actions = ["راجع مدى تطابق كل شخص مع المشتري المستهدف.", "اكتب رسالة قصيرة مرتبطة بمشكلة محددة وحديثة.", "اختبر النسخة على عينة جديدة وسجّل الردود."];
    experiment = { ...experiment, hypothesis: "رسالة مرتبطة بمشكلة حديثة لدى الشريحة المحددة ستحسن الردود.", action: "اختبر رسالتين واضحتين على مجموعتين متقاربتين من المشترين المؤهلين.", metric: "معدل الردود ذات الصلة لكل رسالة", successCondition: "إحدى الرسالتين تحقق ردودًا ذات صلة أكثر بوضوح في عينة الاختبار.", failureCondition: "لا يظهر فرق واضح؛ أعد فحص تعريف المشتري ومصدر الوصول." };
  } else if (replies > 0 && interested / replies < 0.3) {
    primaryBottleneck = "POSITIONING";
    candidates = ["POSITIONING", "PRODUCT_PROBLEM", "ICP"];
    confidenceLevel = "low";
    objective = "افهم إن كانت المشكلة أولوية فعلية للمشتري قبل تعديل الرسائل فقط.";
    actions = ["راجع ما قاله أصحاب الردود عن المشكلة الحالية.", "اسأل عن آخر مرة واجهوا فيها المشكلة وما فعلوه.", "لا تعتبر المجاملة دليلًا على نية الشراء."];
    missingEvidence.push("أمثلة مباشرة عن تكرار المشكلة وتكلفتها والحلول الحالية.");
  } else if (interested > 0 && paid === 0) {
    primaryBottleneck = "OFFER";
    candidates = ["OFFER", "TRUST", "PROOF", "PRICE", "SALES_PROCESS"];
    confidenceLevel = "low";
    objective = "حدد أين يتوقف المهتمون بين إبداء الاهتمام وقرار الشراء.";
    actions = ["اسأل كل مهتم عن العائق المحدد أمام الخطوة التالية.", "اعرض طلب شراء أو تجربة واضحًا بسعر وشروط محددة.", "سجّل الاعتراضات كما قيلت ولا تفترض أن السعر هو السبب."];
    missingEvidence.push("اعتراضات مباشرة، عروض سعر فعلية، ونتيجة طلب شراء واضح.");
    experiment = { ...experiment, hypothesis: "طلب شراء واضح ومحدد سيكشف إن كان العائق في العرض أو الثقة أو السعر.", target: input.targetBuyer, action: "قدّم عرضًا واحدًا محدد النتيجة والسعر والخطوة التالية إلى 5 مهتمين مؤهلين.", sampleSize: 5, metric: "قرارات الشراء وأسباب الرفض المسجلة مباشرة", successCondition: "قرار شراء أو تجربة مدفوعة واحدة على الأقل، أو اعتراض متكرر يمكن اختباره.", failureCondition: "لا قرار ولا سبب واضح؛ أجرِ مقابلات متابعة قبل تغيير السعر." };
  } else if (paid > 0 && input.activated < paid) {
    primaryBottleneck = "ACTIVATION";
    candidates = ["ACTIVATION"];
    confidenceLevel = "medium";
    objective = "قلّل العائق الذي يمنع المشترين من الوصول لأول قيمة من المنتج.";
    actions = ["تواصل مع من دفعوا ولم يبدأوا الاستخدام.", "حدد أول خطوة تعطلهم وأزل عائقًا واحدًا.", "قِس الوصول لأول نتيجة مفيدة."];
    missingEvidence.push("سبب عدم التفعيل والوقت من الدفع لأول نتيجة.");
  } else if (input.activated > 0 && input.retained < input.activated) {
    primaryBottleneck = "RETENTION";
    candidates = ["RETENTION"];
    confidenceLevel = "low";
    objective = "افهم لماذا لم يعد المستخدمون بعد أول استخدام.";
    actions = ["قارن الاستخدام الفعلي بالنتيجة التي وعد بها العرض.", "اسأل المستخدمين المنقطعين عن آخر نقطة قيمة وصلوا لها.", "اختبر تحسينًا واحدًا في مسار العودة."];
    missingEvidence.push("فترة القياس وسبب توقف المستخدمين عن العودة.");
  } else if (paid > 0 && input.retained > 0) {
    primaryBottleneck = "DEMAND";
    candidates = ["DEMAND", "ACQUISITION"];
    confidenceLevel = "low";
    objective = "افهم ما الذي دفع العملاء الحاليين للشراء، ثم اختبر تكرار الوصول إليهم.";
    actions = ["وثّق مصدر كل عميل مدفوع وسبب اختياره.", "اختبر قناة واحدة للوصول إلى مشترين مشابهين."];
    missingEvidence.push("عينة متكررة تثبت إمكانية الوصول إلى مشترين مشابهين.");
  }

  if (!input.customerEvidence) missingEvidence.push("نصوص أو ملاحظات مباشرة من محادثات المشترين المحتملين.");
  const doNotChangeYet = ["لا تغيّر السعر اعتمادًا على افتراض فقط.", "لا تضف خصائص قبل تحديد عائق مدعوم بدليل."];
  const explanation = candidates[0] === "INSUFFICIENT_EVIDENCE"
    ? "المعلومات الحالية لا تكفي لتحديد عطل في السوق أو المنتج. النتيجة هنا نقص دليل، وليست حكمًا على وجود الطلب."
    : `النتيجة فرضية أولية مبنية على الأرقام المدخلة. المرشحون الذين يستحقون الاختبار: ${candidates.join("، ")}. الحدود المستخدمة إرشادية وليست معيارًا علميًا عامًا.`;

  const legacy: DiagnosisResult["bottleneck"] = !input.isLive ? "no_live_product" : contacted < MIN_OUTREACH_SAMPLE ? "no_outreach" : primaryBottleneck === "ACTIVATION" || primaryBottleneck === "RETENTION" || primaryBottleneck === "DEMAND" ? "growth_phase" : primaryBottleneck === "OFFER" ? "interest_no_payment" : primaryBottleneck === "POSITIONING" ? "positioning_problem" : primaryBottleneck === "MESSAGING" ? "targeting_or_message" : "unclear_offer";
  const legacyLabels: Record<DiagnosisResult["bottleneck"], string> = {
    no_live_product: "المنتج محتاج يبقى متاح للتجربة", no_outreach: "الأدلة الحالية غير كافية", targeting_or_message: "راجع الشريحة أو الرسالة", positioning_problem: "راجع المشكلة والتموضع", interest_no_payment: "راجع العرض وخطوة الشراء", growth_phase: "راجع التفعيل أو استمرار الاستخدام", unclear_offer: "العرض محتاج اختبار أوضح",
  };

  return {
    bottleneck: legacy,
    bottleneckAr: legacyLabels[legacy],
    bottleneckDescAr: objective,
    recommendedDay: 1,
    confidence: confidenceLevel === "medium" ? "ثقة متوسطة" : "فرضية أولية - ثقة منخفضة",
    disclaimer: "دي فرضية إرشادية وليست تشخيصًا مؤكدًا أو وعدًا ببيع. استخدم سلوك المشترين الفعلي كدليل.",
    primaryBottleneck, candidates, confidenceLevel, evidence, knownFacts, hypotheses,
    missingEvidence, doNotChangeYet, explanation, fix: { objective, actions }, experiment, funnel,
  };
}
