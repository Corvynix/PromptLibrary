import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2, Heart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function Feed() {
    const [filter, setFilter] = useState("trending");

    // Fetch prompts from API
    const { data: prompts, isLoading, error } = useQuery({
        queryKey: ["/api/prompts", filter],
        queryFn: async () => {
            const endpoint = filter === "trending"
                ? "/api/feed/trending"
                : filter === "newest"
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
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <p className="text-red-500 font-mono">Failed to load prompts</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
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

                <div className="flex items-center gap-2" role="group" aria-label="Filter prompts">
                    {["TRENDING", "NEWEST", "TOP RATED"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f.toLowerCase().replace(" ", ""))}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setFilter(f.toLowerCase().replace(" ", ""));
                                }
                            }}
                            className={cn(
                                "px-4 py-2 border-2 text-xs font-bold tracking-widest transition-all rounded-full",
                                filter === f.toLowerCase().replace(" ", "")
                                    ? "border-blue-400 bg-blue-400/10 text-blue-400"
                                    : "border-white/20 text-muted-foreground hover:border-white hover:text-white"
                            )}
                            aria-label={`Filter by ${f.toLowerCase()}`}
                            aria-pressed={filter === f.toLowerCase().replace(" ", "")}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts?.map((item: any, index: number) => {
                    const prompt = item.prompt || item;
                    const author = item.author || { username: "Unknown", avatar: null };

                    return (
                        <motion.div
                            key={prompt.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={`/prompt/${prompt.id}`}>
                                <div className="cursor-pointer group">
                                    <div className="border-2 border-white/10 bg-black/50 backdrop-blur-sm rounded-3xl p-6 hover:border-blue-400 hover:bg-blue-400/5 transition-all h-full flex flex-col">
                                        {/* Title */}
                                        <h3 className="text-xl font-black tracking-tight mb-3 group-hover:text-blue-400 transition-colors">
                                            {prompt.title}
                                        </h3>

                                        {/* Description */}
                                        {prompt.shortDesc && (
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                {prompt.shortDesc}
                                            </p>
                                        )}

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {prompt.industryTags?.slice(0, 3).map((tag: string) => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className="text-[10px] px-2 py-0.5 rounded-full border-white/20"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6 border border-white/20">
                                                    <AvatarImage src={author.avatar} />
                                                    <AvatarFallback className="text-[10px]">
                                                        {author.username?.substring(0, 2).toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs font-mono text-muted-foreground">
                                                    {author.username || "Unknown"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Heart className="w-4 h-4" />
                                                <span className="text-xs font-mono">
                                                    {prompt.totalLikes || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Empty State */}
            {prompts?.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[30vh] gap-4">
                    <p className="text-muted-foreground font-mono">No prompts found</p>
                    <Link href="/create">
                        <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-colors">
                            CREATE FIRST PROMPT
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
