import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            nav: {
                home: "HOME",
                program: "PROGRAM",
                outcomes: "OUTCOMES",
                curriculum: "CURRICULUM",
                faq: "FAQ",
            },
            home: {
                nav: { home: "HOME", program: "HOW IT WORKS", diagnosis: "DIAGNOSIS", sprint: "SPRINT", login: "SIGN IN", menu: "MENU", terms: "TERMS", privacy: "PRIVACY", refund: "REFUNDS", guidelines: "COMMUNITY GUIDELINES" },
                eyebrow: "For builders with a product and no meaningful sales",
                title: "Built something with AI, but nobody bought it?",
                subtitle: "Before adding more features, find who needs the product, start real conversations, and make a clear offer.",
                cta: "Start the free diagnosis",
                secondary: "See the 7-day sprint",
                stats: [
                    { value: "01", label: "Choose a buyer", note: "A person you can actually reach" },
                    { value: "02", label: "Understand the problem", note: "Ask about what happened" },
                    { value: "03", label: "Make an offer", note: "Ask for a clear next step" },
                    { value: "04", label: "Record evidence", note: "Use real replies, not guesses" },
                ],
                programTitle: "Turn your product into a real sales attempt",
                programOutcomes: "What you will work on",
                modules: {
                    buyer: { title: "Choose a buyer", description: "Narrow the audience to people you can identify and contact.", output: "A specific buyer profile" },
                    problem: { title: "Understand the problem", description: "Ask how people handle the problem today and what it costs them.", output: "Notes from real conversations" },
                    offer: { title: "Shape the offer", description: "Explain the result, price, and next step without adding unsupported promises.", output: "A clear offer to test" },
                    evidence: { title: "Make the attempt", description: "Ask for a trial or purchase and record what people actually do.", output: "A decision based on market evidence" },
                },
                outcomeTitle: "Useful evidence, not promised outcomes",
                outcomes: [
                    { value: "Buyer", label: "Who it is for", note: "A reachable target buyer" },
                    { value: "Problem", label: "What matters", note: "Evidence of a real need" },
                    { value: "Offer", label: "What you ask", note: "A clear trial or purchase step" },
                    { value: "Response", label: "What happened", note: "A record of the actual response" },
                ],
                curriculumTitle: "The 7-day sprint",
                days: {
                    zero: "Day 0", zeroTask: "Check that the product is live and ready to try.",
                    oneTwo: "Days 1–2", oneTwoTask: "Choose a buyer and make the offer clear.",
                    threeFive: "Days 3–5", threeFiveTask: "Find prospects, start conversations, and review what you hear.",
                    sixSeven: "Days 6–7", sixSevenTask: "Ask for the sale and decide what to change next.",
                },
                principlesTitle: "How we work",
                principles: [
                    { title: "No sales guarantees", body: "The sprint does not promise a customer, revenue, or market fit." },
                    { title: "No invented proof", body: "Progress comes from real conversations and actions, not fabricated metrics." },
                    { title: "Keep the next step clear", body: "Each area should point back to a practical action for your product." },
                ],
                expectationsTitle: "Before you start",
                expectations: [
                    { title: "No guaranteed result", body: "The sprint does not promise a customer, revenue, or market fit.", note: "The market decides" },
                    { title: "Use real evidence", body: "A polite compliment is not the same as a request to buy.", note: "Record what happens" },
                    { title: "Keep testing", body: "Change one thing at a time, then see how people respond.", note: "Make the next step clear" },
                ],
                faqTitle: "Common questions",
                faqItems: [
                    { q: "Who is this for?", a: "Egyptian AI builders who have a software or digital product and have not made meaningful sales yet." },
                    { q: "Will I make a sale?", a: "There is no promise of a sale or revenue. The goal is to run a real sales experiment and collect clear evidence." },
                    { q: "How does payment work?", a: "The current flow uses manual InstaPay transfer claims. Access begins only after an admin checks and verifies the payment." },
                    { q: "Does it include an AI assistant?", a: "No. The AI operator is not implemented in V1 and remains disabled." },
                    { q: "What about refunds?", a: "The refund policy is still a draft and must be finalized and legally reviewed before public sales begin." },
                    { q: "What language is the product in?", a: "Egyptian Arabic is primary, with English available as a secondary language." },
                ],
                ctaTitle: "Start with one useful question",
                ctaSubtitle: "The diagnosis is an initial hypothesis. Real market behavior is the evidence.",
                ctaPrimary: "Start diagnosis",
                ctaSecondary: "View sprint details",
                noGuarantee: "The sprint aims to run a real sales experiment and get clear evidence.",
            },
            hero: { title: "Built something with AI, but nobody bought it?", subtitle: "Turn your product into a real sales attempt.", cta: "Start the free diagnosis", secondary: "See the 7-day sprint" },
            stats: {
                salaryLift: "Avg Salary Lift",
                salaryNote: "within 12 months",
                cohortSize: "Cohort Size",
                cohortNote: "builders per cohort",
                duration: "Duration",
                durationNote: "months to completion",
                partners: "Hiring Partners",
                partnersNote: "VCs & startups",
            },
            program: { title: "Four practical steps", outcomes: "What you will work on" },
            outcomes: { title: "Useful evidence, not promised outcomes" },
            curriculum: {
                title: "THE CURRICULUM",
            },
            faculty: { title: "How we work" },
            testimonials: { title: "What the sprint is for" },
            faq: { title: "Common questions" },
            apply: { title: "Start with one useful question", subtitle: "The diagnosis is an initial hypothesis. Real market behavior is the evidence.", cta: "Start diagnosis", talkToAdmissions: "View sprint details" },
            footer: {
                copyright: "© 2026 Koriq. All rights reserved.",
            },
            search: {
                placeholder: "What are you building, and who is it for?",
                subline: "START WITH THE PRODUCT. FIND THE NEXT SALES STEP.",
            },
            applyPage: {
                title: "Apply to Cohort 7",
                subtitle: "Applications reviewed on a rolling basis.",
                name: "Full name",
                namePlaceholder: "Your full name",
                email: "Work email",
                emailPlaceholder: "you@company.com",
                background: "Background",
                message: "Why Koriq? (max 800 characters)",
                messagePlaceholder: "Tell us about your background and what you're hoping to get out of Koriq.",
                submit: "SUBMIT APPLICATION",
                submitting: "Submitting...",
                success: "Application received.",
                successDetail: "We'll review your application and be in touch within 5 business days.",
                backToHome: "BACK TO HOME",
                backgroundOptions: {
                    engineer: "Software Engineer",
                    designer: "Designer",
                    founder: "Founder / Co-founder",
                    analyst: "Analyst / Consultant",
                    other: "Other",
                },
            },
            about: {
                mission: "Our Mission",
                missionText: "Koriq exists because the traditional MBA was built for a different era. We built it for the age of software, leverage, and builder-driven careers. Our program puts case clinics and founder-ready frameworks at the center — not theory.",
                difference: "The Koriq Difference",
                diffItems: [
                    "Small cohorts of 24, not lecture halls of 500",
                    "Cases you ship in public, not Harvard HBS downloads",
                    "A builder alumni network that actually helps",
                    "10× lower tuition than a top-10 MBA",
                ],
            },
            stub: {
                title: "Coming soon.",
                detail: "This section is available to enrolled students. Applications for Cohort 7 are open at",
                link: "/apply",
                back: "← Back to home",
            },
        }
    },
    ar: {
        translation: {
            nav: {
                home: "الرئيسية",
                program: "البرنامج",
                outcomes: "النتائج",
                curriculum: "المنهج",
                faq: "الأسئلة الشائعة",
            },
            home: {
                nav: { home: "الرئيسية", program: "طريقة العمل", diagnosis: "التشخيص", sprint: "التحدي", login: "دخول", menu: "القائمة", terms: "الشروط", privacy: "الخصوصية", refund: "الاسترداد", guidelines: "إرشادات المجتمع" },
                eyebrow: "للبنّائين اللي عندهم منتج ولسه مفيش مبيعات حقيقية",
                title: "بنيت حاجة بالـAI… ومحدش اشتراها؟",
                subtitle: "قبل ما تزود خصائص، افهم مين محتاج المنتج، ابدأ محادثات حقيقية، واطلب البيع بوضوح.",
                cta: "ابدأ التشخيص المجاني",
                secondary: "شوف تحدي 7 أيام",
                stats: [
                    { value: "01", label: "اختار مشتري", note: "شخص تقدر توصل له" },
                    { value: "02", label: "افهم المشكلة", note: "اسأل عن اللي حصل" },
                    { value: "03", label: "اعرض الحل", note: "اطلب خطوة واضحة" },
                    { value: "04", label: "سجل الدليل", note: "ردود حقيقية مش تخمين" },
                ],
                programTitle: "حوّل منتجك لمحاولة بيع حقيقية",
                programOutcomes: "هتشتغل على إيه",
                modules: {
                    buyer: { title: "اختار المشتري", description: "حدد ناس تقدر تتعرف عليهم وتبدأ معاهم كلام.", output: "وصف واضح للمشتري" },
                    problem: { title: "افهم المشكلة", description: "اسأل الناس بيتعاملوا مع المشكلة إزاي دلوقتي وبتكلفهم إيه.", output: "ملاحظات من محادثات حقيقية" },
                    offer: { title: "ظبط العرض", description: "وضح النتيجة والسعر والخطوة الجاية من غير وعود مش مثبتة.", output: "عرض واضح للاختبار" },
                    evidence: { title: "جرّب البيع", description: "اطلب تجربة أو شراء وسجل الناس عملت إيه فعلًا.", output: "قرار مبني على دليل من السوق" },
                },
                outcomeTitle: "دليل مفيد، مش نتائج مضمونة",
                outcomes: [
                    { value: "المشتري", label: "لمين المنتج", note: "شخص محدد تقدر توصله" },
                    { value: "المشكلة", label: "إيه المهم", note: "دليل على احتياج حقيقي" },
                    { value: "العرض", label: "هتطلب إيه", note: "خطوة تجربة أو شراء واضحة" },
                    { value: "الرد", label: "إيه اللي حصل", note: "تسجيل لرد الفعل الحقيقي" },
                ],
                curriculumTitle: "تحدي الـ7 أيام",
                days: {
                    zero: "اليوم 0", zeroTask: "اتأكد إن المنتج شغال وجاهز للتجربة.",
                    oneTwo: "اليومان 1–2", oneTwoTask: "اختار المشتري ووضح العرض.",
                    threeFive: "الأيام 3–5", threeFiveTask: "دور على عملاء محتملين وابدأ كلام وراجع اللي سمعته.",
                    sixSeven: "اليومان 6–7", sixSevenTask: "اطلب البيع وقرر إيه الخطوة اللي هتغيرها بعد كده.",
                },
                principlesTitle: "طريقة شغلنا",
                principles: [
                    { title: "مفيش ضمان للبيع", body: "التحدي مش بيوعد بعميل أو دخل أو توافق المنتج مع السوق." },
                    { title: "مفيش دليل متفبرك", body: "التقدم مبني على محادثات وخطوات حقيقية، مش أرقام مخترعة." },
                    { title: "الخطوة الجاية تفضل واضحة", body: "كل جزء يرجعك لفعل عملي تقدر تجربه على منتجك." },
                ],
                expectationsTitle: "قبل ما تبدأ",
                expectations: [
                    { title: "مفيش ضمان نتيجة", body: "التحدي مش بيوعد بعميل أو دخل أو توافق المنتج مع السوق.", note: "السوق هو اللي يقرر" },
                    { title: "استخدم دليل حقيقي", body: "المجاملة مش زي طلب الشراء.", note: "سجل اللي حصل" },
                    { title: "كمّل اختبار", body: "غيّر حاجة واحدة كل مرة وشوف الناس هترد إزاي.", note: "خلي الخطوة الجاية واضحة" },
                ],
                faqTitle: "أسئلة شائعة",
                faqItems: [
                    { q: "مين مناسب له التحدي؟", a: "بنّائين مصريين عندهم منتج برمجي أو رقمي ولسه محققوش مبيعات حقيقية." },
                    { q: "هل هبيع؟", a: "مفيش وعد ببيع أو دخل. الهدف تجربة بيع حقيقية وجمع دليل واضح." },
                    { q: "الدفع بيتم إزاي؟", a: "الدفع حاليًا بتحويل InstaPay ومطالبة يراجعها مشرف. الوصول بيتفعل بعد التأكيد اليدوي فقط." },
                    { q: "فيه مساعد ذكاء اصطناعي؟", a: "لأ. مساعد الذكاء الاصطناعي مش منفذ في الإصدار الأول ولسه متوقف." },
                    { q: "إيه نظام الاسترداد؟", a: "سياسة الاسترداد لسه مسودة ولازم تتراجع قانونيًا وتتحدد قبل استقبال مدفوعات عامة." },
                    { q: "إيه لغة المنتج؟", a: "المصري العربي هو الأساس، والإنجليزي متاح كلغة تانية." },
                ],
                ctaTitle: "ابدأ بسؤال واحد مفيد",
                ctaSubtitle: "التشخيص فرضية أولية. تصرفات السوق الحقيقية هي الدليل.",
                ctaPrimary: "ابدأ التشخيص",
                ctaSecondary: "تفاصيل التحدي",
                noGuarantee: "هدف التحدي تنفيذ تجربة بيع حقيقية والحصول على evidence واضح.",
            },
            hero: {
                title: "ماجستير إدارة الأعمال،\nمُعاد تصميمه للبناة.",
                subtitle: "اثنا عشر شهراً. مجموعات صغيرة. حالات حقيقية تُنشر علناً.",
                cta: "قدّم الآن",
                secondary: "عرض المنهج",
            },
            stats: {
                salaryLift: "متوسط زيادة الراتب",
                salaryNote: "خلال 12 شهراً",
                cohortSize: "حجم المجموعة",
                cohortNote: "بناة في كل مجموعة",
                duration: "المدة",
                durationNote: "شهراً للإتمام",
                partners: "شركاء التوظيف",
                partnersNote: "رؤوس أموال وشركات ناشئة",
            },
            program: {
                title: "أربعة وحدات. بدون حشو.",
                outcomes: "النتائج",
            },
            outcomes: {
                title: "نتائج تتحدث عن نفسها",
            },
            curriculum: {
                title: "المنهج",
            },
            faculty: {
                title: "هيئة التدريس",
            },
            testimonials: {
                title: "من المجموعات السابقة",
            },
            faq: {
                title: "الأسئلة الشائعة",
            },
            apply: {
                title: "المجموعة السابعة تبدأ في سبتمبر 2026.",
                subtitle: "24 مقعداً. يتم مراجعة الطلبات على دوام مستمر.",
                cta: "قدّم الآن",
                talkToAdmissions: "تحدث مع القبول",
            },
            footer: {
                copyright: "© 2026 كوريق. جميع الحقوق محفوظة.",
            },
            search: {
                placeholder: "إيه اللي بتبنيه، ومين المفروض يشتريه؟",
                subline: "ابدأ بمنتجك وحدد الخطوة الجاية للبيع",
            },
            applyPage: {
                title: "قدّم للمجموعة السابعة",
                subtitle: " يتم مراجعة الطلبات على دوام مستمر.",
                name: "الاسم الكامل",
                namePlaceholder: "اسمك الكامل",
                email: "البريد الإلكتروني",
                emailPlaceholder: "you@company.com",
                background: "الخلفية",
                message: "لماذا كوريق؟ (حد أقصى 800 حرف)",
                messagePlaceholder: "أخبرنا عن خلفيتك وما تتمنى الحصول عليه من كوريق.",
                submit: "إرسال الطلب",
                submitting: "جارٍ الإرسال...",
                success: "تم استلام طلبك.",
                successDetail: "سنراجع طلبك ونتواصل معك خلال 5 أيام عمل.",
                backToHome: "العودة للرئيسية",
                backgroundOptions: {
                    engineer: "مهندس برمجيات",
                    designer: "مصمم",
                    founder: "مؤسس / شريك مؤسس",
                    analyst: "محلل / مستشار",
                    other: "أخرى",
                },
            },
            about: {
                mission: "مهمتنا",
                missionText: "كوريق موجود لأن ماجستير إدارة الأعمال التقليدي صُمم لعصر مختلف. بنيناه لعصر البرمجيات والرافعة المالية والمهام المبنية على البناء. برنامجنا يضع عيادات الحالات وأطر المؤسسين الجاهزة في المركز — وليس النظرية.",
                difference: "الفرق في كوريق",
                diffItems: [
                    "مجموعات صغيرة من 24، لا قاعات محاضرات من 500",
                    "حالات تنشر علناً، لا téléchargements من هارفارد",
                    "شبكة خريجين بناة تساعد فعلاً",
                    " tuition أقل بـ 10× من أفضل 10 ماجستير",
                ],
            },
            stub: {
                title: "قريباً.",
                detail: "هذا القسم متاح للطلاب المسجلين. طلبات المجموعة السابعة مفتوحة في",
                link: "/apply",
                back: "← العودة للرئيسية",
            },
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        lng: localStorage.getItem('language') || 'ar',
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },
        react: {
            useSuspense: false
        }
    });

// Set initial dir/lang
const initialLang = i18n.language;
document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLang;

export default i18n;
