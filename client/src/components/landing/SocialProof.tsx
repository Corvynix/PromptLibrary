import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export function SocialProof() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="py-12 px-6 border-t border-white/10"
        >
            <div className="flex items-center justify-center gap-8 text-center flex-wrap">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <span className="text-2xl font-black">1,000,000+</span>
                    <span className="text-sm text-muted-foreground font-mono">PROMPTS</span>
                </div>
                <div className="w-1 h-8 bg-white/20" />
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">100,000</span>
                    <span className="text-sm text-muted-foreground font-mono">CREATORS</span>
                </div>
                <div className="w-1 h-8 bg-white/20" />
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">72</span>
                    <span className="text-sm text-muted-foreground font-mono">INDUSTRIES</span>
                </div>
            </div>
        </motion.div>
    );
}
