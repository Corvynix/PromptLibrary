import { motion, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import { TechShell } from "@/components/layout/TechShell";
import { FocusedCarousel } from "@/components/ui/focused-carousel";

const ABOUT_ITEMS = [
    {
        id: 1,
        title: "OUR_MISSION",
        subtitle: "Democratizing AI prompts",
        image: "https://picsum.photos/seed/mission/600/800",
    },
    {
        id: 2,
        title: "THE_PLATFORM",
        subtitle: "Built for creators",
        image: "https://picsum.photos/seed/platform/600/800",
    },
    {
        id: 3,
        title: "COMMUNITY",
        subtitle: "100k+ prompt engineers",
        image: "https://picsum.photos/seed/community/600/800",
    },
    {
        id: 4,
        title: "TECHNOLOGY",
        subtitle: "PQAS quality scoring",
        image: "https://picsum.photos/seed/tech/600/800",
    },
    {
        id: 5,
        title: "OPEN_SOURCE",
        subtitle: "Free forever",
        image: "https://picsum.photos/seed/opensource/600/800",
    },
];

export default function About() {
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LayoutGroup>
            <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col p-4 md:p-6">

                {/* Splash Screen State */}
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
                            ABOUT
                        </motion.div>
                    </motion.div>
                )}

                <TechShell loading={loading} logoText="ABOUT">
                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="flex-1 flex flex-col justify-center items-center relative py-12">
                            {/* Background Overlay Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                                <h1
                                    className="text-[18vw] font-black font-display text-transparent whitespace-nowrap select-none"
                                    style={{ WebkitTextStroke: "2px var(--foreground)", opacity: 0.08 }}
                                >
                                    ABOUT
                                </h1>
                            </div>

                            {/* Carousel */}
                            <FocusedCarousel items={ABOUT_ITEMS} activeIndex={activeIndex} />

                            {/* Navigation Dots */}
                            <div className="flex gap-2 mt-8 z-10">
                                {ABOUT_ITEMS.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveIndex(idx)}
                                        className={`w-2 h-2 border transition-all ${activeIndex === idx
                                                ? "bg-cyan-400 border-cyan-400 w-8"
                                                : "bg-transparent border-white/40 hover:border-white"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* About Content */}
                        <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto space-y-8">
                            <div className="border-2 border-white/20 bg-black p-8">
                                <h2 className="text-2xl font-black tracking-tighter uppercase mb-4">WHO WE ARE</h2>
                                <p className="text-sm text-muted-foreground leading-relaxed font-mono">
                                    PROMPTLIBRARY IS THE WORLD'S LARGEST OPEN PLATFORM FOR AI PROMPTS. WE BELIEVE THAT GREAT PROMPTS SHOULD BE ACCESSIBLE TO EVERYONE, NOT LOCKED BEHIND PAYWALLS OR SCATTERED ACROSS THE INTERNET.
                                </p>
                            </div>

                            <div className="border-2 border-white/20 bg-black p-8">
                                <h2 className="text-2xl font-black tracking-tighter uppercase mb-4">WHAT WE DO</h2>
                                <p className="text-sm text-muted-foreground leading-relaxed font-mono mb-4">
                                    WE PROVIDE A PLATFORM WHERE PROMPT ENGINEERS CAN:
                                </p>
                                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                                    <li className="flex items-start gap-2">
                                        <span className="text-cyan-400 font-bold">→</span>
                                        <span>DISCOVER PROMPTS ACROSS ALL AI MODELS AND INDUSTRIES</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-cyan-400 font-bold">→</span>
                                        <span>SHARE THEIR CREATIONS WITH THE COMMUNITY</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-cyan-400 font-bold">→</span>
                                        <span>REMIX AND IMPROVE EXISTING PROMPTS</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-cyan-400 font-bold">→</span>
                                        <span>EARN KARMA AND BUILD REPUTATION</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="border-2 border-white/20 bg-black p-8">
                                <h2 className="text-2xl font-black tracking-tighter uppercase mb-4">OUR VALUES</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { title: "OPEN", desc: "Free forever, no paywalls" },
                                        { title: "QUALITY", desc: "PQAS scoring ensures excellence" },
                                        { title: "COMMUNITY", desc: "Built by creators, for creators" },
                                        { title: "INNOVATION", desc: "Pushing the boundaries of AI" },
                                    ].map((value) => (
                                        <div key={value.title} className="border border-white/10 p-4">
                                            <h3 className="text-sm font-black tracking-wider mb-2">{value.title}</h3>
                                            <p className="text-xs text-muted-foreground font-mono">{value.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center py-8">
                                <p className="text-xs text-muted-foreground font-mono tracking-wider">
                                    © 2025 PROMPTLIBRARY • BUILT WITH ❤️ FOR THE AI COMMUNITY
                                </p>
                            </div>
                        </div>
                    </div>
                </TechShell>
            </div>
        </LayoutGroup>
    );
}
