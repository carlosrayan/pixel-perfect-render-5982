import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useResumes } from "@/hooks/use-matchcv";

export const Route = createFileRoute("/_authenticated/curriculos/")({
  head: () => ({ meta: [
    { title: "Currículos gerados | MatchCV" }, { name: "description", content: "Acesse suas versões de currículo." },
    { property: "og:title", content: "Currículos gerados | MatchCV" }, { property: "og:description", content: "Acesse suas versões de currículo." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ResumesPage,
});
function ResumesPage() { const { data: resumes = [] } = useResumes(); return <AppShell title="Currículos Gerados" description="Versões salvas para suas oportunidades">{resumes.length === 0 ? <Card><CardContent className="py-16 text-center"><FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground"/><p className="text-muted-foreground">Nenhum currículo salvo ainda.</p></CardContent></Card> : <div className="grid gap-3">{resumes.map((resume) => <Link key={resume.id} to="/curriculos/$resumeId" params={{ resumeId: resume.id }}><Card className="hover:border-brand"><CardContent className="flex items-center justify-between py-5"><div><h2 className="font-semibold">{resume.title}</h2><p className="text-sm text-muted-foreground">{resume.jobs ? `${resume.jobs.title} · ${resume.jobs.company || "Empresa não informada"}` : "Perfil profissional"}</p></div>{resume.is_master ? <Badge>Principal</Badge> : <Badge variant="outline">Personalizado</Badge>}</CardContent></Card></Link>)}</div>}</AppShell>; }