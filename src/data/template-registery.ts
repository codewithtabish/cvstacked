import { ResumeTemplate } from "./resume";

export const resumeTemplates = {
  modern: {
    name: "Modern",
  },
  professional: {
    name: "Professional",
  },
  minimal: {
    name: "Minimal",
  },
  creative: {
    name: "Creative",
  },
  executive: {
    name: "Executive",
  },
  classic: {
    name: "Classic",
  },
  elegant: {
    name: "Elegant",
  },
  technical: {
    name: "Technical",
  },
  compact: {
    name: "Compact",
  },
} satisfies Record<ResumeTemplate, { name: string }>;
