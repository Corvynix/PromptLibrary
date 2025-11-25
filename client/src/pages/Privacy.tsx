import { motion, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import { TechShell } from "@/components/layout/TechShell";

export default function Privacy() {
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
                            PRIVACY
                        </motion.div>
                    </motion.div>
                )}

                <TechShell loading={loading} logoText="PRIVACY">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto space-y-8">

                            {/* Background Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                                <h1
                                    className="text-[18vw] font-black font-display text-transparent whitespace-nowrap select-none"
                                    style={{ WebkitTextStroke: "2px var(--foreground)", opacity: 0.08 }}
                                >
                                    PRIVACY
                                </h1>
                            </div>

                            <div className="relative z-10 space-y-8">
                                <div className="border-2 border-white/20 bg-black p-8">
                                    <h2 className="text-2xl font-black tracking-tighter uppercase mb-4">PRIVACY POLICY</h2>
                                    <p className="text-xs text-muted-foreground font-mono mb-4">LAST UPDATED: JANUARY 2025</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                                        YOUR PRIVACY IS IMPORTANT TO US. THIS POLICY EXPLAINS HOW WE COLLECT, USE, AND PROTECT YOUR PERSONAL INFORMATION.
                                    </p>
                                </div>

                                <div className="border-2 border-white/20 bg-black p-8">
                                    <h3 className="text-xl font-black tracking-tighter uppercase mb-4">INFORMATION WE COLLECT</h3>
                                    <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">→</span>
                                            <span>ACCOUNT INFORMATION (EMAIL, USERNAME)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">→</span>
                                            <span>PROMPTS AND CONTENT YOU UPLOAD</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">→</span>
                                            <span>USAGE DATA AND ANALYTICS</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">→</span>
                                            <span>COOKIES AND TRACKING TECHNOLOGIES</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-2 border-white/20 bg-black p-8">
                                    <h3 className="text-xl font-black tracking-tighter uppercase mb-4">HOW WE USE YOUR DATA</h3>
                                    <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">→</span>
                                            <span>PROVIDE AND IMPROVE OUR SERVICES</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">→</span>
                                            <span>PERSONALIZE YOUR EXPERIENCE</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">→</span>
                                            <span>COMMUNICATE UPDATES AND FEATURES</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-cyan-400 font-bold">→</span>
                                            <span>ENSURE PLATFORM SECURITY</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-2 border-white/20 bg-black p-8">
                                    <h3 className="text-xl font-black tracking-tighter uppercase mb-4">DATA PROTECTION</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                                        WE IMPLEMENT INDUSTRY-STANDARD SECURITY MEASURES TO PROTECT YOUR DATA. YOUR INFORMATION IS ENCRYPTED IN TRANSIT AND AT REST.
                                    </p>
                                </div>

                                <div className="border-2 border-white/20 bg-black p-8">
                                    <h3 className="text-xl font-black tracking-tighter uppercase mb-4">YOUR RIGHTS</h3>
                                    <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 font-bold">✓</span>
                                            <span>ACCESS YOUR PERSONAL DATA</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 font-bold">✓</span>
                                            <span>REQUEST DATA DELETION</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 font-bold">✓</span>
                                            <span>OPT-OUT OF MARKETING COMMUNICATIONS</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 font-bold">✓</span>
                                            <span>EXPORT YOUR DATA</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="text-center py-8">
                                    <p className="text-xs text-muted-foreground font-mono tracking-wider">
                                        PRIVACY QUESTIONS? EMAIL PRIVACY@PROMPTLIBRARY.COM
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
