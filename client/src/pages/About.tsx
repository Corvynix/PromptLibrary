import { motion, LayoutGroup } from "framer-motion";
import { useState, useEffect } from "react";
import { TechShell } from "@/components/layout/TechShell";
import { Sparkles, Users, Code, Heart, Zap, Globe } from "lucide-react";

export default function About() {
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
                        {/* Hero Section */}
                        <div className="relative py-20 px-6 text-center">
                            {/* Background Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                                <h1
                                    className="text-[18vw] font-black font-display text-transparent whitespace-nowrap select-none"
                                    style={{ WebkitTextStroke: "2px var(--foreground)", opacity: 0.08 }}
                                >
                                    ABOUT
                                </h1>
                            </div>

                            {/* Hero Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative z-10 max-w-3xl mx-auto space-y-6"
                            >
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                                    THE PLATFORM
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">BUILT FOR CREATORS</span>
                                </h2>
                                <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                                    Democratizing AI prompts for everyone. Free forever.
                                </p>
                            </motion.div>
                        </div>

                        {/* Stats Section */}
                        <div className="px-6 py-12 max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: Users, label: "COMMUNITY", value: "100K+", desc: "Prompt Engineers" },
                                    { icon: Code, label: "PROMPTS", value: "50K+", desc: "AI Prompts Shared" },
                                    { icon: Globe, label: "MODELS", value: "ALL", desc: "AI Models Supported" },
                                ].map((stat, idx) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.1 }}
                                        className="border-2 border-white/10 bg-black/40 backdrop-blur-md rounded-3xl p-8 text-center hover:border-blue-500/50 transition-all group"
                                    >
                                        <div className="flex justify-center mb-4">
                                            <div className="p-4 rounded-full bg-blue-500/10 border-2 border-blue-500/20 group-hover:scale-110 transition-transform">
                                                <stat.icon className="w-8 h-8 text-blue-400" />
                                            </div>
                                        </div>
                                        <div className="text-4xl font-black tracking-tighter mb-2 group-hover:text-white transition-colors">{stat.value}</div>
                                        <div className="text-xs font-mono text-muted-foreground tracking-wider">{stat.desc}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* About Content */}
                        <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="border-2 border-white/10 bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                        <Sparkles className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">WHO WE ARE</h2>
                                </div>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    PromptLibrary is the world's largest open platform for AI prompts. We believe that great prompts should be accessible to everyone, not locked behind paywalls or scattered across the internet. Our mission is to democratize AI by making high-quality prompts freely available to creators, developers, and innovators worldwide.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="border-2 border-white/10 bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <Zap className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">WHAT WE DO</h2>
                                </div>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                    We provide a platform where prompt engineers can:
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Discover prompts across all AI models and industries",
                                        "Share their creations with the community",
                                        "Remix and improve existing prompts",
                                        "Earn karma and build reputation",
                                        "Connect with other creators worldwide"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                            <span className="text-blue-400 font-bold text-xl">→</span>
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="border-2 border-white/20 bg-black/50 backdrop-blur-sm rounded-3xl p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <Heart className="w-6 h-6 text-blue-400" />
                                    <h2 className="text-2xl font-black tracking-tighter uppercase">OUR VALUES</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { title: "OPEN", desc: "Free forever, no paywalls", icon: "🔓" },
                                        { title: "QUALITY", desc: "Community-driven excellence", icon: "⭐" },
                                        { title: "COMMUNITY", desc: "Built by creators, for creators", icon: "🤝" },
                                        { title: "INNOVATION", desc: "Pushing the boundaries of AI", icon: "🚀" },
                                    ].map((value) => (
                                        <div key={value.title} className="border-2 border-white/10 rounded-2xl p-6 hover:border-blue-400/40 transition-colors">
                                            <div className="text-3xl mb-3">{value.icon}</div>
                                            <h3 className="text-sm font-black tracking-wider mb-2">{value.title}</h3>
                                            <p className="text-xs text-muted-foreground">{value.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

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
