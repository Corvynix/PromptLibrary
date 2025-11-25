import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CarouselItem {
    id: number;
    title: string;
    subtitle: string;
    image: string;
}

export const CAROUSEL_ITEMS: CarouselItem[] = [
    {
        id: 1,
        title: "MIDJOURNEY_PRO",
        subtitle: "Image generation mastery",
        image: "https://picsum.photos/seed/midjourney/600/800",
    },
    {
        id: 2,
        title: "GPT_ENGINEERING",
        subtitle: "Code & architecture prompts",
        image: "https://picsum.photos/seed/coding/600/800",
    },
    {
        id: 3,
        title: "CLAUDE_ANALYSIS",
        subtitle: "Deep reasoning & research",
        image: "https://picsum.photos/seed/analysis/600/800",
    },
    {
        id: 4,
        title: "CONTENT_CREATION",
        subtitle: "Marketing & copywriting",
        image: "https://picsum.photos/seed/content/600/800",
    },
    {
        id: 5,
        title: "DATA_SCIENCE",
        subtitle: "Analytics & visualization",
        image: "https://picsum.photos/seed/data/600/800",
    },
];

interface FocusedCarouselProps {
    items: CarouselItem[];
    activeIndex: number;
}

export function FocusedCarousel({ items, activeIndex }: FocusedCarouselProps) {
    const getIndex = (offset: number) => {
        return (activeIndex + offset + items.length) % items.length;
    };

    return (
        <div className="w-full h-[55vh] flex items-center justify-center relative perspective-1000">
            <div className="flex items-center justify-center w-full max-w-7xl overflow-hidden py-10 relative">
                <AnimatePresence mode="popLayout">
                    {[-1, 0, 1].map((offset) => {
                        const index = getIndex(offset);
                        const item = items[index];
                        const isCenter = offset === 0;

                        return (
                            <motion.div
                                key={`${item.id}-${offset}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8, x: offset * 150 }}
                                animate={{
                                    opacity: isCenter ? 1 : 0.4,
                                    scale: isCenter ? 1.2 : 0.8,
                                    x: offset * 50,
                                    filter: isCenter ? "blur(0px) grayscale(0%)" : "blur(2px) grayscale(100%)",
                                    zIndex: isCenter ? 20 : 10,
                                    rotateY: offset * 15
                                }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className={cn(
                                    "relative flex-shrink-0 transition-all duration-500 flex flex-col items-center",
                                    isCenter ? "w-80" : "w-64"
                                )}
                            >
                                {/* Floating Artifact Container */}
                                <div className={cn(
                                    "relative w-full aspect-[3/4] mb-6 transition-all duration-500",
                                    isCenter ? "drop-shadow-2xl" : "drop-shadow-none"
                                )}>
                                    {/* Image Mask / Cutout Effect */}
                                    <div className="w-full h-full overflow-hidden rounded-2xl bg-transparent">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover mix-blend-normal"
                                            style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}
                                        />
                                    </div>
                                </div>

                                {/* Text Content (Only visible for center) */}
                                <motion.div
                                    className="text-center space-y-2"
                                    animate={{ opacity: isCenter ? 1 : 0, y: isCenter ? 0 : 20 }}
                                >
                                    <h3 className="text-3xl font-black tracking-tighter uppercase">{item.title}</h3>
                                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{item.subtitle}</p>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
