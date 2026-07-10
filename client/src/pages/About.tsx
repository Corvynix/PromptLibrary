import { TechShell } from "@/components/layout/TechShell";

export default function About() {
  return (
    <TechShell logoText="KORIQ">
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="text-center py-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">KORIQ</h1>
          <p className="text-xl text-muted-foreground font-medium">The MBA, redesigned for builders.</p>
        </div>
        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-black tracking-tight mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">Koriq exists because the traditional MBA was built for a different era. We built it for the age of software, leverage, and builder-driven careers. Our program puts case clinics and founder-ready frameworks at the center — not theory.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black tracking-tight mb-4">The Koriq Difference</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>→ Small cohorts of 24, not lecture halls of 500</li>
              <li>→ Cases you ship in public, not Harvard HBS downloads</li>
              <li>→ A builder alumni network that actually helps</li>
              <li>→ 10× lower tuition than a top-10 MBA</li>
            </ul>
          </section>
        </div>
      </div>
    </TechShell>
  );
}
