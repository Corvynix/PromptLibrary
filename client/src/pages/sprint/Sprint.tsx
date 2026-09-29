import { FormEvent, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { SprintDay } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Enrollment = { id: string; currentDay: number; status: string };
type SprintData = { enrollment: Enrollment | null; entries?: Array<{ dayNumber: number; isCompleted: boolean }> };
type DayData = { days: SprintDay[] };

export default function SprintPages() {
  const [dayRoute, dayParams] = useRoute("/sprint/day/:dayNumber");
  const [crmRoute] = useRoute("/sprint/crm");
  const [paymentRoute] = useRoute("/payment/status");
  if (crmRoute) return <Prospects />;
  if (paymentRoute) return <PaymentStatus />;
  return dayRoute ? <SprintDay dayNumber={Number(dayParams?.dayNumber)} /> : <SprintHome />;
}

function SprintHome() {
  const queryClient = useQueryClient();
  const { data: sprint } = useQuery<SprintData>({ queryKey: ["/api/sprint/enrollment"] });
  const { data: access } = useQuery<{ hasAccess: boolean }>({ queryKey: ["/api/sprint/access"] });
  const { data: days } = useQuery<DayData>({ queryKey: ["/api/sprint/days"] });
  const [error, setError] = useState("");
  const current = sprint?.enrollment?.currentDay;
  const next = current === undefined ? null : days?.days.find((day) => day.dayNumber === current);

  async function start() {
    setError("");
    try {
      await apiRequest("POST", "/api/sprint/start", {});
      await queryClient.invalidateQueries({ queryKey: ["/api/sprint/enrollment"] });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "حصل خطأ."); }
  }

  return <section dir="rtl" className="space-y-8"><header><p className="text-sm text-muted-foreground">تحدي عملي</p><h1 className="mt-2 text-3xl font-bold">أول تجربة بيع في 7 أيام</h1><p className="mt-3 max-w-2xl leading-7">الهدف تنفيذ أول تجربة بيع حقيقية والحصول على evidence واضح. كل يوم بيطلعك بخطوة تقدر تنفذها مع عميل محتمل.</p></header>
    {next ? <div className="border-y border-border py-6"><h2 className="text-xl font-semibold">اليوم {next.dayNumber}: {next.titleAr}</h2><p className="mt-2">{next.missionAr}</p><Button asChild className="mt-5 rounded-none"><Link href={`/sprint/day/${next.dayNumber}`}>ابدأ الخطوة</Link></Button><Link href="/sprint/crm" className="mr-5 text-sm underline">سجل العملاء المحتملين</Link></div>
      : sprint?.enrollment?.status === "completed" ? <p className="border-y border-border py-6">خلصت التحدي. راجع الدليل اللي جمعته وحدد التجربة اللي بعدها.</p>
        : access?.hasAccess ? <div className="border-y border-border py-6"><p>وصول التحدي متاح لحسابك.</p><Button className="mt-4 rounded-none" onClick={start}>ابدأ اليوم صفر</Button></div>
          : <div className="border-y border-border py-6"><p>ابدأ بالتشخيص المجاني عشان تحدد نقطة البداية.</p><Button asChild className="mt-4 rounded-none"><Link href="/purchase">تفاصيل وطريقة الاشتراك</Link></Button></div>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <ol className="divide-y divide-border">{days?.days.map((day) => <li key={day.id} className="flex items-start justify-between gap-4 py-4"><div><p className="text-xs text-muted-foreground">اليوم {day.dayNumber}</p><p className="mt-1 font-medium">{day.titleAr}</p></div>{sprint?.enrollment?.status === "active" && day.dayNumber <= (current ?? -1) && <Link className="text-sm underline" href={`/sprint/day/${day.dayNumber}`}>افتح</Link>}</li>)}</ol>
  </section>;
}

function SprintDay({ dayNumber }: { dayNumber: number }) {
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const { data: sprint } = useQuery<SprintData>({ queryKey: ["/api/sprint/enrollment"] });
  const { data } = useQuery<DayData>({ queryKey: ["/api/sprint/days"] });
  const { data: entryData } = useQuery<{ entry: { inputData: Record<string, unknown>; isCompleted: boolean } | null }>({ queryKey: ["sprint-entry", dayNumber], queryFn: async () => {
    const response = await fetch(`/api/sprint/entry/${dayNumber}`, { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}` } });
    if (!response.ok) throw new Error("اليوم مش متاح لحسابك.");
    return response.json();
  } });
  const day = data?.days.find((item) => item.dayNumber === dayNumber);
  const [reflection, setReflection] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const currentDay = sprint?.enrollment?.currentDay;
  const previous = entryData?.entry;

  async function save(complete: boolean, event?: FormEvent) {
    event?.preventDefault(); setPending(true); setError("");
    try {
      await apiRequest("POST", `/api/sprint/entry/${dayNumber}`, { inputData: { reflection }, isCompleted: complete });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/sprint/enrollment"] }),
        queryClient.invalidateQueries({ queryKey: ["sprint-entry", dayNumber] }),
      ]);
      if (complete) navigate(dayNumber < 7 ? `/sprint/day/${dayNumber + 1}` : "/community");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "حصل خطأ."); }
    finally { setPending(false); }
  }

  if (!sprint?.enrollment || sprint.enrollment.status !== "active") return <section dir="rtl"><h1 className="text-2xl font-bold">ابدأ التحدي من الأول</h1><Button asChild className="mt-5 rounded-none"><Link href="/sprint">صفحة التحدي</Link></Button></section>;
  if (currentDay !== dayNumber) return <section dir="rtl"><h1 className="text-2xl font-bold">الخطوة دي لسه مش دورها</h1><p className="mt-2 text-muted-foreground">كمّل اليوم الحالي عشان تفتح الخطوة اللي بعدها.</p><Button asChild className="mt-5 rounded-none"><Link href={`/sprint/day/${currentDay}`}>ارجع لليوم الحالي</Link></Button></section>;
  if (!day) return <p>بنحمّل اليوم...</p>;
  const value = typeof previous?.inputData?.reflection === "string" ? previous.inputData.reflection : reflection;
  return <section dir="rtl" className="max-w-3xl"><p className="text-sm text-muted-foreground">اليوم {day.dayNumber} من 7</p><h1 className="mt-2 text-3xl font-bold">{day.titleAr}</h1><p className="mt-5 leading-8">{day.missionAr}</p>
    <form className="mt-8 space-y-4" onSubmit={(event) => void save(true, event)}><div className="space-y-2"><Label htmlFor="reflection">إيه اللي نفذته أو اكتشفته؟</Label><Textarea id="reflection" required minLength={5} maxLength={5000} value={value} onChange={(e) => setReflection(e.target.value)} className="min-h-40 rounded-none" /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex gap-3"><Button disabled={pending} className="rounded-none">{pending ? "بنحفظ..." : "احفظ وكمل"}</Button><Button type="button" variant="outline" disabled={pending} className="rounded-none" onClick={() => void save(false)}>احفظ كمسودة</Button></div>
    </form>
  </section>;
}

function Prospects() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [error, setError] = useState("");
  const { data } = useQuery<{ prospects: Array<{ id: string; name: string; business: string | null; status: string }> }>({ queryKey: ["/api/sprint/prospects"] });
  async function add(event: FormEvent) {
    event.preventDefault(); setError("");
    try { await apiRequest("POST", "/api/sprint/prospects", { name, business }); setName(""); setBusiness(""); await queryClient.invalidateQueries({ queryKey: ["/api/sprint/prospects"] }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "حصل خطأ."); }
  }
  return <section dir="rtl" className="max-w-3xl space-y-6"><header><h1 className="text-3xl font-bold">قائمة العملاء المحتملين</h1><p className="mt-2 text-muted-foreground">ابدأ بأشخاص تقدر توصل لهم، وسجل المحادثات عشان تتعلم من ردودهم.</p></header>
    <form onSubmit={add} className="grid gap-4 border-y border-border py-6 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="prospect-name">الاسم</Label><Input id="prospect-name" required value={name} onChange={(e) => setName(e.target.value)} className="rounded-none" /></div><div className="space-y-2"><Label htmlFor="business">الشركة أو النشاط</Label><Input id="business" value={business} onChange={(e) => setBusiness(e.target.value)} className="rounded-none" /></div>{error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}<Button className="rounded-none sm:col-span-2">أضف للقائمة</Button></form>
    <div className="divide-y divide-border">{data?.prospects.map((person) => <article key={person.id} className="py-4"><h2 className="font-semibold">{person.name}</h2><p className="text-sm text-muted-foreground">{person.business || "نشاط غير محدد"} · {person.status}</p></article>)}{data?.prospects.length === 0 && <p className="py-5 text-sm text-muted-foreground">لسه مفيش عملاء محتملين. ابدأ بإضافة شخص واحد تعرف توصل له.</p>}</div>
  </section>;
}

function PaymentStatus() {
  const { data } = useQuery<{ payments: Array<{ id: string; type: string; amount: string; currency: string; status: string; createdAt: string }> }>({ queryKey: ["/api/payments/my"] });
  return <section dir="rtl"><h1 className="text-3xl font-bold">حالة الدفع</h1><div className="mt-6 divide-y divide-border">{data?.payments.map((payment) => <article key={payment.id} className="py-4"><p className="font-medium">{payment.type === "sprint" ? "تحدي أول بيعة" : "عضوية المجتمع"} · {payment.amount} {payment.currency}</p><p className="mt-1 text-sm text-muted-foreground">{payment.status === "submitted" ? "قيد المراجعة اليدوية" : payment.status === "verified" ? "تم التأكيد" : payment.status === "rejected" ? "لم يتم التأكيد" : "بانتظار إرسال المطالبة"}</p></article>)}{data?.payments.length === 0 && <p className="py-4 text-muted-foreground">مفيش مطالبات دفع.</p>}</div></section>;
}
