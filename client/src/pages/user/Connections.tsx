import { TechShell } from "@/components/layout/TechShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Connections() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-4xl mx-auto py-12 px-6">
                    <h1 className="text-4xl font-black tracking-tighter mb-8">CONNECTIONS</h1>

                    <Tabs defaultValue="followers" className="w-full">
                        <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none mb-8">
                            <TabsTrigger value="followers" className="text-lg font-bold px-8 border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">FOLLOWERS</TabsTrigger>
                            <TabsTrigger value="following" className="text-lg font-bold px-8 border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none">FOLLOWING</TabsTrigger>
                        </TabsList>

                        <TabsContent value="followers">
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border border-white/10 rounded-2xl bg-white/5">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-bold">User_{i}</h3>
                                                <p className="text-xs text-muted-foreground font-mono">2.5K FOLLOWERS</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">FOLLOW BACK</Button>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </TechShell>
        </div>
    );
}
