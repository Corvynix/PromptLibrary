import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            // Navigation
            nav: {
                home: "HOME",
                discover: "DISCOVER",
                create: "CREATE",
                tags: "TAGS"
            },
            // Landing Page
            landing: {
                hero: {
                    title: "THE WORLD'S\nPROMPT LIBRARY",
                    subtitle: "Every Prompt. Any Model. Free Forever.",
                    explore: "START EXPLORING",
                    upload: "UPLOAD A PROMPT"
                },
                trending: "TRENDING NOW",
                promptOfDay: "PROMPT OF THE DAY",
                featured: "FEATURED PROMPT",
                recentRemixes: "RECENT REMIXES",
                viewPrompt: "VIEW PROMPT",
                viewAll: "VIEW ALL ACTIVITY"
            },
            // Feed Page
            feed: {
                title: "DISCOVER",
                subtitle: "EXPLORE THE BEST PROMPTS",
                filters: {
                    trending: "TRENDING",
                    newest: "NEWEST",
                    topRated: "TOP RATED"
                }
            },
            // Common
            common: {
                likes: "likes",
                forks: "forks",
                remixed: "remixed",
                by: "By",
                ago: "ago"
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
            landing: {
                hero: {
                    title: "أكبر مكتبة\nللمطالبات في العالم",
                    subtitle: "كل المطالبات. أي نموذج. مجاناً للأبد.",
                    explore: "ابدأ الاستكشاف",
                    upload: "رفع مطالبة"
                },
                trending: "الأكثر رواجاً",
                promptOfDay: "مطالبة اليوم",
                featured: "مطالبة مميزة",
                recentRemixes: "الإصدارات الأخيرة",
                viewPrompt: "عرض المطالبة",
                viewAll: "عرض كل النشاطات"
            },
            feed: {
                title: "استكشف",
                subtitle: "استكشف أفضل المطالبات",
                filters: {
                    trending: "الأكثر رواجاً",
                    newest: "الأحدث",
                    topRated: "الأعلى تقييماً"
                }
            },
            common: {
                likes: "إعجابات",
                forks: "نسخ",
                remixed: "تم التعديل",
                by: "بواسطة",
                ago: "منذ"
            }
        }
    },
    es: {
        translation: {
            nav: {
                home: "INICIO",
                discover: "DESCUBRIR",
                create: "CREAR",
                tags: "ETIQUETAS"
            },
            landing: {
                hero: {
                    title: "LA BIBLIOTECA DE\nPROMPTS DEL MUNDO",
                    subtitle: "Todos los Prompts. Cualquier Modelo. Gratis Para Siempre.",
                    explore: "COMENZAR A EXPLORAR",
                    upload: "SUBIR UN PROMPT"
                },
                trending: "TENDENCIAS",
                promptOfDay: "PROMPT DEL DÍA",
                featured: "PROMPT DESTACADO",
                recentRemixes: "REMIXES RECIENTES",
                viewPrompt: "VER PROMPT",
                viewAll: "VER TODA LA ACTIVIDAD"
            },
            feed: {
                title: "DESCUBRIR",
                subtitle: "EXPLORA LOS MEJORES PROMPTS",
                filters: {
                    trending: "TENDENCIAS",
                    newest: "MÁS NUEVOS",
                    topRated: "MEJOR VALORADOS"
                }
            },
            common: {
                likes: "me gusta",
                forks: "copias",
                remixed: "remezclado",
                by: "Por",
                ago: "hace"
            }
        }
    },
    fr: {
        translation: {
            nav: {
                home: "ACCUEIL",
                discover: "DÉCOUVRIR",
                create: "CRÉER",
                tags: "TAGS"
            },
            landing: {
                hero: {
                    title: "LA BIBLIOTHÈQUE DE\nPROMPTS DU MONDE",
                    subtitle: "Tous les Prompts. N'importe quel Modèle. Gratuit Pour Toujours.",
                    explore: "COMMENCER À EXPLORER",
                    upload: "TÉLÉCHARGER UN PROMPT"
                },
                trending: "TENDANCES",
                promptOfDay: "PROMPT DU JOUR",
                featured: "PROMPT EN VEDETTE",
                recentRemixes: "REMIXES RÉCENTS",
                viewPrompt: "VOIR LE PROMPT",
                viewAll: "VOIR TOUTE L'ACTIVITÉ"
            },
            feed: {
                title: "DÉCOUVRIR",
                subtitle: "EXPLOREZ LES MEILLEURS PROMPTS",
                filters: {
                    trending: "TENDANCES",
                    newest: "PLUS RÉCENTS",
                    topRated: "MIEUX NOTÉS"
                }
            },
            common: {
                likes: "j'aime",
                forks: "copies",
                remixed: "remixé",
                by: "Par",
                ago: "il y a"
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
        lng: localStorage.getItem('language') || 'en',
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
