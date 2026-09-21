import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useJobs } from "@/hooks/use-matchcv";
import { scoreTone } from "./dashboard";

export const Route = createFileRoute("/_authenticated/vagas/")({
  head: () => ({ meta: [
    { title: "Minhas vagas | MatchCV" }, { name: "description", content: "Consulte suas vagas analisadas." },
    { property: "og:title", content: "Minhas vagas | MatchCV" }, { property: "og:description", content: "Consulte suas vagas analisadas." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: JobsPage,
});

function JobsPage() {
  const { data: jobs = [] } = useJobs();
  return <AppShell title="Minhas Vagas" description="Todas as oportunidades que você já analisou" action={<Button asChild><Link to="/analisar"><Plus /> Nova análise</Link></Button>}>
    {jobs.length === 0 ? <Card><CardContent className="py-16 text-center"><Briefcase className="mx-auto mb-3 h-8 w-8 text-muted-foreground" /><p className="text-muted-foreground">Nenhuma vaga analisada ainda.</p></CardContent></Card> : <div className="grid gap-3">{jobs.map((job) => { const score = job.analyses?.[0]?.score ?? 0; return <Link key={job.id} to="/vagas/$jobId" params={{ jobId: job.id }}><Card className="hover:border-brand"><CardContent className="flex items-center justify-between gap-4 py-5"><div><h2 className="font-semibold">{job.title}</h2><p className="text-sm text-muted-foreground">{job.company || "Empresa não informada"} · {job.location || "Local não informado"}</p></div><div className="flex gap-2"><Badge variant="outline" className="capitalize">{job.status}</Badge><Badge className={scoreTone(score)}>{score}%</Badge></div></CardContent></Card></Link>; })}</div>}
  </AppShell>;
}