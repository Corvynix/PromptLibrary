import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { NeonCard } from "@/components/ui/neon-card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Realistic Mock Data (Fallback since DB is down)
const MOCK_PROMPTS = [
    {
        id: 1,
        title: "Marketing Copywriting",
        tags: ["Email", "Marketing", "GPT-4"],
        author: {
            username: "DR RAX",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rax"
        },
        likes: 563
    },
    {
        id: 2,
        title: "Logo Designer",
        tags: ["DALL-E", "Design", "Branding"],
        author: {
            username: "NYX",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nyx"
        },
        likes: 462
    },
    {
        id: 3,
        title: "Cinematic Portrait",
        tags: ["Midjourney", "Photography", "Realism"],
        author: {
            username: "LENS_GOD",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lens"
        },
        likes: 892
    },
    {
        id: 4,
        title: "SaaS Landing Page",
        tags: ["Web", "UX/UI", "Figma"],
        author: {
            username: "UI_NINJA",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja"
        },
        likes: 341
    },
    {
        id: 5,
        title: "Python Bug Fixer",
        tags: ["Coding", "Python", "Debug"],
        author: {
            username: "DEV_BOT",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev"
        },
        likes: 720
    },
    {
        id: 6,
        title: "Cyberpunk City",
        tags: ["Art", "Sci-Fi", "Concept"],
        author: {
            username: "NEON_ART",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neon"
        },
        likes: 654
    }
];

export default function Feed() {
    const [filter, setFilter] = useState("trending");
    const [loading, setLoading] = useState(false);

    // Simulating API load
    // const { data: prompts, isLoading, error } = useQuery... 

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">DISCOVER</h1>
                    <p className="text-sm text-muted-foreground font-mono tracking-wider">EXPLORE THE BEST PROMPTS</p>
                </div>

                <div className="flex items-center gap-2">
                    {["TRENDING", "NEWEST", "TOP RATED"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f.toLowerCase().replace(" ", ""))}
                            className={cn(
                                "px-4 py-2 border-2 text-xs font-bold tracking-widest transition-all",
                                filter === f.toLowerCase().replace(" ", "")
                                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                                    : "border-white/20 text-muted-foreground hover:border-white hover:text-white"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PROMPTS.map((prompt, index) => (
                    <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link href={`/prompt/${prompt.id}`}>
                            <div className="cursor-pointer">
                                <NeonCard
                                    title={prompt.title}
                                    tags={prompt.tags}
                                    author={prompt.author}
                                    likes={prompt.likes}
                                    className="h-full"
                                />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
