import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Share2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for now
const MOCK_PROMPTS = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: `Cinematic Portrait Generator v${i + 1}`,
    description: "Create stunning, hyper-realistic portraits with cinematic lighting and depth of field. Optimized for Midjourney v6.",
    author: {
        username: "prompt_wizard",
        avatar: "https://github.com/shadcn.png"
    },
    likes: Math.floor(Math.random() * 1000),
    remixes: Math.floor(Math.random() * 100),
    tags: ["Midjourney", "Portrait", "Cinematic"],
    image: `https://picsum.photos/seed/${i + 1}/400/300`,
    pqas: (Math.random() * 5 + 90).toFixed(1),
    model: ["Midjourney", "GPT-4", "Claude"][i % 3]
}));

export default function Feed() {
    const [filter, setFilter] = useState("trending");

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
                            <div className="group cursor-pointer border-2 border-white/20 bg-black overflow-hidden hover:border-white hover:scale-[1.02] transition-all">
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                                    <img
                                        src={prompt.image}
                                        alt={prompt.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                    {/* PQAS Badge */}
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/90 border-2 border-white/40 flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-yellow-400" />
                                        <span className="text-[10px] font-mono font-black">{prompt.pqas}</span>
                                    </div>
                                    {/* Model Badge */}
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/90 border border-white/40 text-[9px] font-mono font-bold">
                                        {prompt.model}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    <h3 className="font-bold tracking-tight leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
                                        {prompt.title}
                                    </h3>

                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {prompt.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {prompt.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 border border-white/20 text-[10px] font-mono font-bold tracking-wider uppercase hover:border-white transition-colors"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-4 pt-0 flex items-center justify-between border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-6 h-6 border-2 border-white/40">
                                            <AvatarImage src={prompt.author.avatar} />
                                            <AvatarFallback>{prompt.author.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs font-mono font-bold">@{prompt.author.username}</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs font-mono">
                                        <div className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer">
                                            <Heart className="w-3.5 h-3.5" />
                                            {prompt.likes}
                                        </div>
                                        <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer">
                                            <Share2 className="w-3.5 h-3.5" />
                                            {prompt.remixes}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
