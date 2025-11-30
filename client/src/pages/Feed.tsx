import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Prompt, User } from "@shared/schema";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { PromptCard } from "@/components/PromptCard";

// Define the shape of the API response
type PromptWithAuthor = Prompt & {
    author: User;
    totalLikes?: number;
};

const FILTERS = {
    TRENDING: "trending",
    NEWEST: "newest",
    TOP_RATED: "top rated"
} as const;

type FilterType = typeof FILTERS[keyof typeof FILTERS];

export default function Feed() {
    const [filter, setFilter] = useState<string>(FILTERS.TRENDING);

    // Fetch prompts from API
    const { data: prompts, isLoading, error, refetch } = useQuery<PromptWithAuthor[]>({
        queryKey: ["/api/prompts", filter],
        queryFn: async () => {
            const endpoint = filter === FILTERS.TRENDING
                ? "/api/feed/trending"
                : filter === FILTERS.NEWEST
                    ? "/api/feed/new"
                    : "/api/prompts";

            const res = await fetch(endpoint);
            if (!res.ok) throw new Error("Failed to fetch prompts");
            return res.json();
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
        );
    }

    if (error) {
        return (
            <ErrorState
                title="Failed to load feed"
                description="We couldn't load the latest prompts. Please check your connection and try again."
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Premium Header */}
            <div className="relative rounded-3xl bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20 border border-white/10 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                            DISCOVER
                        </h1>
                        <p className="text-lg text-muted-foreground font-mono tracking-wider">
                            EXPLORE THE WORLD'S BEST PROMPTS
                        </p>
                    </div>

                    {/* Glass Filters */}
                    <div className="flex items-center gap-2 p-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full" role="group" aria-label="Filter prompts">
                        {Object.values(FILTERS).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-6 py-2 text-xs font-bold tracking-widest transition-all rounded-full uppercase",
                                    filter === f
                                        ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                                aria-label={`Filter by ${f}`}
                                aria-pressed={filter === f}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            {prompts && prompts.length > 0 ? (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {prompts.map((item, index) => {
                        // Handle potential API variations where item might be nested
                        const promptData = (item as any).prompt || item;
                        const authorData = (item as any).author || item.author;

                        // Construct the prompt object for the card
                        const cardProps = {
                            ...promptData,
                            owner: authorData,
                            totalLikes: item.totalLikes || 0
                        };

                        return (
                            <motion.div
                                key={promptData.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <PromptCard prompt={cardProps} />
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                <EmptyState
                    title="No prompts found"
                    description="Be the first to create a prompt in this category!"
                    actionLabel="CREATE PROMPT"
                    onAction={() => window.location.href = "/create"}
                />
            )}
        </div>
    );
}
