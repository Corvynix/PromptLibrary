import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { landingData } from "@/data/landing";

export default function Faculty() {
  const { t } = useTranslation();
  return (
    <section id="faculty" className="py-20 px-6 bg-foreground/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">{t("faculty.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {landingData.faculty.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 border-2 border-foreground rounded-2xl flex flex-col gap-3 items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center font-black text-xl">
                {f.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="font-black tracking-tight">{f.name}</div>
              <div className="text-xs font-mono text-muted-foreground">{f.role}</div>
              <p className="text-sm text-muted-foreground">{f.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
