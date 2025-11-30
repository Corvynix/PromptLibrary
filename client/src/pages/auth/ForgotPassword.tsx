import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSent(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-md border-2 border-white bg-black p-8">
                <Link href="/login">
                    <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent text-muted-foreground hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                    </Button>
                </Link>

                <h1 className="text-3xl font-black tracking-tighter text-white mb-2">RESET PASSWORD</h1>
                <p className="text-sm text-muted-foreground font-mono mb-8">
                    ENTER YOUR EMAIL TO RECEIVE A RESET LINK
                </p>

                {sent ? (
                    <div className="text-center py-8">
                        <div className="text-green-400 font-bold mb-2">LINK SENT!</div>
                        <p className="text-sm text-muted-foreground">Check your inbox for instructions.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            className="h-12 bg-black border-2 border-white/20 text-white font-mono"
                            required
                        />
                        <Button
                            type="submit"
                            className="w-full h-12 bg-white text-black hover:bg-white/90 font-bold tracking-widest"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "SEND RESET LINK"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
