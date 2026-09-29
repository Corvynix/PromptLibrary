import { FormEvent, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Experiment = {
  id: string;
  hypothesis: string;
  audience: string;
  channel: string;
  message: string;
  sampleSize: number;
  metric: string;
  status: "planned" | "active" | "completed" | "cancelled";
  actualResult: string | null;
  interpretation: string | null;
  nextDecision: string | null;
};

export default function Experiments() {
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, Pick<Experiment, "actualResult" | "interpretation" | "nextDecision">>>({});
  const [error, setError] = useState("");
  const { data } = useQuery<{ experiments: Experiment[] }>({ queryKey: ["/api/experiments"] });

  function draft(experiment: Experiment) {
    return drafts[experiment.id] ?? {
      actualResult: experiment.actualResult,
      interpretation: experiment.interpretation,
      nextDecision: experiment.nextDecision,
    };
  }

  async function update(experiment: Experiment, status: Experiment["status"], event?: FormEvent) {
    event?.preventDefault(); setError("");
    try {
      await apiRequest("PATCH", `/api/experiments/${experiment.id}`, { ...draft(experiment), status });
      await queryClient.invalidateQueries({ queryKey: ["/api/experiments"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/diagnose/history"] });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save the experiment."); }
  }

  return <section dir="rtl" className="space-y-7">
    <header><h1 className="text-3xl font-bold">تجارب البيع</h1><p className="mt-2 text-sm text-muted-foreground">سجّل اللي حصل فعلًا، وحدد القرار اللي بعده.</p></header>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="divide-y divide-border">
      {data?.experiments.map((experiment) => {
        const values = draft(experiment);
        return <article key={experiment.id} className="space-y-4 py-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-mono text-muted-foreground">{experiment.status} · عينة إرشادية {experiment.sampleSize}</p><h2 className="mt-2 font-semibold">{experiment.hypothesis}</h2></div><p className="text-sm text-muted-foreground">{experiment.channel} · {experiment.audience}</p></div>
          <p className="text-sm leading-7">{experiment.message}</p><p className="text-sm"><span className="text-muted-foreground">المقياس: </span>{experiment.metric}</p>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => void update(experiment, "completed", event)}>
            <div className="space-y-2"><Label htmlFor={`result-${experiment.id}`}>النتيجة الفعلية</Label><Textarea id={`result-${experiment.id}`} required maxLength={4000} value={values.actualResult ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [experiment.id]: { ...values, actualResult: event.target.value } }))} className="min-h-20 rounded-none" /></div>
            <div className="space-y-2"><Label htmlFor={`meaning-${experiment.id}`}>تفسيرك للدليل</Label><Textarea id={`meaning-${experiment.id}`} required maxLength={2000} value={values.interpretation ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [experiment.id]: { ...values, interpretation: event.target.value } }))} className="min-h-20 rounded-none" /></div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor={`decision-${experiment.id}`}>القرار أو الخطوة الجاية</Label><Textarea id={`decision-${experiment.id}`} required maxLength={2000} value={values.nextDecision ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [experiment.id]: { ...values, nextDecision: event.target.value } }))} className="min-h-20 rounded-none" /></div>
            <div className="flex flex-wrap gap-3 sm:col-span-2"><Button type="submit" className="rounded-none">احفظ النتيجة واقفل التجربة</Button>{experiment.status === "planned" && <Button type="button" variant="outline" className="rounded-none" onClick={() => void update(experiment, "active")}>ابدأ التجربة</Button>}</div>
          </form>
        </article>;
      })}
      {data?.experiments.length === 0 && <p className="py-6 text-sm text-muted-foreground">مفيش تجارب محفوظة لسه. احفظ تجربة من تقرير التشخيص عشان تتابع نتيجتها هنا.</p>}
    </div>
  </section>;
}
