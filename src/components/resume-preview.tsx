import type { ResumeContent } from "@/lib/matchcv-types";

export function ResumePreview({ content }: { content: ResumeContent }) {
  return (
    <article className="print-area mx-auto max-w-[820px] bg-card p-8 text-sm shadow-sm sm:p-12">
      <header className="border-b border-foreground pb-4">
        <h1 className="text-3xl font-bold uppercase">{content.fullName}</h1>
        <p className="mt-1 text-lg font-medium">{content.headline}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {[content.contact.email, content.contact.phone, content.contact.location, ...content.contact.links]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </header>
      <ResumeSection title="Resumo">
        <p>{content.summary}</p>
      </ResumeSection>
      <ResumeSection title="Experiência profissional">
        {content.experiences.map((item, index) => (
          <div key={`${item.company}-${index}`} className="mb-4 break-inside-avoid">
            <div className="flex justify-between gap-3 font-semibold">
              <span>{item.position} · {item.company}</span><span>{item.period}</span>
            </div>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {item.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}
            </ul>
          </div>
        ))}
      </ResumeSection>
      <ResumeSection title="Formação">
        {content.education.map((item, index) => (
          <p key={`${item.institution}-${index}`} className="mb-2">
            <strong>{item.course}</strong>{item.degree ? ` — ${item.degree}` : ""}, {item.institution} · {item.period}
          </p>
        ))}
      </ResumeSection>
      {content.skills.length ? <ResumeSection title="Habilidades"><p>{content.skills.join(" • ")}</p></ResumeSection> : null}
      {content.languages.length ? <ResumeSection title="Idiomas"><p>{content.languages.join(" • ")}</p></ResumeSection> : null}
      {content.certifications.length ? <ResumeSection title="Certificações"><p>{content.certifications.join(" • ")}</p></ResumeSection> : null}
      {content.projects.length ? (
        <ResumeSection title="Projetos">
          {content.projects.map((item, index) => <p key={`${item.name}-${index}`} className="mb-2"><strong>{item.name}:</strong> {item.description}</p>)}
        </ResumeSection>
      ) : null}
    </article>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-5"><h2 className="mb-2 border-b border-border pb-1 text-sm font-bold uppercase">{title}</h2>{children}</section>;
}