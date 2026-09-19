export type SkillLevel = "Básico" | "Intermediário" | "Avançado" | "Especialista";

export type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string;
  achievements: string;
};

export type Education = {
  id: string;
  institution: string;
  course: string;
  degree: string;
  startDate: string;
  endDate: string;
};

export type Skill = { id: string; name: string; level: SkillLevel };
export type Language = { id: string; name: string; level: string };
export type Certification = { id: string; name: string; issuer: string; year: string };
export type ProjectItem = { id: string; name: string; description: string; url: string };
export type LinkItem = { id: string; label: string; url: string };

export type ProfileData = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  headline: string | null;
  current_position: string | null;
  desired_position: string | null;
  location: string | null;
  salary_expectation: string | null;
  work_model: string | null;
  summary: string | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: ProjectItem[];
  links: LinkItem[];
  onboarding_completed: boolean;
};

export type ParsedJob = {
  title: string;
  company: string;
  location: string;
  workModel: string;
  requiredRequirements: string[];
  desirableRequirements: string[];
  hardSkills: string[];
  softSkills: string[];
  tools: string[];
  technologies: string[];
  education: string[];
  experience: string;
  languages: string[];
  keywords: string[];
  responsibilities: string[];
  benefits: string[];
};

export type CategoryScore = { name: string; score: number; note: string };

export type AnalysisResult = {
  score: number;
  categories: CategoryScore[];
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  metRequirements: string[];
  unmetRequirements: string[];
  strengths: string[];
  improvements: string[];
  summary: string;
};

export type ResumeContent = {
  fullName: string;
  headline: string;
  contact: { email: string; phone: string; location: string; links: string[] };
  summary: string;
  experiences: {
    company: string;
    position: string;
    period: string;
    bullets: string[];
  }[];
  education: { institution: string; course: string; degree: string; period: string }[];
  skills: string[];
  languages: string[];
  certifications: string[];
  projects: { name: string; description: string }[];
};

export type ResumeChange = { section: string; change: string; reason: string };

export const WORK_MODELS = ["Presencial", "Híbrido", "Remoto", "Indiferente"] as const;
export const SKILL_LEVELS: SkillLevel[] = [
  "Básico",
  "Intermediário",
  "Avançado",
  "Especialista",
];

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const emptyProfileSections = {
  experiences: [] as Experience[],
  education: [] as Education[],
  skills: [] as Skill[],
  languages: [] as Language[],
  certifications: [] as Certification[],
  projects: [] as ProjectItem[],
  links: [] as LinkItem[],
};
