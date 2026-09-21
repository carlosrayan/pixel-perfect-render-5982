import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileCheck2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile, useResumes } from "@/hooks/use-matchcv";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { ResumeContent } from "@/lib/matchcv-types";

export const Route = createFileRoute("/_authenticated/curriculo")({
  head: () => ({ meta: [
    { title: "Meu currículo | MatchCV" }, { name: "description", content: "Revise e salve seu currículo principal." },
    { property: "og:title", content: "Meu currículo | MatchCV" }, { property: "og:description", content: "Revise e salve seu currículo principal." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: MasterResumePage,
});

function MasterResumePage() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: resumes = [] } = useResumes();
  const master = resumes.find((resume) => resume.is_master);
  if (!profile) return <AppShell title="Meu Currículo"><p>Carregando...</p></AppShell>;
  const content: ResumeContent = { fullName: profile.full_name ?? "", headline: profile.headline ?? profile.current_position ?? "", contact: { email: profile.email ?? "", phone: profile.phone ?? "", location: profile.location ?? "", links: profile.links.map((item) => item.url).filter(Boolean) }, summary: profile.summary ?? "", experiences: profile.experiences.map((item) => ({ company: item.company, position: item.position, period: `${item.startDate} — ${item.current ? "Atual" : item.endDate}`, bullets: [item.description, item.responsibilities, item.achievements].filter(Boolean) })), education: profile.education.map((item) => ({ institution: item.institution, course: item.course, degree: item.degree, period: `${item.startDate} — ${item.endDate}` })), skills: profile.skills.map((item) => `${item.name} (${item.level})`), languages: profile.languages.map((item) => `${item.name} (${item.level})`), certifications: profile.certifications.map((item) => `${item.name} — ${item.issuer} ${item.year}`), projects: profile.projects.map((item) => ({ name: item.name, description: item.description })) };
  async function save() {
    const { data: userData } = await supabase.auth.getUser(); if (!userData.user) return;
    const query = master ? supabase.from("resumes").update({ content: content as unknown as Json, title: "Currículo principal" }).eq("id", master.id).select("id").single() : supabase.from("resumes").insert({ user_id: userData.user.id, title: "Currículo principal", is_master: true, content: content as unknown as Json }).select("id").single();
    const { data, error } = await query; if (error) { toast.error("Não foi possível salvar."); return; }
    toast.success("Currículo principal salvo."); navigate({ to: "/curriculos/$resumeId", params: { resumeId: data.id } });
  }
  const sections = [["Contato", [profile.email, profile.phone, profile.location].filter(Boolean).join(" · ")], ["Título profissional", content.headline], ["Resumo", content.summary], ["Experiência", `${profile.experiences.length} item(ns)`], ["Formação", `${profile.education.length} item(ns)`], ["Habilidades", profile.skills.map((item) => item.name).join(", ")], ["Idiomas", profile.languages.map((item) => item.name).join(", ")], ["Certificações", `${profile.certifications.length} item(ns)`], ["Projetos", `${profile.projects.length} item(ns)`], ["Links profissionais", `${profile.links.length} item(ns)`]];
  return <AppShell title="Meu Currículo" description="Esta é a fonte dos seus currículos personalizados" action={<Button onClick={save}><FileCheck2 /> Salvar como principal</Button>}><div className="grid gap-3">{sections.map(([title, value]) => <Card key={title}><CardHeader className="pb-2"><CardTitle className="text-sm">{title}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{value || "Não informado"}</p></CardContent></Card>)}</div></AppShell>;
}