import { TechShell } from "@/components/layout/TechShell";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Briefcase, Palette, Megaphone, Home, BookOpen } from "lucide-react";

const CATEGORIES = [
    { name: "Coding", icon: Code, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Business", icon: Briefcase, color: "text-green-400", bg: "bg-green-400/10" },
    { name: "Design", icon: Palette, color: "text-purple-400", bg: "bg-purple-400/10" },
    { name: "Marketing", icon: Megaphone, color: "text-pink-400", bg: "bg-pink-400/10" },
    { name: "Real Estate", icon: Home, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { name: "Education", icon: BookOpen, color: "text-cyan-400", bg: "bg-cyan-400/10" },
];

export default function Categories() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-7xl mx-auto py-12 px-6">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 text-center">BROWSE CATEGORIES</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {CATEGORIES.map((cat) => (
                            <Card key={cat.name} className="group cursor-pointer hover:border-white/40 transition-all">
                                <CardContent className="p-8 flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cat.bg}`}>
                                        <cat.icon className={`w-8 h-8 ${cat.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-tight group-hover:text-blue-400 transition-colors">{cat.name}</h3>
                                        <p className="text-sm text-muted-foreground font-mono">1.2K PROMPTS</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
