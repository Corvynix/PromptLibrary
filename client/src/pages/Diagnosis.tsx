import { useId, useState, type FormEvent } from "react";
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
  "كام شخص حددت كعميل محتمل؟",
  "كام شخص تواصلت معاه فعلًا؟",
  "كام شخص رد عليك؟",
  "كام شخص أبدى اهتمام واضح؟",
  "كام شخص طلب demo؟",
  "كام شخص بدأ تجربة؟",
  "كام شخص وصل لعرض أو مقترح؟",
  "كام شخص دفع؟",
  "كام شخص استخدم المنتج ووصل لأول نتيجة؟",
  "كام شخص استمر في الاستخدام؟",
  "إيه اللي قالوه أو عملوه فعلًا؟ (من غير بيانات شخصية)",
  "إيه اللي جربته لحد دلوقتي وإيه اللي حصل؟",
  "إنت شايف إيه السبب؟ (ده افتراضك مش دليل)؟",
];
const progressWidths = ["w-[6%]", "w-[12%]", "w-[18%]", "w-[24%]", "w-[30%]", "w-[36%]", "w-[42%]", "w-[48%]", "w-[54%]", "w-[60%]", "w-[66%]", "w-[72%]", "w-[78%]", "w-[84%]", "w-[90%]", "w-full"] as const;

const initial: DiagnosisInput = {
  whatBuilt: "", targetBuyer: "", isLive: false, talkedToRealPeople: false,
  repliesCount: 0, trialRequests: 0, paidCount: 0, topAction: "", spentMoney: false, whereStuck: "",
  prospects: 0, contacted: 0, interested: 0, demos: 0, trials: 0, proposals: 0, activated: 0, retained: 0,
  customerEvidence: "", founderHypothesis: "",
};

function getDiagnosisSessionId() {
  const key = "diagnosis_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export default function Diagnosis() {
  const [resultRoute, params] = useRoute("/diagnose/:id");
  return <TechShell logoText="أول بيعة">{resultRoute ? <DiagnosisResult id={params.id} /> : <DiagnosisForm />}</TechShell>;
}

function DiagnosisForm() {
  const [answers, setAnswers] = useState(() => ({ ...initial, sessionId: getDiagnosisSessionId() }));
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
            {step === 3 && <NumberAnswer label="إجمالي العملاء المحتملين اللي حددتهم" value={answers.prospects} onChange={(value) => update("prospects", value)} />}
            {step === 4 && <NumberAnswer label="محاولات التواصل" value={answers.contacted} onChange={(value) => { update("contacted", value); update("talkedToRealPeople", value > 0); }} />}
            {step === 5 && <NumberAnswer label="الردود" value={answers.repliesCount} onChange={(value) => update("repliesCount", value)} />}
            {step === 6 && <NumberAnswer label="المهتمون" value={answers.interested} onChange={(value) => update("interested", value)} />}
            {step === 7 && <NumberAnswer label="طلبات الـ demo" value={answers.demos} onChange={(value) => update("demos", value)} />}
            {step === 8 && <NumberAnswer label="التجارب" value={answers.trials} onChange={(value) => { update("trials", value); update("trialRequests", value); }} />}
            {step === 9 && <NumberAnswer label="العروض أو المقترحات" value={answers.proposals} onChange={(value) => update("proposals", value)} />}
            {step === 10 && <NumberAnswer label="المبيعات" value={answers.paidCount} onChange={(value) => update("paidCount", value)} />}
            {step === 11 && <NumberAnswer label="التفعيل لأول نتيجة" value={answers.activated} onChange={(value) => update("activated", value)} />}
            {step === 12 && <NumberAnswer label="الاستمرار في الاستخدام" value={answers.retained} onChange={(value) => update("retained", value)} />}
            {step === 13 && <Textarea autoFocus value={answers.customerEvidence} onChange={(e) => update("customerEvidence", e.target.value)} maxLength={4000} placeholder="احذف الأسماء وأي بيانات شخصية قبل اللصق" className="min-h-28 rounded-none" />}
            {step === 14 && <Textarea autoFocus value={answers.topAction} onChange={(e) => { update("topAction", e.target.value); update("whereStuck", e.target.value || "Not specified"); }} required maxLength={500} className="min-h-28 rounded-none" />}
            {step === 15 && <Textarea autoFocus value={answers.founderHypothesis} onChange={(e) => update("founderHypothesis", e.target.value)} maxLength={1000} className="min-h-28 rounded-none" />}
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
  return true;
}

