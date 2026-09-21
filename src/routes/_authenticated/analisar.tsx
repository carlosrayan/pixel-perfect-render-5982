import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/use-matchcv";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { analyzeJobFn } from "@/lib/matchcv.functions";

export const Route = createFileRoute("/_authenticated/analisar")({
  head: () => ({ meta: [
    { title: "Analisar vaga | MatchCV" },
    { name: "description", content: "Analise a compatibilidade do seu perfil com uma vaga." },
    { property: "og:title", content: "Analisar vaga | MatchCV" },
    { property: "og:description", content: "Analise a compatibilidade do seu perfil com uma vaga." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeJobFn);
  const { data: profile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState({ title: "", company: "", location: "", url: "", description: "" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!profile || job.description.trim().length < 80) {
      toast.error("Cole uma descrição de vaga mais completa para fazer a análise.");
      return;
    }
    setLoading(true);
    try {
      const result = await analyze({ data: { profile, job } });
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Sessão expirada.");
      const { data: createdJob, error: jobError } = await supabase.from("jobs").insert({
        user_id: user.id,
        title: job.title || result.parsed.title || "Vaga sem título",
        company: job.company || result.parsed.company || null,
        location: job.location || result.parsed.location || null,
        url: job.url || null,
        description: job.description,
        work_model: result.parsed.workModel || null,
        parsed: result.parsed as unknown as Json,
      }).select("id").single();
      if (jobError) throw jobError;
      const { error: analysisError } = await supabase.from("analyses").insert({
        user_id: user.id,
        job_id: createdJob.id,
        score: Math.max(0, Math.min(100, result.analysis.score)),
        categories: result.analysis.categories as unknown as Json,
        result: result.analysis as unknown as Json,
      });
      if (analysisError) throw analysisError;
      navigate({ to: "/vagas/$jobId", params: { jobId: createdJob.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir a análise.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Analisar nova vaga" description="Compare os requisitos com seu perfil profissional">
      <form onSubmit={submit} className="mx-auto max-w-3xl space-y-5">
        <Card>
          <CardHeader><CardTitle>Dados da vaga</CardTitle><CardDescription>O MVP funciona perfeitamente com o texto colado.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Cargo" value={job.title} onChange={(title) => setJob({ ...job, title })} />
              <Field label="Empresa" value={job.company} onChange={(company) => setJob({ ...job, company })} />
              <Field label="Localização" value={job.location} onChange={(location) => setJob({ ...job, location })} />
              <Field label="URL da vaga" value={job.url} onChange={(url) => setJob({ ...job, url })} />
            </div>
            <div className="space-y-2"><Label>Descrição da vaga</Label><Textarea rows={14} required placeholder="Cole aqui a descrição completa, incluindo responsabilidades e requisitos..." value={job.description} onChange={(e) => setJob({ ...job, description: e.target.value })} /></div>
          </CardContent>
        </Card>
        <div className="flex justify-end"><Button size="lg" disabled={loading}>{loading ? <><Loader2 className="animate-spin" /> Analisando...</> : <><Search /> Analisar vaga</>}</Button></div>
      </form>
    </AppShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label>{label}</Label><Input value={value} onChange={(e) => onChange(e.target.value)} /></div>;
}