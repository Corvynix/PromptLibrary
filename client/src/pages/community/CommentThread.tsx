import { TechShell } from "@/components/layout/TechShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CommentThread() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-3xl mx-auto py-12 px-6">
                    <h1 className="text-2xl font-black tracking-tighter mb-8">COMMENTS (42)</h1>

                    <div className="mb-8 flex gap-4">
                        <Avatar>
                            <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea placeholder="Add to the discussion..." className="bg-white/5 border-white/10" />
                            <div className="flex justify-end">
                                <Button>POST COMMENT</Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4">
                                <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold text-sm">User_{i}</span>
                                            <span className="text-xs text-muted-foreground">2h ago</span>
                                        </div>
                                        <p className="text-sm">This is a fantastic prompt! I really like how you handled the lighting parameters.</p>
                                    </div>
                                    <div className="flex gap-4 mt-2 ml-2 text-xs font-bold text-muted-foreground">
                                        <button className="hover:text-white">REPLY</button>
                                        <button className="hover:text-white">LIKE</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
