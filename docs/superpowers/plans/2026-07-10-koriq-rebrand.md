# Koriq Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent- driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand PromptsLoop → Koriq, pivot to an MBA marketing site. Preserve the TechShell chassis, Framer Motion animations, dark/glass visual language. Delete the prompts/feed/ community product surface. Rebuild Landing as an MBA funnel. Add stub `/apply` form.

**Architecture:** Single-frontend SPA served by a thin Express backend. Landing page composes 9 section components. Server routes pruned to only auth skeleton + new `POST /api/apply`. Shared schema slimmed to `users` + new `applications` table.

**Tech Stack:** React 18, Vite, Tailwind CSS, Framer Motion, TanStack Query, Express, Drizzle ORM, PostgreSQL, Zod, Supertest/Vitest.

---

## Global Constraints

- Brand: every visible `PromptsLoop` / `PROMPTSLOOP` / `PromptLibrary` → `Koriq` / `KORIQ`.
- Tagline: "The MBA, redesigned for builders."
- Package name: `koriq`.
- Meta title: `Koriq - The MBA, Redesigned for Builders`.
- Copyright: `© 2026 Koriq`.
- No new animations added. All existing Framer Motion / TechShell animations preserved.
- No analytics, no CRM, no payment. Stub only.
- `npm run check` must pass. `npm run test:unit` must pass.
- Deleted files: removed from disk AND from imports in `App.tsx` and `routes. ts`.

---

## File Manifest (Pre-task)

### New files created in order

| File | Task |
|---|---|
| `client/src/data/landing. ts` | 1 |
| `client/src/lib/apply. ts` | 2 |
| `client/src/components/landing/sections/Hero. tsx` | 2 |
| `client/src/components/landing/sections/StatsStrip. tsx` | 2 |
| `client/src/components/landing/sections/ProgramOverview. tsx` | 2 |
| `client/src/components/landing/sections/Outcomes. tsx` | 2 |
| `client/src/components/landing/sections/Curriculum. tsx` | 2 |
| `client/src/components/landing/sections/Faculty. tsx` | 2 |
| `client/src/components/landing/sections/Testimonials. tsx` | 2 |
| `client/src/components/landing/sections/FAQ. tsx` | 2 |
| `client/src/components/landing/sections/ApplyCTA. tsx` | 2 |
| `client/src/components/landing/sections/index. ts` | 2 |
| `client/src/pages/Apply. tsx` | 3 |
| `client/src/__tests__/landing-renders. test. tsx` | 3 |
| `shared/schema. ts` (rewritten) | 3 |
| `server/routes/apply. ts` | 3 |
| `server/__tests__/apply. test. ts` | 3 |

### Files deleted entirely

`client/src/pages/Feed. tsx`, `PromptDetail. tsx`, `CreatePrompt. tsx`, `RemixEditor. tsx`, `Profile. tsx`, `AdminDashboard. tsx`, `client/src/pages/community/` (entire dir), `client/src/pages/ discovery/` (entire dir), `client/src/pages/content/` (entire dir), `client/src/pages/monetization/Sponsored. tsx`, `client/src/components/PromptCard. tsx`, `RemixGraph. tsx`, `AppSidebar. tsx`, `client/src/components/landing/PromptOfDay. tsx`, `CategorySections. tsx`, `TopCreators. tsx`, `RecentRemixes. tsx`, `TrendingStrip. tsx`, `TagCloud. tsx`, `SocialProof. tsx`.

### Files rewritten

`client/index. html`, `client/src/App. tsx`, `client/src/components/layout/TechShell. tsx`, `client/src/components/landing/SearchHero. tsx`, `client/src/components/landing/UploadCTA. tsx`, `client/src/index. css`, `client/src/pages/Landing. tsx`, `client/src/pages/About. tsx`, `client/src/pages/Terms. tsx`, `client/src/pages/Privacy. tsx`, `client/src/pages/Support. tsx`, `client/src/pages/Auth. tsx`, all files under `client/src/pages/auth/`, `client/src/pages/user/`, `client/src/pages/legal/`, `client/src/pages/system/`, `server/routes. ts`, `server/storage. ts`, `server/seed. ts`, `shared/schema. ts`, `package. json`, `README. md`, `replit. md`.

---

## Task 1: Create landing data file

**Files:**
- Create: `client/src/data/landing. ts`

**Content:**

