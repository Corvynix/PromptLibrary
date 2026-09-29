import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Faculty() {
  const { t } = useTranslation();
  return (
    <section id="faculty" className="py-20 px-6 bg-foreground/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">{t("home.principlesTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(t("home.principles", { returnObjects: true }) as Array<{ title: string; body: string; role: string }>).map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 border-2 border-foreground rounded-2xl flex flex-col gap-3 items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center font-black text-xl">
                {f.title.split(" ").map((word) => word[0]).join("").slice(0, 2)}
              </div>
              <div className="font-black tracking-tight">{f.title}</div>
              <div className="text-xs font-mono text-muted-foreground">{f.role}</div>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
