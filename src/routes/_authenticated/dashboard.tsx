import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Briefcase, FileText, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs, useProfile, useResumes } from "@/hooks/use-matchcv";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | MatchCV" },
      { name: "description", content: "Acompanhe suas vagas analisadas e currículos gerados." },
      { property: "og:title", content: "Dashboard | MatchCV" },
      {
        property: "og:description",
        content: "Acompanhe suas vagas analisadas e currículos gerados.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

export function scoreTone(score: number) {
  if (score >= 75) return "bg-accent text-accent-foreground";
  if (score >= 50) return "bg-highlight text-highlight-foreground";
  return "bg-muted text-muted-foreground";
}

function DashboardPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const { data: jobs = [] } = useJobs();
  const { data: resumes = [] } = useResumes();

  useEffect(() => {
    if (!isLoading && profile && !profile.onboarding_completed) {
      navigate({ to: "/onboarding" });
    }
  }, [isLoading, profile, navigate]);

  const scores = jobs.flatMap((job) =>
    (job.analyses ?? []).map((analysis: { score: number }) => analysis.score),
  );
  const bestScore = scores.length ? Math.max(...scores) : 0;
  const firstName = (profile?.full_name ?? "").split(" ")[0];

  return (
    <AppShell title="Dashboard" description="Visão geral da sua busca por oportunidades">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">Olá, {firstName || "tudo bem"} 👋</h2>
          <p className="mt-1 text-muted-foreground">
            Encontre oportunidades que combinam com seu perfil e adapte seu currículo para cada
            vaga.
          </p>
        </div>

        <Card className="border-brand/60 bg-accent/50">
          <CardContent className="flex flex-col items-start justify-between gap-4 pt-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold">Analisar uma nova vaga</h3>
              <p className="text-sm text-muted-foreground">
                Cole a descrição da vaga e veja sua compatibilidade em segundos.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/analisar">
                Analisar vaga <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard icon={Briefcase} label="Vagas analisadas" value={jobs.length} />
          <MetricCard icon={FileText} label="Currículos personalizados" value={resumes.length} />
          <MetricCard icon={Target} label="Melhor match" value={`${bestScore}%`} />
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Vagas recentes</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/vagas">Ver todas</Link>
            </Button>
          </div>

          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : jobs.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Você ainda não analisou nenhuma vaga.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/analisar">Analisar primeira vaga</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {jobs.slice(0, 5).map((job) => {
                const score = job.analyses?.[0]?.score ?? 0;
                return (
                  <Link key={job.id} to="/vagas/$jobId" params={{ jobId: job.id }}>
                    <Card className="transition-colors hover:border-brand">
                      <CardContent className="flex items-center justify-between gap-4 py-4">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{job.title}</p>
                          <p className="truncate text-sm text-muted-foreground">
                            {job.company || "Empresa não informada"} ·{" "}
                            {new Date(job.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {job.status}
                          </Badge>
                          <Badge className={scoreTone(score)}>{score}%</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Briefcase;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2">
          <Icon className="h-4 w-4" /> {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardContent>
    </Card>
  );
}
