import { useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Trophy,
    Flame,
    Users,
    MapPin,
    Link as LinkIcon,
    Twitter,
    Github,
    Grid,
    Heart,
    GitFork
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
    { id: 1, name: "Early Adopter", icon: "🚀", color: "bg-blue-500/20 text-blue-500" },
    { id: 2, name: "Prompt Wizard", icon: "🧙‍♂️", color: "bg-purple-500/20 text-purple-500" },
    { id: 3, name: "Viral Creator", icon: "🔥", color: "bg-orange-500/20 text-orange-500" },
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
                <div className="h-48 md:h-64 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>

                {/* Profile Info */}
                <div className="px-6 md:px-10 relative -mt-16 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
                    <div className="flex items-end gap-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-2xl bg-background p-1 shadow-2xl">
                                <Avatar className="w-full h-full rounded-xl">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>PW</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-background p-1 rounded-full">
                                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-lg shadow-lg" title="Level 42">
                                    👑
                                </div>
                            </div>
                        </div>

                        <div className="mb-2">
                            <h1 className="text-3xl font-display font-bold flex items-center gap-2">
                                {username || "prompt_wizard"}
                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0">
                                    Pro
                                </Badge>
                            </h1>
                            <p className="text-muted-foreground">Building the future of AI art. Midjourney & GPT-4 expert.</p>

                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    San Francisco, CA
                                </div>
                                <div className="flex items-center gap-1">
                                    <LinkIcon className="w-4 h-4" />
                                    <a href="#" className="hover:text-primary transition-colors">promptwizard.io</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Twitter className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Github className="w-4 h-4" />
                        </Button>
                        <Button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={cn(
                                "rounded-full min-w-[100px] transition-all",
                                isFollowing ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
                {/* Left Column: Stats & Achievements */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-muted/30 rounded-xl">
                                <div className="text-2xl font-bold font-display">{USER_STATS.karma.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Karma</div>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-xl">
                                <div className="text-2xl font-bold font-display">{USER_STATS.followers.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Followers</div>
                            </div>
                            <div className="text-center p-4 bg-muted/30 rounded-xl">
                                <div className="text-2xl font-bold font-display">{USER_STATS.remixes.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Remixes</div>
                            </div>
                            <div className="text-center p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                                <div className="text-2xl font-bold font-display text-orange-500 flex items-center justify-center gap-1">
                                    {USER_STATS.streak} <Flame className="w-5 h-5 fill-orange-500" />
                                </div>
                                <div className="text-xs text-orange-500/80 uppercase tracking-wider mt-1">Day Streak</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-2">
                                {ACHIEVEMENTS.map((achievement) => (
                                    <div key={achievement.id} className="aspect-square rounded-xl bg-muted/50 flex flex-col items-center justify-center p-2 gap-1 hover:bg-muted transition-colors cursor-pointer group relative">
                                        <div className="text-2xl group-hover:scale-110 transition-transform">{achievement.icon}</div>
                                        <div className="text-[10px] text-center font-medium leading-tight opacity-0 group-hover:opacity-100 absolute bottom-2 transition-opacity">
                                            {achievement.name}
                                        </div>
                                    </div>
                                ))}
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="aspect-square rounded-xl bg-muted/20 flex items-center justify-center opacity-50">
                                        <div className="w-8 h-8 rounded-full bg-muted/50" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Heatmap */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-1">
                                {HEATMAP_DATA.map((level, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-2.5 h-2.5 rounded-sm",
                                            level === 0 && "bg-muted/30",
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
                        <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none p-0 mb-6">
                            <TabsTrigger
                                value="prompts"
                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 font-medium"
                            >
                                Prompts
                            </TabsTrigger>
                            <TabsTrigger
                                value="collections"
                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 font-medium"
                            >
                                Collections
                            </TabsTrigger>
                            <TabsTrigger
                                value="remixes"
                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 font-medium"
                            >
                                Remixes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="prompts" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Card key={i} className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-all">
                                        <div className="aspect-[3/2] bg-muted relative overflow-hidden">
                                            <img
                                                src={`https://picsum.photos/seed/${i + 100}/400/300`}
                                                alt="Prompt"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <Badge className="bg-black/50 backdrop-blur-md border-0 text-white">
                                                    v{i}.0
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold truncate mb-1">Cyberpunk Cityscapes v{i}</h3>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>Midjourney v6</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> 124</span>
                                                    <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> 42</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
