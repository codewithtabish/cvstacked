import type { ResumeData } from "@/types/resume";

const PREFIX = "cvstacked:draft:";

export type ResumeDraft = {
  resume: ResumeData;
  activeSectionIndex: number;
  updatedAt: number;
};

export function getDraftKey(templateId: string) {
  return `${PREFIX}${templateId}`;
}

export function loadDraft(templateId: string): ResumeDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(getDraftKey(templateId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ResumeDraft;
    if (!parsed?.resume || typeof parsed.activeSectionIndex !== "number") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveDraft(templateId: string, resume: ResumeData, activeSectionIndex: number) {
  if (typeof window === "undefined") return;

  try {
    const payload: ResumeDraft = {
      resume,
      activeSectionIndex,
      updatedAt: Date.now(),
    };
    sessionStorage.setItem(getDraftKey(templateId), JSON.stringify(payload));
  } catch {
    // ignore quota / private mode errors
  }
}

export function clearDraft(templateId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(getDraftKey(templateId));
}
