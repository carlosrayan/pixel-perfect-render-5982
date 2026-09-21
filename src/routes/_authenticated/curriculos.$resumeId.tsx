import { createFileRoute } from "@tanstack/react-router";
import { Download, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { ResumePreview } from "@/components/resume-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResume } from "@/hooks/use-matchcv";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { ResumeChange, ResumeContent } from "@/lib/matchcv-types";

export const Route = createFileRoute("/_authenticated/curriculos/$resumeId")({
  head: () => ({ meta: [
    { title: "Visualizar currículo | MatchCV" }, { name: "description", content: "Edite e exporte seu currículo ATS-friendly." },
    { property: "og:title", content: "Visualizar currículo | MatchCV" }, { property: "og:description", content: "Edite e exporte seu currículo ATS-friendly." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ResumeDetailPage,
});
function ResumeDetailPage() { const { resumeId } = Route.useParams(); const { data: resume } = useResume(resumeId); const [draft, setDraft] = useState<ResumeContent | null>(null); if (!resume) return <AppShell title="Currículo"><p>Carregando...</p></AppShell>; const content = draft ?? (resume.content as unknown as ResumeContent); const changes = resume.changes as unknown as ResumeChange[];
  async function save() { const { error } = await supabase.from("resumes").update({ content: content as unknown as Json }).eq("id", resumeId); if (error) toast.error("Não foi possível salvar."); else toast.success("Currículo salvo."); }
  return <><div className="print-hidden"><AppShell title={resume.title} description={resume.jobs ? `Adaptado para ${resume.jobs.title}` : "Currículo principal"} action={<div className="flex gap-2"><Button variant="outline" onClick={() => window.print()}><Download /> PDF</Button><Button onClick={save}><Save /> Salvar</Button></div>}><div className="grid gap-6 xl:grid-cols-[360px_1fr]"><div className="space-y-4"><Card><CardHeader><CardTitle className="text-base">Edição rápida</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Título</Label><Input value={content.headline} onChange={(e) => setDraft({ ...content, headline: e.target.value })}/></div><div className="space-y-2"><Label>Resumo</Label><Textarea rows={8} value={content.summary} onChange={(e) => setDraft({ ...content, summary: e.target.value })}/></div></CardContent></Card>{changes.length ? <Card><CardHeader><CardTitle className="text-base">O que foi alterado e por quê</CardTitle></CardHeader><CardContent className="space-y-4">{changes.map((change, index) => <div key={index}><p className="text-sm font-semibold">{change.section}: {change.change}</p><p className="text-xs text-muted-foreground">{change.reason}</p></div>)}</CardContent></Card> : null}</div><div className="surface-soft p-4"><ResumePreview content={content}/></div></div></AppShell></div><div className="hidden print:block"><ResumePreview content={content}/></div></>;
}