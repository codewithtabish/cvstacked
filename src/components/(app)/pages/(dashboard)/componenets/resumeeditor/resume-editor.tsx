"use client";

import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  GraduationCap,
  Heart,
  Languages,
  Lightbulb,
  Pencil,
  Plus,
  Settings2,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadDraft, saveDraft } from "@/lib/resume-draft";
import type { ResumeData } from "@/types/resume";

import EducationEditorSection from "./education-section-editor";
import ExperienceSectionEditor, {
  type ExperienceValidationErrors,
  validateExperience,
} from "./experience-section-editor";
import {
  PersonalSectionEditor,
  type PersonalValidationErrors,
  validatePersonalInfo,
} from "./personalsectioneditor";
import { ResumePreview } from "./resume-previewer";
import SkillsSectionEditor, {
  type SkillsValidationErrors,
  validateSkills,
} from "./skills-section-editor";
import { SummarySectionEditor } from "./summarysectioneditor";

interface ResumeEditorProps {
  initialResume?: ResumeData;
  templateId: string;
}

type SectionId =
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

interface ResumeSection {
  id: SectionId;
  label: string;
  description: string;
  icon: typeof User;
}

const SECTIONS: ResumeSection[] = [
  {
    id: "personal",
    label: "Personal",
    description: "Basic information",
    icon: User,
  },
  {
    id: "summary",
    label: "Summary",
    description: "Professional introduction",
    icon: FileText,
  },
  {
    id: "experience",
    label: "Experience",
    description: "Work history",
    icon: Briefcase,
  },
  {
    id: "education",
    label: "Education",
    description: "Academic background",
    icon: GraduationCap,
  },
  {
    id: "skills",
    label: "Skills",
    description: "Key skills",
    icon: Wrench,
  },
  {
    id: "projects",
    label: "Projects",
    description: "Important projects",
    icon: Lightbulb,
  },
  {
    id: "certifications",
    label: "Certifications",
    description: "Professional credentials",
    icon: Award,
  },
  {
    id: "languages",
    label: "Languages",
    description: "Language proficiency",
    icon: Languages,
  },
  {
    id: "awards",
    label: "Awards",
    description: "Achievements",
    icon: Sparkles,
  },
  {
    id: "publications",
    label: "Publications",
    description: "Published work",
    icon: BookOpen,
  },
  {
    id: "volunteer",
    label: "Volunteer",
    description: "Volunteer experience",
    icon: Heart,
  },
  {
    id: "references",
    label: "References",
    description: "Professional references",
    icon: User,
  },
  {
    id: "interests",
    label: "Interests",
    description: "Hobbies and interests",
    icon: Sparkles,
  },
  {
    id: "custom",
    label: "Custom",
    description: "Additional information",
    icon: Plus,
  },
];

