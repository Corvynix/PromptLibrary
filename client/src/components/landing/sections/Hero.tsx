import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <div id="hero" className="text-center py-16 px-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <p className="text-xs font-mono tracking-wider text-muted-foreground mb-4">{t("home.eyebrow")}</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-4 whitespace-pre-line">
          {t("home.title")}
        </h1>
        <p className="text-lg text-muted-foreground font-medium mb-8">
          {t("home.subtitle")}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/diagnose">
            <Button size="lg" className="h-12 px-8 bg-foreground text-background border-2 border-foreground hover:bg-foreground/90 font-bold tracking-widest rounded-full">
              {t("home.cta")}
            </Button>
          </Link>
          <a href="#curriculum">
            <Button size="lg" variant="outline" className="h-12 px-8 border-2 border-foreground hover:bg-foreground hover:text-background font-bold tracking-widest rounded-full">
              {t("home.secondary")}
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
