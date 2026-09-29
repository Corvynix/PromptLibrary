import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { PopulatedUser, Project, SprintDay } from "@/types";
import { Button } from "@/components/ui/button";

type EnrollmentResponse = { enrollment: { currentDay: number; status: string } | null };
type DaysResponse = { days: SprintDay[] };

export default function Dashboard() {
  const { data: user } = useQuery<PopulatedUser | null>({ queryKey: ["/api/auth/me"], queryFn: async () => {
    const response = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}` } });
    if (!response.ok) return null;
    return response.json();
  } });
  const { data: projects } = useQuery<{ projects: Project[] }>({ queryKey: ["/api/projects"] });
  const { data: enrollment } = useQuery<EnrollmentResponse>({ queryKey: ["/api/sprint/enrollment"] });
  const { data: days } = useQuery<DaysResponse>({ queryKey: ["/api/sprint/days"] });
  const project = projects?.projects[0];
  const currentDay = enrollment?.enrollment?.currentDay;
  const nextDay = currentDay === undefined ? null : days?.days.find((day) => day.dayNumber === currentDay);

  return <section dir="rtl" className="space-y-8">
    <header><p className="text-sm text-muted-foreground">مساحة التنفيذ</p><h1 className="mt-2 text-3xl font-bold">أهلاً {user?.displayName || "بيك"}</h1></header>
    <div className="border-y border-border py-6">
      <p className="text-sm text-muted-foreground">الخطوة الجاية</p>
      {nextDay ? <><h2 className="mt-2 text-xl font-semibold">اليوم {nextDay.dayNumber}: {nextDay.titleAr}</h2><p className="mt-2 max-w-2xl leading-7">{nextDay.missionAr}</p><Button asChild className="mt-5 rounded-none"><Link href={`/sprint/day/${nextDay.dayNumber}`}>كمّل التحدي</Link></Button></>
        : enrollment?.enrollment?.status === "completed" ? <><h2 className="mt-2 text-xl font-semibold">خلصت أيام التحدي</h2><p className="mt-2 text-muted-foreground">راجع الدليل اللي جمعته وحدد تجربتك التالية.</p></>
          : <><h2 className="mt-2 text-xl font-semibold">ابدأ بمحاولة بيع حقيقية</h2><p className="mt-2 text-muted-foreground">التشخيص والتحدي يساعدوك تحول افتراضاتك لخطوات قابلة للاختبار.</p><Button asChild className="mt-5 rounded-none"><Link href="/diagnose">ابدأ التشخيص</Link></Button></>}
    </div>
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="border-b border-border pb-5"><h2 className="font-semibold">مشروعك</h2>{project ? <><p className="mt-2">{project.name}</p><p className="mt-1 text-sm text-muted-foreground">{project.targetAudience || "حدد المشتري المستهدف"}</p><Link href="/projects" className="mt-3 inline-block text-sm underline">عدّل تفاصيل المشروع</Link></> : <Link href="/projects" className="mt-3 inline-block text-sm underline">أضف مشروعك</Link>}</div>
      <div className="border-b border-border pb-5"><h2 className="font-semibold">سجل الأدلة</h2><p className="mt-2 text-sm text-muted-foreground">سجل الردود والتجارب والمبيعات من داخل أيام التحدي.</p><Link href="/sprint/crm" className="mt-3 inline-block text-sm underline">افتح سجل العملاء المحتملين</Link></div>
    </div>
    <nav className="flex flex-wrap gap-5 text-sm"><Link href="/experiments" className="underline">تجارب البيع</Link><Link href="/community" className="underline">المجتمع</Link><Link href="/radar" className="underline">رادار AI</Link><Link href="/vault" className="underline">المكتبة</Link></nav>
  </section>;
}
