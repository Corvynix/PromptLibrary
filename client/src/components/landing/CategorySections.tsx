import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { NeonCard } from "@/components/ui/neon-card";
import { useState, useRef } from "react";

interface PromptCard {
    id: number;
    title: string;
    model: string;
    pqas: number;
    image: string;
}

interface CategorySectionProps {
    title: string;
    prompts: PromptCard[];
}

function CategorySection({ title, prompts }: CategorySectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative group">
            <h3 className="text-xl font-black tracking-tighter uppercase mb-4">{title}</h3>

            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border-2 border-white bg-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-cyan-400"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {prompts.map((prompt) => (
                    <div
                        key={prompt.id}
                        className="flex-shrink-0 w-52 h-full"
                    >
                        <NeonCard
                            title={prompt.title}
                            tags={[prompt.model]}
                            author={{ username: "prompt_wizard", avatar: prompt.image }}
                            likes={prompt.pqas}
                            className="h-full"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border-2 border-white bg-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-cyan-400"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}

const CATEGORIES = [
    {
        title: "Business & Marketing",
        prompts: Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            title: `Marketing Strategy ${i + 1}`,
            model: ["GPT-4", "Claude"][i % 2],
            pqas: Math.floor(Math.random() * 10 + 90),
            image: `https://picsum.photos/seed/biz${i}/400/300`,
        })),
    },
    {
        title: "Coding & Automation",
        prompts: Array.from({ length: 12 }, (_, i) => ({
            id: i + 100,
            title: `Code Generator ${i + 1}`,
            model: ["GPT-4", "Claude", "Gemini"][i % 3],
            pqas: Math.floor(Math.random() * 10 + 90),
            image: `https://picsum.photos/seed/code${i}/400/300`,
        })),
    },
    {
        title: "Image Generation",
        prompts: Array.from({ length: 12 }, (_, i) => ({
            id: i + 200,
            title: `Visual Masterpiece ${i + 1}`,
            model: ["Midjourney", "DALL-E"][i % 2],
            pqas: Math.floor(Math.random() * 10 + 90),
            image: `https://picsum.photos/seed/img${i}/400/300`,
        })),
    },
    {
        title: "Real Estate",
        prompts: Array.from({ length: 12 }, (_, i) => ({
            id: i + 300,
            title: `Property Listing ${i + 1}`,
            model: "GPT-4",
            pqas: Math.floor(Math.random() * 10 + 90),
            image: `https://picsum.photos/seed/real${i}/400/300`,
        })),
    },
];

export function CategorySections() {
    return (
        <div className="space-y-12 py-12">
            {CATEGORIES.map((category, idx) => (
                <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <CategorySection title={category.title} prompts={category.prompts} />
                </motion.div>
            ))}
        </div>
    );
}
