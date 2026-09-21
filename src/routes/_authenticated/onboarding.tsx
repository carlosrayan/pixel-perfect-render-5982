import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandLogo } from "@/components/brand-logo";
import { ResumeImport } from "@/components/resume-import";
import {
  CertificationList,
  EducationList,
  ExperienceList,
  LanguageList,
  SkillList,
} from "@/components/profile-sections";
import { useProfile, useUpdateProfile } from "@/hooks/use-matchcv";
import { WORK_MODELS, type ProfileData } from "@/lib/matchcv-types";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding | MatchCV" },
      { name: "description", content: "Monte seu perfil profissional em poucos passos." },
      { property: "og:title", content: "Onboarding | MatchCV" },
      { property: "og:description", content: "Monte seu perfil profissional em poucos passos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OnboardingPage,
});

const STEP_TITLES = [
  "Vamos conhecer seu perfil profissional.",
  "Experiência profissional",
  "Formação acadêmica",
  "Habilidades",
  "Idiomas",
  "Certificações",
  "Resumo profissional",
];

function OnboardingPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (profile && !form) setForm(profile);
  }, [profile, form]);

  if (isLoading || !form) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  const set = (patch: Partial<ProfileData>) => setForm({ ...form, ...patch });
  const last = step === STEP_TITLES.length - 1;

  async function save(finish: boolean) {
    if (!form) return;
    const { id, ...rest } = form;
    void id;
    try {
      await updateProfile.mutateAsync({ ...rest, onboarding_completed: finish ? true : rest.onboarding_completed });
      if (finish) {
        toast.success("Seu perfil está pronto.");
        navigate({ to: "/dashboard" });
      }
    } catch {
      toast.error("Não foi possível salvar agora. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen surface-soft px-4 py-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <BrandLogo />
        <Progress value={((step + 1) / STEP_TITLES.length) * 100} />

        <Card>
          <CardHeader>
            <CardDescription>
              Etapa {step + 1} de {STEP_TITLES.length}
            </CardDescription>
            <CardTitle>{STEP_TITLES[step]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 ? (
              <>
                <ResumeImport onImported={(data) => setForm({ ...form, ...(data as ProfileData) })} />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome completo</Label>
                    <Input
                      value={form.full_name ?? ""}
                      onChange={(e) => set({ full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo atual</Label>
                    <Input
                      value={form.current_position ?? ""}
                      onChange={(e) => set({ current_position: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cargo desejado</Label>
                    <Input
                      value={form.desired_position ?? ""}
                      onChange={(e) => set({ desired_position: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Localização</Label>
                    <Input
                      value={form.location ?? ""}
                      onChange={(e) => set({ location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pretensão salarial (opcional)</Label>
                    <Input
                      value={form.salary_expectation ?? ""}
                      onChange={(e) => set({ salary_expectation: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Modelo de trabalho desejado</Label>
                    <Select
                      value={form.work_model ?? ""}
                      onValueChange={(value) => set({ work_model: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {WORK_MODELS.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <ExperienceList
                items={form.experiences ?? []}
                onChange={(experiences) => set({ experiences })}
              />
            ) : null}
            {step === 2 ? (
              <EducationList items={form.education ?? []} onChange={(education) => set({ education })} />
            ) : null}
            {step === 3 ? (
              <SkillList items={form.skills ?? []} onChange={(skills) => set({ skills })} />
            ) : null}
            {step === 4 ? (
              <LanguageList items={form.languages ?? []} onChange={(languages) => set({ languages })} />
            ) : null}
            {step === 5 ? (
              <CertificationList
                items={form.certifications ?? []}
                onChange={(certifications) => set({ certifications })}
              />
            ) : null}
            {step === 6 ? (
              <div className="space-y-2">
                <Label>Resumo profissional</Label>
                <Textarea
                  rows={6}
                  placeholder="Conte em poucas linhas quem você é profissionalmente."
                  value={form.summary ?? ""}
                  onChange={(e) => set({ summary: e.target.value })}
                />
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                disabled={step === 0}
                onClick={() => setStep((current) => current - 1)}
              >
                Voltar
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => save(false)}>
                  Salvar
                </Button>
                {last ? (
                  <Button type="button" onClick={() => save(true)} disabled={updateProfile.isPending}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Concluir
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      save(false);
                      setStep((current) => current + 1);
                    }}
                  >
                    Continuar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
