import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, FileText, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useJob, useProfile } from "@/hooks/use-matchcv";
import { generateResumeFn } from "@/lib/matchcv.functions";
import type { AnalysisResult, ParsedJob } from "@/lib/matchcv-types";
import type { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { scoreTone } from "./dashboard";

export const Route = createFileRoute("/_authenticated/vagas/$jobId")({
  head: () => ({ meta: [
    { title: "Resultado da análise | MatchCV" }, { name: "description", content: "Veja a compatibilidade do seu perfil com a vaga." },
    { property: "og:title", content: "Resultado da análise | MatchCV" }, { property: "og:description", content: "Veja a compatibilidade do seu perfil com a vaga." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: JobDetailPage,
});

function JobDetailPage() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJob(jobId);
  const { data: profile } = useProfile();
  const generate = useServerFn(generateResumeFn);
  const [generating, setGenerating] = useState(false);
  if (isLoading || !job) return <AppShell title="Resultado"><Skeleton className="h-96" /></AppShell>;
  const analysisRow = job.analyses?.[0];
  const analysis = (analysisRow?.result ?? {}) as unknown as AnalysisResult;
  const parsed = job.parsed as unknown as ParsedJob;
  const score = analysisRow?.score ?? 0;
  const jobTitle = job.title;

  async function createResume() {
    if (!profile || !analysisRow) return;
    setGenerating(true);
    try {
      const result = await generate({ data: { profile, parsed, analysis } });
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Sessão expirada.");
      const { data, error } = await supabase.from("resumes").insert({ user_id: userData.user.id, job_id: jobId, analysis_id: analysisRow.id, title: `Currículo — ${jobTitle}`, content: result.content as unknown as Json, changes: result.changes as unknown as Json }).select("id").single();
      if (error) throw error;
      navigate({ to: "/curriculos/$resumeId", params: { resumeId: data.id } });
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível gerar o currículo."); }
    finally { setGenerating(false); }
  }

  return <AppShell title={job.title} description={`${job.company || "Empresa não informada"} · ${job.location || "Local não informado"}`} action={<Button onClick={createResume} disabled={generating}>{generating ? <Loader2 className="animate-spin" /> : <FileText />} Gerar currículo</Button>}>
    <div className="space-y-6">
      <Card className="border-brand"><CardContent className="flex flex-col items-center gap-5 py-8 sm:flex-row"><div className={`flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold ${scoreTone(score)}`}>{score}%</div><div><h2 className="text-xl font-semibold">Compatibilidade com a vaga</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{analysis.summary}</p><p className="mt-3 text-xs text-muted-foreground">Este score representa compatibilidade entre seu perfil e os requisitos identificados, não probabilidade de contratação.</p></div></CardContent></Card>
      <div className="grid gap-4 md:grid-cols-2">{(analysis.categories ?? []).map((category) => <Card key={category.name}><CardContent className="pt-5"><div className="mb-2 flex justify-between"><span className="font-medium">{category.name}</span><strong>{category.score}%</strong></div><Progress value={category.score} /><p className="mt-2 text-xs text-muted-foreground">{category.note}</p></CardContent></Card>)}</div>
      <div className="grid gap-4 lg:grid-cols-2"><ListCard title="Pontos fortes" items={analysis.strengths} positive /><ListCard title="Pontos a melhorar" items={analysis.improvements} /><ListCard title="Requisitos atendidos" items={analysis.metRequirements} positive /><ListCard title="Requisitos não atendidos" items={analysis.unmetRequirements} /></div>
      <Card><CardHeader><CardTitle>Palavras-chave</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{(parsed.keywords ?? []).map((item) => <Badge key={item} variant={(analysis.matchedKeywords ?? []).includes(item) ? "default" : "outline"}>{item}</Badge>)}</CardContent></Card>
    </div>
  </AppShell>;
}

function ListCard({ title, items = [], positive = false }: { title: string; items?: string[]; positive?: boolean }) {
  const Icon = positive ? Check : X;
  return <Card><CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader><CardContent><ul className="space-y-2">{items.length ? items.map((item) => <li key={item} className="flex gap-2 text-sm"><Icon className={positive ? "text-success" : "text-warning"} />{item}</li>) : <li className="text-sm text-muted-foreground">Nenhum item identificado.</li>}</ul></CardContent></Card>;
}