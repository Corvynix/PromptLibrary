import { motion, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import { TechShell } from "@/components/layout/TechShell";
import { Mail, MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Support() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LayoutGroup>
            <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col p-4 md:p-6">

                {/* Splash Screen */}
                {loading && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            layoutId="logo"
                            className="text-4xl md:text-6xl font-black tracking-tighter font-display text-white"
                        >
                            SUPPORT
                        </motion.div>
                    </motion.div>
                )}

                <TechShell loading={loading} logoText="SUPPORT">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto space-y-8">

                            {/* Background Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                                <h1
                                    className="text-[18vw] font-black font-display text-transparent whitespace-nowrap select-none"
                                    style={{ WebkitTextStroke: "2px var(--foreground)", opacity: 0.08 }}
                                >
                                    SUPPORT
                                </h1>
                            </div>

                            <div className="relative z-10 space-y-8">
                                <div className="border-2 border-white/20 bg-black p-8 text-center">
                                    <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">HOW CAN WE HELP?</h2>
                                    <p className="text-sm text-muted-foreground font-mono">
                                        WE'RE HERE TO SUPPORT YOU. CHOOSE YOUR PREFERRED METHOD BELOW.
                                    </p>
                                </div>

                                {/* Support Options */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="border-2 border-white/20 bg-black p-6 hover:border-cyan-400 transition-all group">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="w-16 h-16 border-2 border-white/40 group-hover:border-cyan-400 flex items-center justify-center transition-colors">
                                                <Mail className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-lg font-black tracking-tighter uppercase">EMAIL</h3>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                SUPPORT@PROMPTLIBRARY.COM
                                            </p>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                RESPONSE IN 24H
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-2 border-white/20 bg-black p-6 hover:border-cyan-400 transition-all group">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="w-16 h-16 border-2 border-white/40 group-hover:border-cyan-400 flex items-center justify-center transition-colors">
                                                <MessageCircle className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-lg font-black tracking-tighter uppercase">DISCORD</h3>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                JOIN OUR COMMUNITY
                                            </p>
                                            <Button className="w-full border-2 border-white/20 bg-black hover:border-white hover:bg-white hover:text-black font-bold tracking-wider text-xs">
                                                JOIN SERVER
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="border-2 border-white/20 bg-black p-6 hover:border-cyan-400 transition-all group">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="w-16 h-16 border-2 border-white/40 group-hover:border-cyan-400 flex items-center justify-center transition-colors">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-lg font-black tracking-tighter uppercase">DOCS</h3>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                BROWSE DOCUMENTATION
                                            </p>
                                            <Button className="w-full border-2 border-white/20 bg-black hover:border-white hover:bg-white hover:text-black font-bold tracking-wider text-xs">
                                                VIEW DOCS
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ */}
                                <div className="border-2 border-white/20 bg-black p-8">
                                    <h3 className="text-2xl font-black tracking-tighter uppercase mb-6">FREQUENTLY ASKED</h3>
                                    <div className="space-y-4">
                                        {[
                                            { q: "HOW DO I UPLOAD A PROMPT?", a: "CLICK THE 'CREATE' BUTTON IN THE NAVIGATION BAR AND FILL OUT THE FORM." },
                                            { q: "WHAT IS PQAS?", a: "PROMPT QUALITY ASSESSMENT SYSTEM - OUR ALGORITHM THAT SCORES PROMPT EFFECTIVENESS." },
                                            { q: "CAN I EDIT MY PROMPTS?", a: "YES, GO TO YOUR PROFILE AND CLICK EDIT ON ANY OF YOUR PROMPTS." },
                                            { q: "IS PROMPTLIBRARY FREE?", a: "YES, COMPLETELY FREE FOREVER. NO HIDDEN FEES OR PAYWALLS." },
                                        ].map((faq, idx) => (
                                            <div key={idx} className="border-l-2 border-cyan-400 pl-4">
                                                <h4 className="text-sm font-bold mb-2">{faq.q}</h4>
                                                <p className="text-xs text-muted-foreground font-mono">{faq.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center py-8">
                                    <p className="text-xs text-muted-foreground font-mono tracking-wider">
                                        STILL NEED HELP? WE'RE ALWAYS HERE FOR YOU.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TechShell>
            </div>
        </LayoutGroup>
    );
}
