import { TechShell } from "@/components/layout/TechShell";
import { PromptCard } from "@/components/PromptCard";

export default function Sponsored() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-7xl mx-auto py-12 px-6">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">PARTNER PROMPTS</h1>
                        <p className="text-xl text-muted-foreground font-mono">CURATED COLLECTIONS FROM INDUSTRY LEADERS</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Placeholder for sponsored content */}
                        <div className="col-span-full text-center py-20 border-2 border-dashed border-white/10 rounded-3xl">
                            <p className="text-muted-foreground">No sponsored campaigns active at the moment.</p>
                        </div>
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
