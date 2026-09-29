import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PopulatedPayment } from "@/types";

type AdminUser = { id: number; email: string; displayName: string | null; isBanned: boolean };
type PaymentRow = { payment: PopulatedPayment & { proofUrl?: string | null }; user?: Pick<AdminUser, "email" | "displayName"> | null };
type Flag = { key: string; value: boolean; description: string | null };
type Setting = { key: string; value: string; description: string | null };
type AdminConfig = { featureFlags: Flag[]; siteSettings: Setting[] };
type ReportRow = { report: { id: string; targetType: string; targetId: string; reason: string; createdAt: string }; reporter?: { email: string | null } | null };

export default function Admin() {
  const queryClient = useQueryClient();
  const payments = useQuery<{ payments: PaymentRow[] }>({ queryKey: ["/api/admin/payments"] });
  const users = useQuery<{ users: AdminUser[] }>({ queryKey: ["/api/admin/users"] });
  const config = useQuery<AdminConfig>({ queryKey: ["/api/admin/config"] });
  const reports = useQuery<{ reports: ReportRow[] }>({ queryKey: ["/api/admin/reports"] });
  const [proofLinks, setProofLinks] = useState<Record<string, string>>({});
  const [settingValues, setSettingValues] = useState<Record<string, string>>({});

  async function act(path: string, data?: unknown, method?: string) {
    await apiRequest(method ?? (data ? "PATCH" : "POST"), path, data);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] }),
    ]);
  }

  return <section dir="rtl" className="space-y-10"><header><h1 className="text-3xl font-bold">إدارة أول بيعة</h1><p className="mt-2 text-sm text-muted-foreground">راجع المطالبات يدويًا قبل منح أي وصول.</p></header>
    <section><h2 className="border-b border-border pb-3 text-xl font-semibold">مطالبات الدفع</h2><div className="divide-y divide-border">{payments.data?.payments.map(({ payment, user }) => <article key={payment.id} className="flex flex-wrap items-center justify-between gap-4 py-5"><div><p className="font-medium">{user?.displayName || user?.email} · {payment.amount} {payment.currency}</p><p className="mt-1 text-sm text-muted-foreground">{payment.type} · {payment.referenceNumber} · {payment.status}</p>{payment.proofUrl && (proofLinks[payment.id] ? <a className="text-sm underline" href={proofLinks[payment.id]} target="_blank" rel="noreferrer">عرض إثبات التحويل</a> : <Button variant="link" className="h-auto p-0" onClick={async () => { try { const response = await apiRequest("GET", `/api/admin/payments/${payment.id}/proof`); const data = await response.json() as { signedUrl: string }; setProofLinks((links) => ({ ...links, [payment.id]: data.signedUrl })); } catch { /* Query client surfaces request errors elsewhere. */ } }}>تحميل رابط الإثبات</Button>)}</div>{payment.status === "submitted" && <div className="flex gap-2"><Button className="rounded-none" onClick={() => void act(`/api/admin/payments/${payment.id}/verify`)}>تأكيد بعد المراجعة</Button><Button variant="outline" className="rounded-none" onClick={() => void act(`/api/admin/payments/${payment.id}/reject`, { note: "التحويل غير مؤكد. راجع الرقم وحاول مرة أخرى." })}>رفض المطالبة</Button></div>}</article>)}{payments.data?.payments.length === 0 && <p className="py-4 text-sm text-muted-foreground">مفيش مطالبات قيد المراجعة.</p>}</div></section>
    <section><h2 className="border-b border-border pb-3 text-xl font-semibold">الحسابات</h2><div className="divide-y divide-border">{users.data?.users.map((user) => <article key={user.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><p>{user.displayName || user.email} <span className="text-sm text-muted-foreground">{user.email}</span></p><Button variant="outline" className="rounded-none" onClick={() => void act(`/api/admin/users/${user.id}/${user.isBanned ? "unban" : "ban"}`)}>{user.isBanned ? "إلغاء الحظر" : "حظر الحساب"}</Button></article>)}</div></section>
    <section><h2 className="border-b border-border pb-3 text-xl font-semibold">بلاغات المجتمع</h2><div className="divide-y divide-border">{reports.data?.reports.map(({ report, reporter }) => <article key={report.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p>{report.targetType}: {report.targetId}</p><p className="text-sm text-muted-foreground">{report.reason} · {reporter?.email}</p></div><div className="flex gap-2"><Button className="rounded-none" onClick={() => void act(`/api/admin/reports/${report.id}/review`, { action: "hide" }, "POST")}>إخفاء</Button><Button variant="outline" className="rounded-none" onClick={() => void act(`/api/admin/reports/${report.id}/review`, { action: "dismiss" }, "POST")}>رفض البلاغ</Button></div></article>)}{reports.data?.reports.length === 0 && <p className="py-4 text-sm text-muted-foreground">مفيش بلاغات جديدة.</p>}</div></section>
    <section><h2 className="border-b border-border pb-3 text-xl font-semibold">الخصائص</h2><div className="divide-y divide-border">{config.data?.featureFlags.map((flag) => <div key={flag.key} className="flex items-center justify-between gap-4 py-4"><div><p className="font-medium">{flag.key}</p><p className="text-sm text-muted-foreground">{flag.description}</p></div><Button variant="outline" className="rounded-none" aria-pressed={flag.value} onClick={() => void act(`/api/admin/feature-flags/${flag.key}`, { value: !flag.value })}>{flag.value ? "مفعّل" : "متوقف"}</Button></div>)}</div></section>
    <section><h2 className="border-b border-border pb-3 text-xl font-semibold">الأسعار وبيانات التحويل</h2><div className="divide-y divide-border">{config.data?.siteSettings.map((setting) => <form key={setting.key} className="flex flex-wrap items-end gap-3 py-4" onSubmit={(event) => { event.preventDefault(); void act(`/api/admin/site-settings/${setting.key}`, { value: settingValues[setting.key] ?? setting.value }); }}><div className="min-w-0 flex-1 space-y-2"><label className="text-sm font-medium" htmlFor={`setting-${setting.key}`}>{setting.key}</label><Input id={`setting-${setting.key}`} value={settingValues[setting.key] ?? setting.value} onChange={(event) => setSettingValues((values) => ({ ...values, [setting.key]: event.target.value }))} className="rounded-none" /></div><Button type="submit" variant="outline" className="rounded-none">حفظ</Button></form>)}</div></section>
  </section>;
}
