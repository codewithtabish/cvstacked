"use client";

import { Languages, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import type { ResumeData } from "@/data/resume";

interface LanguagesSectionEditorProps {
  resume: ResumeData;
  onChange: (resume: ResumeData) => void;
}

type Language = ResumeData["languages"][number];
type LanguageProficiency = Language["proficiency"];

const PROFICIENCY_OPTIONS: {
  value: LanguageProficiency;
  label: string;
}[] = [
  {
    value: "elementary",
    label: "Elementary",
  },
  {
    value: "conversational",
    label: "Conversational",
  },
  {
    value: "professional",
    label: "Professional",
  },
  {
    value: "fluent",
    label: "Fluent",
  },
  {
    value: "native",
    label: "Native",
  },
];

const createEmptyLanguage = (): Language => ({
  id: crypto.randomUUID(),
  name: "",
  proficiency: "elementary",
});

function validateLanguage(language: Language) {
  const errors: Partial<Record<keyof Language, string>> = {};

  if (!language.name.trim()) {
    errors.name = "Language name is required.";
  }

  if (!language.proficiency) {
    errors.proficiency = "Proficiency level is required.";
  }

  return errors;
}

export function LanguagesSectionEditor({ resume, onChange }: LanguagesSectionEditorProps) {
  const [errors, setErrors] = useState<Record<string, Partial<Record<keyof Language, string>>>>({});

  const languages = resume.languages ?? [];

  const updateLanguage = <K extends keyof Language>(id: string, field: K, value: Language[K]) => {
    const nextLanguages = languages.map((language) =>
      language.id === id
        ? {
            ...language,
            [field]: value,
          }
        : language,
    );

    onChange({
      ...resume,
      languages: nextLanguages,
    });

    if (errors[id]?.[field]) {
      setErrors((current) => {
        const next = { ...current };
        const languageErrors = { ...next[id] };

        delete languageErrors[field];

        if (Object.keys(languageErrors).length === 0) {
          delete next[id];
        } else {
          next[id] = languageErrors;
        }

        return next;
      });
    }
  };

  const addLanguage = () => {
    const language = createEmptyLanguage();

    onChange({
      ...resume,
      languages: [...languages, language],
    });
  };

  const removeLanguage = (id: string) => {
    onChange({
      ...resume,
      languages: languages.filter((language) => language.id !== id),
    });

    setErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const validateAll = () => {
    const nextErrors: Record<string, Partial<Record<keyof Language, string>>> = {};

    languages.forEach((language) => {
      const languageErrors = validateLanguage(language);

      if (Object.keys(languageErrors).length > 0) {
        nextErrors[language.id] = languageErrors;
      }
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
            <Languages className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">Languages</h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Add the languages you speak and your proficiency level.
            </p>
          </div>
        </div>

        {languages.length > 0 && (
          <button
            type="button"
            onClick={addLanguage}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Plus className="size-3.5" />
            Add language
          </button>
        )}
      </div>

      {/* Empty state */}
      {languages.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-border bg-background">
            <Languages className="size-5 text-muted-foreground" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-foreground">No languages added</h3>

          <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-muted-foreground">
            Add languages that demonstrate your communication skills and professional proficiency.
          </p>

          <button
            type="button"
            onClick={addLanguage}
            className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            <Plus className="size-3.5" />
            Add language
          </button>
        </div>
      )}

      {/* Language cards */}
      {languages.length > 0 && (
        <div className="space-y-4">
          {languages.map((language, index) => {
            const languageErrors = errors[language.id] ?? {};

            const proficiencyLabel =
              PROFICIENCY_OPTIONS.find((option) => option.value === language.proficiency)?.label ??
              language.proficiency;

            return (
              <div key={language.id} className="rounded-xl border border-border bg-background">
                {/* Card header */}
                <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {language.name.trim() || "New language"}
                      </p>

                      {language.proficiency && (
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                          {proficiencyLabel}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLanguage(language.id)}
                    aria-label={`Delete ${language.name.trim() || "language"}`}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {/* Fields */}
                <div className="space-y-4 p-4">
                  {/* Language name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`language-name-${language.id}`}
                      className="text-xs font-medium text-foreground"
                    >
                      Language
                      <span className="ml-1 text-destructive">*</span>
                    </label>

                    <input
                      id={`language-name-${language.id}`}
                      type="text"
                      value={language.name}
                      onChange={(event) => updateLanguage(language.id, "name", event.target.value)}
                      onBlur={validateAll}
                      placeholder="e.g. English"
                      autoComplete="off"
                      className={`h-9 w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 ${
                        languageErrors.name
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-ring"
                      }`}
                    />

                    {languageErrors.name && (
                      <p className="text-[11px] text-destructive">{languageErrors.name}</p>
                    )}
                  </div>

                  {/* Proficiency */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`language-proficiency-${language.id}`}
                      className="text-xs font-medium text-foreground"
                    >
                      Proficiency
                      <span className="ml-1 text-destructive">*</span>
                    </label>

                    <select
                      id={`language-proficiency-${language.id}`}
                      value={language.proficiency}
                      onChange={(event) =>
                        updateLanguage(
                          language.id,
                          "proficiency",
                          event.target.value as LanguageProficiency,
                        )
                      }
                      onBlur={validateAll}
                      className={`h-9 w-full rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring/20 ${
                        languageErrors.proficiency
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-ring"
                      }`}
                    >
                      {PROFICIENCY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {languageErrors.proficiency && (
                      <p className="text-[11px] text-destructive">{languageErrors.proficiency}</p>
                    )}

                    <p className="text-[11px] text-muted-foreground">
                      Choose the level that best describes your ability.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add another */}
          <button
            type="button"
            onClick={addLanguage}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-4 py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/40 hover:text-foreground"
          >
            <Plus className="size-3.5" />
            Add another language
          </button>
        </div>
      )}
    </section>
  );
}

export default LanguagesSectionEditor;
