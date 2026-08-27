"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Loader2,
  Maximize2,
  Minus,
  Palette,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { createResumeAction } from "@/app/actions/resume/create-resume";
import { createResumePaymentAction } from "@/app/actions/resume/create-resume-payment";
import { ResumeAppearanceDialog } from "@/components/(app)/general/buttons/reumse-apprance-diloag";
import { RESUME_TEMPLATES } from "@/components/(app)/general/templates/all-templates";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ResumeData } from "@/types/resume";
import { toast } from "sonner";

// ============================================================
// CONSTANTS
// ============================================================

const PREVIEW_ELEMENT_ID = "resume-preview";

// ============================================================
// PROPS
// ============================================================

interface ResumePreviewProps {
  /**
   * Complete current resume editor state.
   *
   * currentResume.templateId
   * = visual template ID / Resume.resumeTemplateId
   *
   * currentResume.id
   * = Prisma Resume.id when the resume already exists.
   */
  resume: ResumeData;

  /**
   * Kept for parent compatibility.
   *
   * The actual database ID comes from currentResume.id.
   */
  id: string;

  /**
   * Optional parent-controlled resume state.
   */
  onChange?: (resume: ResumeData) => void;

  /**
   * Selected template display name.
   *
   * This is saved as Resume.name.
   */
  templateName: string;

  /**
   * Selected template description.
   *
   * This is saved as Resume.description.
   */
  templateDescription: string;

  /**
   * Selected template category.
   *
   * Not used for Resume persistence.
   */
  templateCategory: string;

  /**
   * Selected template pricing plan.
   *
   * Not used for Resume persistence.
   */
  templatePlan: string;
}

// ============================================================
// COMPONENT
// ============================================================

