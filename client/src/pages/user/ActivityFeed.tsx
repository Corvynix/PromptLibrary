import { TechShell } from "@/components/layout/TechShell";
import { PromptCard } from "@/components/PromptCard";

export default function ActivityFeed() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-5xl mx-auto py-12 px-6">
                    <h1 className="text-4xl font-black tracking-tighter mb-8">ACTIVITY FEED</h1>

                    <div className="space-y-8">
                        <div className="border-l-2 border-white/10 pl-8 pb-8 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-black" />
                            <p className="text-sm text-muted-foreground font-mono mb-4">TODAY</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Placeholder for feed items */}
                                <div className="p-6 border border-white/10 rounded-2xl bg-white/5">
                                    <p className="text-muted-foreground">Your network has been quiet today.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
