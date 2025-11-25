import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SpotlightSearch } from "./SpotlightSearch";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <SpotlightSearch />
            <Sidebar />

            <main className="flex-1 relative overflow-hidden flex flex-col">
                {/* Top Gradient Blur */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0">
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
