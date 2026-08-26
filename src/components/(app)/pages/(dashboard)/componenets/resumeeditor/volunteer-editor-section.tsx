"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  CirclePlus,
  GripVertical,
  HeartHandshake,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import type { ResumeVolunteer } from "@/types/resume";

/* ============================================================
   TYPES
   ============================================================ */

interface VolunteerEditorSectionProps {
  volunteer: ResumeVolunteer[];
  onChange: (volunteer: ResumeVolunteer[]) => void;
  onSkip?: () => void;
}

/* ============================================================
   VALIDATION
   ============================================================ */

const volunteerSchema = z
  .object({
    organization: z
      .string()
      .trim()
      .min(1, "Organization is required.")
      .max(120, "Organization must be 120 characters or less."),

    role: z
      .string()
      .trim()
      .min(1, "Role is required.")
      .max(120, "Role must be 120 characters or less."),

    startDate: z.string().trim().min(1, "Start date is required."),

    endDate: z.string().optional(),

    current: z.boolean().optional(),

    description: z
      .string()
      .trim()
      .max(600, "Description must be 600 characters or less.")
      .optional(),

    achievements: z
      .array(z.string().trim().max(250, "Achievement must be 250 characters or less."))
      .optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.current && !value.endDate?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date is required unless you are currently volunteering.",
      });
    }
  });

/* ============================================================
   HELPERS
   ============================================================ */

