import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AdUnitProps {
    className?: string;
    size?: "banner" | "card" | "medium-rect";
    format?: "horizontal" | "vertical" | "square";
    label?: string;
}

export function AdUnit({
    className,
    size = "card",
    format = "square",
    label = "Sponsored"
}: AdUnitProps) {
    // Mock ad content placeholders
    const adContent = {
        title: "Level Up Your AI Workflow",
        description: "Get access to 10,000+ premium prompts and exclusive tools.",
        cta: "Learn More",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
    };

    if (size === "banner") {
        return (
            <div className={cn("w-full relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-1", className)}>
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] uppercase font-bold text-white/50 tracking-wider">
                    {label}
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-6">
                    <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-bold text-white">{adContent.title}</h3>
                        <p className="text-sm text-muted-foreground">{adContent.description}</p>
                    </div>
                    <button className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 transition-colors">
                        {adContent.cta}
                    </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/10 bg-black/40 group cursor-pointer",
                "flex flex-col h-full",
                className
            )}
        >
            {/* Label */}
            <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] uppercase font-bold text-white/70 tracking-wider border border-white/5">
                {label}
            </div>

            {/* Image Area */}
            <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                <img
                    src={adContent.image}
                    alt="Ad"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-1 space-y-3">
                <div>
                    <div className="text-xs font-medium text-blue-400 mb-1">Recommended</div>
                    <h3 className="font-bold text-lg leading-tight text-white group-hover:text-blue-400 transition-colors">
                        {adContent.title}
                    </h3>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                    {adContent.description}
                </p>

                <div className="mt-auto pt-4">
                    <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-white group-hover:bg-white group-hover:text-black transition-all">
                        {adContent.cta}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
