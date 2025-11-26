import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeonCardProps {
    title: string;
    tags: string[];
    author: {
        username: string;
        avatar?: string;
    };
    likes: number;
    className?: string;
}

export function NeonCard({ title, tags, author, likes, className }: NeonCardProps) {
    return (
        <div className={cn("relative group", className)}>
            {/* Outer Glow/Border Container */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan-500 to-blue-600 opacity-50 blur-sm group-hover:opacity-100 transition duration-500" />

            {/* Main Card Content */}
            <div className="relative h-full bg-black border-2 border-cyan-500/50 flex flex-col p-6 space-y-6 hover:border-cyan-400 transition-colors">

                {/* Top Section: Title & Tags */}
                <div className="space-y-4 flex-1">
                    <h3 className="text-2xl font-black tracking-tight text-white leading-tight">
                        {title}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 rounded-full border border-white/20 text-xs font-bold text-muted-foreground bg-white/5"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Divider (Optional, based on image look) */}
                {/* The image shows a distinct separation, almost like two blocks. 
            Let's use a subtle gradient line or just spacing. */}

                {/* Bottom Section: User & Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-cyan-500/30">
                            <AvatarImage src={author.avatar} />
                            <AvatarFallback className="bg-cyan-950 text-cyan-400 font-bold">
                                {author.username[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-bold tracking-wider text-sm text-cyan-100 uppercase">
                            {author.username}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-orange-500 font-bold">
                        <Heart className="w-5 h-5 fill-orange-500" />
                        <span>{likes}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
