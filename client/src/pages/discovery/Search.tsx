import { TechShell } from "@/components/layout/TechShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Sparkles, TrendingUp, Command } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import { useTranslation } from "react-i18next";

export default function Search() {
    const { t } = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const [activeTab, setActiveTab] = useState("prompts");

    const tabs = ["prompts", "workflows", "systems", "templates", "aiUsecases"];

    return (
        <div className="min-h-screen bg-background">
            <TechShell>
                <div className="max-w-6xl mx-auto py-12 px-6">

                    {/* Hero Section */}
                    <div className="text-center mb-16 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none opacity-50" />
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-7xl font-black tracking-tighter mb-6 relative z-10 whitespace-pre-line"
                        >
                            {t('search.hero.title')}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
                        >
                            {t('search.hero.subtitle')}
                        </motion.p>
                    </div>

                    {/* Search Tabs */}
                    <div className="flex justify-center gap-2 mb-8">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab
                                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/5"
                                    }`}
                            >
                                {t(`feed.tabs.${tab}`)}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative max-w-3xl mx-auto mb-12 group"
                    >
                        <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 ${isFocused ? 'opacity-60' : ''}`} />
                        <div className="relative">
                            <SearchIcon className={`absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${isFocused ? 'text-blue-400' : 'text-muted-foreground'}`} />
                            <Input
                                className="h-24 pl-20 rtl:pr-20 rtl:pl-8 pr-8 text-2xl rounded-full bg-black/80 backdrop-blur-xl border-2 border-white/10 focus:border-blue-500/50 focus:ring-0 shadow-2xl transition-all placeholder:text-muted-foreground/50"
                                placeholder={t('search.hero.placeholder')}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                autoFocus
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground border border-white/10 px-3 py-1.5 rounded-full bg-white/5">
                                <Command className="w-3 h-3" /> K
                            </div>
                        </div>
                    </motion.div>

                    {/* Filters */}
                    <div className="flex justify-center gap-4 mb-20">
                        {["model", "difficulty", "length", "sortBy"].map(filter => (
                            <Button key={filter} variant="outline" className="border-white/10 bg-black/40 hover:bg-white/10 text-muted-foreground">
                                {t(`search.filters.${filter}`)} <span className="ml-2 rtl:mr-2 rtl:ml-0">▼</span>
                            </Button>
                        ))}
                    </div>

                    {/* Recent & Trending */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-sm font-black text-muted-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> {t('search.sections.recent')}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {["Cyberpunk City", "SaaS Email Sequence", "Python Refactoring", "Logo Design", "Midjourney V6"].map((t, i) => (
                                    <motion.div
                                        key={t}
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="text-sm font-medium group-hover:text-white transition-colors">{t}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-sm font-black text-muted-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> {t('search.sections.trending')}
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { name: "Real Estate Lead Gen", count: "2.4k searches" },
                                    { name: "Instagram Viral Hooks", count: "1.8k searches" },
                                    { name: "React Component Generator", count: "1.2k searches" }
                                ].map((item, i) => (
                                    <div key={item.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer group">
                                        <span className="font-bold group-hover:text-blue-400 transition-colors">{item.name}</span>
                                        <span className="text-xs font-mono text-muted-foreground">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </TechShell>
        </div>
    );
}
