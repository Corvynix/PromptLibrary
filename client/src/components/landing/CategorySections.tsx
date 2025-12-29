import { PromptCard, Prompt } from "@/components/PromptCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface CategorySectionProps {
    title: string;
    description?: string;
    prompts: Prompt[];
    color?: string;
}

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CategorySection({ title, description, prompts, color = "blue" }: CategorySectionProps) {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalItems = prompts.length;

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
    };

    // Get 3 visible items with wrapping
    const getVisibleItems = () => {
        if (totalItems === 0) return [];
        const items = [];
        for (let i = -1; i <= 1; i++) {
            const index = (currentIndex + i + totalItems) % totalItems;
            items.push({ prompt: prompts[index], offset: i });
        }
        return items;
    };

    return (
        <section className="py-12 border-t border-white/5 overflow-hidden">
            <div className="flex items-end justify-between mb-8 px-4 md:px-0 max-w-6xl mx-auto">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                        <span className={`w-2 h-8 rounded-full bg-${color}-500`} />
                        {title}
                    </h2>
                    {description && (
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            {description}
                        </p>
                    )}
                </div>
                <Button variant="ghost" className="hidden md:flex gap-2 hover:bg-white/5">
                    {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
                </Button>
            </div>

            <div className="relative h-[450px] flex items-center justify-center">
                {/* Left Arrow */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-0 top-0 bottom-0 z-20 w-12 md:w-20 flex items-center justify-center bg-foreground text-background hover:opacity-80 transition-all"
                    style={{ clipPath: "polygon(0 0, 100% 25%, 100% 75%, 0 100%)" }}
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
                </button>

                {/* Cards Container */}
                <div className="relative w-full max-w-5xl mx-auto h-full flex items-center justify-center perspective-1000">
                    {getVisibleItems().map(({ prompt, offset }) => {
                        const absOffset = Math.abs(offset);
                        const zIndex = 20 - absOffset;
                        const scale = 1 - (absOffset * 0.15); // Slightly less scaling variation
                        const opacity = 1 - (absOffset * 0.3);
                        const blur = absOffset * 2;
                        const translateX = offset * 60; // Spread out a bit more

                        return (
                            <motion.div
                                key={`${prompt.id}-${offset}`}
                                className="absolute transition-all duration-500 ease-out"
                                style={{
                                    width: "300px", // Fixed width for carousel
                                    zIndex: zIndex,
                                    x: `${translateX}%`, // Use framer-motion x for smoother perf if possible, but style transform is fine too
                                    scale: scale,
                                    opacity: opacity,
                                    filter: `blur(${blur}px)`,
                                    pointerEvents: offset === 0 ? 'auto' : 'none'
                                }}
                                initial={false} // Prevent initial animation glitch
                            >
                                <PromptCard prompt={prompt} className="h-[400px]" />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={handleNext}
                    className="absolute right-0 top-0 bottom-0 z-20 w-12 md:w-20 flex items-center justify-center bg-foreground text-background hover:opacity-80 transition-all"
                    style={{ clipPath: "polygon(0 25%, 100% 0, 100% 100%, 0 75%)" }}
                    aria-label="Next"
                >
                    <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
                </button>
            </div>

            <div className="mt-6 md:hidden px-4">
                <Button variant="outline" className="w-full gap-2 border-white/10 bg-white/5">
                    {t('common.viewAll')} {title} <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </section>
    );
}

// Mock Data Helper for Preview
export const MOCK_CATEGORIES = [
    {
        title: "Real Estate & Property",
        description: "High-converting scripts, listing descriptions, and lead gen workflows.",
        color: "emerald"
    },
    {
        title: "Islamic Content Engine",
        description: "Respectful, accurate, and creative prompts for Islamic content creation.",
        color: "amber"
    },
    {
        title: "Viral Marketing Hooks",
        description: "Stop the scroll with these psychology-backed hook generators.",
        color: "rose"
    },
    {
        title: "SaaS Growth Systems",
        description: "Complete workflows for onboarding, retention, and churn reduction.",
        color: "blue"
    }
];

import { AdUnit } from "@/components/ads/AdUnit";

export function CategorySections() {
    // Generate some mock prompts for the preview
    const generatePrompts = (category: string) => Array.from({ length: 4 }).map((_, i) => ({
        id: Math.random(),
        slug: `prompt-${i}`,
        title: `${category} Template ${i + 1}`,
        shortDesc: "Boost your productivity with this optimized prompt template designed for professionals.",
        type: "Chat",
        difficulty: "Intermediate",
        rating: 4.8,
        totalLikes: 120 + i * 10,
        totalUses: 1000 + i * 50,
        author: {
            name: "PromptExpert",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
        },
        tags: ["Business", "AI", "Productivity"],
        isPro: i % 2 === 0
    }));

    return (
        <div className="space-y-4">
            {MOCK_CATEGORIES.map((category, index) => (
                <div key={category.title}>
                    <CategorySection
                        {...category}
                        prompts={generatePrompts(category.title) as any}
                    />

                    {/* Inject Ad after the second category (index 1) */}
                    {index === 1 && (
                        <div className="max-w-6xl mx-auto px-6 py-8">
                            <AdUnit size="banner" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
