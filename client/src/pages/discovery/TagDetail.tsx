import { TechShell } from "@/components/layout/TechShell";
import { useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TagDetail() {
    const { tag } = useParams();

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-7xl mx-auto py-12 px-6">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
                                #{tag || "TAG"}
                            </h1>
                            <p className="text-xl text-muted-foreground font-mono">EXPLORE PROMPTS TAGGED WITH #{tag}</p>
                        </div>
                        <Button variant="outline" className="rounded-full">FOLLOW TAG</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Placeholder for tag results */}
                        <div className="col-span-full text-center py-20 border-2 border-dashed border-white/10 rounded-3xl">
                            <p className="text-muted-foreground">Loading prompts for #{tag}...</p>
                        </div>
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
