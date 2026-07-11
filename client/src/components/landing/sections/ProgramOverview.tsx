import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Target, Boxes, TrendingUp, Users } from "lucide-react";
import { landingData } from "@/data/landing";

const iconMap: Record<string, React.ReactNode> = {
  Target: <Target className="w-8 h-8" />,
  Boxes: <Boxes className="w-8 h-8" />,
  TrendingUp: <TrendingUp className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
};

export default function ProgramOverview() {
  const { t } = useTranslation();
  return (
    <section id="program" className="py-20 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">{t("program.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {landingData.modules.map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 border-2 border-foreground rounded-2xl flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              {iconMap[mod.icon]}
              <h3 className="text-xl font-black tracking-tight">{mod.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{mod.description}</p>
            <div className="text-xs font-bold tracking-wider uppercase text-muted-foreground mt-2">{t("program.outcomes")}</div>
            <ul className="flex flex-col gap-1">
              {mod.outcomes.map((o) => (
                <li key={o} className="text-sm font-mono">→ {o}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
