import { useTranslation } from "react-i18next";

export function LanguageToggle() {
    const { i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    const toggle = () => {
        const next = isArabic ? "en" : "ar";
        i18n.changeLanguage(next);
        localStorage.setItem("language", next);
        document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = next;
    };

    return (
        <button
            onClick={toggle}
            className="rounded-full w-10 h-10 border border-foreground/20 hover:bg-foreground hover:text-background transition-colors flex items-center justify-center font-bold text-xs tracking-wider"
            aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
        >
            {isArabic ? "EN" : "ع"}
        </button>
    );
}
