"use client";

import { CalendarIcon, FileText, Plus, Trash2, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { z } from "zod";

import type { ResumeData, ResumeProject } from "@/types/resume";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

/* ============================================================
   VALIDATION
============================================================ */

const projectItemSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Project name must be at least 2 characters.")
      .max(100, "Project name must be 100 characters or less."),

    role: z
      .string()
      .trim()
      .max(80, "Role must be 80 characters or less.")
      .optional()
      .or(z.literal("")),

    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters.")
      .max(600, "Description must be 600 characters or less."),

    technologies: z
      .array(z.string().trim().min(1).max(40))
      .max(12, "You can add up to 12 technologies.")
      .optional()
      .default([]),

    startDate: z.string().trim().max(20, "Start date is too long.").optional().or(z.literal("")),

    endDate: z.string().trim().max(20, "End date is too long.").optional().or(z.literal("")),

    url: z.string().trim().url("Please enter a valid URL.").optional().or(z.literal("")),

    github: z.string().trim().url("Please enter a valid GitHub URL.").optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    /*
     * "Present" represents a currently active project.
     */
    if (data.startDate && data.endDate && data.endDate !== "Present") {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date cannot be before the start date.",
        });
      }
    }
  });

export type ProjectItemValidationErrors = {
  name?: string;
  role?: string;
  description?: string;
  technologies?: string;
  startDate?: string;
  endDate?: string;
  url?: string;
  github?: string;
};

export type ProjectSectionValidationErrors = {
  projects?: string;
  items?: Record<string, ProjectItemValidationErrors>;
};

/* ============================================================
   VALIDATE SINGLE PROJECT
============================================================ */

export function validateProjectItem(project: Partial<ResumeProject>): ProjectItemValidationErrors {
  const result = projectItemSchema.safeParse({
    name: project.name ?? "",
    role: project.role ?? "",
    description: project.description ?? "",
    technologies: project.technologies ?? [],
    startDate: project.startDate ?? "",
    endDate: project.endDate ?? "",
    url: project.url ?? "",
    github: project.github ?? "",
  });

  if (result.success) {
    return {};
  }

  const errors: ProjectItemValidationErrors = {};

  for (const issue of result.error.issues) {
    const path = issue.path[0] as keyof ProjectItemValidationErrors | undefined;

    if (path && !errors[path]) {
      errors[path] = issue.message;
    }
  }

  return errors;
}

/* ============================================================
   VALIDATE PROJECTS
============================================================ */

export function validateProjects(projects: ResumeProject[]): ProjectSectionValidationErrors {
  if (projects.length === 0) {
    return {};
  }

  const items: Record<string, ProjectItemValidationErrors> = {};
  let hasErrors = false;

  for (const project of projects) {
    const itemErrors = validateProjectItem(project);

    if (Object.keys(itemErrors).length > 0) {
      items[project.id] = itemErrors;
      hasErrors = true;
    }
  }

  if (!hasErrors) {
    return {};
  }

  return {
    projects: "Please fix the errors in your projects.",
    items,
  };
}

/* ============================================================
   VALIDITY HELPER
============================================================ */

export function isProjectsValid(projects: ResumeProject[]): boolean {
  return Object.keys(validateProjects(projects)).length === 0;
}

/* ============================================================
   DATE HELPERS
============================================================ */

