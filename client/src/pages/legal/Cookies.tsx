import { TechShell } from "@/components/layout/TechShell";

export default function Cookies() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <TechShell>
                <div className="max-w-3xl mx-auto py-12 px-6">
                    <h1 className="text-4xl font-black tracking-tighter mb-8">COOKIE POLICY</h1>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg text-muted-foreground mb-6">
                            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                        </p>
                        <h3>1. What are cookies?</h3>
                        <p>Cookies are small text files stored on your device...</p>
                        <h3>2. How we use cookies</h3>
                        <p>We use cookies for authentication, analytics, and personalization...</p>
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
