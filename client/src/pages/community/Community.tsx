import { FormEvent, useState } from "react";
import { Link, useRoute } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PopulatedComment, PopulatedPost } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Community() {
  const [postRoute, params] = useRoute("/community/post/:id");
  return postRoute ? <PostDetails id={params?.id} /> : <CommunityFeed />;
}

function CommunityFeed() {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { data, isLoading, error: feedError } = useQuery<{ posts: PopulatedPost[]; hasMore: boolean }>({ queryKey: ["/api/community?page=1"] });

  async function create(event: FormEvent) {
    event.preventDefault(); setError("");
    try { await apiRequest("POST", "/api/community", { content, type: "general" }); setContent(""); await queryClient.invalidateQueries({ queryKey: ["/api/community"] }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "حصل خطأ."); }
  }
  async function like(id: string) {
    await apiRequest("POST", `/api/community/${id}/like`, {});
    await queryClient.invalidateQueries({ queryKey: ["/api/community"] });
  }

  return <section dir="rtl" className="max-w-3xl space-y-8"><header><h1 className="text-3xl font-bold">مجتمع البنّائين</h1><p className="mt-2 text-muted-foreground">شارك تجربة أو سؤال يساعدك تاخد خطوة فعلية في البيع.</p></header>
    <form onSubmit={create} className="space-y-3 border-y border-border py-6"><Label htmlFor="post">إيه اللي بتختبره دلوقتي؟</Label><Textarea id="post" required minLength={10} maxLength={5000} value={content} onChange={(e) => setContent(e.target.value)} className="min-h-24 rounded-none" />{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="rounded-none">انشر</Button></form>
    {feedError && <p role="alert" className="text-sm text-destructive">تعذر تحميل المجتمع: {feedError.message}</p>}
    {isLoading && <p role="status" className="py-6 text-sm text-muted-foreground">جارٍ تحميل النقاشات...</p>}
    <div className="divide-y divide-border">{data?.posts.map((post) => <article key={post.id} className="py-6"><p className="text-xs text-muted-foreground">{post.type} · {post.author.displayName || "عضو"} · {new Date(post.createdAt).toLocaleDateString("ar-EG")}</p><p className="mt-3 whitespace-pre-wrap leading-7">{post.content}</p><div className="mt-4 flex gap-5 text-sm"><button type="button" onClick={() => void like(post.id)} aria-label={post.isLiked ? "إزالة الإعجاب" : "أعجبني"}>{post.isLiked ? "أعجبك" : "إعجاب"} · {post.likeCount}</button><Link className="underline" href={`/community/post/${post.id}`}>التعليقات · {post.commentCount}</Link></div></article>)}
      {data?.posts.length === 0 && <div className="py-8"><p className="font-medium">لسه مفيش نقاشات.</p><p className="mt-2 text-sm text-muted-foreground">ابدأ بسؤال أو شارك حاجة بتختبرها مع العملاء.</p></div>}
    </div>
  </section>;
}

function PostDetails({ id }: { id?: string }) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { data, isLoading, error: loadError } = useQuery<{ post: PopulatedPost; comments: PopulatedComment[] }>({
    queryKey: ["community-post", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await fetch(`/api/community/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}` } });
      if (!response.ok) throw new Error("المنشور مش متاح.");
      return response.json();
    },
  });
  async function comment(event: FormEvent) {
    event.preventDefault(); setError("");
    try { await apiRequest("POST", `/api/community/${id}/comments`, { content }); setContent(""); await queryClient.invalidateQueries({ queryKey: ["community-post", id] }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "حصل خطأ."); }
  }
  if (!data) return <section dir="rtl" className="max-w-3xl" role={loadError ? "alert" : "status"}>{loadError?.message || (isLoading ? "بنحمّل النقاش..." : "النقاش مش موجود.")}</section>;
  return <section dir="rtl" className="max-w-3xl"><Link className="text-sm underline" href="/community">ارجع للمجتمع</Link><article className="border-b border-border py-6"><p className="text-xs text-muted-foreground">{data.post.author.displayName || "عضو"} · {data.post.type}</p><p className="mt-4 whitespace-pre-wrap leading-7">{data.post.content}</p></article>
    <form onSubmit={comment} className="space-y-3 border-b border-border py-6"><label htmlFor="comment" className="text-sm font-medium">اكتب تعليقك</label><Textarea id="comment" required minLength={3} maxLength={2000} value={content} onChange={(e) => setContent(e.target.value)} className="rounded-none" />{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="rounded-none">أضف تعليق</Button></form>
    <div className="divide-y divide-border">{data.comments.map((item) => <article className="py-4" key={item.id}><p className="text-xs text-muted-foreground">{item.author.displayName || "عضو"}</p><p className="mt-2 whitespace-pre-wrap">{item.content}</p></article>)}{data.comments.length === 0 && <p className="py-4 text-sm text-muted-foreground">لسه مفيش تعليقات.</p>}</div>
  </section>;
}
