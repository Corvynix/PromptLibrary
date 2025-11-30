import { TechShell } from "@/components/layout/TechShell";

export default function AdsDisclosure() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-3xl mx-auto py-12 px-6">
                    <h1 className="text-4xl font-black tracking-tighter mb-8">ADVERTISING DISCLOSURE</h1>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg text-muted-foreground mb-6">
                            Transparency is core to our values. Here is how we handle advertising and sponsored content.
                        </p>
                        <h3>Sponsored Content</h3>
                        <p>Some prompts may be sponsored by partners. These are clearly marked with a "Sponsored" tag...</p>
                        <h3>Affiliate Links</h3>
                        <p>We may earn a commission from links to AI tools and services...</p>
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
