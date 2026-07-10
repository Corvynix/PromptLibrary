import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ApplyCTA() {
  return (
    <section id="apply" className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center p-12 border-2 border-foreground rounded-3xl bg-foreground text-background"
      >
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">COHORT 7 OPENS SEPTEMBER 2026.</h2>
        <p className="text-lg mb-8 opacity-80">24 seats. Applications reviewed on a rolling basis.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/apply">
            <Button size="lg" className="h-12 px-8 bg-background text-foreground border-2 border-foreground hover:bg-background/90 font-bold tracking-widest rounded-full">
              APPLY NOW
            </Button>
          </Link>
          <a href="mailto:admissions@koriq.education">
            <Button size="lg" variant="outline" className="h-12 px-8 border-2 border-background text-background hover:bg-background hover:text-foreground font-bold tracking-widest rounded-full">
              TALK TO ADMISSIONS
            </Button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
