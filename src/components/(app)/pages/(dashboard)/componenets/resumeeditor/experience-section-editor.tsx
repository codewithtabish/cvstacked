"use client";

import { BriefcaseBusiness, Plus, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { z } from "zod";

import type { ResumeData } from "@/types/resume";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/* ============================================================
   VALIDATION
============================================================ */

const monthSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}$/, "Please select a valid month and year.");

export const experienceItemSchema = z
  .object({
    id: z.string().min(1),

    position: z
      .string()
      .trim()
      .min(1, "Job title is required.")
      .max(120, "Job title must be 120 characters or less."),

    company: z
      .string()
      .trim()
      .min(1, "Company name is required.")
      .max(120, "Company name must be 120 characters or less."),

    location: z
      .string()
      .trim()
      .max(120, "Location must be 120 characters or less.")
      .optional()
      .or(z.literal("")),

    startDate: monthSchema,

    endDate: z.string().trim().optional().or(z.literal("")),

    current: z.boolean(),

    // Description is mandatory
    description: z
      .string()
      .trim()
      .min(1, "Description is required.")
      .max(1000, "Description must be 1000 characters or less."),

    // Achievements are optional — empty / blank entries are allowed
    achievements: z
      .array(z.string().trim().max(300, "Achievement must be 300 characters or less."))
      .max(8, "You can add up to 8 achievements.")
      .default([]),
  })
  .superRefine((experience, ctx) => {
    const startDate = experience.startDate.trim();
    const endDate = experience.endDate?.trim() ?? "";

    /*
     * Current position must not have an end date.
     */
    if (experience.current && endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Remove the end date because this is your current position.",
      });
    }

    /*
     * Non-current positions require an end date.
     */
    if (!experience.current && !endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date is required unless this is your current position.",
      });
    }

    /*
     * End date cannot be earlier than start date.
     */
    if (startDate && endDate && endDate < startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date cannot be earlier than the start date.",
      });
    }
  });

export const experienceSchema = z
  .array(experienceItemSchema)
  .min(1, "Add at least one work experience.");

export type ExperienceValidationErrors = {
  experiences?: string;

  items?: Record<
    string,
    {
      position?: string;
      company?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
      achievements?: string;
    }
  >;
};

/* ============================================================
   VALIDATION HELPERS
============================================================ */

export function validateExperience(
  experiences: ResumeData["experience"],
): ExperienceValidationErrors {
  const result = experienceSchema.safeParse(experiences);

  if (result.success) {
    return {};
  }

  const errors: ExperienceValidationErrors = {
    items: {},
  };

  for (const issue of result.error.issues) {
    const [index, field] = issue.path;

    /*
     * Array-level error.
     */
    if (typeof index !== "number") {
      errors.experiences ??= issue.message;
      continue;
    }

    const experience = experiences[index];

    if (!experience) {
      continue;
    }

    /*
     * Item-level error without a specific field.
     */
    if (field === undefined) {
      errors.experiences ??= issue.message;
      continue;
    }

    const fieldName = String(field);

    if (
      fieldName === "position" ||
      fieldName === "company" ||
      fieldName === "location" ||
      fieldName === "startDate" ||
      fieldName === "endDate" ||
      fieldName === "description" ||
      fieldName === "achievements"
    ) {
      errors.items![experience.id] ??= {};

      const itemErrors = errors.items![experience.id]!;

      if (fieldName === "position") {
        itemErrors.position ??= issue.message;
      }

      if (fieldName === "company") {
        itemErrors.company ??= issue.message;
      }

      if (fieldName === "location") {
        itemErrors.location ??= issue.message;
      }

      if (fieldName === "startDate") {
        itemErrors.startDate ??= issue.message;
      }

      if (fieldName === "endDate") {
        itemErrors.endDate ??= issue.message;
      }

      if (fieldName === "description") {
        itemErrors.description ??= issue.message;
      }

      if (fieldName === "achievements") {
        itemErrors.achievements ??= issue.message;
      }
    }
  }

  /*
   * Remove empty items so the parent receives a clean object.
   */
  if (errors.items && Object.keys(errors.items).length === 0) {
    delete errors.items;
  }

  return errors;
}

export function isExperienceValid(experiences: ResumeData["experience"]): boolean {
  return Object.keys(validateExperience(experiences)).length === 0;
}

