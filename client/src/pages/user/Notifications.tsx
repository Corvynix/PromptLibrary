import { TechShell } from "@/components/layout/TechShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, UserPlus, Star } from "lucide-react";

export default function Notifications() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-3xl mx-auto py-12 px-6">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-black tracking-tighter">NOTIFICATIONS</h1>
                        <button className="text-sm text-blue-400 font-bold hover:underline">MARK ALL READ</button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-start gap-4 p-4 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="mt-1">
                                    {i % 3 === 0 ? <UserPlus className="text-blue-400" /> : i % 2 === 0 ? <Heart className="text-red-400" /> : <Star className="text-yellow-400" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <span className="font-bold text-sm">User_{i}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {i % 3 === 0 ? "started following you" : i % 2 === 0 ? "liked your prompt" : "remixed your prompt"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono">2 HOURS AGO</p>
                                </div>
                                {i === 1 && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                            </div>
                        ))}
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
