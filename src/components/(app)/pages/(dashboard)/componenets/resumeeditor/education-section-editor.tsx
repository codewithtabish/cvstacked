"use client";

import {
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  GripVertical,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { z } from "zod";

import type { ResumeData } from "@/types/resume";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ResumeEducation = ResumeData["education"][number];

/* ============================================================
   VALIDATION
============================================================ */

const monthSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}$/, "Please select a valid month and year.");

export const educationItemSchema = z
  .object({
    id: z.string().min(1),

    degree: z
      .string()
      .trim()
      .min(1, "Degree is required.")
      .max(120, "Degree must be 120 characters or less."),

    institution: z
      .string()
      .trim()
      .min(1, "Institution is required.")
      .max(160, "Institution must be 160 characters or less."),

    fieldOfStudy: z
      .string()
      .trim()
      .max(120, "Field of study must be 120 characters or less.")
      .optional()
      .or(z.literal("")),

    location: z
      .string()
      .trim()
      .max(120, "Location must be 120 characters or less.")
      .optional()
      .or(z.literal("")),

    startDate: monthSchema,

    endDate: z.string().trim().optional().or(z.literal("")),

    current: z.boolean().optional(),

    grade: z
      .string()
      .trim()
      .max(40, "Grade must be 40 characters or less.")
      .optional()
      .or(z.literal("")),

    description: z
      .string()
      .trim()
      .max(1000, "Description must be 1000 characters or less.")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((education, ctx) => {
    const startDate = education.startDate.trim();
    const endDate = education.endDate?.trim() ?? "";
    const isCurrent = Boolean(education.current);

    if (isCurrent && endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Remove the end date because you currently study here.",
      });
    }

    if (!isCurrent) {
      if (!endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date is required unless you currently study here.",
        });
      } else if (!/^\d{4}-\d{2}$/.test(endDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "Please select a valid month and year.",
        });
      } else if (startDate && endDate < startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date cannot be earlier than the start date.",
        });
      }
    }
  });

export const educationSchema = z.array(educationItemSchema);

export type EducationValidationErrors = {
  education?: string;
  items?: Record<
    string,
    {
      degree?: string;
      institution?: string;
      fieldOfStudy?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      grade?: string;
      description?: string;
    }
  >;
};

export function validateEducation(education: ResumeData["education"]): EducationValidationErrors {
  if (!education || education.length === 0) {
    return {};
  }

  // One fully blank entry = user has not started yet → allow continue
  if (
    education.length === 1 &&
    !education[0].degree.trim() &&
    !education[0].institution.trim() &&
    !education[0].startDate.trim() &&
    !(education[0].endDate ?? "").trim()
  ) {
    return {};
  }

  const result = educationSchema.safeParse(education);

  if (result.success) {
    return {};
  }

  const errors: EducationValidationErrors = { items: {} };

  for (const issue of result.error.issues) {
    const [index, field] = issue.path;

    if (typeof index !== "number") {
      errors.education ??= issue.message;
      continue;
    }

    const item = education[index];
    if (!item || field === undefined) continue;

    const fieldName = String(field);

    if (
      fieldName === "degree" ||
      fieldName === "institution" ||
      fieldName === "fieldOfStudy" ||
      fieldName === "location" ||
      fieldName === "startDate" ||
      fieldName === "endDate" ||
      fieldName === "grade" ||
      fieldName === "description"
    ) {
      errors.items![item.id] ??= {};
      const itemErrors = errors.items![item.id]!;

      if (fieldName === "degree") itemErrors.degree ??= issue.message;
      if (fieldName === "institution") itemErrors.institution ??= issue.message;
      if (fieldName === "fieldOfStudy") itemErrors.fieldOfStudy ??= issue.message;
      if (fieldName === "location") itemErrors.location ??= issue.message;
      if (fieldName === "startDate") itemErrors.startDate ??= issue.message;
      if (fieldName === "endDate") itemErrors.endDate ??= issue.message;
      if (fieldName === "grade") itemErrors.grade ??= issue.message;
      if (fieldName === "description") itemErrors.description ??= issue.message;
    }
  }

  if (errors.items && Object.keys(errors.items).length === 0) {
    delete errors.items;
  }

  return errors;
}

export function isEducationValid(education: ResumeData["education"]): boolean {
  return Object.keys(validateEducation(education)).length === 0;
}

/* ============================================================
   EMPTY ITEM
============================================================ */

