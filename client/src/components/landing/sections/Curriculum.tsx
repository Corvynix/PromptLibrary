import { motion } from "framer-motion";
import { landingData } from "@/data/landing";

export default function Curriculum() {
  return (
    <section id="curriculum" className="py-20 px-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">THE CURRICULUM</h2>
      <div className="flex flex-col gap-6">
        {landingData.curriculum.map((q, i) => (
          <motion.div
            key={q.quarter}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-6 items-start"
          >
            <div className="flex-shrink-0 w-20 text-center">
              <div className="text-2xl font-black tracking-tighter">{q.quarter}</div>
              <div className="text-xs font-mono text-muted-foreground">{q.title}</div>
            </div>
            <div className="flex-1 border-l-2 border-foreground/30 pl-6 py-2">
              <ul className="flex flex-col gap-1">
                {q.modules.map((m) => (
                  <li key={m} className="text-sm font-mono">— {m}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
