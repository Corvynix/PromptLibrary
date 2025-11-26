import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Award, Users } from "lucide-react";

interface Creator {
    id: number;
    name: string;
    username: string;
    avatar: string;
    karma: number;
    followers: number;
    uploads: number;
}

const MOCK_CREATORS: Creator[] = [
    { id: 1, name: "Ahmed Hassan", username: "prompt_wizard", avatar: "https://i.pravatar.cc/150?img=1", karma: 9850, followers: 12400, uploads: 234 },
    { id: 2, name: "Sarah Chen", username: "ai_architect", avatar: "https://i.pravatar.cc/150?img=2", karma: 8920, followers: 9800, uploads: 189 },
    { id: 3, name: "Omar Khalil", username: "arabic_pro", avatar: "https://i.pravatar.cc/150?img=3", karma: 8450, followers: 8200, uploads: 156 },
    { id: 4, name: "Maria Garcia", username: "design_guru", avatar: "https://i.pravatar.cc/150?img=4", karma: 7890, followers: 7100, uploads: 178 },
    { id: 5, name: "Yuki Tanaka", username: "code_master", avatar: "https://i.pravatar.cc/150?img=5", karma: 7230, followers: 6400, uploads: 203 },
];

export function TopCreators() {
    return (
        <div className="py-12 border-y border-white/10">
            <div className="flex items-center justify-between mb-6 px-6">
                <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-xl font-black tracking-widest uppercase">TOP CREATORS</h2>
                </div>
                <a href="/creators" className="text-xs font-mono tracking-wider hover:text-blue-400 transition-colors border-2 border-white/20 hover:border-blue-400 rounded-full px-4 py-2">
                    VIEW ALL →
                </a>
            </div>

            <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide">
                {MOCK_CREATORS.map((creator, idx) => (
                    <motion.div
                        key={creator.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex-shrink-0 w-56 border-2 border-border/50 bg-card p-4 hover:border-blue-400 transition-all cursor-pointer group rounded-3xl shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="relative">
                                <Avatar className="w-20 h-20 border-4 border-white group-hover:border-blue-400 transition-colors">
                                    <AvatarImage src={creator.avatar} />
                                    <AvatarFallback>{creator.name[0]}</AvatarFallback>
                                </Avatar>
                                {idx < 3 && (
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center text-xs font-black">
                                        {idx + 1}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="font-bold text-sm">{creator.name}</h3>
                                <p className="text-xs text-muted-foreground font-mono">@{creator.username}</p>
                            </div>

                            <div className="w-full space-y-1.5 text-[11px] font-mono">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">KARMA</span>
                                    <span className="font-bold">{creator.karma.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        FOLLOWS
                                    </span>
                                    <span className="font-bold">{creator.followers.toLocaleString()}</span>
                                </div>
                            </div>

                            <Badge variant="outline" className="text-[10px] font-mono border-white/40">
                                {creator.uploads} UPLOADS
                            </Badge>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
