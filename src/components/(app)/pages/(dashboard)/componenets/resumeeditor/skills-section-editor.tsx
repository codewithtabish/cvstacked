"use client";

import { Plus, Sparkles, Trash2 } from "lucide-react";

import { useMemo, useState, type ChangeEvent } from "react";

import { z } from "zod";

import type { ResumeData } from "@/types/resume";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ============================================================
   VALIDATION
============================================================ */

/**
 * Skill levels supported by ResumeSkill.
 */
export const skillLevelSchema = z.enum(["beginner", "intermediate", "advanced", "expert"]);

/**
 * Validate a single skill.
 *
 * Rules:
 * - id is required
 * - name is required
 * - name max 100 characters
 * - level is optional
 * - category is optional
 * - category max 80 characters
 */
export const skillItemSchema = z.object({
  id: z.string().trim().min(1, "Skill ID is required."),

  name: z
    .string()
    .trim()
    .min(1, "Skill name is required.")
    .max(100, "Skill name must be 100 characters or less."),

  level: skillLevelSchema.optional(),

  category: z
    .string()
    .trim()
    .max(80, "Category must be 80 characters or less.")
    .optional()
    .or(z.literal("")),
});

/**
 * Validate the complete skills array.
 *
 * At least one skill is required when the Skills section
 * is being completed.
 *
 * Duplicate skill names are not allowed.
 */
export const skillsSchema = z
  .array(skillItemSchema)
  .min(1, "Add at least one skill.")
  .superRefine((skills, ctx) => {
    const seen = new Map<string, number>();

    skills.forEach((skill, index) => {
      const normalizedName = skill.name.trim().replace(/\s+/g, " ").toLowerCase();

      if (!normalizedName) {
        return;
      }

      const previousIndex = seen.get(normalizedName);

      if (previousIndex !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, "name"],
          message: "This skill has already been added.",
        });

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [previousIndex, "name"],
          message: "This skill has already been added.",
        });

        return;
      }

      seen.set(normalizedName, index);
    });
  });

/* ============================================================
   VALIDATION ERRORS
============================================================ */

export type SkillsValidationErrors = {
  skills?: string;

  items?: Record<
    string,
    {
      name?: string;
      level?: string;
      category?: string;
    }
  >;
};

/* ============================================================
   VALIDATION HELPER
============================================================ */

/**
 * Converts Zod validation issues into an editor-friendly
 * error object keyed by skill ID.
 */
export function validateSkills(skills: ResumeData["skills"]): SkillsValidationErrors {
  const result = skillsSchema.safeParse(skills);

  if (result.success) {
    return {};
  }

  const errors: SkillsValidationErrors = {
    items: {},
  };

  for (const issue of result.error.issues) {
    const [index, field] = issue.path;

    /*
     * Array-level error.
     */
    if (typeof index !== "number") {
      errors.skills ??= issue.message;
      continue;
    }

    const skill = skills[index];

    if (!skill) {
      continue;
    }

    /*
     * Item-level error without a specific field.
     */
    if (field === undefined) {
      errors.skills ??= issue.message;
      continue;
    }

    const fieldName = String(field);

    if (fieldName !== "name" && fieldName !== "level" && fieldName !== "category") {
      continue;
    }

    errors.items![skill.id] ??= {};

    const itemErrors = errors.items![skill.id]!;

    if (fieldName === "name") {
      itemErrors.name ??= issue.message;
    }

    if (fieldName === "level") {
      itemErrors.level ??= issue.message;
    }

    if (fieldName === "category") {
      itemErrors.category ??= issue.message;
    }
  }

  /*
   * Keep the object clean when there are no item errors.
   */
  if (errors.items && Object.keys(errors.items).length === 0) {
    delete errors.items;
  }

  return errors;
}

/**
 * Convenience helper for navigation / parent validation.
 */
export function isSkillsValid(skills: ResumeData["skills"]): boolean {
  return Object.keys(validateSkills(skills)).length === 0;
}

/* ============================================================
   EMPTY SKILL
============================================================ */

function createEmptySkill(): ResumeData["skills"][number] {
  return {
    id: crypto.randomUUID(),
    name: "",
    level: undefined,
    category: "",
  };
}

/* ============================================================
   PROPS
============================================================ */

interface SkillsSectionEditorProps {
  resume: ResumeData;

  onChange: (next: ResumeData) => void;

  errors?: SkillsValidationErrors;

  onValidate?: (errors: SkillsValidationErrors) => void;
}

/* ============================================================
   COMPONENT
============================================================ */

