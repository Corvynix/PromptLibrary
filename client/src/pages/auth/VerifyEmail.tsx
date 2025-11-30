import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function VerifyEmail() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md border-2 border-white bg-black p-8 text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-blue-500" />
                </div>

                <h1 className="text-3xl font-black tracking-tighter text-white mb-4">VERIFY EMAIL</h1>
                <p className="text-sm text-muted-foreground font-mono mb-8">
                    WE'VE SENT A VERIFICATION LINK TO YOUR EMAIL. PLEASE CLICK THE LINK TO ACTIVATE YOUR ACCOUNT.
                </p>

                <Button variant="outline" className="w-full h-12 border-white/20 text-white hover:bg-white hover:text-black font-bold tracking-widest">
                    RESEND EMAIL
                </Button>
            </div>
        </div>
    );
}
