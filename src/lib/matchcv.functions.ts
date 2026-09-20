import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  AnalysisResult,
  ParsedJob,
  ProfileData,
  ResumeChange,
  ResumeContent,
} from "./matchcv-types";

const NO_INVENTION =
  "Regra absoluta: NUNCA invente informações que não estejam no perfil do candidato. " +
  "Você pode reescrever, reorganizar, priorizar e usar a terminologia da vaga, mas jamais criar " +
  "experiências, empresas, datas, resultados numéricos ou habilidades inexistentes. " +
  "Responda sempre em português do Brasil e apenas com JSON válido.";

function profileForPrompt(profile: ProfileData) {
  return JSON.stringify(
    {
      nome: profile.full_name,
      titulo: profile.headline,
      cargo_atual: profile.current_position,
      cargo_desejado: profile.desired_position,
      localizacao: profile.location,
      modelo_trabalho: profile.work_model,
      resumo: profile.summary,
      experiencias: profile.experiences,
      formacao: profile.education,
      habilidades: profile.skills,
      idiomas: profile.languages,
      certificacoes: profile.certifications,
      projetos: profile.projects,
      links: profile.links,
      contato: { email: profile.email, telefone: profile.phone },
    },
    null,
    1,
  );
}

/** Estrutura a vaga e calcula a compatibilidade com o perfil. */
export const analyzeJobFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      profile: ProfileData;
      job: {
        title: string;
        company: string;
        location: string;
        url: string;
        description: string;
      };
    }) => input,
  )
  .handler(async ({ data }) => {
    const { askForJson } = await import("./ai.server");

    const result = await askForJson<{ parsed: ParsedJob; analysis: AnalysisResult }>([
      {
        role: "system",
        content:
          "Você é um especialista em recrutamento e em sistemas ATS. " +
          NO_INVENTION +
          ' Retorne exatamente este JSON: {"parsed":{"title":"","company":"","location":"","workModel":"",' +
          '"requiredRequirements":[],"desirableRequirements":[],"hardSkills":[],"softSkills":[],"tools":[],' +
          '"technologies":[],"education":[],"experience":"","languages":[],"keywords":[],"responsibilities":[],' +
          '"benefits":[]},"analysis":{"score":0,"categories":[{"name":"","score":0,"note":""}],' +
          '"matchedKeywords":[],"missingKeywords":[],"matchedSkills":[],"missingSkills":[],' +
          '"metRequirements":[],"unmetRequirements":[],"strengths":[],"improvements":[],"summary":""}}. ' +
          "As categorias devem ser exatamente: Experiência, Hard skills, Soft skills, Formação, Idiomas, " +
          "Ferramentas, Palavras-chave, Requisitos obrigatórios — cada uma com score de 0 a 100. " +
          "O score geral (0-100) representa apenas compatibilidade entre o perfil informado e os requisitos " +
          "identificados na vaga, nunca probabilidade de contratação.",
      },
      {
        role: "user",
        content:
          `PERFIL DO CANDIDATO:\n${profileForPrompt(data.profile)}\n\n` +
          `VAGA:\nCargo informado: ${data.job.title}\nEmpresa: ${data.job.company}\n` +
          `Localização: ${data.job.location}\nURL: ${data.job.url}\n\nDescrição:\n${data.job.description}`,
      },
    ]);

    return result;
  });

/** Gera a versão do currículo adaptada para a vaga. */
export const generateResumeFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { profile: ProfileData; parsed: ParsedJob; analysis: AnalysisResult }) => input,
  )
  .handler(async ({ data }) => {
    const { askForJson } = await import("./ai.server");

    return askForJson<{ content: ResumeContent; changes: ResumeChange[] }>([
      {
        role: "system",
        content:
          "Você monta currículos ATS-friendly em português do Brasil. " +
          NO_INVENTION +
          " Use seções padrão, frases objetivas, verbos de ação e as palavras-chave da vaga somente quando " +
          "forem verdadeiras para o candidato. Nada de tabelas, colunas, ícones ou gráficos. " +
          'Retorne este JSON: {"content":{"fullName":"","headline":"","contact":{"email":"","phone":"","location":"","links":[]},' +
          '"summary":"","experiences":[{"company":"","position":"","period":"","bullets":[]}],' +
          '"education":[{"institution":"","course":"","degree":"","period":""}],"skills":[],"languages":[],' +
          '"certifications":[],"projects":[{"name":"","description":""}]},' +
          '"changes":[{"section":"","change":"","reason":""}]}. ' +
          "Em changes, liste de 4 a 10 alterações feitas e o porquê de cada uma.",
      },
      {
        role: "user",
        content:
          `PERFIL:\n${profileForPrompt(data.profile)}\n\n` +
          `VAGA ESTRUTURADA:\n${JSON.stringify(data.parsed)}\n\n` +
          `ANÁLISE DE COMPATIBILIDADE:\n${JSON.stringify(data.analysis)}`,
      },
    ]);
  });

/** Transforma o texto de um currículo importado em campos estruturados. */
export const parseResumeTextFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { text: string }) => input)
  .handler(async ({ data }) => {
    const { askForJson } = await import("./ai.server");

    return askForJson<Partial<ProfileData>>([
      {
        role: "system",
        content:
          "Você extrai dados estruturados de currículos. " +
          NO_INVENTION +
          " Deixe em branco o que não encontrar. " +
          'Retorne este JSON: {"full_name":"","email":"","phone":"","headline":"","current_position":"",' +
          '"location":"","summary":"","experiences":[{"company":"","position":"","startDate":"","endDate":"",' +
          '"current":false,"description":"","responsibilities":"","achievements":""}],' +
          '"education":[{"institution":"","course":"","degree":"","startDate":"","endDate":""}],' +
          '"skills":[{"name":"","level":"Intermediário"}],"languages":[{"name":"","level":""}],' +
          '"certifications":[{"name":"","issuer":"","year":""}],"projects":[{"name":"","description":"","url":""}],' +
          '"links":[{"label":"","url":""}]}. Datas no formato MM/AAAA quando possível.',
      },
      { role: "user", content: data.text.slice(0, 24000) },
    ]);
  });
