import { FormEvent, useState } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Onboarding() {
  const [name, setName] = useState("");
  const [buyer, setBuyer] = useState("");
  const [problem, setProblem] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [, navigate] = useLocation();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await apiRequest("POST", "/api/auth/onboarding", { targetAudience: buyer, whatBuilt: name, builderStatus: "trying_to_sell" });
      await apiRequest("POST", "/api/projects", {
        name,
        description: problem,
        targetAudience: buyer,
        url: url || undefined,
        stage: "trying_to_sell",
      });
      navigate("/dashboard");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "حصل خطأ. حاول تاني.");
    } finally {
      setPending(false);
    }
  }

  return <main dir="rtl" className="min-h-screen bg-background px-4 py-10 text-foreground"><div className="mx-auto max-w-xl">
    <a href="/" className="font-bold">أول بيعة</a>
    <h1 className="mt-10 text-3xl font-bold">ابدأ بمشروعك</h1>
    <p className="mt-2 text-muted-foreground">هنستخدم التفاصيل دي عشان نحدد الخطوة الجاية.</p>
    <form className="mt-8 space-y-5" onSubmit={submit}>
      <div className="space-y-2"><Label htmlFor="project">إيه اللي بنيته؟</Label><Input id="project" required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="rounded-none" /></div>
      <div className="space-y-2"><Label htmlFor="problem">بيحل مشكلة إيه؟</Label><Textarea id="problem" required maxLength={1000} value={problem} onChange={(e) => setProblem(e.target.value)} className="min-h-24 rounded-none" /></div>
      <div className="space-y-2"><Label htmlFor="buyer">مين المفروض يستخدمه أو يشتريه؟</Label><Input id="buyer" required maxLength={300} value={buyer} onChange={(e) => setBuyer(e.target.value)} className="rounded-none" /></div>
      <div className="space-y-2"><Label htmlFor="url">رابط المنتج لو متاح</Label><Input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="rounded-none" /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button disabled={pending} className="w-full rounded-none">{pending ? "بنحفظ..." : "احفظ وكمّل"}</Button>
    </form>
  </div></main>;
}
