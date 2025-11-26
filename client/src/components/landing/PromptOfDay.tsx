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

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-30 blur-lg group-hover:opacity-50 transition duration-1000" />
                    <div className="border-2 border-cyan-400 bg-black p-8 relative z-10">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-400 text-black text-xs font-black tracking-widest uppercase">
                            FEATURED PROMPT
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/3 relative group/image">
                                <div className="absolute inset-0 bg-cyan-400/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
                                <img
                                    src="https://picsum.photos/seed/potd/400/500"
                                    alt="Prompt of the Day"
                                    className="w-full h-64 md:h-full object-cover border-2 border-white/20 group-hover/image:border-cyan-400 transition-colors duration-500"
                                />
                            </div>

                            <div className="md:w-2/3 space-y-6 flex flex-col justify-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 border border-cyan-500/50 text-cyan-400 text-[10px] font-mono font-bold tracking-wider bg-cyan-950/30">
                                            MIDJOURNEY V6
                                        </span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-white mb-4 group-hover:text-cyan-100 transition-colors">
                                        HYPER REALISTIC<br />PORTRAIT GEN
                                    </h3>
                                    <p className="text-base text-muted-foreground leading-relaxed font-medium max-w-lg">
                                        Create stunning, magazine-quality portraits with perfect lighting, depth of field, and emotional depth. Optimized for Midjourney v6.1 with cinematic presets.
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono border-y border-white/10 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-cyan-900 rounded-none flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/30">
                                            P
                                        </div>
                                        <span className="text-white font-bold tracking-wider">@PROMPT_WIZARD</span>
                                    </div>
                                    <span>•</span>
                                    <span className="text-cyan-400">1,234 FORKS</span>
                                    <span>•</span>
                                    <span>24H AGO</span>
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <Button className="flex-1 bg-white text-black hover:bg-cyan-400 hover:text-black font-black tracking-widest h-14 text-lg border-2 border-white rounded-none transition-all duration-300">
                                        VIEW PROMPT
                                    </Button>
                                    <Button variant="outline" className="px-8 h-14 border-2 border-white/20 hover:border-cyan-400 hover:bg-cyan-950/30 hover:text-cyan-400 font-bold rounded-none transition-all duration-300">
                                        <Copy className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
