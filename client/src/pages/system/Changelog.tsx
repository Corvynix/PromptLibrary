import { TechShell } from "@/components/layout/TechShell";
import { Badge } from "@/components/ui/badge";

const UPDATES = [
    {
        version: "1.0.0",
        date: "2025-11-28",
        title: "Initial Launch",
        changes: [
            "Launched PromptLibrary platform",
            "Added support for Midjourney and GPT-4 prompts",
            "Implemented user profiles and remixing",
            "Added dark mode support"
        ]
    }
];

export default function Changelog() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-4xl mx-auto py-12 px-6">
                    <h1 className="text-4xl font-black tracking-tighter mb-8">CHANGELOG</h1>

                    <div className="space-y-12">
                        {UPDATES.map((update) => (
                            <div key={update.version} className="border-l-2 border-foreground/20 pl-8 relative">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-foreground" />

                                <div className="flex items-center gap-4 mb-4">
                                    <h2 className="text-2xl font-bold tracking-tight">{update.version}</h2>
                                    <Badge variant="outline" className="font-mono">{update.date}</Badge>
                                </div>

                                <h3 className="text-xl font-semibold mb-4">{update.title}</h3>

                                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                    {update.changes.map((change, i) => (
                                        <li key={i}>{change}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
