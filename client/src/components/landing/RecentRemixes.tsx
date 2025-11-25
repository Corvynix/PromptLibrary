import { motion } from "framer-motion";
import { GitFork, Clock } from "lucide-react";

interface Remix {
    id: number;
    user: string;
    promptTitle: string;
    originalAuthor: string;
    timeAgo: string;
}

const MOCK_REMIXES: Remix[] = [
    { id: 1, user: "ai_explorer", promptTitle: "Real Estate Listing Generator", originalAuthor: "prompt_wizard", timeAgo: "2m ago" },
    { id: 2, user: "code_ninja", promptTitle: "SQL Query Optimizer", originalAuthor: "tech_master", timeAgo: "5m ago" },
    { id: 3, user: "design_pro", promptTitle: "Logo Design Prompt", originalAuthor: "creative_soul", timeAgo: "8m ago" },
    { id: 4, user: "marketing_guru", promptTitle: "Ad Copy Generator", originalAuthor: "word_smith", timeAgo: "12m ago" },
    { id: 5, user: "arabic_writer", promptTitle: "Islamic Studies Assistant", originalAuthor: "scholar_ai", timeAgo: "15m ago" },
];

export function RecentRemixes() {
    return (
        <div className="py-12 px-6 border-y border-white/10">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <GitFork className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-black tracking-widest uppercase">RECENT REMIXES</h2>
                </div>

                <div className="space-y-3">
                    {MOCK_REMIXES.map((remix, idx) => (
                        <motion.div
                            key={remix.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="border border-white/10 bg-black/50 p-4 hover:border-cyan-400 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm">
                                        <span className="font-bold group-hover:text-cyan-400 transition-colors">@{remix.user}</span>
                                        <span className="text-muted-foreground mx-2">remixed</span>
                                        <span className="font-semibold">"{remix.promptTitle}"</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                                        Original by @{remix.originalAuthor}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono ml-4">
                                    <Clock className="w-3 h-3" />
                                    {remix.timeAgo}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button className="w-full mt-4 py-3 border-2 border-white/20 hover:border-white hover:bg-white hover:text-black transition-all text-xs font-bold tracking-widest">
                    VIEW ALL ACTIVITY
                </button>
            </div>
        </div>
    );
}
