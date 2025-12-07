import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Grid, Menu } from "lucide-react";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface TechShellProps {
    children: ReactNode;
    loading?: boolean;
    className?: string;
    showNav?: boolean;
    logoText?: string; // Custom logo text
}

export function TechShell({ children, loading = false, className, showNav = true, logoText = "PROMPTLIBRARY" }: TechShellProps) {
    const { t } = useTranslation();
    const { currentUser } = useAuth();
    const [location] = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const NAV_ITEMS = [
        { label: t('nav.home'), href: "/" },
        { label: t('nav.discover'), href: "/feed" },
        { label: "COMMUNITY", href: "/community" },
        { label: "LEADERBOARD", href: "/leaderboard" },
        { label: t('nav.tags'), href: "/tags" }
    ];

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
            {/* Skip to content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-500 focus:text-white focus:rounded-full focus:font-bold"
            >
                Skip to main content
            </a>

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
                {/* Left: Pill Nav (Desktop) */}
                <nav className="hidden md:flex items-center gap-1 px-2 py-1.5 border-2 border-foreground rounded-full bg-background" aria-label="Main navigation">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location === item.href;
                        return (
                            <Link key={item.label} href={item.href}>
                                <a
                                    className={cn(
                                        "px-4 py-1 text-xs font-bold tracking-widest rounded-full transition-colors",
                                        isActive
                                            ? "bg-foreground text-background"
                                            : "hover:bg-foreground hover:text-background"
                                    )}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {item.label}
                                </a>
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open mobile menu">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle className="text-left font-black text-2xl tracking-tighter">MENU</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-4 mt-8">
                            {NAV_ITEMS.map((item) => {
                                const isActive = location === item.href;
                                return (
                                    <Link key={item.label} href={item.href}>
                                        <a
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "text-lg font-bold tracking-wider py-2 border-b border-border transition-colors",
                                                isActive ? "text-blue-500 border-blue-500" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {item.label}
                                        </a>
                                    </Link>
                                );
                            })}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Right: Tools */}
                <div className="flex items-center gap-3" role="toolbar" aria-label="Theme and settings">
                    <LanguageToggle />
                    <ThemeToggle />

                    <div className="h-6 w-px bg-foreground/20 mx-1" />

                    {currentUser ? (
                        <Link href="/feed">
                            <Button size="sm" className="rounded-full font-bold tracking-wider px-6">
                                DASHBOARD
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" className="rounded-full font-bold tracking-wider px-6">
                                LOGIN
                            </Button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main id="main-content" className="flex-1 relative z-10 flex flex-col">
                {children}
            </main>
        </motion.div>
    );
}
