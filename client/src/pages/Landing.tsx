import { LayoutGroup } from "framer-motion";
import { TechShell } from "@/components/layout/TechShell";
import { SearchHero } from "@/components/landing/SearchHero";
import { useState, useEffect } from "react";
import { Hero, StatsStrip, ProgramOverview, Outcomes, Curriculum, Faculty, Testimonials, FAQ, ApplyCTA } from "@/components/landing/sections";

export default function Landing() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 20_000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col p-4 md:p-6">
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="text-4xl md:text-6xl font-black tracking-tighter font-display text-white">
              KORIQ
            </div>
          </div>
        )}
        <TechShell loading={loading} logoText="KORIQ">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <SearchHero />
            <Hero />
            <StatsStrip />
            <ProgramOverview />
            <Outcomes />
            <Curriculum />
            <Faculty />
            <Testimonials />
            <FAQ />
            <ApplyCTA />
            <footer className="py-12 px-6 border-t border-foreground/20">
              <div className="max-w-6xl mx-auto text-center">
                <div className="text-2xl font-black tracking-tighter mb-6">KORIQ</div>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {[
                    { label: "About", href: "/about" },
                    { label: "Terms", href: "/terms" },
                    { label: "Privacy", href: "/privacy" },
                    { label: "Support", href: "/support" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground font-mono tracking-wider border border-foreground/20 hover:border-foreground rounded-full px-4 py-1.5 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground font-mono">© 2026 Koriq. All rights reserved.</div>
              </div>
            </footer>
          </div>
        </TechShell>
      </div>
    </LayoutGroup>
  );
}
