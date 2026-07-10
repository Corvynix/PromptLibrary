import { motion } from "framer-motion";
import { landingData } from "@/data/landing";
import { TrendingUp, Users, Clock, Building2 } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
};

export default function StatsStrip() {
  return (
    <section id="stats" className="py-12 px-6 border-y border-foreground/20">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {landingData.stats.map((stat) => (
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