```typescript
export const landingData = {
  stats: [
    { label: "Avg Salary Lift", value: "+38%", note: "within 12 months" },
    { label: "Cohort Size", value: "24", note: "builders per cohort" },
    { label: "Duration", value: "12", note: "months to completion" },
    { label: "Hiring Partners", value: "120+", note: "VCs & startups" },
  ],
  modules: [
    { id: "strategy", title: "Strategy", icon: "Target", description: "Market sizing, competitive analysis, go-to-market.", outcomes: ["Launch roadmap", "Competitor framework", "GTM playbook"] },
    { id: "product", title: "Product", icon: "Boxes", description: "Customer discovery, rapid prototyping, metrics that matter.", outcomes: ["PRD templates", "Cohort analysis", "A/B framework"] },
    { id: "finance", title: "Finance", icon: "TrendingUp", description: "Unit economics, fundraising, cap table mechanics.", outcomes: ["Financial model", "Term sheet decoder", "Investor stack"] },
    { id: "leadership", title: "Leadership", icon: "Users", description: "Team building, culture, managing up and down.", outcomes: ["Operating docs", "Comp framework", "Culture blueprint"] },
  ],
  outcomes: [
    { label: "Salary uplift", value: "+38%", note: "median within 12mo of graduation" },
    { label: "Founder rate", value: "23%", note: "of cohort started a company within 18mo" },
    { label: "Promotions", value: "41%", note: "received a title change or equity grant" },
    { label: "Network lift", value: "3.2×", note: "new meaningful professional connections" },
  ],
  curriculum: [
    { quarter: "Q1", title: "Foundations", modules: ["Customer discovery", "Market mapping", "First principles thinking"] },
    { quarter: "Q2", title: "Build", modules: ["Prototyping sprints", "Cohort analysis", "Metrics & instrumentation"] },
    { quarter: "Q3", title: "Operate", modules: ["Unit economics deep-dive", "Fundraising mechanics", "Team & culture"] },
    { quarter: "Q4", title: "Capstone", modules: ["Final case clinic", "Demo day", "Alumni network activation"] },
  ],
  faculty: [
    { name: "Maya Chen", role: "Former Partner, Sequoia Capital", bio: "15 years investing in B2B SaaS. Led Series A for 12 companies." },
    { name: "James Okafor", role: "Founder & CEO, ScaleOps ($240M raised)", bio: "Built and sold 2 companies. Bootstrapped ScaleOps to $40M ARR." },
    { name: "Sara Lindstrom", role: "Ex-McKinsey, Ex-Stripe", bio: "Strategic finance lead at Stripe EMEA. Built Stripe Atlas program." },
  ],
  testimonials: [
    { quote: "Koriq compressed 2 years of business education into 12 months. The cohort network alone was worth the tuition.", author: "Tariq A.", role: "Software Engineer to Founder", cohort: "Cohort 3" },
    { quote: "I negotiated a 60% raise using frameworks I learned in Q2. The finance module alone paid for the program.", author: "Priya M.", role: "Product Manager to VP Product", cohort: "Cohort 4" },
    { quote: "The case clinics were unlike anything in a traditional MBA. Every session was a live teardown of a real company we were building.", author: "Daniel R.", role: "Consultant to CTO", cohort: "Cohort 5" },
  ],
  faq: [
    { q: "What background do I need?", a: "We admit engineers, designers, analysts, and operators with 2+ years of experience. No prior business education required." },
    { q: "Is this online or in-person?", a: "Fully remote. Live sessions run twice a week in the evenings (UTC). All case material is on demand." },
    { q: "How much does Koriq cost?", a: "Tuition is $18,000 paid upfront, or $20,000 in three installments. Need-based deferred payment available." },
    { q: "Is there a refund policy?", a: "Full refund within the first 14 days if you're not satisfied. No questions asked." },
    { q: "What do I get at completion?", a: "Koriq certificate, access to the alumni network, and a capstone portfolio you built in public." },
    { q: "How is this different from a traditional MBA?", a: "Half the cost, 10x more technical. Built for builders who want strategic fluency without a 2-year pause." },
  ],
};
```

- [ ] **Step 1: Create directory + write file**
```bash
mkdir -p /Users/mac/Documents/GitHub/PromptLibrary/client/src/data
```
Write `client/src/data/landing. ts` with the content above.

- [ ] **Step 2: Commit**
```bash
git add client/src/data/landing. ts && git commit -m "feat(landing): add typed MBA content data"
```

---

## Task 2: Build 9 landing section components + rewrite Landing. tsx

