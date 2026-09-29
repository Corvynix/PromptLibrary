import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Resource } from "@/types";

export default function Vault() {
  const { data, error, isLoading } = useQuery<{ resources: Resource[] }>({ queryKey: ["/api/vault"] });
  return <section dir="rtl" className="space-y-6"><header><h1 className="text-3xl font-bold">مكتبة البنّاء</h1><p className="mt-2 text-muted-foreground">قوالب وأدوات تساعدك تنفذ خطوة بيع أو بحث محددة.</p></header>
    {isLoading && <p>بنحمّل الموارد...</p>}{error && <p role="alert" className="text-destructive">تعذر تحميل المكتبة دلوقتي.</p>}
    <div className="divide-y divide-border">{data?.resources.map((resource) => <article key={resource.id} className="py-5"><p className="text-xs text-muted-foreground">{resource.resourceType} · {resource.category || "عام"}</p><h2 className="mt-2 font-semibold">{resource.title}</h2>{resource.description && <p className="mt-2 max-w-2xl text-sm leading-6">{resource.description}</p>}{resource.url && <a href={resource.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm underline">افتح المورد</a>}</article>)}
      {data?.resources.length === 0 && <p className="py-6 text-sm text-muted-foreground">المكتبة لسه فاضية. ارجع لمهمتك الحالية وكمل اختبارها.</p>}
    </div><Link href="/sprint" className="inline-block text-sm underline">افتح التحدي</Link>
  </section>;
}