/* ============================================================
   EMPTY EXPERIENCE ITEM
============================================================ */

function createEmptyExperience(): ResumeData["experience"][number] {
  return {
    id: crypto.randomUUID(),
    position: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    achievements: [],
  };
}

/* ============================================================
   PROPS
============================================================ */

interface ExperienceSectionEditorProps {
  resume: ResumeData;
  onChange: (next: ResumeData) => void;
  errors?: ExperienceValidationErrors;
  onValidate?: (errors: ExperienceValidationErrors) => void;
}

/* ============================================================
   COMPONENT
============================================================ */

export function ExperienceSectionEditor({
  resume,
  onChange,
  errors = {},
  onValidate,
}: ExperienceSectionEditorProps) {
  /*
   * The editor intentionally guarantees that there is always
   * one empty experience form available.
   */
  const experiences =
    resume.experience && resume.experience.length > 0
      ? resume.experience
      : [createEmptyExperience()];

  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  /* ==========================================================
     UPDATE ALL EXPERIENCES
  ========================================================== */

  const updateExperiences = (nextExperiences: ResumeData["experience"]) => {
    onChange({
      ...resume,
      experience: nextExperiences,
    });

    if (hasAttemptedValidation) {
      onValidate?.(validateExperience(nextExperiences));
    }
  };

  /* ==========================================================
     UPDATE FIELD
  ========================================================== */

  const updateExperience = (
    id: string,
    field: keyof ResumeData["experience"][number],
    value: string | boolean | string[],
  ) => {
    const nextExperiences = experiences.map((experience) => {
      if (experience.id !== id) {
        return experience;
      }

      return {
        ...experience,
        [field]: value,
      };
    });

    updateExperiences(nextExperiences);
  };

  /* ==========================================================
     ADD EXPERIENCE
  ========================================================== */

  const handleAddExperience = () => {
    updateExperiences([...experiences, createEmptyExperience()]);
  };

  /* ==========================================================
     REMOVE EXPERIENCE
  ========================================================== */

  const handleRemoveExperience = (experienceId: string) => {
    // Keep at least one experience form
    if (experiences.length <= 1) {
      return;
    }

    const nextExperiences = experiences.filter((item) => item.id !== experienceId);
    updateExperiences(nextExperiences);
  };

  /* ==========================================================
     ADD ACHIEVEMENT
  ========================================================== */

  const handleAddAchievement = (experienceId: string) => {
    const experience = experiences.find((item) => item.id === experienceId);

    if (!experience) {
      return;
    }

    const achievements = [...(experience.achievements ?? []), ""];

    updateExperience(experienceId, "achievements", achievements);
  };

  /* ==========================================================
     UPDATE ACHIEVEMENT
  ========================================================== */

  const handleAchievementChange = (
    experienceId: string,
    achievementIndex: number,
    value: string,
  ) => {
    const experience = experiences.find((item) => item.id === experienceId);

    if (!experience) {
      return;
    }

    const achievements = [...(experience.achievements ?? [])];

    achievements[achievementIndex] = value;

    updateExperience(experienceId, "achievements", achievements);
  };

  /* ==========================================================
     REMOVE ACHIEVEMENT
  ========================================================== */

  const handleRemoveAchievement = (experienceId: string, achievementIndex: number) => {
    const experience = experiences.find((item) => item.id === experienceId);

    if (!experience) {
      return;
    }

    const achievements = (experience.achievements ?? []).filter(
      (_, index) => index !== achievementIndex,
    );

    updateExperience(experienceId, "achievements", achievements);
  };

  /* ==========================================================
     BLUR VALIDATION
  ========================================================== */

  const handleBlur = () => {
    if (!hasAttemptedValidation) {
      return;
    }

    onValidate?.(validateExperience(experiences));
  };

  /* ==========================================================
     CURRENT POSITION
  ========================================================== */

  const handleCurrentChange = (experienceId: string, current: boolean) => {
    const nextExperiences = experiences.map((item) =>
      item.id === experienceId
        ? {
            ...item,
            current,
            endDate: current ? "" : item.endDate,
          }
        : item,
    );

    updateExperiences(nextExperiences);
  };

  /* ==========================================================
     VALIDATE
  ========================================================== */

  const handleValidate = () => {
    setHasAttemptedValidation(true);

    const validationErrors = validateExperience(experiences);

    onValidate?.(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-base font-semibold tracking-tight">Work Experience</h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Add your professional experience, starting with your most recent position. Include your
          job title, company, dates, responsibilities, and measurable achievements.
        </p>
      </div>

      {/* EXPERIENCE ITEMS */}
      <div className="space-y-6">
        {experiences.map((experience, index) => {
          const itemErrors = errors.items?.[experience.id] ?? {};
          const canDelete = experiences.length > 1;

          return (
            <div key={experience.id} className="rounded-xl border border-border bg-background">
              {/* ITEM HEADER */}
              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
                    <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Experience {index + 1}</p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {index === 0
                        ? "Start with your most recent or current position."
                        : "Add another position from your professional history."}
                    </p>
                  </div>
                </div>

                {/* DELETE EXPERIENCE */}
                {canDelete && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveExperience(experience.id)}
                    aria-label={`Delete Experience ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* CONTENT */}
              <div className="space-y-6 p-5">
                {/* JOB TITLE + COMPANY */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`position-${experience.id}`}>
                      Job title <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id={`position-${experience.id}`}
                      value={experience.position}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        updateExperience(experience.id, "position", event.target.value)
                      }
                      onBlur={handleBlur}
                      placeholder="e.g. Senior Software Engineer"
                      aria-invalid={Boolean(itemErrors.position)}
                    />

                    <p className="text-xs leading-5 text-muted-foreground">
                      Use the official title you held at the company.
                    </p>

                    {itemErrors.position && (
                      <p className="text-xs font-medium text-destructive" role="alert">
                        {itemErrors.position}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`company-${experience.id}`}>
                      Company <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id={`company-${experience.id}`}
                      value={experience.company}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        updateExperience(experience.id, "company", event.target.value)
                      }
                      onBlur={handleBlur}
                      placeholder="e.g. Acme Technologies"
                      aria-invalid={Boolean(itemErrors.company)}
                    />

                    <p className="text-xs leading-5 text-muted-foreground">
                      Enter the company, organization, or employer name.
                    </p>

                    {itemErrors.company && (
                      <p className="text-xs font-medium text-destructive" role="alert">
                        {itemErrors.company}
                      </p>
                    )}
                  </div>
                </div>

                {/* LOCATION */}
                <div className="space-y-2">
                  <Label htmlFor={`location-${experience.id}`}>Location</Label>

                  <Input
                    id={`location-${experience.id}`}
                    value={experience.location ?? ""}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      updateExperience(experience.id, "location", event.target.value)
                    }
                    onBlur={handleBlur}
                    placeholder="e.g. London, UK or Remote"
                    aria-invalid={Boolean(itemErrors.location)}
                  />

                  <p className="text-xs leading-5 text-muted-foreground">
                    You can enter a city, country, or simply &quot;Remote&quot;.
                  </p>

                  {itemErrors.location && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {itemErrors.location}
                    </p>
                  )}
                </div>

                {/* DATES */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`start-date-${experience.id}`}>
                      Start date <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id={`start-date-${experience.id}`}
                      type="month"
                      value={experience.startDate}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        updateExperience(experience.id, "startDate", event.target.value)
                      }
                      onBlur={handleBlur}
                      aria-invalid={Boolean(itemErrors.startDate)}
                    />

                    <p className="text-xs leading-5 text-muted-foreground">
                      Select the month and year when you started this position.
                    </p>

                    {itemErrors.startDate && (
                      <p className="text-xs font-medium text-destructive" role="alert">
                        {itemErrors.startDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`end-date-${experience.id}`}>
                      End date
                      {!experience.current && <span className="text-destructive"> *</span>}
                    </Label>

                    <Input
                      id={`end-date-${experience.id}`}
                      type="month"
                      value={experience.endDate ?? ""}
                      disabled={experience.current}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        updateExperience(experience.id, "endDate", event.target.value)
                      }
                      onBlur={handleBlur}
                      aria-invalid={Boolean(itemErrors.endDate)}
                    />

                    <p className="text-xs leading-5 text-muted-foreground">
                      {experience.current
                        ? "Leave this empty because you currently work here."
                        : "Select the month and year when you left this position."}
                    </p>

                    {itemErrors.endDate && (
                      <p className="text-xs font-medium text-destructive" role="alert">
                        {itemErrors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* CURRENT POSITION */}
                <label
                  htmlFor={`current-${experience.id}`}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/30"
                >
                  <input
                    id={`current-${experience.id}`}
                    type="checkbox"
                    checked={experience.current}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleCurrentChange(experience.id, event.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 rounded border-border"
                  />

                  <span>
                    <span className="block text-sm font-medium">I currently work here</span>

                    <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                      Select this if this is your current position. The end date will not be
                      required.
                    </span>
                  </span>
                </label>

                {/* DESCRIPTION — required */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor={`description-${experience.id}`}>
                      Description <span className="text-destructive">*</span>
                    </Label>

                    <span className="text-xs tabular-nums text-muted-foreground">
                      {(experience.description ?? "").length}
                      /1000
                    </span>
                  </div>

                  <Textarea
                    id={`description-${experience.id}`}
                    value={experience.description ?? ""}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                      updateExperience(experience.id, "description", event.target.value)
                    }
                    onBlur={handleBlur}
                    placeholder="Describe your main responsibilities, the type of work you handled, and the scope of your role..."
                    className="min-h-[130px] resize-y leading-6"
                    aria-invalid={Boolean(itemErrors.description)}
                  />

                  <p className="text-xs leading-5 text-muted-foreground">
                    Focus on what you did. Keep it concise and relevant to the jobs you want.
                  </p>

                  {itemErrors.description && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {itemErrors.description}
                    </p>
                  )}
                </div>

                {/* ACHIEVEMENTS — optional, blank allowed */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Label>Key achievements</Label>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Optional. Add measurable results, improvements, awards, or important
                        contributions. You can leave these blank.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={(experience.achievements?.length ?? 0) >= 8}
                      onClick={() => handleAddAchievement(experience.id)}
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add
                    </Button>
                  </div>

                  {experience.achievements?.length > 0 && (
                    <div className="space-y-3">
                      {experience.achievements.map((achievement, achievementIndex) => (
                        <div
                          key={`${experience.id}-achievement-${achievementIndex}`}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-medium text-muted-foreground">
                              Achievement {achievementIndex + 1}
                            </span>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                handleRemoveAchievement(experience.id, achievementIndex)
                              }
                            >
                              Remove
                            </Button>
                          </div>

                          <Textarea
                            value={achievement}
                            onChange={(event) =>
                              handleAchievementChange(
                                experience.id,
                                achievementIndex,
                                event.target.value,
                              )
                            }
                            onBlur={handleBlur}
                            placeholder="e.g. Improved application performance by 35% by optimizing API requests and database queries."
                            className="min-h-[85px] resize-y"
                            maxLength={300}
                            aria-label={`Achievement ${achievementIndex + 1}`}
                          />

                          <div className="text-right text-[11px] tabular-nums text-muted-foreground">
                            {achievement.length}/300
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {itemErrors.achievements && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {itemErrors.achievements}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD ANOTHER EXPERIENCE */}
      <Button type="button" variant="outline" className="w-full" onClick={handleAddExperience}>
        <Plus className="mr-2 h-4 w-4" />
        Add Another Experience
      </Button>

      <p className="text-center text-xs leading-5 text-muted-foreground">
        Add another position for each relevant job in your professional history.
      </p>

      {/* GENERAL ERROR */}
      {errors.experiences && (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3"
          role="alert"
        >
          <p className="text-xs font-medium text-destructive">{errors.experiences}</p>
        </div>
      )}

      {/* GUIDANCE */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
            <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium">Write stronger experience entries</p>

            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-muted-foreground">
              <li>• Start with your most recent position.</li>
              <li>• Use the exact job title you held.</li>
              <li>• Explain what you were responsible for.</li>
              <li>• Focus achievements on measurable results.</li>
              <li>• Use numbers when they demonstrate impact.</li>
              <li>
                • Use strong action words such as built, improved, led, designed, reduced, or
                delivered.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* VALIDATION MESSAGE */}
      {!isExperienceValid(experiences) && hasAttemptedValidation && (
        <p className="text-xs font-medium text-destructive" role="alert">
          Please complete the highlighted experience fields before continuing.
        </p>
      )}

      {/* INTERNAL VALIDATION TRIGGER */}
      <button
        type="button"
        className="hidden"
        onClick={handleValidate}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}

export default ExperienceSectionEditor;
