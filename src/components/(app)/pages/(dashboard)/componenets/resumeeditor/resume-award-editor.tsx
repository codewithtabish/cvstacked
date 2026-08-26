"use client";

import { Award, CalendarDays, Check, ChevronDown, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import type { ResumeAward } from "@/types/resume";

interface ResumeAwardEditorProps {
  awards: ResumeAward[];
  onChange: (awards: ResumeAward[]) => void;
}

interface AwardFormData {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

const EMPTY_FORM: AwardFormData = {
  title: "",
  issuer: "",
  date: "",
  description: "",
};

export function ResumeAwardEditor({ awards, onChange }: ResumeAwardEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AwardFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof AwardFormData, string>>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setIsAdding(false);
    setEditingId(null);
  };

  const updateField = (field: keyof AwardFormData, value: string) => {
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

  const validate = () => {
    const nextErrors: Partial<Record<keyof AwardFormData, string>> = {};

    if (!form.title.trim()) {
      nextErrors.title = "Award title is required.";
    }

    if (!form.issuer.trim()) {
      nextErrors.issuer = "Issuer is required.";
    }

    if (!form.date.trim()) {
      nextErrors.date = "Date is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;

    const newAward: ResumeAward = {
      id: `award-${crypto.randomUUID()}`,
      title: form.title.trim(),
      issuer: form.issuer.trim(),
      date: form.date.trim(),
      ...(form.description.trim() ? { description: form.description.trim() } : {}),
    };

    onChange([...awards, newAward]);

    setExpandedId(newAward.id);
    resetForm();
  };

  const handleEdit = (award: ResumeAward) => {
    setEditingId(award.id);
    setIsAdding(false);

    setForm({
      title: award.title,
      issuer: award.issuer,
      date: award.date,
      description: award.description ?? "",
    });

    setErrors({});
    setExpandedId(award.id);
  };

  const handleSaveEdit = () => {
    if (!editingId || !validate()) return;

    const updatedAwards = awards.map((award) =>
      award.id === editingId
        ? {
            ...award,
            title: form.title.trim(),
            issuer: form.issuer.trim(),
            date: form.date.trim(),
            ...(form.description.trim()
              ? { description: form.description.trim() }
              : { description: undefined }),
          }
        : award,
    );

    onChange(updatedAwards);
    resetForm();
  };

  const handleDelete = (id: string) => {
    onChange(awards.filter((award) => award.id !== id));

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
    setIsAdding(true);
  };

  const isFormOpen = isAdding || editingId !== null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/50">
              <Award className="size-4 text-foreground" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-foreground">Awards & Honors</h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Highlight awards and recognition you have received.
              </p>
            </div>
          </div>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={startAdding}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Plus className="size-3.5" />
            Add award
          </button>
        )}
      </div>

      {/* Add / Edit form */}
      {isFormOpen && (
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h3 className="text-sm font-medium text-foreground">
                {editingId ? "Edit award" : "Add award"}
              </h3>

              <p className="mt-0.5 text-xs text-muted-foreground">Add the award details below.</p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-4 p-4">
            {/* Award title */}
            <div className="space-y-1.5">
              <label htmlFor="award-title" className="text-xs font-medium text-foreground">
                Award title <span className="text-destructive">*</span>
              </label>

              <input
                id="award-title"
                type="text"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="e.g. Employee of the Year"
                className={`h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 ${
                  errors.title
                    ? "border-destructive focus:border-destructive"
                    : "border-input focus:border-ring"
                }`}
              />

              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            {/* Issuer */}
            <div className="space-y-1.5">
              <label htmlFor="award-issuer" className="text-xs font-medium text-foreground">
                Issuer <span className="text-destructive">*</span>
              </label>

              <input
                id="award-issuer"
                type="text"
                value={form.issuer}
                onChange={(event) => updateField("issuer", event.target.value)}
                placeholder="e.g. Google"
                className={`h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 ${
                  errors.issuer
                    ? "border-destructive focus:border-destructive"
                    : "border-input focus:border-ring"
                }`}
              />

              {errors.issuer && <p className="text-xs text-destructive">{errors.issuer}</p>}
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label htmlFor="award-date" className="text-xs font-medium text-foreground">
                Date <span className="text-destructive">*</span>
              </label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="award-date"
                  type="text"
                  value={form.date}
                  onChange={(event) => updateField("date", event.target.value)}
                  placeholder="e.g. 2024"
                  className={`h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 ${
                    errors.date
                      ? "border-destructive focus:border-destructive"
                      : "border-input focus:border-ring"
                  }`}
                />
              </div>

              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="award-description" className="text-xs font-medium text-foreground">
                Description <span className="font-normal text-muted-foreground">(optional)</span>
              </label>

              <textarea
                id="award-description"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Briefly describe why you received this award..."
                rows={4}
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="h-9 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={editingId ? handleSaveEdit : handleAdd}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
              >
                <Check className="size-3.5" />

                {editingId ? "Save changes" : "Add award"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {awards.length === 0 && !isFormOpen && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-border bg-background">
            <Award className="size-5 text-muted-foreground" />
          </div>

          <h3 className="mt-3 text-sm font-medium text-foreground">No awards added yet</h3>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
            Add awards, honors, or professional recognition to strengthen your resume.
          </p>

          <button
            type="button"
            onClick={startAdding}
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Plus className="size-3.5" />
            Add your first award
          </button>
        </div>
      )}

      {/* Awards list */}
      {awards.length > 0 && (
        <div className="space-y-2.5">
          {awards.map((award) => {
            const isExpanded = expandedId === award.id;

            return (
              <div
                key={award.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                {/* Award row */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                    <Award className="size-4 text-muted-foreground" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : award.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-medium text-foreground">
                        {award.title}
                      </h3>

                      <ChevronDown
                        className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                      <span>{award.issuer}</span>
                      <span aria-hidden="true">•</span>
                      <span>{award.date}</span>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(award)}
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`Edit ${award.title}`}
                    >
                      <Pencil className="size-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(award.id)}
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Delete ${award.title}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-border bg-muted/20 px-4 py-3.5">
                    {award.description ? (
                      <p className="text-xs leading-5 text-muted-foreground">{award.description}</p>
                    ) : (
                      <p className="text-xs italic text-muted-foreground">No description added.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add another */}
      {awards.length > 0 && !isFormOpen && (
        <button
          type="button"
          onClick={startAdding}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/30 hover:text-foreground"
        >
          <Plus className="size-3.5" />
          Add another award
        </button>
      )}
    </div>
  );
}

export default ResumeAwardEditor;
