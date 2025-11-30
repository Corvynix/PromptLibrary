import { TechShell } from "@/components/layout/TechShell";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";

export default function WorkflowBuilder() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="h-[calc(100vh-200px)] flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <h1 className="text-2xl font-black tracking-tighter">WORKFLOW BUILDER</h1>
                        <div className="flex gap-2">
                            <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Block</Button>
                            <Button className="bg-green-500 hover:bg-green-600 text-white"><Play className="w-4 h-4 mr-2" /> Run Workflow</Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-white/5 relative overflow-hidden flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-4">Drag and drop blocks to build your workflow</p>
                            <div className="w-64 h-32 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center mx-auto">
                                <span className="text-sm font-mono text-white/40">CANVAS AREA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
