import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            nav: {
                home: "HOME",
                discover: "DISCOVER",
                create: "CREATE",
                tags: "TAGS"
            },
            feed: {
                hero: {
                    title: "DISCOVER THE\nFUTURE OF PROMPTING",
                    subtitle: "Explore the world's largest library of high-performance prompts, workflows, and AI assets. Curated by experts, ranked by the community.",
                    searchPlaceholder: "Search for {{tab}}..."
                },
                generate: "GENERATE",
                tabs: {
                    prompts: "Prompts",
                    workflows: "Workflows",
                    systems: "Systems",
                    templates: "Templates",
                    aiUsecases: "AI Usecases"
                },
                filters: {
                    all: "All",
                    trending: "Trending",
                    new: "New",
                    topRated: "Top Rated",
                    editorsChoice: "Editors Choice"
                }
            },
            search: {
                hero: {
                    title: "FIND YOUR\nNEXT SUPERPOWER",
                    subtitle: "Search through 10,000+ premium prompts, workflows, and AI assets.",
                    placeholder: "What do you want to create today?"
                },
                sections: {
                    recent: "Recent Searches",
                    trending: "Trending Now"
                },
                filters: {
                    model: "Model",
                    difficulty: "Difficulty",
                    length: "Length",
                    sortBy: "Sort By"
                }
            },
            categories: {
                all: "All",
                realEstate: "Real Estate",
                islamicContent: "Islamic Content",
                business: "Business",
                marketing: "Marketing",
                copywriting: "Copywriting",
                lifeOS: "Life OS",
                uxui: "UX/UI",
                storytelling: "Storytelling",
                personalBrand: "Personal Brand",
                moneySales: "Money & Sales",
                youtube: "YouTube",
                psychology: "Psychology",
                courses: "Courses",
                appsAutomations: "Apps & Automations"
            },
            promptCard: {
                preview: "Preview",
                hideOutput: "Hide Output",
                viewOutput: "View Output Example",
                popupTitle: "EXAMPLE OUTPUT",
                copy: "Copy Prompt",
                copied: "Copied!",
                remix: "Remix / Fork",
                save: "Save for Later",
                popularity: "Popularity Score",
                advanced: {
                    title: "Advanced Data",
                    license: "License",
                    tokens: "Tokens",
                    updated: "Updated",
                    uses: "Uses",
                    related: "Related"
                },
                creator: "Creator",
                unknown: "Unknown",
                noDesc: "No description available for this prompt."
            },
            common: {
                likes: "likes",
                forks: "forks",
                remixed: "remixed",
                by: "By",
                ago: "ago",
                version: "v",
                viewAll: "View All"
            }
        }
    },
    ar: {
        translation: {
            nav: {
                home: "الرئيسية",
                discover: "استكشف",
                create: "إنشاء",
                tags: "الوسوم"
            },
            feed: {
                hero: {
                    title: "اكتشف مستقبل\nهندسة الأوامر",
                    subtitle: "استكشف أكبر مكتبة في العالم للأوامر عالية الأداء، سير العمل، وأصول الذكاء الاصطناعي. منسقة بواسطة خبراء، ومصنفة من قبل المجتمع.",
                    searchPlaceholder: "ابحث عن {{tab}}..."
                },
                generate: "توليد",
                tabs: {
                    prompts: "أوامر (Prompts)",
                    workflows: "سير عمل",
                    systems: "أنظمة",
                    templates: "قوالب",
                    aiUsecases: "استخدامات AI"
                },
                filters: {
                    all: "الكل",
                    trending: "الرائج",
                    new: "الجديد",
                    topRated: "الأعلى تقييماً",
                    editorsChoice: "اختيارات المحررين"
                }
            },
            search: {
                hero: {
                    title: "اكتشف قوتك\nالخارقة التالية",
                    subtitle: "ابحث في أكثر من 10,000 أمر متميز، سير عمل، وأصول ذكاء اصطناعي.",
                    placeholder: "ماذا تريد أن تبني اليوم؟"
                },
                sections: {
                    recent: "عمليات البحث الأخيرة",
                    trending: "رائج الآن"
                },
                filters: {
                    model: "النموذج",
                    difficulty: "الصعوبة",
                    length: "الطول",
                    sortBy: "ترتيب حسب"
                }
            },
            categories: {
                all: "الكل",
                realEstate: "عقارات",
                islamicContent: "المحتوى الإسلامي",
                business: "أعمال",
                marketing: "تسويق",
                copywriting: "كتابة إعلانية",
                lifeOS: "نظام الحياة",
                uxui: "تجربة المستخدم",
                storytelling: "قصص وسرد",
                personalBrand: "علامة شخصية",
                moneySales: "مال ومبيعات",
                youtube: "يوتيوب",
                psychology: "علم نفس",
                courses: "كورسات",
                appsAutomations: "تطبيقات وأتمتة"
            },
            promptCard: {
                preview: "معاينة",
                hideOutput: "إخفاء المخرجات",
                viewOutput: "عرض مثال للمخرجات",
                popupTitle: "مثال للمخرجات",
                copy: "نسخ الأمر",
                copied: "تم النسخ!",
                remix: "تعديل / نسخ فرعي",
                save: "حفظ لوقت لاحق",
                popularity: "نقاط الشعبية",
                advanced: {
                    title: "بيانات متقدمة",
                    license: "الرخصة",
                    tokens: "الرموز (Tokens)",
                    updated: "محدث",
                    uses: "الاستخدامات",
                    related: "ذات صلة"
                },
                creator: "المنشئ",
                unknown: "مجهول",
                noDesc: "لا يوجد وصف متاح لهذا الأمر."
            },
            common: {
                likes: "إعجابات",
                forks: "نسخ",
                remixed: "تم التعديل",
                by: "بواسطة",
                ago: "منذ",
                version: "نسخة",
                viewAll: "عرض الكل"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        lng: localStorage.getItem('language') || 'ar', // Default to Arabic for this platform
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

export default i18n;
