import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Grid, Menu } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface TechShellProps {
    children: ReactNode;
    loading?: boolean;
    className?: string;
    showNav?: boolean;
    logoText?: string; // Custom logo text
}

export function TechShell({ children, loading = false, className, showNav = true, logoText = "PROMPTLIBRARY" }: TechShellProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            className={cn(
                "flex-1 relative border-[3px] border-foreground rounded-[2rem] overflow-hidden flex flex-col bg-background",
                className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >

            {/* Top Tech Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-14 bg-foreground rounded-b-3xl z-20 flex items-center justify-center shadow-lg">
                {/* Decorative line */}
                <div className="absolute top-2 w-20 h-1 bg-background rounded-full opacity-20" />

                {/* Center: Logo (Moved inside Notch) */}
                {!loading && (
                    <motion.div
                        layoutId="logo"
                        className="text-2xl md:text-3xl font-black tracking-tighter font-display text-background z-30 pt-1"
                        transition={{ duration: 0.8, ease: "circOut" }}
                    >
                        {logoText}
                    </motion.div>
                )}
            </div>

            {/* Corner Accents */}
            <div className="absolute top-8 left-0 w-4 h-16 bg-foreground rounded-r-xl z-20" />
            <div className="absolute top-8 right-0 w-4 h-16 bg-foreground rounded-l-xl z-20" />
            <div className="absolute bottom-20 left-0 w-3 h-12 bg-foreground/20 rounded-r-lg z-10" />
            <div className="absolute bottom-20 right-0 w-3 h-12 bg-foreground/20 rounded-l-lg z-10" />

            {/* Header */}
            <header className="relative z-30 flex items-center justify-between px-6 md:px-10 py-8">
                {/* Left: Pill Nav */}
                <nav className="hidden md:flex items-center gap-1 px-2 py-1.5 border-2 border-foreground rounded-full bg-background">
                    {[
                        { label: t('nav.home'), href: "/" },
                        { label: t('nav.discover'), href: "/feed" },
                        { label: t('nav.create'), href: "/create" },
                        { label: t('nav.tags'), href: "/tags" }
                    ].map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="px-4 py-1 text-xs font-bold tracking-widest hover:bg-foreground hover:text-background rounded-full transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Mobile Menu Icon */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                </Button>

                {/* Right: Tools */}
                <div className="flex items-center gap-3">
                    <LanguageToggle />
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" className="hover:bg-foreground/10 rounded-full">
                        <Grid className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col">
                {children}
            </main>
        </motion.div>
    );
}
