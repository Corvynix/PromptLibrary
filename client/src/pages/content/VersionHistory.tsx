import { TechShell } from "@/components/layout/TechShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitCommit, ArrowLeft, ArrowRight } from "lucide-react";

export default function VersionHistory() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-5xl mx-auto py-12 px-6">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-black tracking-tighter">VERSION HISTORY</h1>
                        <Button variant="outline">COMPARE VERSIONS</Button>
                    </div>

                    <div className="relative border-l-2 border-white/10 ml-4 space-y-12">
                        {[3, 2, 1].map((v) => (
                            <div key={v} className="relative pl-8">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-white" />

                                <div className="flex items-center gap-4 mb-2">
                                    <h2 className="text-2xl font-bold">v{v}.0</h2>
                                    <Badge variant="secondary" className="font-mono">2025-11-{28 - v}</Badge>
                                    {v === 3 && <Badge className="bg-blue-500">CURRENT</Badge>}
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-sm font-bold text-muted-foreground mb-2 uppercase">Prompt</h3>
                                            <p className="font-mono text-sm">
                                                /imagine prompt: A futuristic city with neon lights... --v {v}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-muted-foreground mb-2 uppercase">Changes</h3>
                                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                                                <li>Tweaked lighting parameters</li>
                                                <li>Updated model version</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Button size="sm" variant="ghost"><ArrowLeft className="w-4 h-4 mr-2" /> Rollback</Button>
                                        <Button size="sm" variant="ghost">View Details <ArrowRight className="w-4 h-4 ml-2" /></Button>
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
