import { LayoutGroup } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { TechShell } from "@/components/layout/TechShell";
import { SearchHero } from "@/components/landing/SearchHero";
import { Hero, StatsStrip, ProgramOverview, Outcomes, Curriculum, Faculty, Testimonials, FAQ, ApplyCTA } from "@/components/landing/sections";

export default function Landing() {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col p-4 md:p-6">
        {loading && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black"><div className="text-4xl md:text-6xl font-black tracking-tighter font-display text-white">أول بيعة</div></div>}
        <TechShell loading={loading} logoText="أول بيعة">
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
                <div className="text-2xl font-black tracking-tighter mb-6">أول بيعة</div>
                <nav className="flex flex-wrap justify-center gap-4 mb-6">
                  {[
                    { label: t("home.nav.terms"), href: "/terms" },
                    { label: t("home.nav.privacy"), href: "/privacy" },
                    { label: t("home.nav.refund"), href: "/refund" },
                    { label: t("home.nav.guidelines"), href: "/guidelines" },
                  ].map((link) => <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground font-mono tracking-wider border border-foreground/20 hover:border-foreground rounded-full px-4 py-1.5 transition-colors">{link.label}</Link>)}
                </nav>
                <div className="text-xs text-muted-foreground font-mono">{t("home.noGuarantee")}</div>
              </div>
            </footer>
          </div>
        </TechShell>
      </div>
    </LayoutGroup>
  );
}
