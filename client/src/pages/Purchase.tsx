import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TechShell } from "@/components/layout/TechShell";

type Offer = { products: Array<{ id: string; slug: string; name: string }>; pricing: { sprintPriceEgp: string; instapayPhone: string; instapayName: string } };

export default function Purchase() {
  const [reference, setReference] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofKey, setProofKey] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { data } = useQuery<Offer>({ queryKey: ["/api/sprint"] });
  const product = data?.products[0];

  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (!user) { navigate(`/auth?returnTo=${encodeURIComponent("/purchase")}`); return; }
    if (!product) { setError("التحدي مش متاح للتسجيل دلوقتي."); return; }
    if (!proofFile && !proofKey) { setError("ارفع إثبات التحويل أولاً."); return; }
    setPending(true);
    try {
      let uploadedKey = proofKey;
      if (!uploadedKey && proofFile) {
        const upload = await fetch("/api/payments/proof", {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`, "Content-Type": proofFile.type },
          body: proofFile,
        });
        const payload = await upload.json() as { proofKey?: string; error?: string };
        if (!upload.ok || !payload.proofKey) throw new Error(payload.error || "Unable to upload proof");
        uploadedKey = payload.proofKey;
        setProofKey(uploadedKey);
      }
      await apiRequest("POST", "/api/payments/initiate", { type: "sprint", productId: product.id, referenceNumber: reference, proofUrl: uploadedKey });
      setSubmitted(true);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "حصل خطأ."); }
    finally { setPending(false); }
  }

  return <TechShell logoText="أول بيعة"><main dir="rtl" className="flex-1 px-4 py-12 text-foreground"><div className="mx-auto max-w-xl"><Link href="/" className="font-bold">أول بيعة</Link><h1 className="mt-10 text-3xl font-bold">تحدي أول بيعة</h1><p className="mt-4 leading-7">خطوات عملية لفهم المشتري، بدء محادثات حقيقية، وتجربة طلب البيع. مفيش ضمان لنتيجة مالية.</p>
    {data && <div className="my-7 border-y border-border py-5"><p>السعر الحالي: <strong>{data.pricing.sprintPriceEgp} جنيه</strong></p><p className="mt-3">التحويل عبر InstaPay إلى:</p><p dir="ltr" className="mt-1 text-left font-mono">{data.pricing.instapayPhone || "بيانات الدفع لم تُضف بعد"}</p>{data.pricing.instapayName && <p className="mt-1">{data.pricing.instapayName}</p>}</div>}
    {submitted ? <div role="status" className="border-y border-border py-6"><h2 className="font-semibold">وصلت مطالبة الدفع</h2><p className="mt-2 text-sm text-muted-foreground">هنراجع رقم العملية يدويًا. الوصول للتحدي مش بيتفعل قبل التأكيد.</p><Button asChild variant="outline" className="mt-4 rounded-none"><Link href="/payment/status">حالة المطالبة</Link></Button></div>
      : <form noValidate={!user} className="space-y-4" onSubmit={submit}><div className="space-y-2"><Label htmlFor="reference">رقم العملية</Label><Input id="reference" required minLength={6} maxLength={64} pattern="[A-Za-z0-9_-]+" value={reference} onChange={(e) => setReference(e.target.value)} className="rounded-none" /></div><div className="space-y-2"><Label htmlFor="proof">إثبات التحويل (JPEG, PNG, PDF، بحد أقصى 5MB)</Label><Input id="proof" type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => { setProofFile(e.target.files?.[0] ?? null); setProofKey(""); }} className="rounded-none" /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="rounded-none" disabled={pending || Boolean(user && !data?.pricing.instapayPhone)}>{pending ? "جارٍ الإرسال..." : user ? "أرسِل مطالبة الدفع للمراجعة" : "دخول لإرسال المطالبة"}</Button></form>}
    <p className="mt-6 text-xs leading-6 text-muted-foreground">الدفع يدوي ولا يتم تأكيده تلقائيًا. لا ترسل بيانات بطاقتك أو كلمة مرور InstaPay.</p>
  </div></main></TechShell>;
}
