import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SpotlightSearch } from "./SpotlightSearch";
import { Toaster } from "@/components/ui/toaster";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="flex h-screen w-full bg-black overflow-hidden">
            <SpotlightSearch />
            <Sidebar />

            <main className="flex-1 relative overflow-hidden flex flex-col">
                {/* Top Header Bar */}
                <div className="h-16 border-b-2 border-white/10 flex items-center justify-end px-6 gap-3 bg-black">
                    <LanguageToggle />
                    <ThemeToggle />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0 bg-black">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="min-h-full p-4 md:p-8 max-w-7xl mx-auto"
                    >
                        {children}
                    </motion.div>
                </div>
            </main>

            <Toaster />
        </div>
    );
}
