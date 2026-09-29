import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { RadarItem } from "@/types";

export default function Radar() {
  const { data, error, isLoading } = useQuery<{ items: RadarItem[] }>({ queryKey: ["/api/radar"] });
  return <section dir="rtl" className="space-y-6"><header><h1 className="text-3xl font-bold">رادار AI</h1><p className="mt-2 text-muted-foreground">تحديثات وأدوات مرتبطة بتجارب ممكن تعملها في منتجك أو طريقة بيعه.</p></header>
    {isLoading && <p>بنحمّل التحديثات...</p>}{error && <p role="alert" className="text-destructive">تعذر تحميل الرادار دلوقتي.</p>}
    <div className="divide-y divide-border">{data?.items.map((item) => <article key={item.id} className="py-5"><p className="text-xs text-muted-foreground">{item.category}</p><h2 className="mt-2 font-semibold">{item.title}</h2>{item.summary && <p className="mt-2 max-w-2xl text-sm leading-6">{item.summary}</p>}{item.sourceUrl && <a className="mt-3 inline-block text-sm underline" href={item.sourceUrl} target="_blank" rel="noreferrer">افتح المصدر</a>}</article>)}
      {data?.items.length === 0 && <p className="py-6 text-sm text-muted-foreground">مفيش تحديثات منشورة دلوقتي.</p>}
    </div><Link href="/sprint" className="inline-block text-sm underline">ارجع لخطوة التحدي الحالية</Link>
  </section>;
}
