import { TechShell } from "@/components/layout/TechShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Flame, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-5xl mx-auto py-12 px-6">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 flex items-center justify-center gap-4">
                            <Trophy className="w-12 h-12 text-yellow-400" />
                            LEADERBOARDS
                        </h1>
                        <p className="text-xl text-muted-foreground font-mono">HALL OF FAME</p>
                    </div>

                    <Tabs defaultValue="creators" className="w-full">
                        <TabsList className="w-full justify-center bg-transparent mb-8">
                            <TabsTrigger value="creators" className="text-lg font-bold px-8">TOP CREATORS</TabsTrigger>
                            <TabsTrigger value="prompts" className="text-lg font-bold px-8">TOP PROMPTS</TabsTrigger>
                            <TabsTrigger value="trending" className="text-lg font-bold px-8">TRENDING</TabsTrigger>
                        </TabsList>

                        <TabsContent value="creators">
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i, index) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-4 p-4 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all group cursor-pointer"
                                    >
                                        <div className="font-black text-2xl w-12 text-center text-muted-foreground group-hover:text-white transition-colors">
                                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${i}`}
                                        </div>
                                        <div className="relative">
                                            <Avatar className="w-12 h-12 border-2 border-transparent group-hover:border-blue-500 transition-colors">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} />
                                                <AvatarFallback>U{i}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                                PromptWizard_{i}
                                                {i === 1 && <Badge variant="secondary" className="text-[10px] bg-blue-500/20 text-blue-400 border-blue-500/20">PRO</Badge>}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mt-1">
                                                <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" /> 12.5K KARMA</span>
                                                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-500" /> +12% THIS WEEK</span>
                                            </div>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <div className="font-bold text-blue-400 text-lg">Level 42</div>
                                            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Grandmaster</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </TechShell>
        </div>
    );
}
