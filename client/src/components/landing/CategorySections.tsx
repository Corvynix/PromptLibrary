import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";

interface PromptCard {
    id: number;
    title: string;
    model: string;
    tags: string[];
    author: {
        name: string;
        avatar: string;
    };
    likes: number;
}

interface CategorySectionProps {
    title: string;
    prompts: PromptCard[];
}

function CategorySection({ title, prompts }: CategorySectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const itemsPerView = 3;
    const maxIndex = Math.max(0, prompts.length - itemsPerView);

    const scrollToIndex = (index: number) => {
        if (scrollContainerRef.current) {
            const cardWidth = 280;
            scrollContainerRef.current.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        }
    };

    const handlePrevious = () => {
        const newIndex = Math.max(0, currentIndex - 1);
        setCurrentIndex(newIndex);
        scrollToIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = Math.min(maxIndex, currentIndex + 1);
        setCurrentIndex(newIndex);
        scrollToIndex(newIndex);
    };

    return (
        <div className="relative">
            <h3 className="text-xl font-black tracking-widest uppercase mb-12 px-6">{title}</h3>

            <div className="relative h-[400px] flex items-center justify-center">
                {/* Left Arrow - Shaped (4-sided) */}
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="absolute left-0 top-0 bottom-0 z-20 w-20 flex items-center justify-center bg-black text-white dark:bg-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-zinc-900 dark:hover:bg-zinc-200"
                    style={{ clipPath: "polygon(0 0, 100% 25%, 100% 75%, 0 100%)" }}
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
                </button>

                {/* Cards Container - Focused Layout */}
                <div className="relative w-full max-w-5xl mx-auto h-full flex items-center justify-center perspective-1000">
                    {prompts.map((prompt, index) => {
                        const offset = index - currentIndex;
                        const absOffset = Math.abs(offset);
                        const isVisible = absOffset <= 2;

                        if (!isVisible) return null;

                        // Dynamic styles for depth effect
                        const zIndex = 20 - absOffset;
                        const scale = 1.1 - (absOffset * 0.15); // 1.1 -> 0.95 -> 0.8
                        const opacity = 1 - (absOffset * 0.3); // 1 -> 0.7 -> 0.4
                        const blur = absOffset * 2; // 0 -> 2px -> 4px
                        const translateX = offset * 55; // 0 -> 55% -> 110%

                        return (
                            <div
                                key={prompt.id}
                                className="absolute transition-all duration-500 ease-out flex flex-col"
                                style={{
                                    width: "300px",
                                    zIndex: zIndex,
                                    transform: `translateX(${translateX}%) scale(${scale})`,
                                    opacity: opacity,
                                    filter: `blur(${blur}px)`
                                }}
                            >
                                {/* Card */}
                                <div className="relative bg-card border-2 border-border/50 rounded-3xl overflow-hidden h-[350px] flex flex-col shadow-2xl">
                                    <div className="relative flex flex-col h-full p-6">
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-bold mb-2 line-clamp-2">
                                                {prompt.title}
                                            </h3>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-auto">
                                            {prompt.tags.map((tag, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs rounded-full">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8 border-2 border-border">
                                                    <AvatarImage src={prompt.author.avatar} />
                                                    <AvatarFallback>{prompt.author.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-semibold">{prompt.author.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-red-500">
                                                <Heart className="w-4 h-4 fill-red-500" />
                                                <span className="text-sm font-bold">{prompt.likes}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Glow (Only on active) */}
                                    {offset === 0 && (
                                        <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[0_0_30px_rgba(34,211,238,0.2)] border-2 border-blue-400/50" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Arrow - Shaped (4-sided) */}
                <button
                    onClick={handleNext}
                    disabled={currentIndex >= maxIndex}
                    className="absolute right-0 top-0 bottom-0 z-20 w-20 flex items-center justify-center bg-black text-white dark:bg-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-zinc-900 dark:hover:bg-zinc-200"
                    style={{ clipPath: "polygon(0 25%, 100% 0, 100% 100%, 0 75%)" }}
                    aria-label="Next"
                >
                    <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
}

// Mock data for categories
const CATEGORIES = [
    {
        title: "AI ART & DESIGN",
        prompts: [
            { id: 1, title: "Cyberpunk Portrait", model: "Midjourney", tags: ["Art", "Cyberpunk"], author: { name: "ALEX", avatar: "https://i.pravatar.cc/150?img=3" }, likes: 892 },
            { id: 2, title: "Minimalist Logo", model: "DALL-E", tags: ["Design", "Logo"], author: { name: "SARA", avatar: "https://i.pravatar.cc/150?img=4" }, likes: 654 },
            { id: 3, title: "Fantasy Landscape", model: "Midjourney", tags: ["Art", "Fantasy"], author: { name: "MIKE", avatar: "https://i.pravatar.cc/150?img=5" }, likes: 1023 },
            { id: 4, title: "Product Mockup", model: "DALL-E", tags: ["Design", "Product"], author: { name: "EMMA", avatar: "https://i.pravatar.cc/150?img=6" }, likes: 445 },
        ]
    },
    {
        title: "CODING & DEVELOPMENT",
        prompts: [
            { id: 5, title: "React Component", model: "GPT-4", tags: ["React", "Code"], author: { name: "JOHN", avatar: "https://i.pravatar.cc/150?img=7" }, likes: 723 },
            { id: 6, title: "API Documentation", model: "Claude", tags: ["API", "Docs"], author: { name: "LISA", avatar: "https://i.pravatar.cc/150?img=8" }, likes: 567 },
            { id: 7, title: "SQL Optimizer", model: "GPT-4", tags: ["SQL", "Database"], author: { name: "TOM", avatar: "https://i.pravatar.cc/150?img=9" }, likes: 891 },
            { id: 8, title: "Code Review", model: "Claude", tags: ["Code", "Review"], author: { name: "ANNA", avatar: "https://i.pravatar.cc/150?img=10" }, likes: 432 },
        ]
    },
    {
        title: "BUSINESS & MARKETING",
        prompts: [
            { id: 9, title: "Email Campaign", model: "GPT-4", tags: ["Email", "Marketing"], author: { name: "CHRIS", avatar: "https://i.pravatar.cc/150?img=11" }, likes: 678 },
            { id: 10, title: "Social Media Post", model: "Claude", tags: ["Social", "Content"], author: { name: "KATE", avatar: "https://i.pravatar.cc/150?img=12" }, likes: 543 },
            { id: 11, title: "Product Description", model: "GPT-4", tags: ["Product", "Copy"], author: { name: "DAVID", avatar: "https://i.pravatar.cc/150?img=13" }, likes: 789 },
            { id: 12, title: "SEO Content", model: "Claude", tags: ["SEO", "Content"], author: { name: "NINA", avatar: "https://i.pravatar.cc/150?img=14" }, likes: 621 },
        ]
    }
];

export function CategorySections() {
    return (
        <div className="w-full py-12 space-y-16">
            {CATEGORIES.map((category, idx) => (
                <CategorySection key={idx} title={category.title} prompts={category.prompts} />
            ))}
        </div>
    );
}
