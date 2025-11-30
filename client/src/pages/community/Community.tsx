import { TechShell } from "@/components/layout/TechShell";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Community() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-5xl mx-auto py-12 px-6">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">COMMUNITY</h1>
                        <p className="text-xl text-muted-foreground font-mono">JOIN THE CONVERSATION</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-blue-400" />
                                Trending Discussions
                            </h2>
                            {[1, 2, 3, 4].map((i, index) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all group">
                                        <CardContent className="p-6">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-blue-400 transition-colors">
                                                    <ThumbsUp className="w-5 h-5" />
                                                    <span className="font-bold text-sm">42</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                                        Best practices for Midjourney v6 parameters?
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                        I've been experimenting with the new --stylize values and wanted to share my findings on how they affect photorealism...
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="w-5 h-5">
                                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} />
                                                                <AvatarFallback>U{i}</AvatarFallback>
                                                            </Avatar>
                                                            <span>User_{i}</span>
                                                        </div>
                                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                                        <span>24 comments</span>
                                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                                        <span>2h ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h3 className="font-bold mb-4 uppercase">Popular Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["midjourney", "stable-diffusion", "gpt-4", "dalle-3"].map(t => (
                                        <span key={t} className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono hover:bg-white/20 cursor-pointer">#{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
