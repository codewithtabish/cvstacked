export type ResumeTemplate =
  | "modern"
  | "professional"
  | "minimal"
  | "creative"
  | "executive"
  | "classic"
  | "elegant"
  | "technical"
  | "compact";

export type ResumeSectionType =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "awards"
  | "publications"
  | "volunteer"
  | "references"
  | "interests"
  | "custom";

export interface ResumePersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  photo: string;
  email: string;
  phone: string;
  location: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  employmentType?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  achievements: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  grade?: string;
  description?: string;
}

export interface ResumeSkill {
  id: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  category?: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  role?: string;
  description: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  github?: string;
  achievements?: string[];
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface ResumeLanguage {
  id: string;
  name: string;
  proficiency: "elementary" | "conversational" | "professional" | "fluent" | "native";
}

export interface ResumeAward {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface ResumePublication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface ResumeVolunteer {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
}

export interface ResumeReference {
  id: string;
  name: string;
  position: string;
  company: string;
  email?: string;
  phone?: string;
  relationship?: string;
}

export interface ResumeCustomSection {
  id: string;
  title: string;
  description?: string;
  items: {
    id: string;
    title: string;
    subtitle?: string;
    date?: string;
    description?: string;
  }[];
}

export interface ResumeData {
  id: string;
  title: string;
  templateId: string;
  themeId: string;
  fontFamilyId: string;
  typographyScale: string;
  personal: ResumePersonalInfo;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  languages: ResumeLanguage[];
  awards: ResumeAward[];
  publications: ResumePublication[];
  volunteer: ResumeVolunteer[];
  references: ResumeReference[];
  interests: string[];
  customSections: ResumeCustomSection[];
}
