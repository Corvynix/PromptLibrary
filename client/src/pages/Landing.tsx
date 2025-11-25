
import { motion, LayoutGroup } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FocusedCarousel, CAROUSEL_ITEMS } from "@/components/ui/focused-carousel";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { TechShell } from "@/components/layout/TechShell";

export default function Landing() {
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col p-4 md:p-6">

        {/* Splash Screen State */}
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId="logo"
              className="text-4xl md:text-6xl font-black tracking-tighter font-display text-white"
            >
              PROMPTLIBRARY
            </motion.div>
          </motion.div>
        )}

        <TechShell loading={loading}>
          {/* Navigation Toggles */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 group"
          >
            <div
              className="w-16 h-64 bg-black text-white flex items-center justify-center group-hover:w-20 transition-all shadow-2xl"
              style={{ clipPath: "polygon(0 0, 100% 35%, 100% 65%, 0 100%)" }}
            >
              <ChevronLeft className="w-10 h-10 -ml-2" />
            </div>
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 group"
          >
            <div
              className="w-16 h-64 bg-black text-white flex items-center justify-center group-hover:w-20 transition-all shadow-2xl"
              style={{ clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0 65%)" }}
            >
              <ChevronRight className="w-10 h-10 -mr-2" />
            </div>
          </button>

          <div className="flex-1 flex flex-col justify-center items-center relative">
            {/* Background Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
              <h1
                className="text-[18vw] font-black font-display text-transparent whitespace-nowrap select-none"
                style={{ WebkitTextStroke: "2px var(--foreground)", opacity: 0.08 }}
              >
                PROMPTS
              </h1>
            </div>

            <FocusedCarousel items={CAROUSEL_ITEMS} activeIndex={activeIndex} />
          </div>

          {/* Footer / Callout */}
          <footer className="relative z-20 px-6 md:px-12 py-8 flex flex-col md:flex-row items-end justify-between gap-8">
            {/* Bottom Left: Title */}
            <div className="max-w-md">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase">
                AI Prompt<br />
                Library
              </h2>
              <div className="mt-4 flex items-center gap-2">
                <div className="px-3 py-1 border border-foreground rounded-full text-[10px] font-mono font-bold">BETA</div>
                <div className="px-3 py-1 border border-foreground rounded-full text-[10px] font-mono font-bold">2025</div>
              </div>
            </div>

            {/* Bottom Right: CTA */}
            <div className="flex flex-col items-end gap-4 max-w-xs text-right">
              <p className="text-xs text-muted-foreground leading-relaxed font-medium uppercase tracking-wide">
                Discover, Create & Share<br />
                Professional AI Prompts.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-foreground" />
                <Link href="/feed">
                  <Button size="lg" className="rounded-full h-12 px-6 text-sm font-bold tracking-widest bg-foreground text-background hover:bg-foreground/90 flex items-center gap-2 group">
                    EXPLORE PROMPTS
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </footer>
        </TechShell>
      </div>
    </LayoutGroup>
  );
}
