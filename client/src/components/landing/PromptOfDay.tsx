import { motion } from "framer-motion";
import { Star, Zap, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromptOfDay() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="py-16 px-6"
        >
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <h2 className="text-2xl font-black tracking-widest uppercase">PROMPT OF THE DAY</h2>
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>

                <div className="border-4 border-cyan-400 bg-black p-8 shadow-[0_0_40px_rgba(34,211,238,0.3)] relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-400 text-black text-xs font-black tracking-widest">
                        FEATURED
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                            <img
                                src="https://picsum.photos/seed/potd/400/500"
                                alt="Prompt of the Day"
                                className="w-full h-64 md:h-full object-cover border-2 border-white/20"
                            />
                        </div>

                        <div className="md:w-2/3 space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 border border-white/40 text-[10px] font-mono font-bold">MIDJOURNEY</span>
                                    <span className="flex items-center gap-1 text-sm font-mono">
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                        <span className="font-black">98</span>
                                        <span className="text-muted-foreground text-xs">PQAS</span>
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black tracking-tight leading-tight">
                                    Hyper-Realistic Portrait Generator
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                    Create stunning, magazine-quality portraits with perfect lighting, depth of field, and emotional depth. Optimized for Midjourney v6.1 with cinematic presets.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                                <span>By <span className="text-white font-bold">@prompt_wizard</span></span>
                                <span>•</span>
                                <span>1,234 forks</span>
                                <span>•</span>
                                <span>24h ago</span>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button className="flex-1 bg-white text-black hover:bg-white/90 font-bold tracking-widest h-12 border-2 border-white">
                                    VIEW PROMPT
                                </Button>
                                <Button variant="outline" className="px-6 h-12 border-2 border-white hover:bg-white hover:text-black font-bold">
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
