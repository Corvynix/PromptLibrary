import { motion, LayoutGroup } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { TechShell } from "@/components/layout/TechShell";
import { SearchHero } from "@/components/landing/SearchHero";
import { TrendingStrip } from "@/components/landing/TrendingStrip";
import { CategorySections } from "@/components/landing/CategorySections";
import { PromptOfDay } from "@/components/landing/PromptOfDay";
import { UploadCTA } from "@/components/landing/UploadCTA";
import { TopCreators } from "@/components/landing/TopCreators";
import { RecentRemixes } from "@/components/landing/RecentRemixes";
import { TagCloud } from "@/components/landing/TagCloud";
import { SocialProof } from "@/components/landing/SocialProof";

export default function Landing() {
  const [loading, setLoading] = useState(true);

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
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Instant Search Bar */}
            <SearchHero />

            {/* Hero Section */}
            <div className="text-center py-12 px-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-4">
                  THE WORLD'S<br />
                  PROMPT LIBRARY
                </h1>
                <p className="text-lg text-muted-foreground font-medium mb-8">
                  Every Prompt. Any Model. Free Forever.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/feed">
                    <Button size="lg" className="h-12 px-8 bg-white text-black hover:bg-white/90 font-bold tracking-widest">
                      START EXPLORING
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button size="lg" variant="outline" className="h-12 px-8 border-2 border-white hover:bg-white hover:text-black font-bold tracking-widest">
                      UPLOAD A PROMPT
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Live Trending Strip */}
            <TrendingStrip />

            {/* Prompt of the Day */}
            <PromptOfDay />

            {/* Industry Categories */}
            <div className="px-6">
              <CategorySections />
            </div>

            {/* Top Creators */}
            <TopCreators />

            {/* Recent Remixes */}
            <RecentRemixes />

            {/* Tag Cloud */}
            <TagCloud />

            {/* Social Proof */}
            <SocialProof />

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/10">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
                  {[
                    { label: "About", href: "/about" },
                    { label: "Terms", href: "/terms" },
                    { label: "Privacy", href: "/privacy" },
                    { label: "Upload", href: "/create" },
                    { label: "Browse", href: "/feed" },
                    { label: "Support", href: "/support" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-white transition-colors font-mono tracking-wider"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="text-center text-xs text-muted-foreground font-mono">
                  © 2025 PROMPTLIBRARY. ALL RIGHTS RESERVED.
                </div>
              </div>
            </footer>
          </div>

          {/* Sticky Upload CTA */}
          <UploadCTA />
        </TechShell>
      </div>
    </LayoutGroup>
  );
}