function createEmptyResume(templateId: string): ResumeData {
  return {
    id: crypto.randomUUID(),
    title: "Untitled Resume",
    templateId,
    themeId: "blue",
    fontFamilyId: "inter",
    typographyScale: "comfortable",
    personal: {
      firstName: "",
      lastName: "",
      jobTitle: "",
      photo: "",
      email: "",
      phone: "",
      location: "",
      address: "",
      website: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    publications: [],
    volunteer: [],
    references: [],
    interests: [],
    customSections: [],
  };
}

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function normalizeResume(resume: ResumeData, templateId: string): ResumeData {
  const personal = resume.personal ?? {};

  return {
    ...resume,
    id: resume.id ?? crypto.randomUUID(),
    title: resume.title ?? "Untitled Resume",
    templateId,
    themeId: resume.themeId ?? "blue",
    fontFamilyId: resume.fontFamilyId ?? "inter",
    typographyScale: resume.typographyScale ?? "comfortable",
    personal: {
      firstName: personal.firstName ?? "",
      lastName: personal.lastName ?? "",
      jobTitle: personal.jobTitle ?? "",
      photo: personal.photo ?? "",
      email: personal.email ?? "",
      phone: personal.phone ?? "",
      location: personal.location ?? "",
      address: personal.address ?? "",
      website: personal.website ?? "",
      linkedin: personal.linkedin ?? "",
      github: personal.github ?? "",
      portfolio: personal.portfolio ?? "",
    },
    summary: resume.summary ?? "",
    experience: resume.experience ?? [],
    education: resume.education ?? [],
    skills: resume.skills ?? [],
    projects: resume.projects ?? [],
    certifications: resume.certifications ?? [],
    languages: resume.languages ?? [],
    awards: resume.awards ?? [],
    publications: resume.publications ?? [],
    volunteer: resume.volunteer ?? [],
    references: resume.references ?? [],
    interests: resume.interests ?? [],
    customSections: resume.customSections ?? [],
  };
}

/**
 * Draft is the source of truth when it exists.
 *
 * Priority:
 * 1. sessionStorage draft
 * 2. initialResume
 * 3. completely empty resume
 */
function getInitialResume(templateId: string, initialResume?: ResumeData): ResumeData {
  const draft = loadDraft(templateId);

  if (draft?.resume) {
    return normalizeResume(draft.resume, templateId);
  }

  if (initialResume) {
    return normalizeResume(initialResume, templateId);
  }

  return createEmptyResume(templateId);
}

function getInitialSectionIndex(templateId: string): number {
  const draft = loadDraft(templateId);

  if (draft && typeof draft.activeSectionIndex === "number") {
    return Math.min(Math.max(0, draft.activeSectionIndex), SECTIONS.length - 1);
  }

  return 0;
}

function validateSummary(summary: string): boolean {
  return summary.trim().length > 0;
}

function validateEducation(education: ResumeData["education"]): boolean {
  if (!education || education.length === 0) {
    return true;
  }

  return education.every((item) => {
    const institutionValid =
      typeof item.institution === "string" && item.institution.trim().length > 0;

    const degreeValid = typeof item.degree === "string" && item.degree.trim().length > 0;

    const startDateValid = typeof item.startDate === "string" && item.startDate.trim().length > 0;

    return institutionValid && degreeValid && startDateValid;
  });
}

export function ResumeEditor({ initialResume, templateId }: ResumeEditorProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div className="flex h-full min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Loading draft…
      </div>
    );
  }

  return <ResumeEditorClient initialResume={initialResume} templateId={templateId} />;
}