**Files:**
- Create: `client/src/components/landing/sections/` (9 files + index. ts)
- Create: `client/src/lib/apply. ts`
- Modify: `client/src/pages/Landing. tsx`
- Create: `client/src/__tests__/landing-renders. test. tsx`

**`client/src/lib/apply. ts`**

```typescript
export interface ApplyPayload {
  name: string;
  email: string;
  background: "engineer" | "designer" | "founder" | "analyst" | "other";
  message: string;
}

export async function submitApplication(
  payload: ApplyPayload
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const res = await fetch("/api/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    return { ok: false, error: data.error ?? "Submission failed" };
  }
  const data = (await res.json()) as { ok: boolean; id?: string };
  return { ok: true, id: data.id };
}
```

**`client/src/components/landing/sections/index. ts`**

```typescript
export { default as Hero } from "./Hero";
export { default as StatsStrip } from "./StatsStrip";
export { default as ProgramOverview } from "./ProgramOverview";
export { default as Outcomes } from "./Outcomes";
export { default as Curriculum } from "./Curriculum";
export { default as Faculty } from "./Faculty";
export { default as Testimonials } from "./Testimonials";
export { default as FAQ } from "./FAQ";
export { default as ApplyCTA } from "./ApplyCTA";
```

**`client/src/components/landing/sections/Hero. tsx`**

```tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Hero() {
  return (
    <div id="hero" className="text-center py-16 px-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="text-4xl md:text-6xl font- black tracking-tighter leading-tight mb-4">
          THE MBA,<br />REDESIGNED FOR BUILDERS.
        </h1>
        <p className="text-lg text-muted-foreground font-medium mb-8">
          Twelve months. Small cohorts. Cases shipped in public.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/apply">
            <Button size="lg" className="h-12 px-8 bg-foreground text-background border-2 border-foreground hover:bg-foreground/90 font-bold tracking-widest rounded-full">
              APPLY NOW
            </Button>
          </Link>
          <a href="#curriculum">
            <Button size="lg" variant="outline" className="h-12 px-8 border-2 border-foreground hover:bg-foreground hover:text- background font-bold tracking-widest rounded-full">
              VIEW CURRICULUM
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
```

**`client/src/components/landing/sections/StatsStrip. tsx`**

```tsx
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
            className="flex flex-col items-center gap-1 p-4 border border-foreground/20 rounded-2xl bg- background/50"
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
```

**`client/src/components/landing/sections/ProgramOverview. tsx`**

```tsx
import { motion } from "framer-motion";
import { landingData } from "@/data/landing";
import { Target, Boxes, TrendingUp, Users } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Target: <Target className="w-8 h-8" />,
  Boxes: <Boxes className="w-8 h-8" />,
  TrendingUp: <TrendingUp className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
};

export default function ProgramOverview() {
  return (
    <section id="program" className="py-20 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">FOUR MODULES. ZERO FLUFF.</h2>
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
            <div className="text-xs font-bold tracking-wider uppercase text-muted-foreground mt-2">Outcomes</div>
            <ul className="flex flex-col gap-1">
              {mod.outcomes.map((o) => (
                <li key={o} className="text-sm font-mono">-&gt; {o}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

**`client/src/components/landing/sections/Outcomes. tsx`**

```tsx
import { motion } from "framer-motion";
import { landingData } from "@/data/landing";

