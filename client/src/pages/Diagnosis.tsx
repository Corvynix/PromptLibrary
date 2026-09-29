import { useState, type FormEvent } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DiagnosisInput, DiagnosisResult } from "@shared/types";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TechShell } from "@/components/layout/TechShell";

const questions = [
  "إيه اللي بنيته؟",
  "مين المفروض يشتريه؟",
  "هل المنتج متاح للتجربة دلوقتي؟",
  "هل اتكلمت مع ناس فعلية عنه؟",
  "كام شخص رد عليك؟",
  "كام شخص طلب يجربه أو يشوف demo؟",
  "كام شخص دفع؟",
  "إيه أكتر حاجة عملتها عشان تبيعه؟",
  "هل دفعت فلوس قبل كده عشان توصل لعملاء؟",
  "إيه أكبر حاجة موقفاك؟",
];
const progressWidths = ["w-[10%]", "w-[20%]", "w-[30%]", "w-[40%]", "w-1/2", "w-[60%]", "w-[70%]", "w-[80%]", "w-[90%]", "w-full"] as const;

const initial: DiagnosisInput = {
  whatBuilt: "", targetBuyer: "", isLive: false, talkedToRealPeople: false,
  repliesCount: 0, trialRequests: 0, paidCount: 0, topAction: "", spentMoney: false, whereStuck: "",
};

export default function Diagnosis() {
  const [resultRoute, params] = useRoute("/diagnose/:id");
  return <TechShell logoText="أول بيعة">{resultRoute ? <DiagnosisResult id={params.id} /> : <DiagnosisForm />}</TechShell>;
}

function DiagnosisForm() {
  const [answers, setAnswers] = useState(initial);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [, navigate] = useLocation();

  function update<K extends keyof DiagnosisInput>(key: K, value: DiagnosisInput[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await apiRequest("POST", "/api/diagnose", answers);
      const data = await response.json() as { id: string };
      navigate(`/diagnose/${data.id}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "حصل خطأ. حاول تاني.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main dir="rtl" className="flex-1 px-4 py-10 text-foreground">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="font-bold">أول بيعة</a>
        <div className="mt-10 flex items-center justify-between text-sm text-muted-foreground"><span>التشخيص المجاني</span><span>{step + 1} / {questions.length}</span></div>
        <div className="mt-3 h-1 bg-muted" role="progressbar" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={step + 1}><div className={`h-full bg-primary ${progressWidths[step]}`} /></div>
        <form className="mt-8" onSubmit={submit}>
          <h1 className="text-2xl font-bold">{questions[step]}</h1>
          <div className="mt-6 space-y-2">
            {step === 0 && <Input autoFocus value={answers.whatBuilt} onChange={(e) => update("whatBuilt", e.target.value)} required maxLength={300} placeholder="مثال: أداة لتنظيم طلبات المتاجر" className="rounded-none" />}
            {step === 1 && <Input autoFocus value={answers.targetBuyer} onChange={(e) => update("targetBuyer", e.target.value)} required maxLength={300} placeholder="مثال: أصحاب المتاجر الصغيرة" className="rounded-none" />}
            {step === 2 && <BooleanChoice value={answers.isLive} onChange={(value) => update("isLive", value)} yes="آه، متاح" no="لسه" />}
            {step === 3 && <BooleanChoice value={answers.talkedToRealPeople} onChange={(value) => update("talkedToRealPeople", value)} yes="آه" no="لأ" />}
            {step === 4 && <NumberAnswer label="عدد الردود" value={answers.repliesCount} onChange={(value) => update("repliesCount", value)} />}
            {step === 5 && <NumberAnswer label="طلبات التجربة أو الـ demo" value={answers.trialRequests} onChange={(value) => update("trialRequests", value)} />}
            {step === 6 && <NumberAnswer label="المبيعات" value={answers.paidCount} onChange={(value) => update("paidCount", value)} />}
            {step === 7 && <Textarea autoFocus value={answers.topAction} onChange={(e) => update("topAction", e.target.value)} required maxLength={500} className="min-h-28 rounded-none" />}
            {step === 8 && <BooleanChoice value={answers.spentMoney} onChange={(value) => update("spentMoney", value)} yes="آه" no="لأ" />}
            {step === 9 && <Textarea autoFocus value={answers.whereStuck} onChange={(e) => update("whereStuck", e.target.value)} required maxLength={500} className="min-h-28 rounded-none" />}
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
          <div className="mt-8 flex justify-between gap-3">
            <Button type="button" variant="outline" className="rounded-none" disabled={step === 0 || pending} onClick={() => setStep(step - 1)}><ArrowRight className="ml-2 h-4 w-4" />السابق</Button>
            {step < questions.length - 1
              ? <Button type="button" className="rounded-none" onClick={() => setStep(step + 1)} disabled={!canAdvance(step, answers)}>التالي<ArrowLeft className="mr-2 h-4 w-4" /></Button>
              : <Button type="submit" className="rounded-none" disabled={pending}>{pending ? "بنحلل إجاباتك..." : "شوف النتيجة"}</Button>}
          </div>
        </form>
      </div>
    </main>
  );
}

function canAdvance(step: number, answers: DiagnosisInput) {
  if (step === 0) return answers.whatBuilt.trim().length > 0;
  if (step === 1) return answers.targetBuyer.trim().length > 0;
  if (step === 7) return answers.topAction.trim().length > 0;
  return true;
}

function BooleanChoice({ value, onChange, yes, no }: { value: boolean; onChange: (value: boolean) => void; yes: string; no: string }) {
  const options: Array<[boolean, string]> = [[true, yes], [false, no]];
  return <div className="flex gap-3">{options.map(([choice, label]) => <Button key={String(choice)} type="button" variant={value === choice ? "default" : "outline"} className="rounded-none" onClick={() => onChange(choice)}>{label}</Button>)}</div>;
}

function NumberAnswer({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <div className="max-w-xs space-y-2"><Label htmlFor="count">{label}</Label><Input id="count" type="number" min={0} max={10000} step={1} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} className="rounded-none" /></div>;
}

function DiagnosisResult({ id }: { id?: string }) {
  const [, navigate] = useLocation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["diagnosis", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await fetch(`/api/diagnose/${id}`);
      if (!response.ok) throw new Error("نتيجة التشخيص مش متاحة دلوقتي.");
      return response.json() as Promise<{ id: string; result: DiagnosisResult }>;
    },
  });
  if (isLoading) return <main dir="rtl" className="flex-1 p-8">بنحمّل النتيجة...</main>;
  if (error || !data) return <main dir="rtl" className="flex-1 p-8" role="alert">{error?.message || "النتيجة مش موجودة."}</main>;
  return <main dir="rtl" className="flex-1 px-4 py-12 text-foreground"><div className="mx-auto max-w-2xl">
    <p className="text-sm text-muted-foreground">نتيجة أولية</p><h1 className="mt-3 text-3xl font-bold">{data.result.bottleneckAr}</h1>
    <p className="mt-4 leading-8">{data.result.bottleneckDescAr}</p><p className="mt-4 border-r-2 border-primary pr-4 text-sm text-muted-foreground">{data.result.disclaimer}</p>
    <Button className="mt-8 rounded-none" onClick={() => navigate(`/purchase?diagnosisId=${data.id}`)}>اعرف خطوات التحدي</Button>
  </div></main>;
}