function ResumeEditorClient({ initialResume, templateId }: ResumeEditorProps) {
  const [resume, setResume] = useState<ResumeData>(() =>
    getInitialResume(templateId, initialResume),
  );

  const [activeSectionIndex, setActiveSectionIndex] = useState(() =>
    getInitialSectionIndex(templateId),
  );

  const [view, setView] = useState<"editor" | "preview">("editor");

  const [personalErrors, setPersonalErrors] = useState<PersonalValidationErrors>({});
  const [personalValidationStarted, setPersonalValidationStarted] = useState(false);

  const [experienceErrors, setExperienceErrors] = useState<ExperienceValidationErrors>({});
  const [experienceValidationStarted, setExperienceValidationStarted] = useState(false);

  const [educationValidationStarted, setEducationValidationStarted] = useState(false);

  const [skillsErrors, setSkillsErrors] = useState<SkillsValidationErrors>({});
  const [skillsValidationStarted, setSkillsValidationStarted] = useState(false);

  /**
   * IMPORTANT:
   *
   * editorDraft is the complete resume used by the section editors.
   * It must stay synchronized with the real resume, including:
   *
   * - themeId
   * - fontFamilyId
   * - typographyScale
   */
  const [editorDraft, setEditorDraft] = useState<ResumeData>(() =>
    getInitialResume(templateId, initialResume),
  );

  const emptyResume = useMemo(() => createEmptyResume(templateId), [templateId]);

  /**
   * Persist the complete resume.
   */
  useEffect(() => {
    saveDraft(templateId, resume, activeSectionIndex);
  }, [templateId, resume, activeSectionIndex]);

  const activeSection = SECTIONS[activeSectionIndex] ?? SECTIONS[0];

  const ActiveIcon = activeSection.icon;

  const isFirst = activeSectionIndex === 0;
  const isLast = activeSectionIndex === SECTIONS.length - 1;

  const summaryComplete = validateSummary(resume.summary ?? "");

  const educationComplete = validateEducation(resume.education ?? []);

  const skillsComplete = Object.keys(validateSkills(resume.skills ?? [])).length === 0;

  /**
   * Handles changes from section editors AND the Customize dialog.
   *
   * The important fix is that appearance properties are now preserved:
   *
   * - themeId
   * - fontFamilyId
   * - typographyScale
   *
   * Previously these values were lost because the switch below only
   * copied the currently active section.
   */
  const onChange = (next: ResumeData) => {
    const normalizedNext = normalizeResume(next, templateId);

    /**
     * Keep editorDraft completely synchronized.
     */
    setEditorDraft(normalizedNext);

    /**
     * Update the real resume.
     *
     * We preserve the section-specific update behavior, but ALSO
     * preserve global resume properties such as appearance.
     */
    setResume((currentResume) => {
      const updatedResume: ResumeData = {
        ...currentResume,

        /**
         * Global properties.
         *
         * These are what the Customize dialog changes.
         */
        title: normalizedNext.title,
        themeId: normalizedNext.themeId,
        fontFamilyId: normalizedNext.fontFamilyId,
        typographyScale: normalizedNext.typographyScale,

        /**
         * Keep template identity stable.
         */
        templateId,
      };

      switch (activeSection.id) {
        case "personal":
          return {
            ...updatedResume,
            personal: normalizedNext.personal,
          };

        case "summary":
          return {
            ...updatedResume,
            summary: normalizedNext.summary,
          };

        case "experience":
          return {
            ...updatedResume,
            experience: normalizedNext.experience,
          };

        case "education":
          return {
            ...updatedResume,
            education: normalizedNext.education,
          };

        case "skills":
          return {
            ...updatedResume,
            skills: normalizedNext.skills,
          };

        case "projects":
          return {
            ...updatedResume,
            projects: normalizedNext.projects,
          };

        case "certifications":
          return {
            ...updatedResume,
            certifications: normalizedNext.certifications,
          };

        case "languages":
          return {
            ...updatedResume,
            languages: normalizedNext.languages,
          };

        case "awards":
          return {
            ...updatedResume,
            awards: normalizedNext.awards,
          };

        case "publications":
          return {
            ...updatedResume,
            publications: normalizedNext.publications,
          };

        case "volunteer":
          return {
            ...updatedResume,
            volunteer: normalizedNext.volunteer,
          };

        case "references":
          return {
            ...updatedResume,
            references: normalizedNext.references,
          };

        case "interests":
          return {
            ...updatedResume,
            interests: normalizedNext.interests,
          };

        case "custom":
          return {
            ...updatedResume,
            customSections: normalizedNext.customSections,
          };

        default:
          return updatedResume;
      }
    });

    /**
     * Revalidate active sections while typing.
     */
    if (activeSection.id === "personal" && personalValidationStarted) {
      setPersonalErrors(validatePersonalInfo(normalizedNext.personal));
    }

    if (activeSection.id === "experience" && experienceValidationStarted) {
      setExperienceErrors(validateExperience(normalizedNext.experience ?? []));
    }

    if (activeSection.id === "skills" && skillsValidationStarted) {
      setSkillsErrors(validateSkills(normalizedNext.skills ?? []));
    }
  };

  /**
   * Validation for the current section.
   */
  const validateCurrentSection = (): boolean => {
    if (activeSection.id === "personal") {
      setPersonalValidationStarted(true);

      const errors = validatePersonalInfo(resume.personal);

      setPersonalErrors(errors);

      return Object.keys(errors).length === 0;
    }

    if (activeSection.id === "summary") {
      return summaryComplete;
    }

    if (activeSection.id === "experience") {
      setExperienceValidationStarted(true);

      const errors = validateExperience(resume.experience ?? []);

      setExperienceErrors(errors);

      return Object.keys(errors).length === 0;
    }

    if (activeSection.id === "education") {
      setEducationValidationStarted(true);

      return educationComplete;
    }

    if (activeSection.id === "skills") {
      setSkillsValidationStarted(true);

      const errors = validateSkills(resume.skills ?? []);

      setSkillsErrors(errors);

      return Object.keys(errors).length === 0;
    }

    return true;
  };

  const resetValidation = () => {
    setPersonalValidationStarted(false);
    setPersonalErrors({});

    setExperienceValidationStarted(false);
    setExperienceErrors({});

    setEducationValidationStarted(false);

    setSkillsValidationStarted(false);
    setSkillsErrors({});
  };

  /**
   * Move to another section.
   */
  const moveToSection = (index: number) => {
    if (index < 0 || index >= SECTIONS.length) {
      return;
    }

    setActiveSectionIndex(index);
    resetValidation();

    /**
     * IMPORTANT:
     *
     * Use the latest complete resume.
     *
     * This includes customization changes.
     */
    setEditorDraft(resume);
  };

  const handleNext = () => {
    if (isLast) {
      return;
    }

    const valid = validateCurrentSection();

    if (!valid) {
      return;
    }

    moveToSection(activeSectionIndex + 1);
  };

  const handlePrevious = () => {
    if (isFirst) {
      return;
    }

    moveToSection(activeSectionIndex - 1);
  };

  const handleSectionChange = (index: number) => {
    if (index < 0 || index >= SECTIONS.length) {
      return;
    }

    if (index === activeSectionIndex) {
      return;
    }

    if (index < activeSectionIndex) {
      moveToSection(index);
      return;
    }

    const valid = validateCurrentSection();

    if (!valid) {
      return;
    }

    moveToSection(index);
  };

  const isSectionCompleted = (index: number): boolean => {
    if (index >= activeSectionIndex) {
      return false;
    }

    const section = SECTIONS[index];

    switch (section.id) {
      case "personal":
        return Object.keys(validatePersonalInfo(resume.personal)).length === 0;

      case "summary":
        return summaryComplete;

      case "experience":
        return Object.keys(validateExperience(resume.experience ?? [])).length === 0;

      case "education":
        return educationComplete;

      case "skills":
        return skillsComplete;

      default:
        return true;
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-5 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-sm font-semibold tracking-tight">CVStacked</span>

          <Separator orientation="vertical" className="h-5" />

          <span className="truncate text-sm text-muted-foreground">
            {resume.title || "Untitled Resume"}
          </span>
        </div>

        <Tabs value={view} onValueChange={(value) => setView(value as "editor" | "preview")}>
          <TabsList className="h-9">
            <TabsTrigger value="editor" className="gap-1.5 px-3">
              <Pencil className="h-3.5 w-3.5" />

              <span className="hidden sm:inline">Editor</span>
            </TabsTrigger>

            <TabsTrigger value="preview" className="gap-1.5 px-3">
              <Eye className="h-3.5 w-3.5" />

              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="hidden items-center gap-2 sm:flex">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setView("preview")}
          >
            <Settings2 className="h-3.5 w-3.5" />
            Customize
          </Button>

          <Button type="button" size="sm">
            Download
          </Button>
        </div>
      </header>

      <Tabs
        value={view}
        onValueChange={(value) => setView(value as "editor" | "preview")}
        className="min-h-0 flex-1"
      >
        <TabsContent value="editor" className="mt-0 h-full min-h-0 data-[state=inactive]:hidden">
          <div className="flex h-full min-h-0 flex-col">
            {/* MOBILE SECTION NAVIGATION */}
            <div className="shrink-0 border-b border-border bg-background lg:hidden">
              <div className="px-3 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    disabled={isFirst}
                    onClick={handlePrevious}
                    aria-label="Previous section"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex gap-2 overflow-x-auto">
                      {SECTIONS.map((section, index) => {
                        const Icon = section.icon;
                        const isActive = index === activeSectionIndex;
                        const isCompleted = isSectionCompleted(index);
                        const isDisabled = index > activeSectionIndex;

                        return (
                          <button
                            key={section.id}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleSectionChange(index)}
                            className={[
                              "min-w-[110px] flex-1 rounded-lg border px-2.5 py-2 text-left",
                              "transition-all duration-200",
                              isActive
                                ? "border-primary/30 bg-primary/5"
                                : isCompleted
                                  ? "border-border bg-muted/30"
                                  : "border-transparent bg-muted/20 opacity-50",
                              isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                            ].join(" ")}
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className={[
                                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                                  isActive
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background text-muted-foreground",
                                ].join(" ")}
                              >
                                {isCompleted ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <Icon className="h-3.5 w-3.5" />
                                )}
                              </span>

                              <span className="min-w-0 truncate">
                                <span
                                  className={[
                                    "block truncate text-xs font-medium",
                                    isActive ? "text-foreground" : "text-muted-foreground",
                                  ].join(" ")}
                                >
                                  {section.label}
                                </span>

                                {isActive && (
                                  <span className="mt-0.5 block text-[10px] text-muted-foreground">
                                    {index + 1} of {SECTIONS.length}
                                  </span>
                                )}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    disabled={isLast}
                    onClick={handleNext}
                    aria-label="Next section"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* DESKTOP EDITOR */}
            <div className="hidden min-h-0 flex-1 lg:flex">
              <aside className="w-[270px] shrink-0 border-r border-border bg-muted/20">
                <div className="flex h-full flex-col">
                  <div className="border-b border-border px-5 py-5">
                    <p className="text-sm font-semibold tracking-tight">Resume sections</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Complete each section to build your resume.
                    </p>
                  </div>

                  <ScrollArea className="min-h-0 flex-1">
                    <div className="p-3">
                      <div className="space-y-1">
                        {SECTIONS.map((section, index) => {
                          const Icon = section.icon;
                          const isActive = index === activeSectionIndex;
                          const isCompleted = isSectionCompleted(index);
                          const isDisabled = index > activeSectionIndex;

                          return (
                            <button
                              key={section.id}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => handleSectionChange(index)}
                              className={[
                                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                                "transition-colors duration-150",
                                isActive
                                  ? "bg-primary/8 text-foreground ring-1 ring-primary/15"
                                  : isCompleted
                                    ? "text-foreground hover:bg-muted"
                                    : "text-muted-foreground opacity-50",
                                isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                                  isActive
                                    ? "border-primary/25 bg-primary text-primary-foreground"
                                    : "border-border bg-background",
                                ].join(" ")}
                              >
                                {isCompleted ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <Icon className="h-3.5 w-3.5" />
                                )}
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13px] font-medium">
                                  {section.label}
                                </span>

                                <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                                  {section.description}
                                </span>
                              </span>

                              <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground/50">
                                {index + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </ScrollArea>

                  <div className="border-t border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium">
                          {activeSectionIndex + 1} of {SECTIONS.length}
                        </p>

                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          Sections completed
                        </p>
                      </div>

                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{
                            width: `${((activeSectionIndex + 1) / SECTIONS.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              <ScrollArea className="min-w-0 flex-1">
                <div className="w-full px-8 py-8 xl:px-12 2xl:px-16">
                  <div className="mx-auto w-full max-w-5xl">
                    <SectionContent
                      activeSection={activeSection}
                      ActiveIcon={ActiveIcon}
                      resume={editorDraft}
                      emptyResume={emptyResume}
                      onChange={onChange}
                      personalErrors={personalErrors}
                      onPersonalValidate={setPersonalErrors}
                      experienceErrors={experienceErrors}
                      onExperienceValidate={setExperienceErrors}
                      skillsErrors={skillsErrors}
                      onSkillsValidate={setSkillsErrors}
                    />

                    <EditorNavigation
                      isFirst={isFirst}
                      isLast={isLast}
                      sectionIndex={activeSectionIndex}
                      totalSections={SECTIONS.length}
                      onPrevious={handlePrevious}
                      onNext={handleNext}
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* MOBILE EDITOR */}
            <ScrollArea className="min-h-0 flex-1 lg:hidden">
              <div className="w-full px-4 py-6 sm:px-6 sm:py-8">
                <div className="mx-auto w-full max-w-3xl">
                  <SectionContent
                    activeSection={activeSection}
                    ActiveIcon={ActiveIcon}
                    resume={editorDraft}
                    emptyResume={emptyResume}
                    onChange={onChange}
                    personalErrors={personalErrors}
                    onPersonalValidate={setPersonalErrors}
                    experienceErrors={experienceErrors}
                    onExperienceValidate={setExperienceErrors}
                    skillsErrors={skillsErrors}
                    onSkillsValidate={setSkillsErrors}
                  />

                  <EditorNavigation
                    isFirst={isFirst}
                    isLast={isLast}
                    sectionIndex={activeSectionIndex}
                    totalSections={SECTIONS.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* PREVIEW */}
        <TabsContent
          value="preview"
          className="mt-0 h-full min-h-0 overflow-hidden data-[state=inactive]:hidden"
        >
          <div className="h-full w-full overflow-hidden bg-muted/40">
            <ResumePreview resume={resume} id={templateId} onChange={onChange} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SectionContentProps {
  activeSection: ResumeSection;
  ActiveIcon: typeof User;
  resume: ResumeData;
  emptyResume: ResumeData;
  onChange: (next: ResumeData) => void;
  personalErrors: PersonalValidationErrors;
  onPersonalValidate: (errors: PersonalValidationErrors) => void;
  experienceErrors: ExperienceValidationErrors;
  onExperienceValidate: (errors: ExperienceValidationErrors) => void;
  skillsErrors: SkillsValidationErrors;
  onSkillsValidate: (errors: SkillsValidationErrors) => void;
}

function SectionContent({
  activeSection,
  ActiveIcon,
  resume,
  emptyResume,
  onChange,
  personalErrors,
  onPersonalValidate,
  experienceErrors,
  onExperienceValidate,
  skillsErrors,
  onSkillsValidate,
}: SectionContentProps) {
  void emptyResume;

  return (
    <div>
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40">
            <ActiveIcon className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {activeSection.label}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">{activeSection.description}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background shadow-sm">
        <div className="p-5 sm:p-7 lg:p-8">
          {activeSection.id === "personal" ? (
            <PersonalSectionEditor
              resume={resume}
              onChange={onChange}
              errors={personalErrors}
              onValidate={onPersonalValidate}
            />
          ) : activeSection.id === "summary" ? (
            <SummarySectionEditor resume={resume} onChange={onChange} />
          ) : activeSection.id === "experience" ? (
            <ExperienceSectionEditor
              resume={resume}
              onChange={onChange}
              errors={experienceErrors}
              onValidate={onExperienceValidate}
            />
          ) : activeSection.id === "education" ? (
            <EducationEditorSection
              resume={resume}
              onUpdate={(education) =>
                onChange({
                  ...resume,
                  education,
                })
              }
            />
          ) : activeSection.id === "skills" ? (
            <SkillsSectionEditor
              resume={resume}
              onChange={onChange}
              errors={skillsErrors}
              onValidate={onSkillsValidate}
            />
          ) : activeSection.id === "projects" ? (
            <EmptySectionState
              icon={Lightbulb}
              title="Projects editor coming soon"
              description="The projects editor has not been created yet. Your projects data is preserved, and this section will be available once the editor is added."
            />
          ) : (
            <EmptySectionState
              icon={ActiveIcon}
              title={`${activeSection.label} editor`}
              description="This section is ready to be connected to its editor."
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface EmptySectionStateProps {
  icon: typeof User;
  title: string;
  description: string;
}

function EmptySectionState({ icon: Icon, title, description }: EmptySectionStateProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>

      <h2 className="text-sm font-medium">{title}</h2>

      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

interface EditorNavigationProps {
  isFirst: boolean;
  isLast: boolean;
  sectionIndex: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
}

function EditorNavigation({
  isFirst,
  isLast,
  sectionIndex,
  totalSections,
  onPrevious,
  onNext,
}: EditorNavigationProps) {
  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <Button type="button" variant="outline" size="sm" disabled={isFirst} onClick={onPrevious}>
        <ChevronLeft className="mr-1.5 h-3.5 w-3.5" />
        Previous
      </Button>

      <span className="hidden text-xs text-muted-foreground sm:block">
        Section {sectionIndex + 1} of {totalSections}
      </span>

      <Button type="button" size="sm" disabled={isLast} onClick={onNext}>
        Next
        <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
