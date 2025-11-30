import { TechShell } from "@/components/layout/TechShell";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-5xl mx-auto py-12 px-6">
                    <div className="relative mb-12">
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground" />
                        <Input
                            className="h-20 pl-20 text-2xl rounded-full bg-white/5 border-2 border-white/10 focus:border-blue-500"
                            placeholder="Search for anything..."
                            autoFocus
                        />
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-widest">Recent Searches</h3>
                            <div className="flex gap-2 flex-wrap">
                                {["cyberpunk", "logo design", "marketing copy", "python script"].map(t => (
                                    <div key={t} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
