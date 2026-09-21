import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeImport } from "@/components/resume-import";
import {
  CertificationList,
  EducationList,
  ExperienceList,
  LanguageList,
  LinkList,
  ProjectList,
  SkillList,
} from "@/components/profile-sections";
import { useProfile, useUpdateProfile } from "@/hooks/use-matchcv";
import { WORK_MODELS, type ProfileData } from "@/lib/matchcv-types";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil | MatchCV" },
      { name: "description", content: "Gerencie seu perfil profissional completo no MatchCV." },
      { property: "og:title", content: "Meu perfil | MatchCV" },
      {
        property: "og:description",
        content: "Gerencie seu perfil profissional completo no MatchCV.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (profile && !form) setForm(profile);
  }, [profile, form]);

  const set = (patch: Partial<ProfileData>) => setForm((current) => (current ? { ...current, ...patch } : current));

  async function save() {
    if (!form) return;
    const { id, ...rest } = form;
    void id;
    try {
      await updateProfile.mutateAsync(rest);
      toast.success("Perfil salvo.");
    } catch {
      toast.error("Não foi possível salvar agora.");
    }
  }

  return (
    <AppShell
      title="Meu Perfil"
      description="Seus dados profissionais são a base de todos os currículos"
      action={
        <Button onClick={save} disabled={updateProfile.isPending || !form}>
          <Save className="mr-2 h-4 w-4" /> Salvar
        </Button>
      }
    >
      {isLoading || !form ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <div className="space-y-6">
          <ResumeImport onImported={(data) => set(data as Partial<ProfileData>)} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="Nome completo" value={form.full_name} onChange={(v) => set({ full_name: v })} />
              <Field label="E-mail" value={form.email} onChange={(v) => set({ email: v })} />
              <Field label="Telefone" value={form.phone} onChange={(v) => set({ phone: v })} />
              <Field label="Localização" value={form.location} onChange={(v) => set({ location: v })} />
              <Field
                label="Título profissional"
                value={form.headline}
                onChange={(v) => set({ headline: v })}
              />
              <Field
                label="Cargo atual"
                value={form.current_position}
                onChange={(v) => set({ current_position: v })}
              />
              <Field
                label="Cargo desejado"
                value={form.desired_position}
                onChange={(v) => set({ desired_position: v })}
              />
              <Field
                label="Pretensão salarial"
                value={form.salary_expectation}
                onChange={(v) => set({ salary_expectation: v })}
              />
              <div className="space-y-2">
                <Label>Modelo de trabalho</Label>
                <Select value={form.work_model ?? ""} onValueChange={(v) => set({ work_model: v })}>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={5}
                value={form.summary ?? ""}
                onChange={(e) => set({ summary: e.target.value })}
              />
            </CardContent>
          </Card>

          <Accordion type="multiple" defaultValue={["experiencia"]} className="space-y-3">
            <Section value="experiencia" title="Experiência">
              <ExperienceList
                items={form.experiences ?? []}
                onChange={(experiences) => set({ experiences })}
              />
            </Section>
            <Section value="formacao" title="Formação">
              <EducationList items={form.education ?? []} onChange={(education) => set({ education })} />
            </Section>
            <Section value="habilidades" title="Habilidades">
              <SkillList items={form.skills ?? []} onChange={(skills) => set({ skills })} />
            </Section>
            <Section value="idiomas" title="Idiomas">
              <LanguageList items={form.languages ?? []} onChange={(languages) => set({ languages })} />
            </Section>
            <Section value="certificacoes" title="Certificações">
              <CertificationList
                items={form.certifications ?? []}
                onChange={(certifications) => set({ certifications })}
              />
            </Section>
            <Section value="projetos" title="Projetos">
              <ProjectList items={form.projects ?? []} onChange={(projects) => set({ projects })} />
            </Section>
            <Section value="links" title="Links">
              <LinkList items={form.links ?? []} onChange={(links) => set({ links })} />
            </Section>
          </Accordion>

          <div className="flex justify-end">
            <Button onClick={save} disabled={updateProfile.isPending}>
              <Save className="mr-2 h-4 w-4" /> Salvar perfil
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Section({
  value,
  title,
  children,
}: {
  value: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem value={value} className="rounded-xl border border-border bg-card px-4">
      <AccordionTrigger className="text-base font-semibold">{title}</AccordionTrigger>
      <AccordionContent className="pb-4">{children}</AccordionContent>
    </AccordionItem>
  );
}
