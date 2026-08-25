"use client";

import { FileText, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { z } from "zod";

import type { ResumeData } from "@/types/resume";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/* ============================================================
   VALIDATION
============================================================ */

export const summarySchema = z
  .string()
  .trim()
  .min(50, "Professional summary must be at least 50 characters.")
  .max(1000, "Professional summary must be 1000 characters or less.");

export type SummaryValidationErrors = {
  summary?: string;
};

export function validateSummary(summary: string): SummaryValidationErrors {
  const result = summarySchema.safeParse(summary);

  if (result.success) {
    return {};
  }

  return {
    summary: result.error.issues[0]?.message ?? "Please enter a valid professional summary.",
  };
}

export function isSummaryValid(summary: string): boolean {
  return Object.keys(validateSummary(summary)).length === 0;
}

/* ============================================================
   PROPS
============================================================ */

interface SummarySectionEditorProps {
  resume: ResumeData;
  onChange: (next: ResumeData) => void;
  errors?: SummaryValidationErrors;
  onValidate?: (errors: SummaryValidationErrors) => void;
}

/* ============================================================
   COMPONENT
============================================================ */

export function SummarySectionEditor({
  resume,
  onChange,
  errors = {},
  onValidate,
}: SummarySectionEditorProps) {
  const summary = resume.summary ?? "";

  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  const characterCount = summary.length;
  const hasSummary = summary.trim().length > 0;

  /* ==========================================================
     LIVE VALIDATION
  ========================================================== */

  useEffect(() => {
    if (!hasAttemptedValidation) {
      return;
    }

    onValidate?.(validateSummary(summary));
  }, [summary, hasAttemptedValidation, onValidate]);

  /* ==========================================================
     UPDATE SUMMARY
  ========================================================== */

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    onChange({
      ...resume,
      summary: value,
    });

    if (hasAttemptedValidation) {
      onValidate?.(validateSummary(value));
    }
  };

  /* ==========================================================
     CLEAR SUMMARY
  ========================================================== */

  const handleClear = () => {
    onChange({
      ...resume,
      summary: "",
    });

    setHasAttemptedValidation(false);
    onValidate?.({});
  };

  /* ==========================================================
     BLUR
  ========================================================== */

  const handleBlur = () => {
    if (!hasAttemptedValidation) {
      return;
    }

    onValidate?.(validateSummary(summary));
  };

  /* ==========================================================
     VALIDATE EXTERNALLY

     The parent can also use validateSummary() directly
     before allowing the user to continue.
  ========================================================== */

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>
        <h2 className="text-base font-semibold tracking-tight">Professional Summary</h2>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Introduce your professional background, strongest capabilities, and the value you bring to
          your work.
        </p>
      </div>

      {/* ======================================================
          SUMMARY FIELD
      ====================================================== */}

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="resume-summary">
            Professional summary <span className="text-destructive">*</span>
          </Label>

          <div className="flex items-center gap-2">
            {hasSummary && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                aria-label="Clear professional summary"
                title="Clear summary"
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}

            <span
              className={[
                "text-xs tabular-nums",
                characterCount > 1000 ? "text-destructive" : "text-muted-foreground",
              ].join(" ")}
            >
              {characterCount}/1000
            </span>
          </div>
        </div>

        <Textarea
          id="resume-summary"
          value={summary}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Atative is a software engineer with experience building modern web applications, scalable digital products, and intuitive user experiences..."
          aria-invalid={Boolean(errors.summary)}
          aria-describedby={errors.summary ? "resume-summary-error" : "resume-summary-help"}
          className={[
            "min-h-[220px] resize-y leading-6",
            errors.summary ? "border-destructive focus-visible:ring-destructive" : "",
          ].join(" ")}
        />

        {errors.summary ? (
          <p
            id="resume-summary-error"
            className="text-xs font-medium text-destructive"
            role="alert"
          >
            {errors.summary}
          </p>
        ) : (
          <p id="resume-summary-help" className="text-xs leading-5 text-muted-foreground">
            Write around 3–5 sentences. Focus on your experience, strongest skills, specialization,
            and the value you bring.
          </p>
        )}
      </div>

      {/* ======================================================
          WRITING GUIDANCE
      ====================================================== */}

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium">Make your summary stand out</p>

            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-muted-foreground">
              <li>• Mention your years of relevant experience.</li>

              <li>• Highlight your strongest professional skills.</li>

              <li>• Include the type of work or industry you specialize in.</li>

              <li>• Focus on measurable value instead of generic statements.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ======================================================
          VALIDATION STATE NOTE
      ====================================================== */}

      {!hasSummary && (
        <p className="text-xs text-muted-foreground">
          A professional summary is required before you can continue to the next section.
        </p>
      )}
    </div>
  );
}
