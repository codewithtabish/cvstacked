"use client";

import {
  Check,
  ChevronDown,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ResumeData, ResumeReference } from "@/types/resume";

interface ReferencesEditorProps {
  resume: ResumeData;
  emptyResume: ResumeData;
  isEmpty: boolean;
  id: string;
  onChange: (resume: ResumeData) => void;
  onNext?: () => void;
  onBack?: () => void;
}

type ReferenceFormData = {
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
};

const EMPTY_REFERENCE: ReferenceFormData = {
  name: "",
  position: "",
  company: "",
  email: "",
  phone: "",
  relationship: "",
};

const createReferenceId = () => `reference-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function ReferencesEditor({
  resume,
  emptyResume: _emptyResume,
  isEmpty: _isEmpty,
  id,
  onChange,
  onNext,
  onBack,
}: ReferencesEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReferenceFormData>({
    ...EMPTY_REFERENCE,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReferenceFormData, string>>>({});

  const references = resume.references ?? [];

  const updateReferences = (nextReferences: ResumeReference[]) => {
    onChange({
      ...resume,
      references: nextReferences,
    });
  };

  const startAdd = () => {
    setEditingId("new");
    setForm({
      ...EMPTY_REFERENCE,
    });
    setErrors({});
  };

  const startEdit = (reference: ResumeReference) => {
    setEditingId(reference.id);

    setForm({
      name: reference.name ?? "",
      position: reference.position ?? "",
      company: reference.company ?? "",
      email: reference.email ?? "",
      phone: reference.phone ?? "",
      relationship: reference.relationship ?? "",
    });

    setErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);

    setForm({
      ...EMPTY_REFERENCE,
    });

    setErrors({});
  };

  const updateField = (field: keyof ReferenceFormData, value: string) => {
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
    const nextErrors: Partial<Record<keyof ReferenceFormData, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!form.position.trim()) {
      nextErrors.position = "Position is required.";
    }

    if (!form.company.trim()) {
      nextErrors.company = "Company or organization is required.";
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const saveReference = () => {
    if (!validate()) {
      return;
    }

    const referenceData: Omit<ResumeReference, "id"> = {
      name: form.name.trim(),
      position: form.position.trim(),
      company: form.company.trim(),
      ...(form.email.trim() ? { email: form.email.trim() } : {}),
      ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
      ...(form.relationship.trim() ? { relationship: form.relationship.trim() } : {}),
    };

    if (editingId === "new") {
      updateReferences([
        ...references,
        {
          id: createReferenceId(),
          ...referenceData,
        },
      ]);
    } else if (editingId) {
      updateReferences(
        references.map((reference) =>
          reference.id === editingId
            ? {
                ...reference,
                ...referenceData,
              }
            : reference,
        ),
      );
    }

    cancelEdit();
  };

  const deleteReference = (referenceId: string) => {
    const reference = references.find((item) => item.id === referenceId);

    if (!reference) {
      return;
    }

    const confirmed = window.confirm(`Remove ${reference.name} from your references?`);

    if (!confirmed) {
      return;
    }

    updateReferences(references.filter((item) => item.id !== referenceId));

    if (editingId === referenceId) {
      cancelEdit();
    }
  };

  return (
    <div id={id} className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-muted-foreground" />

            <h2 className="text-xl font-semibold tracking-tight">References</h2>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Add professional references who can speak about your experience, skills, and work.
          </p>
        </div>

        {!editingId && (
          <Button type="button" onClick={startAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 size-4" />
            Add Reference
          </Button>
        )}
      </div>

      {/* Empty state */}
      {references.length === 0 && !editingId && (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <UserRound className="size-6 text-muted-foreground" />
            </div>

            <h3 className="text-sm font-semibold">No references added</h3>

            <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
              References are optional. Add a former manager, supervisor, colleague, professor, or
              another professional who can recommend you.
            </p>

            <Button type="button" variant="outline" className="mt-5" onClick={startAdd}>
              <Plus className="mr-2 size-4" />
              Add Your First Reference
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reference list */}
      {!editingId && references.length > 0 && (
        <div className="space-y-3">
          {references.map((reference) => (
            <Card key={reference.id} className="shadow-none">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <UserRound className="size-5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">{reference.name}</h3>

                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {reference.position}

                        {reference.company ? ` · ${reference.company}` : ""}
                      </p>

                      {reference.relationship && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {reference.relationship}
                        </p>
                      )}

                      {(reference.email || reference.phone) && (
                        <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                          {reference.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="size-3.5 shrink-0" />

                              <span className="break-all">{reference.email}</span>
                            </div>
                          )}

                          {reference.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="size-3.5 shrink-0" />

                              <span>{reference.phone}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 self-end sm:self-start">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(reference)}
                      aria-label={`Edit ${reference.name}`}
                    >
                      <Pencil className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteReference(reference.id)}
                      aria-label={`Delete ${reference.name}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit form */}
      {editingId && (
        <Card className="shadow-none">
          <CardHeader className="border-b">
            <CardTitle className="text-base">
              {editingId === "new" ? "Add Reference" : "Edit Reference"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 pt-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor={`${id}-name`}>
                Full Name
                <span className="ml-1 text-destructive">*</span>
              </Label>

              <Input
                id={`${id}-name`}
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="e.g. Sarah Johnson"
                aria-invalid={Boolean(errors.name)}
              />

              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Position + Company */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${id}-position`}>
                  Position
                  <span className="ml-1 text-destructive">*</span>
                </Label>

                <Input
                  id={`${id}-position`}
                  value={form.position}
                  onChange={(event) => updateField("position", event.target.value)}
                  placeholder="e.g. Engineering Manager"
                  aria-invalid={Boolean(errors.position)}
                />

                {errors.position && <p className="text-xs text-destructive">{errors.position}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-company`}>
                  Company / Organization
                  <span className="ml-1 text-destructive">*</span>
                </Label>

                <Input
                  id={`${id}-company`}
                  value={form.company}
                  onChange={(event) => updateField("company", event.target.value)}
                  placeholder="e.g. Acme Technologies"
                  aria-invalid={Boolean(errors.company)}
                />

                {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
              </div>
            </div>

            {/* Relationship */}
            <div className="space-y-2">
              <Label htmlFor={`${id}-relationship`}>
                Relationship
                <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>
              </Label>

              <Input
                id={`${id}-relationship`}
                value={form.relationship}
                onChange={(event) => updateField("relationship", event.target.value)}
                placeholder="e.g. Former Manager"
              />
            </div>

            {/* Email + Phone */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${id}-email`}>
                  Email
                  <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>
                </Label>

                <Input
                  id={`${id}-email`}
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="e.g. sarah@example.com"
                  aria-invalid={Boolean(errors.email)}
                />

                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-phone`}>
                  Phone
                  <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>
                </Label>

                <Input
                  id={`${id}-phone`}
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="e.g. +1 555 123 4567"
                />
              </div>
            </div>

            {/* Tip */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs leading-5 text-muted-foreground">
                <strong className="font-medium text-foreground">Tip:</strong> Ask for permission
                before listing someone as a reference.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={cancelEdit}>
                <X className="mr-2 size-4" />
                Cancel
              </Button>

              <Button type="button" onClick={saveReference}>
                <Check className="mr-2 size-4" />

                {editingId === "new" ? "Add Reference" : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {!editingId && (onBack || onNext) && (
        <div className="flex items-center justify-between border-t pt-6">
          <div>
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
          </div>

          <div>
            {onNext && (
              <Button type="button" onClick={onNext}>
                Continue
                <ChevronDown className="ml-2 size-4 -rotate-90" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferencesEditor;
