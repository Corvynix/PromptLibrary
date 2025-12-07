import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { PromptCard, Prompt } from "@/components/PromptCard";

const PROMPT_OF_DAY: Prompt = {
    id: 999,
    slug: "hyper-realistic-portrait",
    title: "Hyper Realistic Portrait Gen",
    shortDesc: "Create stunning, magazine-quality portraits with perfect lighting, depth of field, and emotional depth. Optimized for Midjourney v6.1 with cinematic presets.",
    type: "Image",
    industryTags: ["Art", "Photography"],
    socialTags: ["#midjourney", "#portrait"],
    totalUses: 15420,
    totalLikes: 1234,
    owner: {
        id: 42,
        displayName: "Prompt Wizard",
        email: "wizard@example.com",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wizard",
        verified: true
    },
    thumbnail: "https://picsum.photos/seed/potd/400/500",
    modelCompatibility: ["Midjourney V6"],
    difficulty: "Expert",
    popularityScore: 100,
    version: "v6.1",
    commentCount: 89,
    license: "CC-BY",
    tokenCount: 45,
    lastUpdated: "24h ago"
};

export function PromptOfDay() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="py-16 px-6"
        >
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-12">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <h2 className="text-2xl font-black tracking-widest uppercase">PROMPT OF THE DAY</h2>
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>

                <div className="flex justify-center relative">
                    {/* Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative w-[380px] h-[500px]">
                        <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-[2rem] blur opacity-50 animate-pulse" />
                        <PromptCard
                            prompt={PROMPT_OF_DAY}
                            className="h-full w-full relative z-10 shadow-2xl"
                        />

                        {/* Featured Badge */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                            <div className="bg-yellow-400 text-black text-[10px] font-black tracking-widest uppercase px-4 py-1 rounded-full shadow-lg border-2 border-black">
                                FEATURED
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
