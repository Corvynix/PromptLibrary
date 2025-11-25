import { motion, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import { TechShell } from "@/components/layout/TechShell";

export default function Terms() {
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
                            TERMS
                        </motion.div>
                    </motion.div>
                )}

                <TechShell loading={loading} logoText="TERMS">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto space-y-8">

                            {/* Background Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                                <h1
                                    className="text-[18vw] font-black font-display text-transparent whitespace-nowrap select-none"
                                    style={{ WebkitTextStroke: "2px var(--foreground)", opacity: 0.08 }}
                                >
                                    TERMS
                                </h1>
                            </div>

                            <div className="relative z-10 space-y-8">
                                <div className="border-2 border-white/20 bg-black p-8">
                                    <h2 className="text-2xl font-black tracking-tighter uppercase mb-4">TERMS OF SERVICE</h2>
                                    <p className="text-xs text-muted-foreground font-mono mb-4">LAST UPDATED: JANUARY 2025</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                                        BY ACCESSING OR USING PROMPTLIBRARY, YOU AGREE TO BE BOUND BY THESE TERMS OF SERVICE AND ALL APPLICABLE LAWS AND REGULATIONS.
                                    </p>
                                </div>

                                <div className="border-2 border-white/20 bg-black p-8">
                                    <h3 className="text-xl font-black tracking-tighter uppercase mb-4">1. ACCEPTANCE OF TERMS</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                                        THESE TERMS GOVERN YOUR USE OF PROMPTLIBRARY AND ALL RELATED SERVICES. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE OUR PLATFORM.
                                    </p>
                                </div>

                                <div className="border-2 border-white/20 bg-black p-8">
                                    <h3 className="text-xl font-black tracking-tighter uppercase mb-4">2. USER CONTENT</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-mono mb-4">
                                        YOU RETAIN ALL RIGHTS TO THE PROMPTS YOU UPLOAD. BY SHARING ON PROMPTLIBRARY, YOU GRANT US A LICENSE TO:
                                    </p>
                                    <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">→</span>
                                            <span>DISPLAY YOUR CONTENT ON THE PLATFORM</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">→</span>
                                            <span>ALLOW OTHER USERS TO VIEW AND REMIX YOUR PROMPTS</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">→</span>
                                            <span>PROMOTE YOUR WORK WITHIN THE COMMUNITY</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-2 border-white/20 bg-black p-8">
                                    <h3 className="text-xl font-black tracking-tighter uppercase mb-4">3. PROHIBITED CONDUCT</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-mono mb-4">
                                        YOU AGREE NOT TO:
                                    </p>
                                    <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 font-bold">✕</span>
                                            <span>UPLOAD MALICIOUS OR HARMFUL CONTENT</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 font-bold">✕</span>
                                            <span>VIOLATE INTELLECTUAL PROPERTY RIGHTS</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400 font-bold">✕</span>
                                            <span>SPAM OR ABUSE THE PLATFORM</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-2 border-white/20 bg-black p-8">
                                    <h3 className="text-xl font-black tracking-tighter uppercase mb-4">4. DISCLAIMER</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                                        PROMPTLIBRARY IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THE ACCURACY OR EFFECTIVENESS OF ANY PROMPTS SHARED ON THE PLATFORM.
                                    </p>
                                </div>

                                <div className="text-center py-8">
                                    <p className="text-xs text-muted-foreground font-mono tracking-wider">
                                        QUESTIONS? CONTACT US AT LEGAL@PROMPTLIBRARY.COM
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