function parseDate(value?: string): Date | undefined {
  if (!value || value === "Present") {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

function formatDate(date?: Date): string {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateForDisplay(value?: string): string {
  if (!value) {
    return "Select date";
  }

  if (value === "Present") {
    return "Present";
  }

  const date = parseDate(value);

  if (!date) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/* ============================================================
   EMPTY PROJECT
============================================================ */

function createEmptyProject(): ResumeProject {
  return {
    id: crypto.randomUUID(),
    name: "",
    role: "",
    description: "",
    technologies: [],
    startDate: "",
    endDate: "",
    url: "",
    github: "",
  };
}

/* ============================================================
   PROPS
============================================================ */

interface ProjectSectionEditorProps {
  resume: ResumeData;
  onChange: (next: ResumeData) => void;
  errors?: ProjectSectionValidationErrors;
  onValidate?: (errors: ProjectSectionValidationErrors) => void;
}

/* ============================================================
   COMPONENT
============================================================ */

export function ProjectSectionEditor({
  resume,
  onChange,
  errors = {},
  onValidate,
}: ProjectSectionEditorProps) {
  const projects = resume.projects ?? [];

  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  const [techDrafts, setTechDrafts] = useState<Record<string, string>>({});

  /*
   * Controls which project cards are expanded.
   * Newly created projects are opened automatically.
   */
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  /* ==========================================================
     LIVE VALIDATION
  ========================================================== */

  useEffect(() => {
    if (!hasAttemptedValidation) {
      return;
    }

    onValidate?.(validateProjects(projects));
  }, [projects, hasAttemptedValidation, onValidate]);

  /* ==========================================================
     UPDATE PROJECT
  ========================================================== */

  const updateProject = (id: string, patch: Partial<ResumeProject>) => {
    const next = projects.map((project) =>
      project.id === id
        ? {
            ...project,
            ...patch,
          }
        : project,
    );

    onChange({
      ...resume,
      projects: next,
    });

    if (hasAttemptedValidation) {
      onValidate?.(validateProjects(next));
    }
  };

  /* ==========================================================
     ADD PROJECT
  ========================================================== */

  const handleAdd = () => {
    const newProject = createEmptyProject();
    const next = [...projects, newProject];

    onChange({
      ...resume,
      projects: next,
    });

    setExpandedProjects((prev) => ({
      ...prev,
      [newProject.id]: true,
    }));

    /*
     * Do not immediately show validation errors
     * for the newly created empty project.
     */
    setHasAttemptedValidation(false);
    onValidate?.({});
  };

  /* ==========================================================
     REMOVE PROJECT
  ========================================================== */

  const handleRemove = (id: string) => {
    const next = projects.filter((project) => project.id !== id);

    onChange({
      ...resume,
      projects: next,
    });

    setTechDrafts((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    setExpandedProjects((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    if (hasAttemptedValidation) {
      onValidate?.(validateProjects(next));
    }
  };

  /* ==========================================================
     TOGGLE PROJECT
  ========================================================== */

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? true),
    }));
  };

  /* ==========================================================
     CURRENT PROJECT
  ========================================================== */

  const isCurrentProject = (project: ResumeProject) => project.endDate === "Present";

  const handleCurrentProjectChange = (project: ResumeProject, checked: boolean) => {
    /*
     * ResumeProject does NOT contain a currentProject property.
     *
     * Current project state is represented by:
     *
     * endDate: "Present"
     */
    updateProject(project.id, {
      endDate: checked ? "Present" : "",
    });
  };

  /* ==========================================================
     START DATE
  ========================================================== */

  const handleStartDateChange = (project: ResumeProject, date: Date | undefined) => {
    const startDate = formatDate(date);

    /*
     * If the existing end date becomes invalid because
     * the start date moved forward, clear the end date.
     */
    if (date && project.endDate && project.endDate !== "Present") {
      const endDate = parseDate(project.endDate);

      if (endDate && endDate < date) {
        updateProject(project.id, {
          startDate,
          endDate: "",
        });

        return;
      }
    }

    updateProject(project.id, {
      startDate,
    });
  };

  /* ==========================================================
     END DATE
  ========================================================== */

  const handleEndDateChange = (project: ResumeProject, date: Date | undefined) => {
    if (!date) {
      updateProject(project.id, {
        endDate: "",
      });

      return;
    }

    const startDate = parseDate(project.startDate);

    /*
     * Prevent selecting an end date before the start date.
     */
    if (startDate && date < startDate) {
      return;
    }

    updateProject(project.id, {
      endDate: formatDate(date),
    });
  };

  /* ==========================================================
     TECHNOLOGIES
  ========================================================== */

  const handleTechDraftChange = (id: string, value: string) => {
    setTechDrafts((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddTechnology = (id: string) => {
    const draft = (techDrafts[id] ?? "").trim();

    if (!draft) {
      return;
    }

    const project = projects.find((item) => item.id === id);

    if (!project) {
      return;
    }

    const existing = project.technologies ?? [];

    if (existing.some((technology) => technology.toLowerCase() === draft.toLowerCase())) {
      setTechDrafts((prev) => ({
        ...prev,
        [id]: "",
      }));

      return;
    }

    if (existing.length >= 12) {
      return;
    }

    updateProject(id, {
      technologies: [...existing, draft],
    });

    setTechDrafts((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const handleRemoveTechnology = (id: string, tech: string) => {
    const project = projects.find((item) => item.id === id);

    if (!project) {
      return;
    }

    updateProject(id, {
      technologies: (project.technologies ?? []).filter((item) => item !== tech),
    });
  };

  /* ==========================================================
     BLUR / VALIDATE
  ========================================================== */

  const handleBlur = () => {
    if (!hasAttemptedValidation) {
      setHasAttemptedValidation(true);
    }

    onValidate?.(validateProjects(projects));
  };

  const itemErrors = errors.items ?? {};

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Selected Projects</h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Showcase the work that best demonstrates your skills, impact, and technical depth. Focus
            on outcomes over responsibilities.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="shrink-0 gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add project
        </Button>
      </div>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {projects.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>

          <p className="mt-3 text-sm font-medium">No projects added yet</p>

          <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-muted-foreground">
            Projects are optional, but strong examples significantly improve your resume.
          </p>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAdd}
            className="mt-4 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add your first project
          </Button>
        </div>
      )}

      {/* ======================================================
          PROJECT LIST
      ====================================================== */}

      <div className="space-y-4">
        {projects.map((project, index) => {
          const fieldErrors = itemErrors[project.id] ?? {};

          const technologies = project.technologies ?? [];

          const descriptionCount = (project.description ?? "").length;

          const current = isCurrentProject(project);

          const expanded = expandedProjects[project.id] ?? true;

          const startDate = parseDate(project.startDate);

          const endDate = project.endDate !== "Present" ? parseDate(project.endDate) : undefined;

          return (
            <div
              key={project.id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              {/* ==================================================
                  CARD HEADER
              ================================================== */}

              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <button
                  type="button"
                  onClick={() => toggleProject(project.id)}
                  className="min-w-0 flex-1 text-left"
                  aria-expanded={expanded}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {project.name.trim() || `Project ${index + 1}`}
                    </span>

                    {current && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Current
                      </span>
                    )}
                  </div>

                  {!project.name.trim() && (
                    <p className="mt-0.5 text-xs text-muted-foreground">Add your project details</p>
                  )}
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(project.id)}
                    aria-label="Remove project"
                    title="Remove project"
                    className="h-8 w-8 rounded-md text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* ==================================================
                  CARD CONTENT
              ================================================== */}

              {expanded && (
                <div className="p-5">
                  <div className="space-y-5">
                    {/* ==========================================
                        NAME + ROLE
                    ========================================== */}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`project-name-${project.id}`}>
                          Project name <span className="text-destructive">*</span>
                        </Label>

                        <Input
                          id={`project-name-${project.id}`}
                          value={project.name}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateProject(project.id, {
                              name: e.target.value,
                            })
                          }
                          onBlur={handleBlur}
                          placeholder="Atlas Analytics Platform"
                          aria-invalid={Boolean(fieldErrors.name)}
                          className={
                            fieldErrors.name
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        />

                        {fieldErrors.name && (
                          <p className="text-xs font-medium text-destructive" role="alert">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`project-role-${project.id}`}>Your role</Label>

                        <Input
                          id={`project-role-${project.id}`}
                          value={project.role ?? ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateProject(project.id, {
                              role: e.target.value,
                            })
                          }
                          onBlur={handleBlur}
                          placeholder="Lead Engineer"
                          aria-invalid={Boolean(fieldErrors.role)}
                          className={
                            fieldErrors.role
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        />

                        {fieldErrors.role && (
                          <p className="text-xs font-medium text-destructive" role="alert">
                            {fieldErrors.role}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ==========================================
                        DESCRIPTION
                    ========================================== */}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label htmlFor={`project-description-${project.id}`}>
                          Description <span className="text-destructive">*</span>
                        </Label>

                        <span
                          className={[
                            "text-xs tabular-nums",
                            descriptionCount > 600 ? "text-destructive" : "text-muted-foreground",
                          ].join(" ")}
                        >
                          {descriptionCount}/600
                        </span>
                      </div>

                      <Textarea
                        id={`project-description-${project.id}`}
                        value={project.description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                          updateProject(project.id, {
                            description: e.target.value,
                          })
                        }
                        onBlur={handleBlur}
                        placeholder="Real-time analytics platform enabling enterprise teams to monitor product usage and operational performance..."
                        aria-invalid={Boolean(fieldErrors.description)}
                        className={[
                          "min-h-[110px] resize-y leading-6",
                          fieldErrors.description
                            ? "border-destructive focus-visible:ring-destructive"
                            : "",
                        ].join(" ")}
                      />

                      {fieldErrors.description ? (
                        <p className="text-xs font-medium text-destructive" role="alert">
                          {fieldErrors.description}
                        </p>
                      ) : (
                        <p className="text-xs leading-5 text-muted-foreground">
                          Briefly describe the problem, your contribution, and the outcome.
                        </p>
                      )}
                    </div>

                    {/* ==========================================
                        DATES
                    ========================================== */}

                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* START DATE */}

                        <div className="space-y-2">
                          <Label>Start date</Label>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className={[
                                  "h-10 w-full justify-start text-left font-normal",
                                  !project.startDate ? "text-muted-foreground" : "",
                                  fieldErrors.startDate
                                    ? "border-destructive focus-visible:ring-destructive"
                                    : "",
                                ].join(" ")}
                                onBlur={handleBlur}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />

                                {formatDateForDisplay(project.startDate)}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={(date) => handleStartDateChange(project, date)}
                                disabled={(date) => date > new Date()}
                                // initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          {fieldErrors.startDate && (
                            <p className="text-xs font-medium text-destructive" role="alert">
                              {fieldErrors.startDate}
                            </p>
                          )}
                        </div>

                        {/* END DATE */}

                        <div className="space-y-2">
                          <Label>End date</Label>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                disabled={current}
                                className={[
                                  "h-10 w-full justify-start text-left font-normal",
                                  !project.endDate ? "text-muted-foreground" : "",
                                  current ? "cursor-not-allowed opacity-60" : "",
                                  fieldErrors.endDate
                                    ? "border-destructive focus-visible:ring-destructive"
                                    : "",
                                ].join(" ")}
                                onBlur={handleBlur}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />

                                {current ? "Present" : formatDateForDisplay(project.endDate)}
                              </Button>
                            </PopoverTrigger>

                            {!current && (
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={endDate}
                                  onSelect={(date) => handleEndDateChange(project, date)}
                                  disabled={(date) => {
                                    if (startDate) {
                                      return date < startDate || date > new Date();
                                    }

                                    return date > new Date();
                                  }}
                                  //   initialFocus
                                />
                              </PopoverContent>
                            )}
                          </Popover>

                          {fieldErrors.endDate && (
                            <p className="text-xs font-medium text-destructive" role="alert">
                              {fieldErrors.endDate}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* CURRENT PROJECT */}

                      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 px-3.5 py-3">
                        <Checkbox
                          id={`project-current-${project.id}`}
                          checked={current}
                          onCheckedChange={(checked) =>
                            handleCurrentProjectChange(project, checked === true)
                          }
                        />

                        <div className="grid gap-1">
                          <Label
                            htmlFor={`project-current-${project.id}`}
                            className="cursor-pointer text-sm font-medium"
                          >
                            I am currently working on this project
                          </Label>

                          <p className="text-xs leading-5 text-muted-foreground">
                            Your end date will automatically be shown as Present.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ==========================================
                        LINKS
                    ========================================== */}

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* LIVE URL */}

                      <div className="space-y-2">
                        <Label htmlFor={`project-url-${project.id}`}>Live URL</Label>

                        <Input
                          id={`project-url-${project.id}`}
                          value={project.url ?? ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateProject(project.id, {
                              url: e.target.value,
                            })
                          }
                          onBlur={handleBlur}
                          placeholder="https://example.com/project"
                          aria-invalid={Boolean(fieldErrors.url)}
                          className={
                            fieldErrors.url
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        />

                        {fieldErrors.url && (
                          <p className="text-xs font-medium text-destructive" role="alert">
                            {fieldErrors.url}
                          </p>
                        )}
                      </div>

                      {/* GITHUB */}

                      <div className="space-y-2">
                        <Label htmlFor={`project-github-${project.id}`}>GitHub</Label>

                        <Input
                          id={`project-github-${project.id}`}
                          value={project.github ?? ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateProject(project.id, {
                              github: e.target.value,
                            })
                          }
                          onBlur={handleBlur}
                          placeholder="https://github.com/username/repo"
                          aria-invalid={Boolean(fieldErrors.github)}
                          className={
                            fieldErrors.github
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        />

                        {fieldErrors.github && (
                          <p className="text-xs font-medium text-destructive" role="alert">
                            {fieldErrors.github}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ==========================================
                        TECHNOLOGIES
                    ========================================== */}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label>Technologies</Label>

                        <span className="text-xs text-muted-foreground">
                          {technologies.length}/12
                        </span>
                      </div>

                      {technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {technologies.map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium"
                            >
                              {tech}

                              <button
                                type="button"
                                onClick={() => handleRemoveTechnology(project.id, tech)}
                                className="ml-0.5 rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                                aria-label={`Remove ${tech}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Input
                          value={techDrafts[project.id] ?? ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleTechDraftChange(project.id, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTechnology(project.id);
                            }
                          }}
                          placeholder="Add technology (e.g. Next.js)"
                          className="flex-1"
                        />

                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAddTechnology(project.id)}
                          disabled={
                            !(techDrafts[project.id] ?? "").trim() || technologies.length >= 12
                          }
                        >
                          Add
                        </Button>
                      </div>

                      {fieldErrors.technologies && (
                        <p className="text-xs font-medium text-destructive" role="alert">
                          {fieldErrors.technologies}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Press Enter or click Add. Maximum 12 technologies.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ======================================================
          WRITING GUIDANCE
      ====================================================== */}

      {projects.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium">Make your projects stand out</p>

              <ul className="mt-2 space-y-1.5 text-xs leading-5 text-muted-foreground">
                <li>• Lead with impact — what changed because of your work?</li>

                <li>• Include the stack so recruiters can quickly scan relevance.</li>

                <li>• Prefer quantified results (users, latency, revenue, stars).</li>

                <li>• Keep descriptions concise and outcome-focused.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          SECTION ERROR
      ====================================================== */}

      {errors.projects && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {errors.projects}
        </p>
      )}
    </div>
  );
}
