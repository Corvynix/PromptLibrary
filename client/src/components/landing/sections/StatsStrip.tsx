import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function StatsStrip() {
  const { t } = useTranslation();
  const stats = [
    { label: t("stats.salaryLift"), value: "+38%", note: t("stats.salaryNote") },
    { label: t("stats.cohortSize"), value: "24", note: t("stats.cohortNote") },
    { label: t("stats.duration"), value: "12", note: t("stats.durationNote") },
    { label: t("stats.partners"), value: "120+", note: t("stats.partnersNote") },
  ];
  return (
    <section id="stats" className="py-12 px-6 border-y border-foreground/20">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-1 p-4 border border-foreground/20 rounded-2xl bg-background/50"
          >
            <div className="text-3xl md:text-4xl font-black tracking-tighter">{stat.value}</div>
            <div className="text-sm font-bold tracking-wider uppercase">{stat.label}</div>
            <div className="text-xs text-muted-foreground font-mono">{stat.note}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
