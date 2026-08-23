"use client";

import { RESUME_TEMPLATES } from "@/components/(app)/general/templates/all-templates";
import { Sparkles } from "lucide-react";

// ============================================================
// COMPONENT
// ============================================================

const TemplatesHeader = () => {
  const templateCount = RESUME_TEMPLATES.length;

  return (
    <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-background">
      {/* ======================================================
          AMBIENT BACKGROUND
      ======================================================= */}

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-muted/60 blur-3xl" />

        <div className="absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-muted/40 blur-3xl" />

        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />

            <span>Atative Resume Collection</span>
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
            Resumes designed to
            <span className="block text-muted-foreground">make an impression.</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            Explore thoughtfully crafted resume templates built for different careers,
            personalities, and professional goals. Choose a design, make it yours, and create a
            resume you will be proud to share.
          </p>

          {/* ==================================================
              META
          =================================================== */}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight">{templateCount}</span>

              <span className="text-sm text-muted-foreground">
                professionally designed templates
              </span>
            </div>

            <div aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />

            <span className="text-sm text-muted-foreground">A4-ready layouts</span>

            <div aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />

            <span className="text-sm text-muted-foreground">Fully customizable</span>
          </div>
        </div>
      </div>

      {/* ======================================================
          BOTTOM DETAIL
      ======================================================= */}
      <div className="relative border-t border-border/50 bg-muted/18 px-6 py-3 sm:px-10 lg:px-14">
        <div className="flex flex-wrap items-center justibg-muted/183">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Find a style that feels like you
          </p>

          <p className="text-xs text-muted-foreground">Built for clarity. Designed for impact.</p>
        </div>
      </div>
    </header>
  );
};

export default TemplatesHeader;
