import { TechShell } from "@/components/layout/TechShell";
import { PromptCard, Prompt } from "@/components/PromptCard";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, Filter, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

// Enhanced Mock Data Generator
const generateMockPrompts = (count: number): Prompt[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        slug: `prompt-${i + 1}`,
        title: [
            "Real Estate Lead Generator – High Conversion Script",
            "SaaS Email Sequence Master Template",
            "Midjourney V6 Photorealistic Portrait Guide",
            "Python Code Refactoring Assistant",
            "SEO Blog Post Generator with Human Touch",
            "React Component Generator with Tailwind",
            "Legal Contract Reviewer & Summarizer",
            "Instagram Viral Content Strategy"
        ][i % 8],
        shortDesc: [
            "Generate high-quality leads with this battle-tested script designed for real estate agents. Includes objection handling and follow-up sequences.",
            "A complete 7-day email sequence for SaaS onboarding that increases retention by 40%.",
            "Master the art of photorealistic portraits in Midjourney V6 with this comprehensive parameter guide.",
            "Clean up your Python code, add type hints, and improve performance with this automated refactoring assistant.",
            "Write SEO-optimized blog posts that rank on Google while sounding completely human and engaging.",
            "Generate production-ready React components with Tailwind CSS styling, TypeScript interfaces, and responsive design.",
            "Quickly analyze legal contracts, highlight risks, and generate plain English summaries for clients.",
            "Create a month's worth of viral Instagram content ideas, captions, and hashtag sets in minutes."
        ][i % 8],
        type: (["Chat", "Image", "Workflow", "System", "Multi-step", "Template"][i % 6]) as any,
        industryTags: [
            ["Marketing", "Real Estate", "Sales"],
            ["SaaS", "Email", "Growth"],
            ["Design", "AI Art", "Creative"],
            ["Development", "Python", "Coding"],
            ["Marketing", "SEO", "Content"],
            ["Development", "React", "Frontend"],
            ["Legal", "Business", "Productivity"],
            ["Social Media", "Marketing", "Viral"]
        ][i % 8],
        socialTags: ["#viral", "#automation", "#productivity", "#ai"],
        totalUses: Math.floor(Math.random() * 50000) + 1000,
        totalLikes: Math.floor(Math.random() * 5000) + 100,
        owner: {
            id: i + 1,
            displayName: ["Alex Chen", "Sarah Jones", "Mike Ross", "Emma Wilson", "David Kim", "Lisa Wang", "James Bond", "Natasha Romanoff"][i % 8],
            email: `user${i}@example.com`,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
            verified: i % 3 === 0,
        },
        // New Fields
        thumbnail: [
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80", // Real Estate
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", // Email
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", // Art
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80", // Code
            "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80", // SEO
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80", // React
            "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80", // Legal
            "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"  // Instagram
        ][i % 8],
        modelCompatibility: [
            ["GPT-4", "Claude 3"],
            ["GPT-3.5", "GPT-4"],
            ["Midjourney V6", "DALL-E 3"],
            ["GPT-4", "Copilot"],
            ["Claude 3", "GPT-4"],
            ["GPT-4", "Claude 3.5"],
            ["GPT-4", "Claude 3"],
            ["GPT-4", "Gemini"]
        ][i % 8],
        difficulty: (["Beginner", "Intermediate", "Advanced", "Expert"][i % 4]) as any,
        popularityScore: Math.floor(Math.random() * 20) + 80, // 80-100
        version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)}`,
        commentCount: Math.floor(Math.random() * 200),
        license: ["MIT", "CC-BY", "Proprietary", "Public Domain"][i % 4],
        tokenCount: Math.floor(Math.random() * 1000) + 100,
        lastUpdated: ["2 days ago", "1 week ago", "Just now", "Yesterday"][i % 4],

        relatedTags: ["AI", "Automation", "Workflow", "Productivity"],
        exampleOutput: [
            "Subject: Quick question about your property search\n\nHi [Name],\n\nI noticed you were looking at homes in [Area]. The market is moving fast right now, and I wanted to see if you're still actively looking or if you've put your search on hold?\n\nI have a few off-market listings that match your criteria.\n\nBest,\n[Agent Name]",
            "Day 1: Welcome & Getting Started\nDay 2: The Problem We Solve\nDay 3: Customer Success Story\nDay 4: Hidden Features\nDay 5: Special Offer",
            "--ar 16:9 --v 6.0 --style raw\n\nA cinematic portrait of an elderly fisherman, weathered face, deep wrinkles, intense eyes, storm clouds in background, dramatic lighting, 8k resolution, photorealistic",
            "def calculate_metrics(data: List[Dict]) -> Dict[str, float]:\n    \"\"\"\n    Calculate key metrics from data.\n    \"\"\"\n    if not data:\n        return {}\n    ...",
            "Title: The Future of AI in 2025\n\nIntroduction:\nArtificial Intelligence is evolving at an unprecedented pace. In this post, we'll explore...",
            "const Button = ({ children, variant = 'primary' }: ButtonProps) => {\n  return (\n    <button className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-blue-500' : 'bg-gray-200'}`}>\n      {children}\n    </button>\n  );\n};",
            "SUMMARY OF RISKS:\n1. Indemnification clause is too broad.\n2. Termination notice period is only 14 days.\n3. Non-compete clause extends for 2 years post-termination.",
            "Hook: 'Stop doing [Common Mistake] if you want to grow on Instagram.'\n\nCaption: Here is the exact strategy I used to gain 10k followers in 30 days...\n\nHashtags: #growth #instagramtips"
        ][i % 8]
    }));
};

