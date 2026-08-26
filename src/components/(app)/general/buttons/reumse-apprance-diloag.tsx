"use client";

import { Check, Palette } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

import { RESUME_THEMES } from "@/data/resume-design";

import { ResumeData } from "@/data/resume";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ============================================================
// TYPES
// ============================================================

interface ResumeAppearanceDialogProps {
  resume: ResumeData;
  onChange: (resume: ResumeData) => void;
  children: ReactNode;
}

// ============================================================
// TYPOGRAPHY SCALES
// ============================================================

const TYPOGRAPHY_SCALES = {
  compact: {
    id: "compact",
    name: "Compact",
    description: "Smaller spacing and tighter typography",
  },

  standard: {
    id: "standard",
    name: "Standard",
    description: "Balanced resume typography",
  },

  comfortable: {
    id: "comfortable",
    name: "Comfortable",
    description: "More breathing room and larger text",
  },
} as const;

// ============================================================
// COMPONENT
// ============================================================

export function ResumeAppearanceDialog({
  resume,
  onChange,
  children,
}: ResumeAppearanceDialogProps) {
  const [open, setOpen] = useState(false);

  const [themeId, setThemeId] = useState(resume.themeId);

  const [fontFamilyId, setFontFamilyId] = useState(resume.fontFamilyId);

  const [typographyScale, setTypographyScale] = useState(resume.typographyScale);

  // ============================================================
  // SELECTED VALUES
  // ============================================================

  const selectedTypography = useMemo(
    () => TYPOGRAPHY_SCALES[typographyScale as keyof typeof TYPOGRAPHY_SCALES],
    [typographyScale],
  );

  // ============================================================
  // DIALOG OPEN / CLOSE
  // ============================================================

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      // Reset temporary settings from the current resume
      // every time the dialog opens.
      setThemeId(resume.themeId);
      setFontFamilyId(resume.fontFamilyId);
      setTypographyScale(resume.typographyScale);
    }

    setOpen(nextOpen);
  };

  // ============================================================
  // APPLY
  // ============================================================

  const handleApply = () => {
    onChange({
      ...resume,
      themeId,
      fontFamilyId,
      typographyScale,
    });

    setOpen(false);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="
          flex
          max-h-[85vh]
          w-[calc(100%-2rem)]
          max-w-lg
          flex-col
          gap-0
          overflow-hidden
          p-0
          sm:w-full
        "
      >
        {/* ========================================================
            HEADER
            ======================================================== */}

        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <Palette className="size-4" />
            </span>
            Customize resume
          </DialogTitle>

          <DialogDescription className="pr-4 text-sm leading-5">
            Personalize the appearance of this resume. Your content and template layout will remain
            unchanged.
          </DialogDescription>
        </DialogHeader>

        {/* ========================================================
            SCROLLABLE SETTINGS
            ======================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 px-6 py-6">
            {/* ====================================================
                THEME
                ==================================================== */}

            <section className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Palette className="size-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-sm font-semibold">Color</p>

                  <p className="text-xs leading-5 text-muted-foreground">
                    Choose the accent color used throughout the resume.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {Object.values(RESUME_THEMES).map((theme) => {
                  const active = theme.id === themeId;

                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setThemeId(theme.id)}
                      aria-label={`Select ${theme.name} theme`}
                      aria-pressed={active}
                      className="group flex flex-col items-center gap-1.5"
                    >
                      <span
                        className={[
                          "relative flex size-9 items-center justify-center rounded-full border-2 transition-all",
                          active
                            ? "border-foreground ring-2 ring-foreground/10"
                            : "border-transparent hover:scale-105",
                        ].join(" ")}
                        style={{
                          backgroundColor: theme.colors.accent,
                        }}
                      >
                        {active && <Check className="size-4 text-white" />}
                      </span>

                      <span className="text-[11px] font-medium">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <Separator />

            <Separator />
          </div>
        </div>

        {/* ========================================================
            FIXED ACTIONS
            ======================================================== */}

        <div className="flex shrink-0 items-center justify-end gap-2 border-t bg-background px-6 py-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button type="button" onClick={handleApply}>
            Apply changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
