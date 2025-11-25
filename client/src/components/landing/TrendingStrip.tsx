import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface TrendingPrompt {
    id: number;
    title: string;
    model: string;
    pqas: number;
    forks: number;
    image: string;
}

const MOCK_TRENDING: TrendingPrompt[] = [
    { id: 1, title: "Photorealistic Product Shot", model: "Midjourney", pqas: 96, forks: 234, image: "https://picsum.photos/seed/trend1/400/300" },
    { id: 2, title: "SQL Query Optimizer", model: "GPT-4", pqas: 94, forks: 189, image: "https://picsum.photos/seed/trend2/400/300" },
    { id: 3, title: "Arabic Marketing Copy", model: "Claude", pqas: 98, forks: 412, image: "https://picsum.photos/seed/trend3/400/300" },
    { id: 4, title: "Real Estate Listing Pro", model: "GPT-4", pqas: 92, forks: 156, image: "https://picsum.photos/seed/trend4/400/300" },
    { id: 5, title: "Code Review Assistant", model: "Claude", pqas: 95, forks: 278, image: "https://picsum.photos/seed/trend5/400/300" },
    { id: 6, title: "3D Character Design", model: "Midjourney", pqas: 97, forks: 523, image: "https://picsum.photos/seed/trend6/400/300" },
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
                            className="flex-shrink-0 w-64 h-40 border-2 border-white/20 bg-black overflow-hidden hover:border-cyan-400 transition-all cursor-pointer group"
                        >
                            <div className="relative h-28 overflow-hidden">
                                <img
                                    src={prompt.image}
                                    alt={prompt.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                />
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 border border-white/40 text-[10px] font-mono font-bold">
                                    {prompt.model}
                                </div>
                            </div>
                            <div className="p-2">
                                <h3 className="text-xs font-bold tracking-tight line-clamp-1">{prompt.title}</h3>
                                <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground font-mono">
                                    <span className="flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-yellow-400" />
                                        {prompt.pqas}
                                    </span>
                                    <span>{prompt.forks} forks</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