export function ResumePreview({
  resume,
  id,
  onChange,
  templateCategory,
  templateName,
  templateDescription,
  templatePlan,
}: ResumePreviewProps) {
  // ==========================================================
  // COMPATIBILITY PROPS
  // ==========================================================

  void id;
  void templateCategory;
  void templatePlan;

  // ==========================================================
  // LOCAL RESUME
  // ==========================================================

  const [localResume, setLocalResume] = useState<ResumeData>(resume);

  // ==========================================================
  // ZOOM
  // ==========================================================

  const [zoom, setZoom] = useState(0.85);

  // ==========================================================
  // PAYMENT / SAVE STATE
  // ==========================================================

  const [isSavingResume, setIsSavingResume] = useState(false);

  // ==========================================================
  // PREVIEW SCROLL REF
  // ==========================================================

  const previewScrollRef = useRef<HTMLDivElement | null>(null);

  // ==========================================================
  // CURRENT RESUME
  // ==========================================================

  const currentResume = onChange ? resume : localResume;

  // ==========================================================
  // RESUME CHANGE
  // ==========================================================

  const handleResumeChange = (updatedResume: ResumeData) => {
    if (onChange) {
      onChange(updatedResume);
      return;
    }

    setLocalResume(updatedResume);
  };

  // ==========================================================
  // TEMPLATE ID
  // ==========================================================

  const templateId = currentResume.templateId?.trim() || null;

  // ==========================================================
  // TEMPLATE COMPONENT
  // ==========================================================

  const TemplateComponent = useMemo(() => {
    if (!templateId) {
      return RESUME_TEMPLATES[0]?.component;
    }

    const template = RESUME_TEMPLATES.find((item) => item.id === templateId);

    return template?.component ?? RESUME_TEMPLATES[0]?.component;
  }, [templateId]);

  // ==========================================================
  // ZOOM IN
  // ==========================================================

  const zoomIn = () => {
    setZoom((currentZoom) => Math.min(1.4, +(currentZoom + 0.1).toFixed(2)));
  };

  // ==========================================================
  // ZOOM OUT
  // ==========================================================

  const zoomOut = () => {
    setZoom((currentZoom) => Math.max(0.5, +(currentZoom - 0.1).toFixed(2)));
  };

  // ==========================================================
  // FIT TO SCREEN
  // ==========================================================

  const fitToScreen = () => {
    setZoom(0.85);
  };

  // ==========================================================
  // SCROLL UP
  // ==========================================================

  const scrollUp = () => {
    const container = previewScrollRef.current;

    if (!container) {
      return;
    }

    container.scrollBy({
      top: -500,
      left: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // SCROLL DOWN
  // ==========================================================

  const scrollDown = () => {
    const container = previewScrollRef.current;

    if (!container) {
      return;
    }

    container.scrollBy({
      top: 500,
      left: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // SAVE RESUME + CREATE PAYMENT
  // ==========================================================
  //
  // IMPORTANT:
  //
  // The payment action receives:
  //
  // createResumePaymentAction({
  //   templateId: selectedTemplateId,
  // })
  //
  // NOT:
  //
  // createResumePaymentAction({
  //   resumeId,
  // })
  //
  // The selected TEMPLATE ID uniquely determines the payment.
  //
  // Flow:
  //
  // 1. Save/create resume.
  // 2. Confirm resume save succeeded.
  // 3. Update local resume with database ID.
  // 4. Create Safepay payment using TEMPLATE ID.
  // 5. Redirect to checkout.
  //
  // ==========================================================

  // ==========================================================
  // TEMPLATE NOT FOUND
  // ==========================================================

  if (!TemplateComponent) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Template not found
      </div>
    );
  }

  const handleMakePayment = async () => {
    if (isSavingResume) {
      return;
    }

    const resumeId = currentResume.id?.trim() || undefined;
    const selectedTemplateId = currentResume.templateId?.trim() || "";
    const resumeName = templateName.trim();
    const resumeDescription = templateDescription.trim() || null;

    if (!selectedTemplateId) {
      toast.error("Resume template is missing.", {
        description: "Please select a resume template before continuing.",
      });
      return;
    }

    if (!resumeName) {
      toast.error("Resume name is missing.", {
        description: "The selected template does not have a valid name.",
      });
      return;
    }

    try {
      setIsSavingResume(true);

      // ======================================================
      // STEP 1 — SAVE / CREATE RESUME
      // ======================================================

      console.log("[Create Resume] Saving resume:", {
        id: resumeId,
        name: resumeName,
        description: resumeDescription,
        resumeTemplateId: selectedTemplateId,
        hasContent: Boolean(currentResume),
      });

      const result = await createResumeAction({
        name: resumeName,
        description: resumeDescription,
        resumeTemplateId: selectedTemplateId,
        content: currentResume,
      });

      if (!result.success) {
        toast.error("Unable to save resume.", {
          description: result.error || "Something went wrong while saving your resume.",
        });
        return;
      }

      // ======================================================
      // STEP 2 — UPDATE RESUME ID
      // ======================================================

      const savedResumeId = result.resumeId ?? resumeId;

      if (result.resumeId && result.resumeId !== currentResume.id) {
        const updatedResume: ResumeData = {
          ...currentResume,
          id: result.resumeId,
        };
        handleResumeChange(updatedResume);
      }

      if (!savedResumeId) {
        console.error("[Resume Payment] No resume ID available after save.", result);
        toast.error("Unable to start payment.", {
          description: "Your resume could not be identified after saving.",
        });
        return;
      }

      // ======================================================
      // STEP 3 — RESUME SAVED
      // ======================================================

      toast.success("Resume saved successfully.", {
        description: "Your resume has been saved. Preparing secure checkout...",
      });

      // ======================================================
      // STEP 4 — CREATE PAYMENT
      //
      // Server action needs BOTH the resume ID (to record which
      // resume the purchase unlocks) and the template ID (used
      // for pricing / validation against the saved resume).
      // ======================================================

      console.log("[Resume Payment] Creating payment:", {
        resumeId: savedResumeId,
        templateId: selectedTemplateId,
      });

      const paymentResult = await createResumePaymentAction({
        resumeId: savedResumeId,
        templateId: selectedTemplateId,
      });

      if (!paymentResult.success) {
        toast.error("Unable to start payment.", {
          description:
            paymentResult.error || "Your resume was saved, but checkout could not be started.",
        });
        return;
      }

      // ======================================================
      // CHECKOUT URL
      //
      // The action only ever returns `checkoutUrl` — there is no
      // `redirectUrl` or `url` field on the result type.
      // ======================================================

      const checkoutUrl = paymentResult.checkoutUrl;

      if (!checkoutUrl) {
        console.error(
          "[Resume Payment] Payment created but no checkout URL was returned.",
          paymentResult,
        );
        toast.error("Payment checkout is unavailable.", {
          description: "Your resume was saved, but we could not open the payment page.",
        });
        return;
      }

      toast.success("Secure checkout is ready.", {
        description: "Redirecting you to payment...",
      });

      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error("[Resume Payment] Unexpected error:", error);
      toast.error("Something went wrong.", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSavingResume(false);
    }
  };
  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-muted/40">
      {/* ======================================================
          TOOLBAR
      ====================================================== */}

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
        {/* ====================================================
            LEFT
        ==================================================== */}

        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {/* ==================================================
              CUSTOMIZE
          ================================================== */}

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

          {/* ==================================================
              UNLOCK PDF
          ================================================== */}

          <Button
            type="button"
            size="sm"
            onClick={handleMakePayment}
            disabled={isSavingResume}
            className="
              h-8
              gap-1.5
              px-2.5
              shadow-sm
              sm:px-3
            "
          >
            {isSavingResume ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />

                <span className="hidden sm:inline">Processing...</span>

                <span className="sm:hidden">Processing</span>
              </>
            ) : (
              <>
                <WalletCards className="h-3.5 w-3.5" />

                <span className="hidden sm:inline">Unlock PDF</span>

                <span className="sm:hidden">Pay</span>
              </>
            )}
          </Button>
        </div>

        {/* ====================================================
            RIGHT — ZOOM
        ==================================================== */}

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
            {/* ==================================================
                ZOOM OUT
            ================================================== */}

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

            {/* ==================================================
                ZOOM PERCENTAGE
            ================================================== */}

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

            {/* ==================================================
                ZOOM IN
            ================================================== */}

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

            {/* ==================================================
                DIVIDER
            ================================================== */}

            <div className="mx-0.5 hidden h-4 w-px bg-border sm:block" />

            {/* ==================================================
                FIT TO SCREEN
            ================================================== */}

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

            {/* ==================================================
                ACTUAL SIZE
            ================================================== */}

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

      {/* ======================================================
          PAYMENT / SAVE INFORMATION
      ====================================================== */}

      <div className="hidden shrink-0 border-b border-border/60 bg-background/60 px-4 py-2 lg:block">
        <div className="flex items-center justify-center gap-5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure payment
          </div>

          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            A4 PDF
          </div>

          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            High-quality export
          </div>
        </div>
      </div>

      {/* ======================================================
          FLOATING SCROLL CONTROLS
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-5
          right-4
          z-40
          flex flex-col
          gap-1.5
        "
      >
        <TooltipProvider delayDuration={250}>
          {/* ==================================================
              SCROLL UP
          ================================================== */}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={scrollUp}
                aria-label="Scroll up"
                className="
                  pointer-events-auto
                  h-9
                  w-9
                  rounded-full
                  border-border/80
                  bg-background/95
                  shadow-lg
                  backdrop-blur
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-background
                "
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>

            <TooltipContent side="left">Scroll up</TooltipContent>
          </Tooltip>

          {/* ==================================================
              SCROLL DOWN
          ================================================== */}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={scrollDown}
                aria-label="Scroll down"
                className="
                  pointer-events-auto
                  h-9
                  w-9
                  rounded-full
                  border-border/80
                  bg-background/95
                  shadow-lg
                  backdrop-blur
                  transition-all
                  hover:translate-y-0.5
                  hover:bg-background
                "
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>

            <TooltipContent side="left">Scroll down</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* ======================================================
          PAPER AREA
      ====================================================== */}

      <div
        ref={previewScrollRef}
        id={PREVIEW_ELEMENT_ID}
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          overscroll-y-contain
          overscroll-x-none
          px-2
          py-4
          sm:px-4
          sm:py-6
        "
        style={{
          scrollbarGutter: "stable",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex w-full justify-center">
          <div
            className="
              relative
              w-full
              max-w-full
              min-w-0
              shrink-0
              origin-top
              transition-transform
              duration-150
              ease-out
            "
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              marginBottom: zoom < 1 ? `${(1 - zoom) * 100}px` : `${(zoom - 1) * 100}px`,
            }}
          >
            <div className="w-full min-w-0 max-w-full overflow-hidden">
              <TemplateComponent resume={currentResume} id={PREVIEW_ELEMENT_ID} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