export default function Outcomes() {
  return (
    <section id="outcomes" className="py-20 px-6 bg-foreground/5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">OUTCOMES THAT SPEAK FOR THEMSELVES</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {landingData.outcomes.map((o, i) => (
            <motion.div
              key={o.label}
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
```

**`client/src/components/landing/sections/Curriculum. tsx`**

```tsx
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
```

**`client/src/components/landing/sections/Faculty. tsx`**

```tsx
import { motion } from "framer-motion";
import { landingData } from "@/data/landing";

export default function Faculty() {
  return (
    <section id="faculty" className="py-20 px-6 bg-foreground/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">YOUR FACULTY</h2>
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
```

**`client/src/components/landing/sections/Testimonials. tsx`**

```tsx
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
```

**`client/src/components/landing/sections/FAQ. tsx`**

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { landingData } from "@/data/landing";

export default function FAQ() {
  return (
    <section id="faq" className="py-20 px-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-black tracking-tighter mb-10 text-center">FAQ</h2>
      <Accordion type="single" collapsible className="w-full">
        {landingData.faq.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-bold tracking-wide">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">{item. a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
```

**`client/src/components/landing/sections/ApplyCTA. tsx`**

```tsx
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
```

**`client/src/pages/Landing. tsx`** (full replacement)

```tsx
import { LayoutGroup } from "framer-motion";
import { TechShell } from "@/components/layout/TechShell";
import { SearchHero } from "@/components/landing/SearchHero";
import { useState, useEffect } from "react";
import { Hero, StatsStrip, ProgramOverview, Outcomes, Curriculum, Faculty, Testimonials, FAQ, ApplyCTA } from "@/components/landing/sections";

export default function Landing() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 20_000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col p-4 md:p-6">
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="text-4xl md:text-6xl font-black tracking-tighter font-display text-white">
              KORIQ
            </div>
          </div>
        )}
        <TechShell loading={loading} logoText="KORIQ">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <SearchHero />
            <Hero />
            <StatsStrip />
            <ProgramOverview />
            <Outcomes />
            <Curriculum />
            <Faculty />
            <Testimonials />
            <FAQ />
            <ApplyCTA />
            <footer className="py-12 px-6 border-t border-foreground/20">
              <div className="max-w-6xl mx-auto text-center">
                <div className="text-2xl font-black tracking-tighter mb-6">KORIQ</div>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {[
                    { label: "About", href: "/about" },
                    { label: "Terms", href: "/terms" },
                    { label: "Privacy", href: "/privacy" },
                    { label: "Support", href: "/support" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground font-mono tracking-wider border border-foreground/20 hover:border-foreground rounded-full px-4 py-1.5 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground font-mono">© 2026 Koriq. All rights reserved.</div>
              </div>
            </footer>
          </div>
        </TechShell>
      </div>
    </LayoutGroup>
  );
}
```

**`client/src/__tests__/landing-renders. test. tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "wouter";
import Landing from "@/pages/Landing";

const queryClient = new QueryClient();

function renderLanding() {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Landing page", () => {
  it("renders hero headline", () => {
    renderLanding();
    expect(document. body.textContent).toContain("THE MBA");
  });

  it("renders stats strip", () => {
    renderLanding();
    expect(document.body.textContent).toContain("Cohort Size");
  });

  it("renders all 8 section anchors", () => {
    renderLanding();
    expect(document.querySelector("#stats")).toBeInTheDocument();
    expect(document.querySelector("#program")).toBeInTheDocument();
    expect(document.querySelector("#outcomes")).toBeInTheDocument();
    expect(document.querySelector("#curriculum")).toBeInTheDocument();
    expect(document.querySelector("#faculty")).toBeInTheDocument();
    expect(document.querySelector("#testimonials")).toBeInTheDocument();
    expect(document.querySelector("#faq")).toBeInTheDocument();
    expect(document.querySelector("#apply")).toBeInTheDocument();
  });
});
```

- [ ] **Step 1: Create sections directory**
```bash
mkdir -p /Users/mac/Documents/GitHub/PromptLibrary/client/src/components/landing/sections
```
- [ ] **Step 2: Write all files** — `index.ts`, 9 section components, `apply.ts`, rewritten `Landing. tsx`, `landing-renders.test. tsx`.
- [ ] **Step 3: Run tsc check**
```bash
npm run check
```
Expected: no errors.
- [ ] **Step 4: Run landing test**
```bash
npm run test:unit -- --run client/src/__tests__/landing-renders.test.tsx
```
Expected: PASS (all 3).
- [ ] **Step 5: Commit**
```bash
git add client/src/data/ client/src/lib/apply. ts client/src/components/landing/sections/ client/src/__tests__/landing-renders.test.tsx client/src/pages/Landing. tsx
git commit -m "feat(landing): add 9 MBA-funnel sections and typed landing data"
```

---

## Task 3: Build Apply page + backend stub

**Files:**
- Create: `client/src/pages/Apply. tsx`
- Create: `server/routes/apply. ts`
- Create: `server/__tests__/apply. test. ts`
- Modify: `server/routes. ts` (add apply router mount, remove deleted module imports/mounts)
- Modify: `server/storage. ts` (add applications table + IStorage method + MemStorage impl)
- Modify: `shared/schema. ts` (rewrite with only users + applications tables)

**`client/src/pages/Apply. tsx`**

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { submitApplication } from "@/lib/apply";
import type { ApplyPayload } from "@/lib/apply";

const BACKGROUNDS = [
  { value: "engineer", label: "Software Engineer" },
  { value: "designer", label: "Designer" },
  { value: "founder", label: "Founder / Co-founder" },
  { value: "analyst", label: "Analyst / Consultant" },
  { value: "other", label: "Other" },
] as const;

export default function Apply() {
  const [form, setForm] = useState<ApplyPayload>({ name: "", email: "", background: "engineer", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    const result = await submitApplication(form);
    if (result.ok) { setStatus("success"); }
    else { setStatus("error"); setErrorMsg(result.error ?? "Something went wrong."); }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="text-5xl font-black tracking-tighter">KORIQ</div>
          <h1 className="text-2xl font-bold">Application received.</h1>
          <p className="text-muted-foreground">We'll review your application and be in touch within 5 business days.</p>
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="rounded-full font-bold tracking-wider">
            BACK TO HOME
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <div className="text-2xl font-black tracking-tighter mb-2">KORIQ</div>
          <h1 className="text-3xl font-black tracking-tight">Apply to Cohort 7</h1>
          <p className="text-muted-foreground mt-2">Applications reviewed on a rolling basis.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold tracking-wide" htmlFor="name">Full name</label>
            <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-12 px-4 border-2 border-foreground/30 rounded-full bg-background text-foreground focus:outline-none focus:border-foreground transition-colors font-medium"
              placeholder="Your full name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold tracking-wide" htmlFor="email">Work email</label>
            <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-12 px-4 border-2 border-foreground/30 rounded-full bg-background text-foreground focus:outline-none focus:border-foreground transition-colors font-medium"
              placeholder="you@company.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold tracking-wide" htmlFor="background">Background</label>
            <select id="background" value={form.background}
              onChange={(e) => setForm({ ...form, background: e.target.value as ApplyPayload["background"] })}
              className="w-full h-12 px-4 border-2 border-foreground/30 rounded-full bg-background text-foreground focus:outline-none focus:border-foreground transition-colors font-medium">
              {BACKGROUNDS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold tracking-wide" htmlFor="message">Why Koriq? (max 800 characters)</label>
            <textarea id="message" required maxLength={800} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full min-h-[120px] p-4 border-2 border-foreground/30 rounded-2xl bg-background text-foreground focus:outline-none focus:border-foreground transition-colors font-medium resize-none"
              placeholder="Tell us about your background and what you're hoping to get out of Koriq." />
            <div className="text-xs text-muted-foreground text-right font-mono">{form.message.length}/800</div>
          </div>
          {status === "error" && <div className="p-4 border-2 border-red-500/50 rounded-xl text-red-500 text-sm font-mono">{errorMsg}</div>}
          <Button type="submit" disabled={status === "submitting"}
            className="w-full h-12 bg-foreground text-background font-bold tracking-widest rounded-full hover:bg-foreground/90 transition-colors disabled:opacity-50">
            {status === "submitting" ? <Loader2 className="w-5 h-5 animate-spin" /> : "SUBMIT APPLICATION"}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

**`shared/schema. ts`** (rewrite — only users + applications)

```typescript
import { sql } from "drizzle-orm";
import { pgTable, text, boolean, timestamp, serial, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_ name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  roles: text("roles").default(sql`'["user"]'::text`).notNull(),
  karmaScore: text("karma_score").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isBanned: boolean("is_banned").default(false).notNull(),
}, (table) => ({ emailIdx: uniqueIndex("users_email_idx").on(table.email) }));

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  background: text("background").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertApplicationSchema = createInsertSchema(applications);
export const selectApplicationSchema = createSelectSchema(applications);
export type Application = z.infer<typeof selectApplicationSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
```

**`server/storage. ts`** — add to IStorage and MemStorage:

In the `IStorage` interface add:
```typescript
createApplication(app: InsertApplication): Promise<Application>;
```

In the `MemStorage` class add:
```typescript
private applications: Application[] = [];
async createApplication(app: InsertApplication): Promise<Application> {
  const row: Application = { ...app, id: crypto.randomUUID() as any, createdAt: new Date() };
  this.applications.push(row);
  return row;
}
```

**`server/routes/apply. ts`**

```typescript
import { Router, Request, Response } from "express";
import { insertApplicationSchema } from "@shared/schema";
import { storage } from "../storage";

const router = Router();

const applyBodySchema = insertApplicationSchema.omit({ id: true, createdAt: true });

router.post("/", async (req: Request, res: Response) => {
  const parsed = applyBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid application data", details: parsed.error.flatten() });
    return;
  }
  try {
    const app = await storage.createApplication(parsed.data);
    res.status(201).json({ ok: true, id: app.id });
  } catch (err) {
    console.error("Application submission error:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

export default router;
```

**`server/routes. ts`** — add to imports: `import applyRouter from "./routes/apply";` and mount: `app.use("/api/apply", applyRouter);`. Remove ALL imports and `app.use(...)` lines for deleted modules (prompts, comments, votes, badges, karma, sponsors, leaderboard, stats, admin, workflow, search, tags, remix, notifications, usageLogs, referrals, executionLogs, adminSettings).

**`server/__tests__/apply. test. ts`**

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createServer } from "../app";

let app: ReturnType<typeof createServer>;

beforeAll(() => { app = createServer(); });

describe("POST /api/apply", () => {
  it("accepts a valid application and returns 201", async () => {
    const res = await request(app).post("/api/apply").send({
      name: "Tariq Ahmed", email: "tariq@example.com", background: "engineer",
      message: "I want to transition from IC to founder.",
    });
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.id).toBeDefined();
  });

  it("rejects a missing name with 400", async () => {
    const res = await request(app).post("/api/apply").send({ email: "bad@example.com", background: "engineer", message: "Hi" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("rejects an invalid email with 400", async () => {
    const res = await request(app).post("/api/apply").send({ name: "Test", email: "not-an-email", background: "founder", message: "Hi" });
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 1: Rewrite shared/schema. ts** with only users + applications tables.
- [ ] **Step 2: Add createApplication to server/storage. ts** — IStorage interface + MemStorage class.
- [ ] **Step 3: Create server/routes/apply. ts**.
- [ ] **Step 4: Update server/routes. ts** — add apply import/mount, remove all deleted route imports/mounts.
- [ ] **Step 5: Create server/__tests__/apply. test. ts**.
- [ ] **Step 6: Run tsc check** — `npm run check`. Expected: no errors.
- [ ] **Step 7: Run apply tests** — `npm run test:unit -- --run server/__tests__/apply.test.ts`. Expected: PASS.
- [ ] **Step 8: Commit**
```bash
git add shared/schema. ts server/routes/apply. ts server/__tests__/apply. test. ts server/storage. ts server/routes. ts
git commit -m "feat(api): add POST /api/apply stub with validation"
```

---

## Task 4: Brand sweep — meta, package.json, README, TechShell, SearchHero, UploadCTA, index.css, App. tsx

**Files:**
- Modify: `client/index. html`, `client/src/App. tsx`, `client/src/components/layout/TechShell. tsx`, `client/src/components/landing/SearchHero. tsx`, `client/src/components/landing/UploadCTA. tsx`, `client/src/index. css`, `package. json`, `README. md`, `replit. md`

**`client/index. html`** — replace title, description, og tags:
```html
<title>Koriq - The MBA, Redesigned for Builders</title>
<meta name="description" content="Koriq is a focused, builder-first MBA program. Real cases, small cohorts, measurable outcomes." />
<meta property="og:title" content="Koriq - The MBA, Redesigned for Builders" />
<meta property="og:description" content="Twelve months. Small cohorts. Cases shipped in public." />
```

**`client/src/components/layout/TechShell. tsx`** — make these exact changes:

Line 27 — `logoText` default prop:
```typescript
logoText = "KORIQ"
```

Lines 33-39 — `NAV_ITEMS` array:
```typescript
const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "PROGRAM", href: "/#program" },
  { label: "OUTCOMES", href: "/#outcomes" },
  { label: "CURRICULUM", href: "/#curriculum" },
  { label: "FAQ", href: "/#faq" },
];
```

Lines 145-157 — remove the `currentUser ?` conditional, always show LOGIN:
```typescript
<Link href="/login">
  <Button size="sm" className="rounded-full font-bold tracking-wider px-6">
    LOGIN
  </Button>
</Link>
```

**`client/src/components/landing/SearchHero. tsx`** — replace placeholder and subline text:
```typescript
placeholder="What kind of builder are you?"
// and
SEARCH ACROSS 12 MODULES, 200+ CASES
```

**`client/src/components/landing/UploadCTA. tsx`** — replace Plus icon with GraduationCap, href to /apply:
```tsx
import { GraduationCap } from "lucide-react";
// ...
<Link href="/apply">
  <motion.button ... >
    <GraduationCap className="w-8 h-8 group-hover:rotate-12 transition-transform" />
    <span className="sr-only">Apply to Koriq</span>
  </motion.button>
</Link>
```

**`client/src/index. css`** — add wordmark utility:
```css
.koriq-wordmark {
  font-family: var(--font-mono);
  letter-spacing: -0.05em;
  font-weight: 800;
}
```

**`client/src/App. tsx`** — prune lazy imports for all deleted pages (Feed, PromptDetail, CreatePrompt, RemixEditor, Profile, AdminDashboard, Terms, Privacy, Support, Cookies, AdsDisclosure, Sponsored, Leaderboard, TagDetail, Search, Categories, ForgotPassword, VerifyEmail, Onboarding, Settings, Notifications, ActivityFeed, Connections, VersionHistory, WorkflowBuilder, Community, CommentThread, Hashtags). Add:
```typescript
const Apply = lazy(() => import("@/pages/Apply"));
```
Add route:
```tsx
<Route path="/apply" component={Apply} />
```

**`package. json`** — change `"name": "rest-express"` to `"name": "koriq"`.

**`README. md`** — rewrite as Koriq one-pager: one-liner, 4 feature bullets, quick start, tech stack, copyright. See existing README structure; replace PromptsLoop content with Koriq MBA content.

- [ ] **Step 1: Run brand grep to find all files needing changes**
```bash
rg -i "promptsloop|promptlibrary|PromptLibrary|PROMPTSLOOP" client/ server/ shared/ --glob '!node_modules' -l
```
- [ ] **Step 2: Apply brand replacements** in each file found.
- [ ] **Step 3: Rewrite App. tsx** — prune deleted imports, add Apply.
- [ ] **Step 4: Rewrite README. md** — Koriq content.
- [ ] **Step 5: Run tsc check** — `npm run check`. Expected: no errors.
- [ ] **Step 6: Commit**
```bash
git add client/index. html client/src/App. tsx client/src/components/layout/TechShell. tsx client/src/components/landing/SearchHero. tsx client/src/components/landing/UploadCTA. tsx client/src/index. css package. json README. md replit. md
git commit -m "branding: sweep PromptsLoop to Koriq across all files"
```

---

## Task 5: Rewrite About, Terms, Privacy, Support, and all stub pages

**Files:**
- Rewrite: `client/src/pages/About. tsx` (full rewrite — 2-section mission + difference)
- Rebrand only: `client/src/pages/Terms. tsx`, `Privacy. tsx`, `Support. tsx`, `client/src/pages/system/Changelog. tsx`, `ApiDocs. tsx`, `ServerError. tsx`, `Maintenance. tsx`
- Stub: `client/src/pages/Auth. tsx`, `auth/ForgotPassword. tsx`, `auth/VerifyEmail. tsx`, `auth/Onboarding. tsx`, `user/Settings. tsx`, `user/Notifications. tsx`, `user/ActivityFeed. tsx`, `user/Connections. tsx`, `legal/Cookies. tsx`, `legal/AdsDisclosure. tsx`

**`client/src/pages/About. tsx`** (full rewrite):

```tsx
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
```

**Stub pattern** (for Auth, ForgotPassword, VerifyEmail, Onboarding, Settings, Notifications, ActivityFeed, Connections, Cookies, AdsDisclosure):

```tsx
export default function Xxx() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-4xl font-black tracking-tighter mb-4">KORIQ</div>
        <h1 className="text-2xl font-bold mb-4">Coming soon.</h1>
        <p className="text-muted-foreground mb-6">This section is available to enrolled students. Applications for Cohort 7 are open at <a href="/apply" className="underline">/apply</a>.</p>
        <a href="/" className="text-sm font-mono text-muted-foreground hover:text-foreground">← Back to home</a>
      </div>
    </div>
  );
}
```

- [ ] **Step 1: Rewrite About. tsx**
- [ ] **Step 2: Update brand strings in Terms, Privacy, Support, Changelog, ApiDocs** (brand name swap; remove any prompt- library product references)
- [ ] **Step 3: Replace body of Auth, ForgotPassword, VerifyEmail, Onboarding, Settings, Notifications, ActivityFeed, Connections, Cookies, AdsDisclosure, ServerError, Maintenance** with the stub pattern above
- [ ] **Step 4: Commit**
```bash
git add client/src/pages/About. tsx client/src/pages/Terms. tsx client/src/pages/Privacy. tsx client/src/pages/Support. tsx client/src/pages/Auth. tsx client/src/pages/auth/ client/src/pages/user/ client/src/pages/legal/ client/src/pages/system/
git commit -m "content: rewrite all kept pages for Koriq MBA brand"
```

---

## Task 6: Delete removed page/component files

**Files:** All files listed in File Manifest under "Files deleted"

```bash
rm -f client/src/pages/Feed. tsx client/src/pages/PromptDetail. tsx client/src/pages/CreatePrompt. tsx client/src/pages/RemixEditor. tsx client/src/pages/Profile. tsx client/src/pages/AdminDashboard. tsx
rm -rf client/src/pages/ community/ client/src/pages/ discovery/ client/src/pages/ content/
rm -f client/src/components/PromptCard. tsx client/src/components/RemixGraph. tsx client/src/components/AppSidebar. tsx
rm -f client/src/components/landing/PromptOfDay. tsx client/src/components/landing/CategorySections. tsx client/src/components/landing/TopCreators. tsx client/src/components/landing/RecentRemixes. tsx client/src/components/landing/TrendingStrip. tsx client/src/components/landing/TagCloud. tsx client/src/components/landing/SocialProof. tsx
rm -f client/src/pages/monetization/Sponsored. tsx
```

- [ ] **Step 1: Delete all files/directories** using the commands above.
- [ ] **Step 2: Run tsc check** — `npm run check`. Expected: no errors. Fix any remaining imports in App. tsx or routes. ts.
- [ ] **Step 3: Commit**
```bash
git add -A && git commit -m "chore: delete removed prompt-library pages and components"
```

---

## Task 7: Server cleanup — prune routes. ts, storage. ts, seed. ts

**Files:**
- Rewrite: `server/routes. ts` (keep only auth + apply), `server/storage. ts` (keep only users + applications + createApplication), `server/seed. ts` (remove all prompt seeding)

In `server/routes. ts`:
- Keep import of auth router if it exists: `import authRouter from "./routes/auth";`
- Keep `app.use("/api/auth", authRouter);`
- Keep `import applyRouter from "./routes/apply";` and `app.use("/api/apply", applyRouter);`
- Remove EVERY other import and `app.use(...)`. This means removing imports and registrations for: prompts, promptVersions, comments, votes, bookmarks, follows, badges, userBadges, karma, sponsors, leaderboard, stats, admin, workflow, search, tags, remix, notifications, usageLogs, referrals, executionLogs, adminSettings.

In `server/storage. ts`:
- In `IStorage` interface: keep only `getUser`, `getUserByEmail`, `createUser`, `updateUser`, `getAllUsers`, `getGlobalStats` (return `{}`), and the new `createApplication`. Remove all prompt/comment/vote/badge/karma/storage methods.
- In `MemStorage` class: remove all implementations for deleted methods. Keep the `users` array and `applications` array. `getGlobalStats` should return `{}`.

In `server/seed. ts`:
- Remove all calls to `seedPrompts`, `seedBadges`, etc. Keep only `createUser` if needed for a stub admin user, or remove all seeding.

- [ ] **Step 1: Rewrite server/routes. ts** — keep only auth + apply registrations.
- [ ] **Step 2: Slim server/storage. ts** — remove all deleted storage methods from interface and class.
- [ ] **Step 3: Rewrite server/seed. ts** — remove all prompt/badge seeding.
- [ ] **Step 4: Run tsc check** — `npm run check`. Expected: no errors.
- [ ] **Step 5: Run full test suite** — `npm run test:unit -- --run`. Expected: all pass.
- [ ] **Step 6: Commit**
```bash
git add server/routes. ts server/storage. ts server/seed. ts
git commit -m "chore(server): remove prompt-library routes and prune storage interface"
```

---

## Task 8: Final brand audit

```bash
rg -i "promptsloop|promptlibrary|PromptLibrary|PROMPTSLOOP" client/ src/ server/ shared/ --glob '!node_modules' --glob '!attached_assets/*' --glob '!.git/*'
```

Expected: zero matches.

If any matches found, fix them and commit.

```bash
npm run check && npm run test:unit -- --run
```

Expected: both pass.

```bash
git add -A && git commit -m "chore: final brand audit - no PromptsLoop remaining"
```

---

## Self-Review Checklist

**Spec coverage:** All 15 spec sections have a task. Landing rebuilt (Task 2), Apply + API (Task 3), brand sweep (Task 4), page rewrites (Task 5), file deletion (Task 6), server cleanup (Task 7), final audit (Task 8).

**Placeholder scan:** No `TBD`, `TODO`, "add appropriate", "handle edge cases", or "similar to task N" found in the plan steps.

**Type consistency:** `submitApplication` in `client/src/lib/apply. ts` matches `applyBodySchema` in `server/routes/apply. ts`. `Application` and `InsertApplication` in `shared/schema. ts` match `createApplication` signature in `server/storage. ts`. All section components consume `landingData` from the single `client/src/data/landing. ts` export. No naming drift across tasks.