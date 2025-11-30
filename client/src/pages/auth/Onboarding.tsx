import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "wouter";

const INTERESTS = ["Coding", "Art", "Writing", "Business", "Marketing", "3D", "Music", "Video"];

export default function Onboarding() {
    const [selected, setSelected] = useState<string[]>([]);

    const toggle = (interest: string) => {
        setSelected(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-2xl border-2 border-white bg-black p-8 md:p-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-4">WELCOME TO THE FUTURE</h1>
                    <p className="text-muted-foreground font-mono">CUSTOMIZE YOUR FEED. CHOOSE YOUR INTERESTS.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {INTERESTS.map(interest => (
                        <button
                            key={interest}
                            onClick={() => toggle(interest)}
                            className={`h-24 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${selected.includes(interest)
                                    ? "bg-white text-black border-white"
                                    : "bg-black text-muted-foreground border-white/20 hover:border-white hover:text-white"
                                }`}
                        >
                            {selected.includes(interest) && <Check className="w-4 h-4" />}
                            <span className="font-bold tracking-wider uppercase">{interest}</span>
                        </button>
                    ))}
                </div>

                <Link href="/feed">
                    <Button className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600 text-white font-black tracking-widest rounded-full">
                        COMPLETE SETUP
                    </Button>
                </Link>
            </div>
        </div>
    );
}