function createEmptyEducation(): ResumeEducation {
  return {
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    fieldOfStudy: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    grade: "",
    description: "",
  };
}

/* ============================================================
   FORMAT DATE FOR PREVIEW (YYYY-MM → readable)
============================================================ */

function formatMonthYear(value?: string): string {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return value || "";

  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/* ============================================================
   PROPS
============================================================ */

interface EducationEditorSectionProps {
  resume: ResumeData;
  onUpdate: (education: ResumeData["education"]) => void;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function EducationEditorSection({ resume, onUpdate }: EducationEditorSectionProps) {
  const educationFromResume = resume.education ?? [];

  /*
   * Always show at least one education.
   * First visit: empty form is already open — no click needed.
   */
  const education = educationFromResume.length > 0 ? educationFromResume : [createEmptyEducation()];

  const [editingId, setEditingId] = useState<string | null>(() =>
    educationFromResume.length === 0 ? (education[0]?.id ?? null) : null,
  );

  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);
  const [errors, setErrors] = useState<EducationValidationErrors>({});

  const runValidation = (next: ResumeData["education"]) => {
    const nextErrors = validateEducation(next);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateEducationList = (next: ResumeData["education"]) => {
    onUpdate(next);
    if (hasAttemptedValidation) {
      runValidation(next);
    }
  };

  const updateEducation = (id: string, updates: Partial<ResumeEducation>) => {
    const base = educationFromResume.length > 0 ? educationFromResume : education;

    const next = base.map((item) => (item.id === id ? { ...item, ...updates } : item));

    updateEducationList(next);
  };

  const addEducation = () => {
    const newEducation = createEmptyEducation();
    const base = educationFromResume.length > 0 ? educationFromResume : education;
    const next = [...base, newEducation];
    updateEducationList(next);
    setEditingId(newEducation.id);
  };

  const removeEducation = (id: string) => {
    const base = educationFromResume.length > 0 ? educationFromResume : education;
    const next = base.filter((item) => item.id !== id);

    if (next.length === 0) {
      const empty = createEmptyEducation();
      updateEducationList([empty]);
      setEditingId(empty.id);
      return;
    }

    updateEducationList(next);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const moveEducation = (index: number, direction: "up" | "down") => {
    const base = educationFromResume.length > 0 ? educationFromResume : education;
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= base.length) return;

    const updated = [...base];
    const current = updated[index];
    const target = updated[newIndex];
    if (!current || !target) return;

    updated[index] = target;
    updated[newIndex] = current;
    updateEducationList(updated);
  };

  const canReorder = educationFromResume.length > 1;
  const canDelete = educationFromResume.length > 1;

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/40">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Education</h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
            Add your degrees, schools, universities, and other educational background.
          </p>
        </div>

        <Button type="button" onClick={addEducation} className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {/* LIST — first form always open when empty */}
      <div className="space-y-4">
        {education.map((item, index) => {
          const isEditing =
            editingId === item.id ||
            (editingId === null && educationFromResume.length === 0 && index === 0);

          const itemErrors = errors.items?.[item.id] ?? {};

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm"
            >
              {/* CARD HEADER */}
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <div className="text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {item.degree?.trim() || "Untitled degree"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.institution?.trim() || "Institution not specified"}
                    </p>
                  </div>
                </div>

                {canReorder && (
                  <div className="hidden items-center gap-0.5 sm:flex">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      disabled={index === 0}
                      onClick={() => moveEducation(index, "up")}
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      disabled={index === education.length - 1}
                      onClick={() => moveEducation(index, "down")}
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => setEditingId(isEditing ? null : item.id)}
                  aria-label={isEditing ? "Close" : "Edit"}
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                </Button>

                {canDelete && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeEducation(item.id)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* PREVIEW */}
              {!isEditing && (
                <div className="px-5 py-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {item.degree?.trim() ? (
                      <PreviewField label="Degree" value={item.degree} />
                    ) : null}
                    {item.fieldOfStudy?.trim() ? (
                      <PreviewField label="Field of Study" value={item.fieldOfStudy} />
                    ) : null}
                    {item.institution?.trim() ? (
                      <PreviewField label="Institution" value={item.institution} />
                    ) : null}
                    {item.location?.trim() ? (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Location
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          {item.location}
                        </p>
                      </div>
                    ) : null}
                    {item.grade?.trim() ? <PreviewField label="Grade" value={item.grade} /> : null}
                    {item.startDate?.trim() || item.endDate?.trim() || item.current ? (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Dates
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          {formatMonthYear(item.startDate) || "—"}
                          <span className="text-muted-foreground">—</span>
                          {item.current ? "Present" : formatMonthYear(item.endDate) || "—"}
                        </p>
                      </div>
                    ) : null}
                    {item.description?.trim() ? (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Description
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {hasAttemptedValidation && Object.keys(itemErrors).length > 0 && (
                    <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
                      <p className="text-xs font-medium text-destructive">
                        Please complete the required fields for this education entry.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* FORM — open by default for first empty education */}
              {isEditing && (
                <div className="space-y-6 px-5 py-6">
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${item.id}`}>
                      Degree <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`degree-${item.id}`}
                      value={item.degree}
                      placeholder="e.g. Bachelor of Science"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateEducation(item.id, { degree: e.target.value })
                      }
                      aria-invalid={Boolean(itemErrors.degree)}
                    />
                    {itemErrors.degree && (
                      <p className="text-xs font-medium text-destructive" role="alert">
                        {itemErrors.degree}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`field-${item.id}`}>Field of Study</Label>
                      <Input
                        id={`field-${item.id}`}
                        value={item.fieldOfStudy ?? ""}
                        placeholder="e.g. Computer Science"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          updateEducation(item.id, {
                            fieldOfStudy: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`institution-${item.id}`}>
                        Institution <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`institution-${item.id}`}
                        value={item.institution}
                        placeholder="e.g. University of California, Berkeley"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          updateEducation(item.id, {
                            institution: e.target.value,
                          })
                        }
                        aria-invalid={Boolean(itemErrors.institution)}
                      />
                      {itemErrors.institution && (
                        <p className="text-xs font-medium text-destructive" role="alert">
                          {itemErrors.institution}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`location-${item.id}`}>Location</Label>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id={`location-${item.id}`}
                          value={item.location ?? ""}
                          placeholder="e.g. Berkeley, California"
                          className="pl-9"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateEducation(item.id, {
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`grade-${item.id}`}>Grade</Label>
                      <Input
                        id={`grade-${item.id}`}
                        value={item.grade ?? ""}
                        placeholder="e.g. 3.8 / 4.0"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          updateEducation(item.id, { grade: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* DATES — month calendar like Experience */}
                  <div className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Label>Education Period</Label>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={Boolean(item.current)}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateEducation(item.id, {
                              current: e.target.checked,
                              endDate: e.target.checked ? "" : item.endDate,
                            })
                          }
                          className="h-4 w-4 rounded border-border"
                        />
                        I currently study here
                      </label>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`start-${item.id}`}>
                          Start Date <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`start-${item.id}`}
                          type="month"
                          value={item.startDate}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateEducation(item.id, {
                              startDate: e.target.value,
                            })
                          }
                          aria-invalid={Boolean(itemErrors.startDate)}
                        />
                        {itemErrors.startDate && (
                          <p className="text-xs font-medium text-destructive" role="alert">
                            {itemErrors.startDate}
                          </p>
                        )}
                      </div>

                      {!item.current && (
                        <div className="space-y-2">
                          <Label htmlFor={`end-${item.id}`}>
                            End Date <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`end-${item.id}`}
                            type="month"
                            value={item.endDate ?? ""}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              updateEducation(item.id, {
                                endDate: e.target.value,
                              })
                            }
                            aria-invalid={Boolean(itemErrors.endDate)}
                          />
                          {itemErrors.endDate && (
                            <p className="text-xs font-medium text-destructive" role="alert">
                              {itemErrors.endDate}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor={`description-${item.id}`}>Description</Label>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {(item.description ?? "").length}/1000
                      </span>
                    </div>
                    <Textarea
                      id={`description-${item.id}`}
                      value={item.description ?? ""}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        updateEducation(item.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Add relevant coursework, academic projects, honors, activities, or other details..."
                      className="min-h-[120px] resize-y leading-6"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional. Add only information that strengthens your resume.
                    </p>
                  </div>

                  <div className="flex justify-end border-t border-border pt-5">
                    <Button type="button" onClick={() => setEditingId(null)} className="gap-2">
                      <Check className="h-4 w-4" />
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={addEducation}
          className="w-full border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add another education
        </Button>
      </div>

      {errors.education && (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3"
          role="alert"
        >
          <p className="text-xs font-medium text-destructive">{errors.education}</p>
        </div>
      )}
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}