const createVolunteer = (): ResumeVolunteer => ({
  id: `volunteer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  organization: "",
  role: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  achievements: [],
});

const formatDateLabel = (value?: string) => {
  if (!value) return "";

  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-");

    const date = new Date(Number(year), Number(month) - 1, 1);

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  return value;
};

/* ============================================================
   COMPONENT
   ============================================================ */

export function VolunteerEditorSection({
  volunteer,
  onChange,
  onSkip,
}: VolunteerEditorSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(
    volunteer.length > 0 ? (volunteer[0]?.id ?? null) : null,
  );

  const [draft, setDraft] = useState<ResumeVolunteer | null>(
    volunteer.length > 0 ? volunteer[0] : null,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [achievementInput, setAchievementInput] = useState("");

  /* ============================================================
     EMPTY STATE
     ============================================================ */

  const showEmptyState = volunteer.length === 0 && draft === null;

  /* ============================================================
     START ADDING
     ============================================================ */

  const handleAddVolunteer = () => {
    const newVolunteer = createVolunteer();

    setDraft(newVolunteer);
    setEditingId(newVolunteer.id);
    setErrors({});
    setAchievementInput("");
  };

  /* ============================================================
     EDIT EXISTING
     ============================================================ */

  const handleEdit = (item: ResumeVolunteer) => {
    setDraft({
      ...item,
      achievements: [...(item.achievements ?? [])],
    });

    setEditingId(item.id);
    setErrors({});
    setAchievementInput("");
  };

  /* ============================================================
     CANCEL
     ============================================================ */

  const handleCancel = () => {
    setDraft(null);
    setEditingId(null);
    setErrors({});
    setAchievementInput("");
  };

  /* ============================================================
     UPDATE DRAFT
     ============================================================ */

  const updateDraft = <K extends keyof ResumeVolunteer>(field: K, value: ResumeVolunteer[K]) => {
    if (!draft) return;

    setDraft({
      ...draft,
      [field]: value,
    });

    setErrors((current) => {
      const next = { ...current };
      delete next[String(field)];
      return next;
    });
  };

  /* ============================================================
     CURRENT VOLUNTEER TOGGLE
     ============================================================ */

  const handleCurrentChange = (checked: boolean) => {
    if (!draft) return;

    setDraft({
      ...draft,
      current: checked,
      endDate: checked ? "" : (draft.endDate ?? ""),
    });

    setErrors((current) => {
      const next = { ...current };
      delete next.endDate;
      return next;
    });
  };

  /* ============================================================
     ACHIEVEMENTS
     ============================================================ */

  const handleAddAchievement = () => {
    if (!draft) return;

    const value = achievementInput.trim();

    if (!value) return;

    if (value.length > 250) {
      setErrors((current) => ({
        ...current,
        achievements: "Achievement must be 250 characters or less.",
      }));

      return;
    }

    updateDraft("achievements", [...(draft.achievements ?? []), value]);

    setAchievementInput("");

    setErrors((current) => {
      const next = { ...current };
      delete next.achievements;
      return next;
    });
  };

  const handleRemoveAchievement = (index: number) => {
    if (!draft) return;

    const achievements = [...(draft.achievements ?? [])];

    achievements.splice(index, 1);

    updateDraft("achievements", achievements);
  };

  const handleAchievementKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddAchievement();
    }
  };

  /* ============================================================
     SAVE
     ============================================================ */

  const handleSave = () => {
    if (!draft) return;

    const result = volunteerSchema.safeParse({
      ...draft,
      achievements: draft.achievements ?? [],
    });

    if (!result.success) {
      const nextErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);

        if (!nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      });

      setErrors(nextErrors);
      return;
    }

    const normalizedVolunteer: ResumeVolunteer = {
      ...draft,
      organization: draft.organization.trim(),
      role: draft.role.trim(),
      startDate: draft.startDate.trim(),
      endDate: draft.current ? "" : draft.endDate?.trim() || "",
      current: Boolean(draft.current),
      description: draft.description?.trim() || "",
      achievements: (draft.achievements ?? [])
        .map((achievement) => achievement.trim())
        .filter(Boolean),
    };

    const existingIndex = volunteer.findIndex((item) => item.id === normalizedVolunteer.id);

    if (existingIndex === -1) {
      onChange([...volunteer, normalizedVolunteer]);
    } else {
      const updated = [...volunteer];

      updated[existingIndex] = normalizedVolunteer;

      onChange(updated);
    }

    setDraft(null);
    setEditingId(null);
    setErrors({});
    setAchievementInput("");
  };

  /* ============================================================
     DELETE
     ============================================================ */

  const handleDelete = (id: string) => {
    const updated = volunteer.filter((item) => item.id !== id);

    onChange(updated);

    if (editingId === id) {
      setEditingId(null);
      setDraft(null);
      setErrors({});
    }
  };

  /* ============================================================
     EMPTY STATE
     ============================================================ */

  if (showEmptyState) {
    return (
      <section className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg border bg-muted/40">
                <HeartHandshake className="size-4.5 text-muted-foreground" />
              </div>

              <div>
                <h2 className="text-base font-semibold tracking-tight">Volunteer Experience</h2>

                <p className="mt-0.5 text-sm text-muted-foreground">
                  Highlight meaningful volunteer work and community involvement.
                </p>
              </div>
            </div>
          </div>

          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Skip
            </button>
          )}
        </div>

        <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full border bg-background shadow-sm">
            <HeartHandshake className="size-5 text-muted-foreground" />
          </div>

          <h3 className="mt-4 text-sm font-semibold">No volunteer experience added</h3>

          <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
            Add volunteer work, community service, mentoring, or other unpaid experiences that
            strengthen your resume.
          </p>

          <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleAddVolunteer}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background shadow-sm transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" />
              Add Volunteer Experience
            </button>

            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Skip this section
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  /* ============================================================
     EDITOR
     ============================================================ */

  return (
    <section className="space-y-6">
      {/* --------------------------------------------------------
          HEADER
          -------------------------------------------------------- */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg border bg-muted/40">
              <HeartHandshake className="size-4.5 text-muted-foreground" />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight">Volunteer Experience</h2>

              <p className="mt-0.5 text-sm text-muted-foreground">
                Add volunteer work and community involvement.
              </p>
            </div>
          </div>
        </div>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Skip
          </button>
        )}
      </div>

      {/* --------------------------------------------------------
          EXISTING ITEMS
          -------------------------------------------------------- */}

      {volunteer.length > 0 && (
        <div className="space-y-3">
          {volunteer.map((item) => {
            const isEditing = editingId === item.id && draft !== null;

            return (
              <div key={item.id} className="overflow-hidden rounded-xl border bg-background">
                {!isEditing ? (
                  <div className="flex items-start gap-3 p-4">
                    <div className="mt-0.5 hidden shrink-0 text-muted-foreground sm:block">
                      <GripVertical className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">
                            {item.role || "Volunteer Role"}
                          </h3>

                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {item.organization || "Organization"}
                          </p>
                        </div>

                        <div className="shrink-0 text-xs text-muted-foreground">
                          {formatDateLabel(item.startDate)}
                          {" — "}
                          {item.current ? "Present" : formatDateLabel(item.endDate)}
                        </div>
                      </div>

                      {item.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      )}

                      {item.achievements && item.achievements.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                            {item.achievements.length} achievement
                            {item.achievements.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete volunteer experience"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <VolunteerForm
                    draft={draft}
                    errors={errors}
                    achievementInput={achievementInput}
                    setAchievementInput={setAchievementInput}
                    onUpdate={updateDraft}
                    onCurrentChange={handleCurrentChange}
                    onAddAchievement={handleAddAchievement}
                    onRemoveAchievement={handleRemoveAchievement}
                    onAchievementKeyDown={handleAchievementKeyDown}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditingExisting
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --------------------------------------------------------
          NEW EDITOR
          -------------------------------------------------------- */}

      {draft && editingId === draft.id && !volunteer.some((item) => item.id === draft.id) && (
        <div className="overflow-hidden rounded-xl border bg-background">
          <VolunteerForm
            draft={draft}
            errors={errors}
            achievementInput={achievementInput}
            setAchievementInput={setAchievementInput}
            onUpdate={updateDraft}
            onCurrentChange={handleCurrentChange}
            onAddAchievement={handleAddAchievement}
            onRemoveAchievement={handleRemoveAchievement}
            onAchievementKeyDown={handleAchievementKeyDown}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditingExisting={false}
          />
        </div>
      )}

      {/* --------------------------------------------------------
          ADD BUTTON
          -------------------------------------------------------- */}

      {!draft && (
        <button
          type="button"
          onClick={handleAddVolunteer}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/10 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/30 hover:text-foreground"
        >
          <CirclePlus className="size-4" />
          Add Volunteer Experience
        </button>
      )}
    </section>
  );
}

/* ============================================================
   VOLUNTEER FORM
   ============================================================ */

interface VolunteerFormProps {
  draft: ResumeVolunteer;
  errors: Record<string, string>;
  achievementInput: string;
  setAchievementInput: (value: string) => void;
  onUpdate: <K extends keyof ResumeVolunteer>(field: K, value: ResumeVolunteer[K]) => void;
  onCurrentChange: (checked: boolean) => void;
  onAddAchievement: () => void;
  onRemoveAchievement: (index: number) => void;
  onAchievementKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditingExisting: boolean;
}

function VolunteerForm({
  draft,
  errors,
  achievementInput,
  setAchievementInput,
  onUpdate,
  onCurrentChange,
  onAddAchievement,
  onRemoveAchievement,
  onAchievementKeyDown,
  onSave,
  onCancel,
  isEditingExisting,
}: VolunteerFormProps) {
  const [showAchievements, setShowAchievements] = useState((draft.achievements?.length ?? 0) > 0);

  return (
    <div className="p-5 sm:p-6">
      {/* --------------------------------------------------------
          FORM HEADER
          -------------------------------------------------------- */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold">
            {isEditingExisting ? "Edit volunteer experience" : "Add volunteer experience"}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Fields marked with <span className="text-destructive">*</span> are required.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close editor"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* --------------------------------------------------------
          BASIC INFORMATION
          -------------------------------------------------------- */}

      <div className="mt-6 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Organization */}

          <FormField label="Organization" required error={errors.organization}>
            <input
              type="text"
              value={draft.organization}
              onChange={(event) => onUpdate("organization", event.target.value)}
              placeholder="e.g. Red Cross"
              className={inputClass(Boolean(errors.organization))}
            />
          </FormField>

          {/* Role */}

          <FormField label="Role" required error={errors.role}>
            <input
              type="text"
              value={draft.role}
              onChange={(event) => onUpdate("role", event.target.value)}
              placeholder="e.g. Volunteer Mentor"
              className={inputClass(Boolean(errors.role))}
            />
          </FormField>
        </div>

        {/* ------------------------------------------------------
            DATES
            ------------------------------------------------------ */}

        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Start date" required error={errors.startDate}>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="month"
                value={draft.startDate}
                onChange={(event) => onUpdate("startDate", event.target.value)}
                className={`${inputClass(Boolean(errors.startDate))} pl-10`}
              />
            </div>
          </FormField>

          {!draft.current && (
            <FormField label="End date" required error={errors.endDate}>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="month"
                  value={draft.endDate ?? ""}
                  onChange={(event) => onUpdate("endDate", event.target.value)}
                  className={`${inputClass(Boolean(errors.endDate))} pl-10`}
                />
              </div>
            </FormField>
          )}
        </div>

        {/* ------------------------------------------------------
            CURRENT TOGGLE
            ------------------------------------------------------ */}

        <button
          type="button"
          onClick={() => onCurrentChange(!Boolean(draft.current))}
          className="flex w-full items-center gap-3 rounded-lg border bg-muted/20 px-3.5 py-3 text-left transition-colors hover:bg-muted/40"
        >
          <span
            className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${
              draft.current
                ? "border-foreground bg-foreground text-background"
                : "border-muted-foreground/40 bg-background"
            }`}
          >
            {draft.current && <Check className="size-3.5" />}
          </span>

          <span className="text-sm font-medium">I currently volunteer here</span>
        </button>

        {/* ------------------------------------------------------
            DESCRIPTION
            ------------------------------------------------------ */}

        <FormField
          label="Description"
          optional
          error={errors.description}
          hint={`${draft.description?.length ?? 0}/600`}
        >
          <textarea
            value={draft.description ?? ""}
            onChange={(event) => onUpdate("description", event.target.value)}
            placeholder="Briefly describe your responsibilities, contribution, or impact..."
            rows={4}
            maxLength={600}
            className={`${inputClass(Boolean(errors.description))} min-h-24 resize-y py-2.5`}
          />
        </FormField>

        {/* ------------------------------------------------------
            ACHIEVEMENTS
            ------------------------------------------------------ */}

        <div className="rounded-lg border">
          <button
            type="button"
            onClick={() => setShowAchievements((current) => !current)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
          >
            <div>
              <p className="text-sm font-medium">
                Achievements
                <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Add specific contributions or results.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(draft.achievements?.length ?? 0) > 0 && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {draft.achievements?.length}
                </span>
              )}

              {showAchievements ? (
                <ChevronUp className="size-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-4 text-muted-foreground" />
              )}
            </div>
          </button>

          {showAchievements && (
            <div className="border-t px-4 pb-4 pt-4">
              <div className="space-y-2">
                {(draft.achievements ?? []).map((achievement, index) => (
                  <div
                    key={`${achievement}-${index}`}
                    className="flex items-start gap-2 rounded-md border bg-muted/20 px-3 py-2.5"
                  >
                    <span className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {index + 1}.
                    </span>

                    <p className="min-w-0 flex-1 text-sm leading-5">{achievement}</p>

                    <button
                      type="button"
                      onClick={() => onRemoveAchievement(index)}
                      className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove achievement"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={achievementInput}
                  onChange={(event) => setAchievementInput(event.target.value)}
                  onKeyDown={onAchievementKeyDown}
                  maxLength={250}
                  placeholder="e.g. Mentored 20 students through weekly coding workshops"
                  className={inputClass(Boolean(errors.achievements))}
                />

                <button
                  type="button"
                  onClick={onAddAchievement}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Plus className="size-4" />
                  Add
                </button>
              </div>

              {errors.achievements && (
                <p className="mt-1.5 text-xs text-destructive">{errors.achievements}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------
          ACTIONS
          -------------------------------------------------------- */}

      <div className="mt-6 flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-9 items-center justify-center rounded-md px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background shadow-sm transition-opacity hover:opacity-90"
        >
          <Check className="size-4" />
          {isEditingExisting ? "Save Changes" : "Add Volunteer Experience"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   FORM FIELD
   ============================================================ */

interface FormFieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function FormField({ label, required, optional, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium">
          {label}

          {required && <span className="ml-1 text-destructive">*</span>}

          {optional && (
            <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
          )}
        </label>

        {hint && !error && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>

      {children}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ============================================================
   INPUT CLASS
   ============================================================ */

function inputClass(hasError: boolean) {
  return [
    "h-10 w-full rounded-md border bg-background px-3 text-sm",
    "outline-none transition-colors",
    "placeholder:text-muted-foreground",
    "focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10",
    "disabled:cursor-not-allowed disabled:opacity-50",
    hasError
      ? "border-destructive focus:border-destructive focus:ring-destructive/10"
      : "border-input",
  ].join(" ");
}