export default function Feed() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTab, setSearchTab] = useState("prompts");

    const categories = [
        "all", "realEstate", "islamicContent", "business", "marketing",
        "copywriting", "lifeOS", "uxui", "storytelling", "personalBrand",
        "moneySales", "youtube", "psychology", "courses", "appsAutomations"
    ];

    const searchTabs = ["prompts", "workflows", "systems", "templates", "aiUsecases"];

    // Use mock data directly for now to showcase the UI
    const { data: prompts, isLoading, error, refetch } = useQuery({
        queryKey: ['prompts', activeFilter],
        queryFn: async () => {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return generateMockPrompts(12);
        }
    });

    const filteredPrompts = prompts?.filter(prompt =>
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.shortDesc?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <TechShell>
            <div className="max-w-[1600px] mx-auto p-6 space-y-8">

                {/* Premium Header */}
                <div className="relative rounded-3xl overflow-hidden bg-black/40 border border-white/10 p-8 md:p-12 mb-12">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent" />
                    <div className="relative z-10 max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 whitespace-pre-line"
                        >
                            {t('feed.hero.title')}
                        </motion.h1>
                        <p className="text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
                            {t('feed.hero.subtitle')}
                        </p>

                        <div className="flex flex-col gap-4 max-w-2xl">
                            {/* Search Tabs */}
                            <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide">

                                {searchTabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setSearchTab(tab)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${searchTab === tab
                                            ? "bg-white text-black"
                                            : "bg-black/40 text-white/60 hover:bg-white/10"
                                            }`}
                                    >
                                        {t(`feed.tabs.${tab}`)}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder={t('feed.hero.searchPlaceholder', { tab: t(`feed.tabs.${searchTab}`) })}
                                        className="pl-10 rtl:pr-10 rtl:pl-4 h-12 bg-black/50 border-white/10 rounded-xl focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                                    <Sparkles className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                    {t('feed.generate')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters / Categories */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mask-linear-fade">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
                            className={`
                  px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all whitespace-nowrap flex items-center gap-2
                  ${activeFilter === category
                                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                                    : 'bg-black/40 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/5'}
                `}
                        >
                            {/* Simple icon mapping based on category name could be added here */}
                            {t(`categories.${category}`)}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                    </div>
                ) : error ? (
                    <ErrorState
                        title="Failed to load prompts"
                        description="We encountered an error while fetching the latest prompts. Please try again."
                        onRetry={() => refetch()}
                    />
                ) : !filteredPrompts?.length ? (
                    <EmptyState
                        title="No prompts found"
                        description="Try adjusting your search or filters to find what you're looking for."
                        actionLabel="Clear Filters"
                        onAction={() => {
                            setSearchQuery("");
                            setActiveFilter("all");
                        }}
                    />
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredPrompts.map((prompt, index) => (
                                <motion.div
                                    key={prompt.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <PromptCard prompt={prompt} className="h-full" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </TechShell>
    );
}
