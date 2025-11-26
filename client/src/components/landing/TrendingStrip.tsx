import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { NeonCard } from "@/components/ui/neon-card";

interface TrendingPrompt {
    id: number;
    title: string;
    model: string;
    forks: number;
    image: string;
}

const MOCK_TRENDING: TrendingPrompt[] = [
    { id: 1, title: "Photorealistic Product Shot", model: "Midjourney", forks: 234, image: "https://picsum.photos/seed/trend1/400/300" },
    { id: 2, title: "SQL Query Optimizer", model: "GPT-4", forks: 189, image: "https://picsum.photos/seed/trend2/400/300" },
    { id: 3, title: "Arabic Marketing Copy", model: "Claude", forks: 412, image: "https://picsum.photos/seed/trend3/400/300" },
    { id: 4, title: "Real Estate Listing Pro", model: "GPT-4", forks: 156, image: "https://picsum.photos/seed/trend4/400/300" },
    { id: 5, title: "Code Review Assistant", model: "Claude", forks: 278, image: "https://picsum.photos/seed/trend5/400/300" },
    { id: 6, title: "3D Character Design", model: "Midjourney", forks: 523, image: "https://picsum.photos/seed/trend6/400/300" },
];

export function TrendingStrip() {
    const [duplicatedItems] = useState([...MOCK_TRENDING, ...MOCK_TRENDING]);

    return (
        <div className="w-full overflow-hidden py-8 border-y border-white/10">
            <div className="flex items-center gap-2 px-6 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h2 className="text-sm font-black tracking-widest uppercase">TRENDING NOW</h2>
            </div>

            <div className="relative">
                <motion.div
                    className="flex gap-4"
                    animate={{
                        x: [0, -1600],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedItems.map((prompt, idx) => (
                        <div
                            key={`${prompt.id}-${idx}`}
                            className="flex-shrink-0 w-64 h-full"
                        >
                            <NeonCard
                                title={prompt.title}
                                tags={[prompt.model]}
                                author={{ username: "prompt_wizard", avatar: prompt.image }}
                                likes={prompt.forks}
                                className="h-full"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