export function SkillsSectionEditor({
  resume,
  onChange,
  errors = {},
  onValidate,
}: SkillsSectionEditorProps) {
  /*
   * Stable empty skill used when the resume currently has
   * no skills.
   *
   * useMemo prevents a new ID being generated on every render.
   */
  const emptySkill = useMemo(() => createEmptySkill(), []);

  /*
   * Always show at least one editable skill form.
   */
  const skills = resume.skills && resume.skills.length > 0 ? resume.skills : [emptySkill];

  /*
   * Validation only becomes visually active after the
   * user has attempted to validate the section.
   */
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  /* ==========================================================
     UPDATE ALL SKILLS
  ========================================================== */

  const updateSkills = (nextSkills: ResumeData["skills"]) => {
    const nextResume: ResumeData = {
      ...resume,
      skills: nextSkills,
    };

    onChange(nextResume);

    if (hasAttemptedValidation) {
      onValidate?.(validateSkills(nextSkills));
    }
  };

  /* ==========================================================
     UPDATE SINGLE SKILL
  ========================================================== */

  const updateSkill = (
    id: string,
    field: keyof ResumeData["skills"][number],
    value: string | undefined,
  ) => {
    const nextSkills = skills.map((skill) => {
      if (skill.id !== id) {
        return skill;
      }

      return {
        ...skill,
        [field]: value,
      };
    });

    updateSkills(nextSkills);
  };

  /* ==========================================================
     ADD SKILL
  ========================================================== */

  const handleAddSkill = () => {
    /*
     * If the resume is empty and the visible form is still
     * the temporary empty skill, don't add a second empty row.
     */
    if (resume.skills.length === 0 && emptySkill.name.trim() === "") {
      /*
       * The user needs to type into the first skill first.
       * This prevents an unnecessary collection of blank rows.
       */
    }

    const nextSkills = [...resume.skills, createEmptySkill()];

    updateSkills(nextSkills);
  };

  /* ==========================================================
     REMOVE SKILL
  ========================================================== */

  const handleRemoveSkill = (skillId: string) => {
    /*
     * Keep at least one skill editor available.
     */
    if (skills.length <= 1) {
      return;
    }

    const nextSkills = skills.filter((skill) => skill.id !== skillId);

    updateSkills(nextSkills);
  };

  /* ==========================================================
     CHANGE NAME
  ========================================================== */

  const handleNameChange = (skillId: string, event: ChangeEvent<HTMLInputElement>) => {
    updateSkill(skillId, "name", event.target.value);
  };

  /* ==========================================================
     CHANGE CATEGORY
  ========================================================== */

  const handleCategoryChange = (skillId: string, event: ChangeEvent<HTMLInputElement>) => {
    updateSkill(skillId, "category", event.target.value);
  };

  /* ==========================================================
     CHANGE LEVEL
  ========================================================== */

  const handleLevelChange = (skillId: string, event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    updateSkill(
      skillId,
      "level",
      value ? (value as ResumeData["skills"][number]["level"]) : undefined,
    );
  };

  /* ==========================================================
     BLUR VALIDATION
  ========================================================== */

  const handleBlur = () => {
    if (!hasAttemptedValidation) {
      return;
    }

    onValidate?.(validateSkills(resume.skills));
  };

  /* ==========================================================
     VALIDATE
  ========================================================== */

  const handleValidate = () => {
    setHasAttemptedValidation(true);

    const validationErrors = validateSkills(resume.skills);

    onValidate?.(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="space-y-6">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div>
        <h2 className="text-base font-semibold tracking-tight">Skills</h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Add the technical, professional, and industry-specific skills that best match the roles
          you want. Keep your list focused on skills you can confidently demonstrate.
        </p>
      </div>

      {/* ========================================================
          SKILL ITEMS
      ======================================================== */}

      <div className="space-y-4">
        {skills.map((skill, index) => {
          const itemErrors = errors.items?.[skill.id] ?? {};

          const canDelete = skills.length > 1;

          return (
            <div key={skill.id} className="rounded-xl border border-border bg-background">
              {/* ==================================================
                  ITEM HEADER
              ================================================== */}

              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Skill {index + 1}</p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {index === 0
                        ? "Start with your strongest or most relevant skill."
                        : "Add another skill relevant to your target roles."}
                    </p>
                  </div>
                </div>

                {/* ==================================================
                    DELETE
                ================================================== */}

                {canDelete && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="
                      h-8 w-8 shrink-0
                      text-muted-foreground
                      hover:bg-destructive/10
                      hover:text-destructive
                    "
                    onClick={() => handleRemoveSkill(skill.id)}
                    aria-label={`Delete Skill ${index + 1}`}
                    title={`Delete Skill ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* ==================================================
                  CONTENT
              ================================================== */}

              <div className="space-y-5 p-5">
                {/* =================================================
                    NAME
                ================================================= */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor={`skill-name-${skill.id}`}>
                      Skill name <span className="text-destructive">*</span>
                    </Label>

                    <span className="text-xs tabular-nums text-muted-foreground">
                      {skill.name.length}/100
                    </span>
                  </div>

                  <Input
                    id={`skill-name-${skill.id}`}
                    value={skill.name}
                    onChange={(event) => handleNameChange(skill.id, event)}
                    onBlur={handleBlur}
                    placeholder="e.g. TypeScript"
                    maxLength={100}
                    aria-invalid={Boolean(itemErrors.name)}
                    aria-describedby={itemErrors.name ? `skill-name-${skill.id}-error` : undefined}
                  />

                  <p className="text-xs leading-5 text-muted-foreground">
                    Enter a specific skill, technology, tool, or professional competency.
                  </p>

                  {itemErrors.name && (
                    <p
                      id={`skill-name-${skill.id}-error`}
                      className="text-xs font-medium text-destructive"
                      role="alert"
                    >
                      {itemErrors.name}
                    </p>
                  )}
                </div>

                {/* =================================================
                    LEVEL + CATEGORY
                ================================================= */}

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* =================================================
                      LEVEL
                  ================================================= */}

                  <div className="space-y-2">
                    <Label htmlFor={`skill-level-${skill.id}`}>Proficiency level</Label>

                    <select
                      id={`skill-level-${skill.id}`}
                      value={skill.level ?? ""}
                      onChange={(event) => handleLevelChange(skill.id, event)}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(itemErrors.level)}
                      className="
                        flex h-10 w-full
                        rounded-md
                        border border-input
                        bg-background
                        px-3 py-2
                        text-sm
                        ring-offset-background
                        transition-colors
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-ring
                        focus-visible:ring-offset-2
                      "
                    >
                      <option value="">Select level</option>

                      <option value="beginner">Beginner</option>

                      <option value="intermediate">Intermediate</option>

                      <option value="advanced">Advanced</option>

                      <option value="expert">Expert</option>
                    </select>

                    <p className="text-xs leading-5 text-muted-foreground">
                      Choose the level that best represents your actual ability.
                    </p>

                    {itemErrors.level && (
                      <p className="text-xs font-medium text-destructive" role="alert">
                        {itemErrors.level}
                      </p>
                    )}
                  </div>

                  {/* =================================================
                      CATEGORY
                  ================================================= */}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor={`skill-category-${skill.id}`}>Category</Label>

                      <span className="text-xs tabular-nums text-muted-foreground">
                        {(skill.category ?? "").length}
                        /80
                      </span>
                    </div>

                    <Input
                      id={`skill-category-${skill.id}`}
                      value={skill.category ?? ""}
                      onChange={(event) => handleCategoryChange(skill.id, event)}
                      onBlur={handleBlur}
                      placeholder="e.g. Frontend Development"
                      maxLength={80}
                      aria-invalid={Boolean(itemErrors.category)}
                      aria-describedby={
                        itemErrors.category ? `skill-category-${skill.id}-error` : undefined
                      }
                    />

                    <p className="text-xs leading-5 text-muted-foreground">
                      Optional. Group related skills such as Frontend, Backend, Design, or
                      Management.
                    </p>

                    {itemErrors.category && (
                      <p
                        id={`skill-category-${skill.id}-error`}
                        className="text-xs font-medium text-destructive"
                        role="alert"
                      >
                        {itemErrors.category}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          ADD ANOTHER SKILL
      ======================================================== */}

      <Button type="button" variant="outline" className="w-full" onClick={handleAddSkill}>
        <Plus className="mr-2 h-4 w-4" />
        Add Another Skill
      </Button>

      <p className="text-center text-xs leading-5 text-muted-foreground">
        Focus on the skills most relevant to the jobs you are applying for. A focused list is
        usually stronger than a very long list.
      </p>

      {/* ========================================================
          GENERAL ERROR
      ======================================================== */}

      {errors.skills && (
        <div
          className="
            rounded-lg
            border border-destructive/20
            bg-destructive/5
            px-4 py-3
          "
          role="alert"
        >
          <p className="text-xs font-medium text-destructive">{errors.skills}</p>
        </div>
      )}

      {/* ========================================================
          GUIDANCE
      ======================================================== */}

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium">Add stronger skills</p>

            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-muted-foreground">
              <li>• Prioritize skills mentioned in the job description.</li>

              <li>• Use specific technologies instead of vague terms.</li>

              <li>• Group skills into useful categories.</li>

              <li>• Only select a proficiency level you can confidently demonstrate.</li>

              <li>• Avoid adding duplicate skills.</li>

              <li>• Keep the list relevant to your target career.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ========================================================
          VALIDATION MESSAGE
      ======================================================== */}

      {!isSkillsValid(resume.skills) && hasAttemptedValidation && (
        <p className="text-xs font-medium text-destructive" role="alert">
          Please complete the highlighted skill fields before continuing.
        </p>
      )}

      {/* ========================================================
          INTERNAL VALIDATION TRIGGER
      ======================================================== */}

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

export default SkillsSectionEditor;
