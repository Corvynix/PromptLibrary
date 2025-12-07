import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PromptCard, Prompt } from "@/components/PromptCard";

const MOCK_TRENDING: Prompt[] = [
    {
        id: 1,
        slug: "marketing-copywriting",
        title: "Marketing Copywriting Master",
        shortDesc: "Generate high-converting marketing copy for emails, ads, and landing pages.",
        type: "Chat",
        industryTags: ["Marketing", "Email", "Sales"],
        socialTags: ["#viral", "#conversion"],
        totalUses: 5630,
        totalLikes: 563,
        owner: {
            id: 1,
            displayName: "DR RAX",
            email: "drrax@example.com",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
            verified: true
        },
        thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
        modelCompatibility: ["GPT-4", "Claude 3"],
        difficulty: "Intermediate",
        popularityScore: 95,
        version: "v2.1",
        commentCount: 42,
        license: "MIT",
        tokenCount: 450,
        lastUpdated: "2 days ago"
    },
    {
        id: 2,
        slug: "logo-designer",
        title: "Logo Designer Pro",
        shortDesc: "Create stunning, professional logos with detailed prompts for DALL-E and Midjourney.",
        type: "Image",
        industryTags: ["Design", "Branding"],
        socialTags: ["#dalle", "#midjourney"],
        totalUses: 4620,
        totalLikes: 462,
        owner: {
            id: 2,
            displayName: "NYX",
            email: "nyx@example.com",
            avatarUrl: "https://i.pravatar.cc/150?img=2",
            verified: true
        },
        thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
        modelCompatibility: ["DALL-E 3", "Midjourney V6"],
        difficulty: "Advanced",
        popularityScore: 92,
        version: "v1.5",
        commentCount: 28,
        license: "CC-BY",
        tokenCount: 320,
        lastUpdated: "Just now"
    },
    {
        id: 3,
        slug: "sql-optimizer",
        title: "SQL Query Optimizer",
        shortDesc: "Optimize and refactor SQL queries for better performance and readability.",
        type: "Chat",
        industryTags: ["Development", "Database", "Code"],
        socialTags: ["#sql", "#optimization"],
        totalUses: 2340,
        totalLikes: 234,
        owner: {
            id: 1,
            displayName: "DR RAX",
            email: "drrax@example.com",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
            verified: true
        },
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
        modelCompatibility: ["GPT-4", "Claude 3.5"],
        difficulty: "Expert",
        popularityScore: 88,
        version: "v3.0",
        commentCount: 15,
        license: "MIT",
        tokenCount: 280,
        lastUpdated: "1 week ago"
    },
    {
        id: 4,
        slug: "arabic-marketing",
        title: "Arabic Marketing Copy",
        shortDesc: "Generate culturally-aware Arabic marketing content for MENA markets.",
        type: "Chat",
        industryTags: ["Marketing", "Arabic", "Localization"],
        socialTags: ["#arabic", "#mena"],
        totalUses: 4120,
        totalLikes: 412,
        owner: {
            id: 2,
            displayName: "NYX",
            email: "nyx@example.com",
            avatarUrl: "https://i.pravatar.cc/150?img=2",
            verified: true
        },
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
        modelCompatibility: ["Claude 3", "GPT-4"],
        difficulty: "Intermediate",
        popularityScore: 90,
        version: "v1.8",
        commentCount: 31,
        license: "Proprietary",
        tokenCount: 380,
        lastUpdated: "3 days ago"
    },
    {
        id: 5,
        slug: "real-estate-listing",
        title: "Real Estate Listing Generator",
        shortDesc: "Create compelling property listings that sell faster with AI-powered descriptions.",
        type: "Chat",
        industryTags: ["Real Estate", "Sales", "Marketing"],
        socialTags: ["#realestate", "#listings"],
        totalUses: 1560,
        totalLikes: 156,
        owner: {
            id: 1,
            displayName: "DR RAX",
            email: "drrax@example.com",
            avatarUrl: "https://i.pravatar.cc/150?img=1",
            verified: true
        },
        thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
        modelCompatibility: ["GPT-4"],
        difficulty: "Beginner",
        popularityScore: 85,
        version: "v1.2",
        commentCount: 8,
        license: "MIT",
        tokenCount: 220,
        lastUpdated: "Yesterday"
    },
    {
        id: 6,
        slug: "code-review",
        title: "Code Review Assistant",
        shortDesc: "Get detailed code reviews with suggestions for improvements and best practices.",
        type: "Chat",
        industryTags: ["Development", "Code", "Review"],
        socialTags: ["#codereview", "#bestpractices"],
        totalUses: 2780,
        totalLikes: 278,
        owner: {
            id: 2,
            displayName: "NYX",
            email: "nyx@example.com",
            avatarUrl: "https://i.pravatar.cc/150?img=2",
            verified: true
        },
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        modelCompatibility: ["Claude 3.5", "GPT-4"],
        difficulty: "Advanced",
        popularityScore: 89,
        version: "v2.3",
        commentCount: 19,
        license: "MIT",
        tokenCount: 410,
        lastUpdated: "5 days ago"
    }
];

export function TrendingStrip() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalItems = MOCK_TRENDING.length;

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
    };

    // Get 3 visible items with wrapping
    const getVisibleItems = () => {
        const items = [];
        for (let i = -1; i <= 1; i++) {
            const index = (currentIndex + i + totalItems) % totalItems;
            items.push({ prompt: MOCK_TRENDING[index], offset: i });
        }
        return items;
    };

    return (
        <div className="w-full py-12 border-y border-border relative overflow-hidden bg-background">
            <div className="flex items-center justify-between px-6 mb-12 relative z-10">
                <h2 className="text-xl font-black tracking-widest uppercase">TRENDING NOW</h2>
            </div>

            <div className="relative h-[480px] flex items-center justify-center">
                {/* Left Arrow */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-0 top-0 bottom-0 z-20 w-20 flex items-center justify-center bg-foreground text-background hover:opacity-80 transition-all"
                    style={{ clipPath: "polygon(0 0, 100% 25%, 100% 75%, 0 100%)" }}
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-8 h-8" strokeWidth={1.5} />
                </button>

                {/* Cards Container */}
                <div className="relative w-full max-w-5xl mx-auto h-full flex items-center justify-center">
                    {getVisibleItems().map(({ prompt, offset }) => {
                        const absOffset = Math.abs(offset);
                        const zIndex = 20 - absOffset;
                        const scale = 1.1 - (absOffset * 0.15);
                        const opacity = 1 - (absOffset * 0.3);
                        const blur = absOffset * 2;
                        const translateX = offset * 55;

                        return (
                            <div
                                key={`${prompt.id}-${offset}`}
                                className="absolute transition-all duration-500 ease-out"
                                style={{
                                    width: "320px",
                                    zIndex: zIndex,
                                    transform: `translateX(${translateX}%) scale(${scale})`,
                                    opacity: opacity,
                                    filter: `blur(${blur}px)`,
                                    pointerEvents: offset === 0 ? 'auto' : 'none'
                                }}
                            >
                                <PromptCard prompt={prompt} className="h-[420px]" />
                            </div>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={handleNext}
                    className="absolute right-0 top-0 bottom-0 z-20 w-20 flex items-center justify-center bg-foreground text-background hover:opacity-80 transition-all"
                    style={{ clipPath: "polygon(0 25%, 100% 0, 100% 100%, 0 75%)" }}
                    aria-label="Next"
                >
                    <ChevronRight className="w-8 h-8" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
}
