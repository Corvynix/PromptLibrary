import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function ServerError() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">500 ERROR</h1>
            <p className="text-xl text-muted-foreground font-mono mb-8 max-w-md">
                SYSTEM MALFUNCTION DETECTED. OUR ENGINEERS HAVE BEEN NOTIFIED.
            </p>
            <Link href="/">
                <Button size="lg" className="rounded-full font-bold tracking-widest">
                    RETURN HOME
                </Button>
            </Link>
        </div>
    );
}
