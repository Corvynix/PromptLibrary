import { motion } from "framer-motion";
import { landingData } from "@/data/landing";
import { Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">FROM THE COHORTS</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {landingData.testimonials.map((t, i) => (
          <motion.div
            key={t.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 border-2 border-foreground rounded-2xl flex flex-col gap-3"
          >
            <Quote className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm leading-relaxed">"{t.quote}"</p>
            <div className="mt-auto pt-3 border-t border-foreground/20">
              <div className="text-sm font-bold">{t.author}</div>
              <div className="text-xs font-mono text-muted-foreground">{t.role} · {t.cohort}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