function BooleanChoice({ value, onChange, yes, no }: { value: boolean; onChange: (value: boolean) => void; yes: string; no: string }) {
  const options: Array<[boolean, string]> = [[true, yes], [false, no]];
  return <div className="flex gap-3">{options.map(([choice, label]) => <Button key={String(choice)} type="button" variant={value === choice ? "default" : "outline"} className="rounded-none" onClick={() => onChange(choice)}>{label}</Button>)}</div>;
}

function NumberAnswer({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  const id = useId();
  return <div className="max-w-xs space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type="number" min={0} max={10000} step={1} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} className="rounded-none" /></div>;
}

function DiagnosisResult({ id }: { id?: string }) {
  const [, navigate] = useLocation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["diagnosis", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await fetch(`/api/diagnose/${id}`, { headers: {
        ...(localStorage.getItem("auth_token") ? { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } : {}),
        "x-diagnosis-session": getDiagnosisSessionId(),
      } });
      if (!response.ok) throw new Error("نتيجة التشخيص مش متاحة دلوقتي.");
      return response.json() as Promise<{ id: string; result: DiagnosisResult }>;
    },
  });
  if (isLoading) return <main dir="rtl" className="flex-1 p-8">بنحمّل النتيجة...</main>;
  if (error || !data) return <main dir="rtl" className="flex-1 p-8" role="alert">{error?.message || "النتيجة مش موجودة."}</main>;
  const report = data.result;
  return <main dir="rtl" className="flex-1 px-4 py-12 text-foreground"><div className="mx-auto max-w-2xl">
    <p className="text-sm text-muted-foreground">Sales Bug Report · التحليل الحتمي المحلي للخادم</p>
    <p className="text-sm text-muted-foreground">نتيجة أولية</p><h1 className="mt-3 text-3xl font-bold">{data.result.bottleneckAr}</h1>
    <p className="mt-4 leading-8">{data.result.bottleneckDescAr}</p><p className="mt-4 border-r-2 border-primary pr-4 text-sm text-muted-foreground">{data.result.disclaimer}</p>
    <Button className="mt-8 rounded-none" onClick={() => navigate(`/purchase?diagnosisId=${data.id}`)}>اعرف خطوات التحدي</Button>
    <ReportList title="الدليل المسجل" items={report.evidence.map((item) => `${item.statement} (${item.source}، ${item.strength})`)} />
    <ReportList title="اللي نعرفه" items={report.knownFacts} />
    <ReportList title="فرضيات صاحب المنتج" items={report.hypotheses} empty="مافيش فرضية مضافة." />
    <ReportList title="الدليل الناقص" items={report.missingEvidence} />
    <ReportList title="ما تغيّرش ده دلوقتي" items={report.doNotChangeYet} />
    <section className="mt-8 border-t border-foreground/20 pt-5"><h2 className="text-lg font-bold">أصلح ده الأول</h2><p className="mt-2">{report.fix.objective}</p><ul className="mt-3 list-inside list-disc space-y-2">{report.fix.actions.map((action) => <li key={action}>{action}</li>)}</ul></section>
    <section className="mt-8 border-t border-foreground/20 pt-5"><h2 className="text-lg font-bold">التجربة الجاية · عينة إرشادية {report.experiment.sampleSize}</h2><p className="mt-2">{report.experiment.hypothesis}</p><p className="mt-2">الفئة: {report.experiment.target}</p><p className="mt-2">التنفيذ: {report.experiment.action}</p><p className="mt-2">القياس: {report.experiment.metric}</p><p className="mt-2">إشارة نجاح: {report.experiment.successCondition}</p><p className="mt-2">إشارة عدم نجاح: {report.experiment.failureCondition}</p></section>
    <section className="mt-8 border-t border-foreground/20 pt-5"><h2 className="text-lg font-bold">معدلات القمع المحسوبة</h2><dl className="mt-3 grid grid-cols-2 gap-3">{Object.entries(report.funnel).map(([label, value]) => <div key={label} className="border border-foreground/20 p-3"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 font-mono">{value === null ? "غير متاح" : `${value}%`}</dd></div>)}</dl></section>
  </div></main>;
}

function ReportList({ title, items, empty = "مفيش بيانات مسجلة." }: { title: string; items: string[]; empty?: string }) {
  return <section className="mt-6 border-t border-foreground/20 pt-4"><h2 className="font-bold">{title}</h2>{items.length ? <ul className="mt-2 list-inside list-disc space-y-2 text-sm leading-7">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">{empty}</p>}</section>;
}
