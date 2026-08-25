"use client";

import { Award, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import type { ResumeData } from "@/data/resume";

interface CertificationsSectionEditorProps {
  resume: ResumeData;
  onChange: (resume: ResumeData) => void;
}

type Certification = ResumeData["certifications"][number];

type CertificationErrors = Partial<Record<keyof Certification, string>>;

const createEmptyCertification = (): Certification => ({
  id: crypto.randomUUID(),
  name: "",
  issuer: "",
  issueDate: "",
});

function validateCertification(certification: Certification): CertificationErrors {
  const errors: CertificationErrors = {};

  if (!certification.name.trim()) {
    errors.name = "Certification name is required.";
  }

  if (!certification.issuer.trim()) {
    errors.issuer = "Issuing organization is required.";
  }

  return errors;
}

function validateAllCertifications(
  certifications: Certification[],
): Record<string, CertificationErrors> {
  const nextErrors: Record<string, CertificationErrors> = {};

  certifications.forEach((certification) => {
    const certificationErrors = validateCertification(certification);

    if (Object.keys(certificationErrors).length > 0) {
      nextErrors[certification.id] = certificationErrors;
    }
  });

  return nextErrors;
}

export function CertificationsSectionEditor({
  resume,
  onChange,
}: CertificationsSectionEditorProps) {
  const [errors, setErrors] = useState<Record<string, CertificationErrors>>({});

  /*
   * Always show one certification form.
   *
   * If the resume has no certifications yet, we create a temporary
   * empty form for the editor. This is intentionally not written
   * into the parent resume until the user changes a field or adds
   * another certification.
   */
  const certifications =
    resume.certifications && resume.certifications.length > 0
      ? resume.certifications
      : [createEmptyCertification()];

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    const nextCertifications = certifications.map((certification) =>
      certification.id === id
        ? {
            ...certification,
            [field]: value,
          }
        : certification,
    );

    onChange({
      ...resume,
      certifications: nextCertifications,
    });

    /*
     * Clear the field error immediately when the user starts
     * correcting the field.
     */
    if (errors[id]?.[field]) {
      setErrors((current) => {
        const next = { ...current };
        const certificationErrors = {
          ...next[id],
        };

        delete certificationErrors[field];

        if (Object.keys(certificationErrors).length === 0) {
          delete next[id];
        } else {
          next[id] = certificationErrors;
        }

        return next;
      });
    }
  };

  const addCertification = () => {
    const certification = createEmptyCertification();

    /*
     * If this is currently only the temporary empty form,
     * replace it with a real certification instead of keeping
     * two empty entries.
     */
    const isTemporaryEmptyForm =
      resume.certifications?.length !== undefined && resume.certifications.length === 0;

    if (isTemporaryEmptyForm) {
      onChange({
        ...resume,
        certifications: [certification],
      });
      return;
    }

    onChange({
      ...resume,
      certifications: [...(resume.certifications ?? []), certification],
    });
  };

  const removeCertification = (id: string) => {
    /*
     * Never leave the editor with zero visible forms.
     * If this is the only real certification, remove it from
     * the resume and the editor will immediately show a fresh
     * empty form.
     */
    const nextCertifications = (resume.certifications ?? []).filter(
      (certification) => certification.id !== id,
    );

    onChange({
      ...resume,
      certifications: nextCertifications,
    });

    setErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const validateAll = () => {
    /*
     * Validate only real saved certifications.
     *
     * The temporary empty form should not immediately show
     * validation errors when the section is first opened.
     */
    const realCertifications = resume.certifications ?? [];

    if (realCertifications.length === 0) {
      setErrors({});
      return true;
    }

    const nextErrors = validateAllCertifications(realCertifications);

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleBlur = (certification: Certification, field: keyof Certification) => {
    /*
     * Don't show validation errors on the untouched initial form.
     */
    if (!resume.certifications?.length) {
      return;
    }

    const certificationErrors = validateCertification(certification);

    if (!certificationErrors[field]) {
      setErrors((current) => {
        const next = { ...current };

        if (next[certification.id]) {
          const updated = {
            ...next[certification.id],
          };

          delete updated[field];

          if (Object.keys(updated).length === 0) {
            delete next[certification.id];
          } else {
            next[certification.id] = updated;
          }
        }

        return next;
      });

      return;
    }

    setErrors((current) => ({
      ...current,
      [certification.id]: {
        ...current[certification.id],
        [field]: certificationErrors[field],
      },
    }));
  };

  return (
    <section className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
            <Award className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Certifications
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Add professional certifications, courses, or credentials that strengthen your resume.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addCertification}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Add certification
        </button>
      </div>

      {/* =========================================================
          CERTIFICATION FORMS
      ========================================================= */}
      <div className="space-y-5">
        {certifications.map((certification, index) => {
          const certificationErrors = errors[certification.id] ?? {};

          const isTemporaryEmptyForm = !resume.certifications?.length && index === 0;

          return (
            <div key={certification.id} className="rounded-xl border border-border bg-background">
              {/* =================================================
                  CARD HEADER
              ================================================= */}
              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {certification.name.trim() || `Certification ${index + 1}`}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {certification.issuer.trim() || "Add your certification details"}
                    </p>
                  </div>
                </div>

                {!isTemporaryEmptyForm && (
                  <button
                    type="button"
                    onClick={() => removeCertification(certification.id)}
                    aria-label={`Delete certification ${index + 1}`}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              {/* =================================================
                  FORM CONTENT
              ================================================= */}
              <div className="space-y-6 p-5">
                {/* =================================================
                    CERTIFICATION NAME
                ================================================= */}
                <div className="space-y-2">
                  <label
                    htmlFor={`certification-name-${certification.id}`}
                    className="text-sm font-medium text-foreground"
                  >
                    Certification name
                    <span className="ml-1 text-destructive">*</span>
                  </label>

                  <input
                    id={`certification-name-${certification.id}`}
                    type="text"
                    value={certification.name}
                    onChange={(event) =>
                      updateCertification(certification.id, "name", event.target.value)
                    }
                    onBlur={() => handleBlur(certification, "name")}
                    placeholder="e.g. AWS Certified Developer"
                    maxLength={120}
                    aria-invalid={Boolean(certificationErrors.name)}
                    className={`h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 ${
                      certificationErrors.name
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-ring"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs leading-5 text-muted-foreground">
                      Enter the official name of the certification or credential.
                    </p>

                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {certification.name.length}/120
                    </span>
                  </div>

                  {certificationErrors.name && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {certificationErrors.name}
                    </p>
                  )}
                </div>

                {/* =================================================
                    ISSUING ORGANIZATION
                ================================================= */}
                <div className="space-y-2">
                  <label
                    htmlFor={`certification-issuer-${certification.id}`}
                    className="text-sm font-medium text-foreground"
                  >
                    Issuing organization
                    <span className="ml-1 text-destructive">*</span>
                  </label>

                  <input
                    id={`certification-issuer-${certification.id}`}
                    type="text"
                    value={certification.issuer}
                    onChange={(event) =>
                      updateCertification(certification.id, "issuer", event.target.value)
                    }
                    onBlur={() => handleBlur(certification, "issuer")}
                    placeholder="e.g. Amazon Web Services"
                    maxLength={120}
                    aria-invalid={Boolean(certificationErrors.issuer)}
                    className={`h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 ${
                      certificationErrors.issuer
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-ring"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs leading-5 text-muted-foreground">
                      Enter the company, institution, or organization that issued it.
                    </p>

                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {certification.issuer.length}/120
                    </span>
                  </div>

                  {certificationErrors.issuer && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                      {certificationErrors.issuer}
                    </p>
                  )}
                </div>

                {/* =================================================
                    ISSUE DATE
                ================================================= */}
                <div className="space-y-2">
                  <label
                    htmlFor={`certification-issue-date-${certification.id}`}
                    className="text-sm font-medium text-foreground"
                  >
                    Issue date
                  </label>

                  <input
                    id={`certification-issue-date-${certification.id}`}
                    type="month"
                    value={certification.issueDate}
                    onChange={(event) =>
                      updateCertification(certification.id, "issueDate", event.target.value)
                    }
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                  />

                  <p className="text-xs leading-5 text-muted-foreground">
                    Select the month and year when you received the certification.
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================
          ADD ANOTHER
      ========================================================= */}
      <button
        type="button"
        onClick={addCertification}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/40 hover:text-foreground"
      >
        <Plus className="size-4" />
        Add another certification
      </button>

      {/* =========================================================
          GUIDANCE
      ========================================================= */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
            <Award className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              Make your certifications stand out
            </p>

            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-muted-foreground">
              <li>• Use the official certification name.</li>
              <li>• Include the organization that issued it.</li>
              <li>• Add the issue date when available.</li>
              <li>• Prioritize certifications relevant to the position you want.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* =========================================================
          HIDDEN VALIDATION TRIGGER
      ========================================================= */}
      <button
        type="button"
        className="hidden"
        onClick={validateAll}
        aria-hidden="true"
        tabIndex={-1}
      />
    </section>
  );
}

export default CertificationsSectionEditor;
