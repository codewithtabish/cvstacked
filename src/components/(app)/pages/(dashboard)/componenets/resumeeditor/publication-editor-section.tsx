"use client";

import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import type { ResumePublication } from "@/types/resume";

interface ResumePublicationEditorProps {
  publications: ResumePublication[];
  onChange: (publications: ResumePublication[]) => void;
}

interface PublicationFormData {
  title: string;
  publisher: string;
  date: string;
  url: string;
  description: string;
}

type PublicationField = keyof PublicationFormData;

type PublicationErrors = Partial<Record<PublicationField, string>>;

const EMPTY_FORM: PublicationFormData = {
  title: "",
  publisher: "",
  date: "",
  url: "",
  description: "",
};

const publicationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Publication title is required.")
    .max(200, "Publication title must be 200 characters or fewer."),

  publisher: z
    .string()
    .trim()
    .min(1, "Publisher is required.")
    .max(200, "Publisher must be 200 characters or fewer."),

  date: z
    .string()
    .trim()
    .min(1, "Publication date is required.")
    .max(50, "Publication date is invalid."),

  url: z
    .string()
    .trim()
    .max(500, "URL must be 500 characters or fewer.")
    .refine(
      (value) => {
        if (!value) return true;

        try {
          const url = new URL(value);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message: "Enter a valid URL starting with http:// or https://.",
      },
    ),

  description: z.string().trim().max(1000, "Description must be 1000 characters or fewer."),
});

/**
 * Convert YYYY-MM-DD into a local Date.
 *
 * We intentionally avoid new Date("YYYY-MM-DD") because that can
 * interpret the value as UTC and cause the calendar to show the
 * previous/next day depending on the user's timezone.
 */
function parseDateValue(value: string): Date | undefined {
  if (!value) return undefined;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined;
  }

  return date;
}

/**
 * Store dates consistently as YYYY-MM-DD.
 */
function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Display the stored date in a human-friendly format.
 */
function formatDisplayDate(value: string): string {
  const date = parseDateValue(value);

  if (!date) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  }).format(date);
}

/**
 * Accept common URLs without forcing users to manually type
 * https:// while still storing a proper URL.
 */
function normalizeUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function ResumePublicationEditor({ publications, onChange }: ResumePublicationEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [form, setForm] = useState<PublicationFormData>(EMPTY_FORM);

  const [errors, setErrors] = useState<PublicationErrors>({});

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setIsAdding(false);
    setEditingId(null);
    setIsDatePickerOpen(false);
  };

  const updateField = (field: PublicationField, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const result = publicationSchema.safeParse(form);

    if (result.success) {
      setErrors({});
      return true;
    }

    const nextErrors: PublicationErrors = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0] as PublicationField;

      if (!nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    }

    setErrors(nextErrors);

    return false;
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      updateField("date", "");
      return;
    }

    updateField("date", formatDateValue(date));
    setIsDatePickerOpen(false);
  };

  const handleAdd = () => {
    if (!validate()) {
      return;
    }

    const newPublication: ResumePublication = {
      id: `publication-${crypto.randomUUID()}`,
      title: form.title.trim(),
      publisher: form.publisher.trim(),
      date: form.date.trim(),

      ...(form.url.trim()
        ? {
            url: normalizeUrl(form.url),
          }
        : {}),

      ...(form.description.trim()
        ? {
            description: form.description.trim(),
          }
        : {}),
    };

    onChange([...publications, newPublication]);

    setExpandedId(newPublication.id);

    resetForm();
  };

  const handleEdit = (publication: ResumePublication) => {
    setEditingId(publication.id);
    setIsAdding(false);

    setForm({
      title: publication.title,
      publisher: publication.publisher,
      date: publication.date,
      url: publication.url ?? "",
      description: publication.description ?? "",
    });

    setErrors({});
    setExpandedId(publication.id);
  };

  const handleSaveEdit = () => {
    if (!editingId) {
      return;
    }

    if (!validate()) {
      return;
    }

    const updatedPublications = publications.map((publication) => {
      if (publication.id !== editingId) {
        return publication;
      }

      return {
        ...publication,

        title: form.title.trim(),

        publisher: form.publisher.trim(),

        date: form.date.trim(),

        ...(form.url.trim()
          ? {
              url: normalizeUrl(form.url),
            }
          : {
              url: undefined,
            }),

        ...(form.description.trim()
          ? {
              description: form.description.trim(),
            }
          : {
              description: undefined,
            }),
      };
    });

    onChange(updatedPublications);

    resetForm();
  };

  const handleDelete = (id: string) => {
    onChange(publications.filter((publication) => publication.id !== id));

    if (editingId === id) {
      resetForm();
    }

    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const startAdding = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setIsDatePickerOpen(false);
    setIsAdding(true);
  };

  const toggleExpanded = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const isFormOpen = isAdding || editingId !== null;

  const getInputClassName = (field: PublicationField) => {
    return errors[field] ? "border-destructive focus-visible:ring-destructive/20" : "";
  };

  return (
    <div className="space-y-5">
      {/* =========================================================
          HEADER
          ========================================================= */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/50">
              <BookOpen className="size-4 text-foreground" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-foreground">Publications</h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Highlight articles, papers, books, or other work you have published.
              </p>
            </div>
          </div>
        </div>

        {!isFormOpen && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startAdding}
            className="h-9 shrink-0 gap-1.5 rounded-lg px-3 text-xs"
          >
            <Plus className="size-3.5" />
            Add publication
          </Button>
        )}
      </div>

      {/* =========================================================
          ADD / EDIT FORM
          ========================================================= */}

      {isFormOpen && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Form Header */}

          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h3 className="text-sm font-medium text-foreground">
                {editingId ? "Edit publication" : "Add publication"}
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Add the publication details below.
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              aria-label="Close"
              className="size-8 rounded-md text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Form Body */}

          <div className="space-y-4 p-4">
            {/* =====================================================
                TITLE
                ===================================================== */}

            <div className="space-y-1.5">
              <Label htmlFor="publication-title" className="text-xs font-medium">
                Publication title <span className="text-destructive">*</span>
              </Label>

              <Input
                id="publication-title"
                type="text"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="e.g. The Future of Artificial Intelligence"
                aria-invalid={Boolean(errors.title)}
                className={`h-10 rounded-lg text-sm ${getInputClassName("title")}`}
              />

              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            {/* =====================================================
                PUBLISHER
                ===================================================== */}

            <div className="space-y-1.5">
              <Label htmlFor="publication-publisher" className="text-xs font-medium">
                Publisher <span className="text-destructive">*</span>
              </Label>

              <Input
                id="publication-publisher"
                type="text"
                value={form.publisher}
                onChange={(event) => updateField("publisher", event.target.value)}
                placeholder="e.g. Medium, IEEE, O'Reilly"
                aria-invalid={Boolean(errors.publisher)}
                className={`h-10 rounded-lg text-sm ${getInputClassName("publisher")}`}
              />

              {errors.publisher && <p className="text-xs text-destructive">{errors.publisher}</p>}
            </div>

            {/* =====================================================
                DATE
                ===================================================== */}

            <div className="space-y-1.5">
              <Label htmlFor="publication-date" className="text-xs font-medium">
                Publication date <span className="text-destructive">*</span>
              </Label>

              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="publication-date"
                    type="button"
                    variant="outline"
                    className={`h-10 w-full justify-start rounded-lg px-3 text-sm font-normal ${
                      !form.date ? "text-muted-foreground" : "text-foreground"
                    } ${errors.date ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                    aria-invalid={Boolean(errors.date)}
                  >
                    <CalendarDays className="mr-2 size-4 shrink-0 text-muted-foreground" />

                    {form.date ? formatDisplayDate(form.date) : "Select publication date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={parseDateValue(form.date)}
                    onSelect={handleDateChange}
                    defaultMonth={parseDateValue(form.date) ?? new Date()}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>

              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>

            {/* =====================================================
                URL
                ===================================================== */}

            <div className="space-y-1.5">
              <Label htmlFor="publication-url" className="text-xs font-medium">
                Publication URL{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>

              <Input
                id="publication-url"
                type="url"
                value={form.url}
                onChange={(event) => updateField("url", event.target.value)}
                placeholder="https://example.com/my-publication"
                aria-invalid={Boolean(errors.url)}
                className={`h-10 rounded-lg text-sm ${getInputClassName("url")}`}
              />

              {errors.url ? (
                <p className="text-xs text-destructive">{errors.url}</p>
              ) : (
                <p className="text-[11px] leading-4 text-muted-foreground">
                  Add a link where recruiters can read or verify the publication.
                </p>
              )}
            </div>

            {/* =====================================================
                DESCRIPTION
                ===================================================== */}

            <div className="space-y-1.5">
              <Label htmlFor="publication-description" className="text-xs font-medium">
                Description <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>

              <Textarea
                id="publication-description"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Briefly describe the publication, its subject, or your contribution..."
                rows={4}
                aria-invalid={Boolean(errors.description)}
                className={`resize-none rounded-lg text-sm ${
                  errors.description ? "border-destructive focus-visible:ring-destructive/20" : ""
                }`}
              />

              <div className="flex items-center justify-between gap-3">
                {errors.description ? (
                  <p className="text-xs text-destructive">{errors.description}</p>
                ) : (
                  <span />
                )}

                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {form.description.length}/1000
                </span>
              </div>
            </div>

            {/* =====================================================
                FORM ACTIONS
                ===================================================== */}

            <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="h-9 rounded-lg px-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={editingId ? handleSaveEdit : handleAdd}
                className="h-9 gap-1.5 rounded-lg px-3.5 text-xs"
              >
                <Check className="size-3.5" />

                {editingId ? "Save changes" : "Add publication"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          EMPTY STATE
          ========================================================= */}

      {publications.length === 0 && !isFormOpen && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-border bg-background">
            <BookOpen className="size-5 text-muted-foreground" />
          </div>

          <h3 className="mt-3 text-sm font-medium text-foreground">No publications added yet</h3>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
            Add articles, research papers, books, or other published work to showcase your
            expertise.
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={startAdding}
            className="mt-4 h-9 gap-1.5 rounded-lg px-3.5 text-xs"
          >
            <Plus className="size-3.5" />
            Add your first publication
          </Button>
        </div>
      )}

      {/* =========================================================
          PUBLICATIONS LIST
          ========================================================= */}

      {publications.length > 0 && (
        <div className="space-y-2.5">
          {publications.map((publication) => {
            const isExpanded = expandedId === publication.id;

            return (
              <div
                key={publication.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                {/* Publication Row */}

                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                    <BookOpen className="size-4 text-muted-foreground" />
                  </div>

                  {/* Main Content */}

                  <button
                    type="button"
                    onClick={() => toggleExpanded(publication.id)}
                    className="min-w-0 flex-1 text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-medium text-foreground">
                        {publication.title}
                      </h3>

                      <ChevronDown
                        className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                      <span>{publication.publisher}</span>

                      <span aria-hidden="true">•</span>

                      <span>{formatDisplayDate(publication.date)}</span>
                    </div>
                  </button>

                  {/* Actions */}

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(publication)}
                      aria-label={`Edit ${publication.title}`}
                      className="size-8 rounded-md text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(publication.id)}
                      aria-label={`Delete ${publication.title}`}
                      className="size-8 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* =================================================
                    EXPANDED DETAILS
                    ================================================= */}

                {isExpanded && (
                  <div className="border-t border-border bg-muted/20 px-4 py-3.5">
                    <div className="space-y-3">
                      {publication.description ? (
                        <p className="text-xs leading-5 text-muted-foreground">
                          {publication.description}
                        </p>
                      ) : (
                        <p className="text-xs italic text-muted-foreground">
                          No description added.
                        </p>
                      )}

                      {publication.url && (
                        <a
                          href={publication.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                        >
                          <ExternalLink className="size-3.5" />
                          View publication
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================
          ADD ANOTHER
          ========================================================= */}

      {publications.length > 0 && !isFormOpen && (
        <Button
          type="button"
          variant="ghost"
          onClick={startAdding}
          className="flex h-auto w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-3 text-xs font-medium text-muted-foreground hover:bg-muted/30 hover:text-foreground"
        >
          <Plus className="size-3.5" />
          Add another publication
        </Button>
      )}
    </div>
  );
}

export default ResumePublicationEditor;
