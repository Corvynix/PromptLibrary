import { useState } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Trophy,
    Flame,
    MapPin,
    Link as LinkIcon,
    Twitter,
    Github,
    Heart,
    GitFork,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const USER_STATS = {
    karma: 15420,
    remixes: 1250,
    followers: 8500,
    following: 120,
    streak: 45
};

const ACHIEVEMENTS = [
    { id: 1, name: "EARLY ADOPTER", icon: "🚀" },
    { id: 2, name: "PROMPT WIZARD", icon: "🧙‍♂️" },
    { id: 3, name: "VIRAL CREATOR", icon: "🔥" },
];

const HEATMAP_DATA = Array.from({ length: 52 * 7 }).map(() => Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0);

export default function Profile() {
    const { username } = useParams();
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Profile Header */}
            <div className="relative">
                {/* Banner */}
                <div className="h-48 md:h-64 border-b-2 border-white/20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-black opacity-50" />

                {/* Profile Info */}
                <div className="px-6 md:px-10 relative -mt-16 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
                    <div className="flex items-end gap-6">
                        <div className="relative group">
                            <div className="w-32 h-32 border-2 border-white bg-black p-1">
                                <Avatar className="w-full h-full rounded-none">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>PW</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-black border border-white p-1">
                                <div className="w-6 h-6 bg-yellow-400 flex items-center justify-center text-xs font-black text-black" title="Level 42">
                                    42
                                </div>
                            </div>
                        </div>

                        <div className="mb-2">
                            <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-2">
                                {username || "prompt_wizard"}
                                <Badge variant="secondary" className="bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-none">
                                    PRO
                                </Badge>
                            </h1>
                            <p className="text-muted-foreground font-mono text-xs mt-1">BUILDING THE FUTURE OF AI ART. MIDJOURNEY & GPT-4 EXPERT.</p>

                            <div className="flex items-center gap-4 mt-4 text-xs font-mono text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    SAN FRANCISCO, CA
                                </div>
                                <div className="flex items-center gap-1">
                                    <LinkIcon className="w-3 h-3" />
                                    <a href="#" className="hover:text-white transition-colors">PROMPTWIZARD.IO</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                        <Button variant="outline" size="icon" className="rounded-none w-10 h-10">
                            <Twitter className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-none w-10 h-10">
                            <Github className="w-4 h-4" />
                        </Button>
                        <Button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={cn(
                                "rounded-none min-w-[120px] transition-all font-bold tracking-wider",
                                isFollowing
                                    ? "bg-white text-black hover:bg-white/90"
                                    : "bg-blue-400 text-black hover:bg-blue-300"
                            )}
                        >
                            {isFollowing ? "FOLLOWING" : "FOLLOW"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
                {/* Left Column: Stats & Achievements */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 grid grid-cols-2 gap-4">
                            <div className="text-center p-4 border border-white/10 bg-white/5">
                                <div className="text-2xl font-black font-display">{USER_STATS.karma.toLocaleString()}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-mono">KARMA</div>
                            </div>
                            <div className="text-center p-4 border border-white/10 bg-white/5">
                                <div className="text-2xl font-black font-display">{USER_STATS.followers.toLocaleString()}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-mono">FOLLOWERS</div>
                            </div>
                            <div className="text-center p-4 border border-white/10 bg-white/5">
                                <div className="text-2xl font-black font-display">{USER_STATS.remixes.toLocaleString()}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-mono">REMIXES</div>
                            </div>
                            <div className="text-center p-4 border border-orange-500/20 bg-orange-500/5">
                                <div className="text-2xl font-black font-display text-orange-500 flex items-center justify-center gap-1">
                                    {USER_STATS.streak} <Flame className="w-5 h-5 fill-orange-500" />
                                </div>
                                <div className="text-[10px] text-orange-500/80 uppercase tracking-widest mt-1 font-mono">DAY STREAK</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-black tracking-widest uppercase flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-400" />
                                ACHIEVEMENTS
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-2">
                                {ACHIEVEMENTS.map((achievement) => (
                                    <div key={achievement.id} className="aspect-square border border-white/10 bg-white/5 flex flex-col items-center justify-center p-2 gap-2 hover:border-white transition-colors cursor-pointer group relative">
                                        <div className="text-2xl group-hover:scale-110 transition-transform">{achievement.icon}</div>
                                        <div className="text-[8px] text-center font-bold tracking-wider opacity-0 group-hover:opacity-100 absolute bottom-1 transition-opacity uppercase">
                                            {achievement.name}
                                        </div>
                                    </div>
                                ))}
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="aspect-square border border-white/5 bg-white/5 flex items-center justify-center opacity-30">
                                        <div className="w-8 h-8 bg-white/10" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Heatmap */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-black tracking-widest uppercase">ACTIVITY</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-1">
                                {HEATMAP_DATA.map((level, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-2.5 h-2.5",
                                            level === 0 && "bg-white/5",
                                            level === 1 && "bg-green-500/30",
                                            level === 2 && "bg-green-500/60",
                                            level === 3 && "bg-green-500",
                                        )}
                                        title={`${level} contributions`}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Portfolio */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="prompts" className="w-full">
                        <TabsList className="w-full justify-start h-12 bg-transparent border-b-2 border-white/10 rounded-none p-0 mb-6">
                            <TabsTrigger
                                value="prompts"
                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 px-6 font-bold tracking-widest text-xs"
                            >
                                PROMPTS
                            </TabsTrigger>
                            <TabsTrigger
                                value="collections"
                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 px-6 font-bold tracking-widest text-xs"
                            >
                                COLLECTIONS
                            </TabsTrigger>
                            <TabsTrigger
                                value="remixes"
                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-400 px-6 font-bold tracking-widest text-xs"
                            >
                                REMIXES
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="prompts" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="group cursor-pointer border-2 border-white/20 bg-black hover:border-white transition-all">
                                        <div className="aspect-[3/2] bg-black relative overflow-hidden border-b-2 border-white/10">
                                            <img
                                                src={`https://picsum.photos/seed/${i + 100}/400/300`}
                                                alt="Prompt"
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <div className="bg-black border border-white/20 px-2 py-0.5 text-[10px] font-mono font-bold text-white">
                                                    v{i}.0
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <h3 className="font-bold tracking-tight uppercase truncate group-hover:text-blue-400 transition-colors">
                                                CYBERPUNK CITYSCAPES V{i}
                                            </h3>
                                            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                                                <span className="bg-white/10 px-1.5 py-0.5 text-white">MIDJOURNEY V6</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1 hover:text-red-400 transition-colors"><Heart className="w-3 h-3" /> 124</span>
                                                    <span className="flex items-center gap-1 hover:text-blue-400 transition-colors"><GitFork className="w-3 h-3" /> 42</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
