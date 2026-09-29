import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Outcomes() {
  const { t } = useTranslation();
  return (
    <section id="outcomes" className="py-20 px-6 bg-foreground/5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">{t("home.outcomeTitle")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(t("home.outcomes", { returnObjects: true }) as Array<{ value: string; label: string; note: string }>).map((o, i) => (
            <motion.div
              key={o.value}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 border-2 border-foreground rounded-2xl flex flex-col gap-2 text-center"
            >
              <div className="text-4xl font-black tracking-tighter">{o.value}</div>
              <div className="text-sm font-bold">{o.label}</div>
              <div className="text-xs text-muted-foreground font-mono mt-1">{o.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
