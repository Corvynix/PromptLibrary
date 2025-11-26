import { Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
    { code: "pl", name: "Polski", flag: "🇵🇱" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "th", name: "ไทย", flag: "🇹🇭" },
    { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "he", name: "עברית", flag: "🇮🇱" },
    { code: "sv", name: "Svenska", flag: "🇸🇪" },
];

export function LanguageToggle() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (code: string) => {
        i18n.changeLanguage(code);
        localStorage.setItem('language', code);
        setIsOpen(false);
    };

    const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full w-10 h-10 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"
            >
                <Globe className="w-[1.2rem] h-[1.2rem]" />
                <span className="sr-only">Change language</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto custom-scrollbar bg-black border-2 border-white/20 z-50 shadow-2xl"
                        >
                            <div className="p-2 border-b-2 border-white/10">
                                <p className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground">
                                    SELECT LANGUAGE
                                </p>
                            </div>
                            <div className="p-2 space-y-1">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 border transition-all text-left ${i18n.language === lang.code
                                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                                            : "border-transparent hover:border-white/20 text-muted-foreground hover:text-white"
                                            }`}
                                    >
                                        <span className="text-lg">{lang.flag}</span>
                                        <span className="text-sm font-medium">{lang.name}</span>
                                        {i18n.language === lang.code && (
                                            <span className="ml-auto text-[10px] font-mono font-bold">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
