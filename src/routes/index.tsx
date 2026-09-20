import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, FileSearch, ListChecks, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandLogo, APP_TAGLINE } from "@/components/brand-logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MatchCV — Seu currículo alinhado à vaga certa" },
      {
        name: "description",
        content:
          "Analise a compatibilidade entre seu perfil e uma vaga e gere um currículo ATS-friendly adaptado para cada oportunidade, sem inventar informações.",
      },
      { property: "og:title", content: "MatchCV — Seu currículo alinhado à vaga certa" },
      {
        property: "og:description",
        content:
          "Analise a compatibilidade entre seu perfil e uma vaga e gere um currículo ATS-friendly adaptado para cada oportunidade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const STEPS = [
  {
    icon: ListChecks,
    title: "Monte seu perfil",
    text: "Preencha ou importe seu currículo em PDF ou Word e revise cada informação.",
  },
  {
    icon: FileSearch,
    title: "Analise a vaga",
    text: "Cole a descrição da vaga e veja requisitos, palavras-chave e o que falta no seu perfil.",
  },
  {
    icon: Sparkles,
    title: "Gere o currículo",
    text: "Receba a versão adaptada para aquela vaga, pronta para ATS, e exporte em PDF.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
        <BrandLogo />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/auth">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/auth">Criar conta</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5">
        <section className="py-16 text-center md:py-24">
          <Badge className="bg-highlight text-highlight-foreground hover:bg-highlight">
            Currículos ATS-friendly
          </Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            {APP_TAGLINE}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Junte seu perfil profissional a uma vaga e receba a versão do currículo mais adequada
            para aquela oportunidade — usando só o que é verdade sobre você.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/auth">
                Começar agora <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth">Já tenho conta</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 pb-16 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="border-border/70">
                <CardContent className="space-y-3 pt-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="text-base font-semibold">{step.title}</h2>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="rounded-2xl bg-accent/60 px-6 py-12 text-center md:px-12">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Uma versão do currículo para cada vaga
          </h2>
          <ul className="mx-auto mt-6 grid max-w-2xl gap-3 text-left text-sm md:grid-cols-2">
            {[
              "Percentual de compatibilidade por categoria",
              "Palavras-chave presentes e ausentes",
              "Requisitos atendidos e não atendidos",
              "Histórico de vagas e currículos gerados",
              "Exportação em PDF pronta para envio",
              "Sem inventar experiências ou habilidades",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8">
            <Link to="/auth">Analisar minha primeira vaga</Link>
          </Button>
        </section>
      </main>

      <footer className="mx-auto mt-16 w-full max-w-5xl px-5 py-8 text-sm text-muted-foreground">
        MatchCV — {APP_TAGLINE}
      </footer>
    </div>
  );
}
