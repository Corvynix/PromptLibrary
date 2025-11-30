import { TechShell } from "@/components/layout/TechShell";
import { Badge } from "@/components/ui/badge";

export default function Hashtags() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-5xl mx-auto py-12 px-6">
                    <h1 className="text-4xl font-black tracking-tighter mb-12">TRENDING HASHTAGS</h1>

                    <div className="flex flex-wrap gap-4">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className="text-lg py-2 px-4 cursor-pointer hover:bg-white hover:text-black transition-colors"
                            >
                                #{["cyberpunk", "portrait", "logo", "ui-design", "anime", "landscape", "3d"][i % 7]}
                            </Badge>
                        ))}
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
