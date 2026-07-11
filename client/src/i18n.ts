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
            hero: {
                title: "THE MBA,\nREDESIGNED FOR BUILDERS.",
                subtitle: "Twelve months. Small cohorts. Cases shipped in public.",
                cta: "APPLY NOW",
                secondary: "VIEW CURRICULUM",
            },
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
            program: {
                title: "FOUR MODULES. ZERO FLUFF.",
                outcomes: "Outcomes",
            },
            outcomes: {
                title: "OUTCOMES THAT SPEAK FOR THEMSELVES",
            },
            curriculum: {
                title: "THE CURRICULUM",
            },
            faculty: {
                title: "YOUR FACULTY",
            },
            testimonials: {
                title: "FROM THE COHORTS",
            },
            faq: {
                title: "FAQ",
            },
            apply: {
                title: "COHORT 7 OPENS SEPTEMBER 2026.",
                subtitle: "24 seats. Applications reviewed on a rolling basis.",
                cta: "APPLY NOW",
                talkToAdmissions: "TALK TO ADMISSIONS",
            },
            footer: {
                copyright: "© 2026 Koriq. All rights reserved.",
            },
            search: {
                placeholder: "What kind of builder are you?",
                subline: "SEARCH ACROSS 12 MODULES, 200+ CASES",
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
                placeholder: "ما نوع الباني الذي أنت؟",
                subline: "ابحث في 12 وحدة و200+ حالة",
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
        lng: localStorage.getItem('language') || 'en',
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
