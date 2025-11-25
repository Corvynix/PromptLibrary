import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function SearchHero() {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl mx-auto px-4 py-8"
        >
            <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isFocused ? 'text-cyan-400' : 'text-muted-foreground'}`} />
                <input
                    type="text"
                    placeholder="Find any prompt on Earth..."
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full h-14 pl-12 pr-4 bg-black text-white border-2 transition-all duration-300 focus:outline-none font-medium tracking-wide ${isFocused
                            ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                />
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3 font-mono tracking-wider">
                SEARCH 1,000,000+ PROMPTS ACROSS ALL INDUSTRIES
            </p>
        </motion.div>
    );
}
