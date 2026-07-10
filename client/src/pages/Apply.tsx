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
          </h1>
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
