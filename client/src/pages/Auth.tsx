import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TechShell } from "@/components/layout/TechShell";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [, navigate] = useLocation();
  const { loginMutation, registerMutation } = useAuth();
  const pending = loginMutation.isPending || registerMutation.isPending;

  function getReturnTo() {
    const candidate = new URLSearchParams(window.location.search).get("returnTo");
    if (!candidate) return "/dashboard";
    try {
      const destination = new URL(candidate, window.location.origin);
      return destination.origin === window.location.origin
        ? `${destination.pathname}${destination.search}${destination.hash}`
        : "/dashboard";
    } catch {
      return "/dashboard";
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        await registerMutation.mutateAsync({ email, password, displayName });
        navigate("/onboarding");
      } else {
        await loginMutation.mutateAsync({ email, password });
        navigate(getReturnTo());
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "حصل خطأ. حاول تاني.");
    }
  }

  return (
    <TechShell logoText="أول بيعة"><main dir="rtl" className="flex-1 px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="text-lg font-bold">أول بيعة</Link>
        <h1 className="mt-10 text-3xl font-bold">{mode === "register" ? "ابدأ حسابك" : "أهلاً بيك تاني"}</h1>
        <p className="mt-2 text-muted-foreground">خلي خطوتك الجاية مبنية على كلام ناس حقيقية.</p>
        <form className="mt-8 space-y-5" onSubmit={submit}>
          {mode === "register" && <div className="space-y-2"><Label htmlFor="name">اسمك</Label><Input id="name" required minLength={2} maxLength={100} autoComplete="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="rounded-none" /></div>}
          <div className="space-y-2"><Label htmlFor="email">البريد الإلكتروني</Label><Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-none" /></div>
          <div className="space-y-2"><Label htmlFor="password">كلمة المرور</Label><Input id="password" type="password" required minLength={8} autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-none" /></div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button disabled={pending} className="w-full rounded-none" type="submit">{pending ? "لحظة..." : mode === "register" ? "إنشاء حساب" : "دخول"}</Button>
        </form>
        <button className="mt-6 text-sm underline underline-offset-4" type="button" onClick={() => { setError(""); setMode(mode === "register" ? "login" : "register"); }}>
          {mode === "register" ? "عندك حساب؟ سجل دخول" : "أول مرة هنا؟ أنشئ حساب"}
        </button>
      </div>
    </main></TechShell>
  );
}
