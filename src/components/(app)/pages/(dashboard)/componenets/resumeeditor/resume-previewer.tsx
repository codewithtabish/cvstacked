"use client";

import { Maximize2, Minus, Palette, Plus, RotateCcw } from "lucide-react";

import { useMemo, useState } from "react";

import DownloadPdfButton from "@/components/(app)/general/buttons/download-pdf-button";
import { ResumeAppearanceDialog } from "@/components/(app)/general/buttons/reumse-apprance-diloag";
import { RESUME_TEMPLATES } from "@/components/(app)/general/templates/all-templates";

import { Button } from "@/components/ui/button";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { ResumeData } from "@/types/resume";

const PREVIEW_ELEMENT_ID = "resume-preview";

interface ResumePreviewProps {
  resume: ResumeData;
  id: string;
  onChange?: (resume: ResumeData) => void;
}

export function ResumePreview({ resume, id, onChange }: ResumePreviewProps) {
  /*
   * Local fallback state.
   *
   * When the parent provides onChange, the parent's resume
   * is used directly instead of duplicating it in local state.
   *
   * When onChange is not provided, this local state allows
   * the Customize dialog to still work normally.
   */
  const [localResume, setLocalResume] = useState<ResumeData>(resume);

  const [zoom, setZoom] = useState(0.85);

  /*
   * Use the parent's resume when onChange exists.
   * Otherwise use the local fallback resume.
   *
   * This avoids useEffect + setState synchronization.
   */
  const currentResume = onChange ? resume : localResume;

  /*
   * Handle appearance changes.
   *
   * If the parent owns the resume state, notify the parent.
   *
   * Otherwise update our local state.
   */
  const handleResumeChange = (updatedResume: ResumeData) => {
    if (onChange) {
      onChange(updatedResume);
      return;
    }

    setLocalResume(updatedResume);
  };

  /*
   * Find the selected template.
   */
  const TemplateComponent = useMemo(() => {
    const found = RESUME_TEMPLATES.find((template) => template.id === id);

    return found?.component ?? RESUME_TEMPLATES[0]?.component;
  }, [id]);

  /*
   * Zoom in.
   */
  const zoomIn = () => {
    setZoom((currentZoom) => Math.min(1.4, +(currentZoom + 0.1).toFixed(2)));
  };

  /*
   * Zoom out.
   */
  const zoomOut = () => {
    setZoom((currentZoom) => Math.max(0.5, +(currentZoom - 0.1).toFixed(2)));
  };

  /*
   * Fit preview to screen.
   */
  const fitToScreen = () => {
    setZoom(0.85);
  };

  /*
   * Generate a clean PDF filename.
   */
  const fileName =
    [currentResume.personal?.firstName?.trim(), currentResume.personal?.lastName?.trim(), "resume"]
      .filter(Boolean)
      .join("-")
      .replace(/\s+/g, "-")
      .toLowerCase() || "resume";

  /*
   * Template not found.
   */
  if (!TemplateComponent) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Template not found
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-muted/40">
      {/* ============================================================
          TOOLBAR
      ============================================================ */}

      <div
        className="
          sticky top-0 z-20
          flex shrink-0 items-center justify-between gap-2
          border-b border-border
          bg-background/95
          px-3 py-2
          backdrop-blur
          supports-backdrop-filter:bg-background/80
          sm:px-4
        "
      >
        {/* ========================================================
            LEFT SIDE
        ======================================================== */}

        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {/* ======================================================
              CUSTOMIZE
          ====================================================== */}

          <ResumeAppearanceDialog resume={currentResume} onChange={handleResumeChange}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-2.5 sm:px-3"
            >
              <Palette className="h-3.5 w-3.5 shrink-0" />

              <span className="hidden sm:inline">Customize</span>
            </Button>
          </ResumeAppearanceDialog>

          {/* ======================================================
              DOWNLOAD PDF
          ====================================================== */}

          <DownloadPdfButton elementId={PREVIEW_ELEMENT_ID} fileName={fileName} />
        </div>

        {/* ========================================================
            RIGHT SIDE - ZOOM CONTROLS
        ======================================================== */}

        <TooltipProvider delayDuration={250}>
          <div
            className="
              flex items-center gap-0.5
              rounded-lg
              border border-border
              bg-muted/40
              p-0.5
            "
          >
            {/* ====================================================
                ZOOM OUT
            ==================================================== */}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={zoomOut}
                  disabled={zoom <= 0.5}
                  aria-label="Zoom out"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="bottom">Zoom out</TooltipContent>
            </Tooltip>

            {/* ====================================================
                ZOOM PERCENTAGE
            ==================================================== */}

            <button
              type="button"
              onClick={fitToScreen}
              className="
                min-w-[3.25rem]
                rounded-md
                px-1.5 py-1
                text-center
                text-xs
                font-medium
                tabular-nums
                text-muted-foreground
                transition-colors
                hover:bg-background
                hover:text-foreground
              "
              title="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </button>

            {/* ====================================================
                ZOOM IN
            ==================================================== */}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={zoomIn}
                  disabled={zoom >= 1.4}
                  aria-label="Zoom in"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="bottom">Zoom in</TooltipContent>
            </Tooltip>

            {/* ====================================================
                DIVIDER
            ==================================================== */}

            <div className="mx-0.5 hidden h-4 w-px bg-border sm:block" />

            {/* ====================================================
                FIT TO SCREEN
            ==================================================== */}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hidden h-7 w-7 sm:inline-flex"
                  onClick={fitToScreen}
                  aria-label="Fit to screen"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="bottom">Fit to screen</TooltipContent>
            </Tooltip>

            {/* ====================================================
                ACTUAL SIZE
            ==================================================== */}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hidden h-7 w-7 md:inline-flex"
                  onClick={() => setZoom(1)}
                  aria-label="Actual size"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="bottom">100%</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* ============================================================
          PAPER AREA
      ============================================================ */}

      <div className="min-h-0 flex-1 overflow-auto">
        <div
          className="
            flex
            min-h-full
            justify-center
            px-3
            py-6
            sm:px-6
            sm:py-10
          "
        >
          <div
            className="
              origin-top
              shadow-xl
              transition-transform
              duration-200
              ease-out
            "
            style={{
              transform: `scale(${zoom})`,
              width: "210mm",
              minHeight: "297mm",
            }}
          >
            <div className="bg-re">
              <TemplateComponent resume={currentResume} id={PREVIEW_ELEMENT_ID} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
