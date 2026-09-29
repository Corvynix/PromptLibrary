import { FormEvent, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Projects() {
  const [name, setName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const { data } = useQuery<{ projects: Project[] }>({ queryKey: ["/api/projects"] });

  async function addProject(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await apiRequest("POST", "/api/projects", { name, targetAudience, description });
      setName(""); setTargetAudience(""); setDescription("");
      await queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "حصل خطأ.");
    }
  }

  return <section dir="rtl" className="space-y-8"><header><h1 className="text-3xl font-bold">مشاريعي</h1><p className="mt-2 text-muted-foreground">ابدأ من اللي بنيته، وبعدها اختبره مع ناس حقيقية.</p></header>
    <form onSubmit={addProject} className="max-w-xl space-y-4 border-y border-border py-6">
      <h2 className="font-semibold">أضف مشروع</h2>
      <div className="space-y-2"><Label htmlFor="project-name">اسم المشروع</Label><Input id="project-name" required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="rounded-none" /></div>
      <div className="space-y-2"><Label htmlFor="audience">المشتري المستهدف</Label><Input id="audience" maxLength={300} value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="rounded-none" /></div>
      <div className="space-y-2"><Label htmlFor="description">المشكلة اللي بيحلها</Label><Textarea id="description" maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-none" /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="rounded-none">حفظ المشروع</Button>
    </form>
    <div className="divide-y divide-border">{data?.projects.map((project) => <article key={project.id} className="py-5"><h2 className="font-semibold">{project.name}</h2><p className="mt-1 text-sm text-muted-foreground">{project.targetAudience || "لسه محددتش المشتري"}</p>{project.description && <p className="mt-2 max-w-2xl text-sm leading-6">{project.description}</p>}</article>)}
      {data?.projects.length === 0 && <p className="py-6 text-sm text-muted-foreground">لسه مفيش مشاريع. أضف المنتج اللي بتختبر بيعه.</p>}
    </div>
  </section>;
}
