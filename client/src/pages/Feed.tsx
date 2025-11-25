import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Copy, Zap, Star } from "lucide-react";
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
    pqas: (Math.random() * 5 + 90).toFixed(1)
}));

export default function Feed() {
    const [filter, setFilter] = useState("trending");

    return (
        <div className="space-y-8">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold">Discover</h1>
                    <p className="text-muted-foreground">Explore the best prompts from the community.</p>
                </div>

                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
                    {["Trending", "Newest", "Top Rated"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f.toLowerCase())}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                                filter === f.toLowerCase()
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PROMPTS.map((prompt, index) => (
                    <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link href={`/prompt/${prompt.id}`}>
                            <Card className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                                {/* Image Preview */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    <img
                                        src={prompt.image}
                                        alt={prompt.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <Badge variant="secondary" className="bg-black/50 backdrop-blur-md text-white border-0">
                                            <Zap className="w-3 h-3 mr-1 text-yellow-400" />
                                            PQAS {prompt.pqas}
                                        </Badge>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <Button size="sm" className="w-full bg-white text-black hover:bg-white/90">
                                            View Details
                                        </Button>
                                    </div>
                                </div>

                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                            {prompt.title}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {prompt.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {prompt.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs font-normal">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="p-4 pt-0 flex items-center justify-between text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src={prompt.author.avatar} />
                                            <AvatarFallback>{prompt.author.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs font-medium">{prompt.author.username}</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs">
                                        <div className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                            <Heart className="w-3.5 h-3.5" />
                                            {prompt.likes}
                                        </div>
                                        <div className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                            <Share2 className="w-3.5 h-3.5" />
                                            {prompt.remixes}
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
