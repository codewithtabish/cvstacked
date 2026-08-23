"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ResumeTemplate } from "@/data/resume";

import { RESUME_TEMPLATES } from "../../general/templates/all-templates";

// ============================================================
// FILTERS
// ============================================================

const TEMPLATE_FILTERS: Array<{
  value: "all" | ResumeTemplate;
  label: string;
}> = [
  { value: "all", label: "All Templates" },
  { value: "modern", label: "Modern" },
  { value: "professional", label: "Professional" },
  { value: "minimal", label: "Minimal" },
  { value: "creative", label: "Creative" },
  { value: "executive", label: "Executive" },
  { value: "classic", label: "Classic" },
  { value: "elegant", label: "Elegant" },
  { value: "technical", label: "Technical" },
  { value: "compact", label: "Compact" },
];

// ============================================================
// HELPERS
// ============================================================

function formatCategory(category: ResumeTemplate) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// ============================================================
// COMPONENT
// ============================================================

const AllTemplateShow = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | ResumeTemplate>("all");

  const filteredTemplates = useMemo(() => {
    if (activeFilter === "all") {
      return RESUME_TEMPLATES;
    }

    return RESUME_TEMPLATES.filter((template) => template.category === activeFilter);
  }, [activeFilter]);

  // const templateCount = filteredTemplates.length;

  return (
    <div className="space-y-8">
      {/* ========================================================
          FILTER HEADER
      ========================================================= */}

      <div className="space-y-5">
        {/* ======================================================
            FILTER BAR
        ======================================================= */}

        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TEMPLATE_FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;

              const count =
                filter.value === "all"
                  ? RESUME_TEMPLATES.length
                  : RESUME_TEMPLATES.filter((template) => template.category === filter.value)
                      .length;

              return (
                <Button
                  key={filter.value}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.value)}
                  className={[
                    "h-9 shrink-0 rounded-full px-4 text-xs font-medium",
                    "transition-all duration-200",
                    isActive
                      ? "shadow-sm"
                      : "border-border/70 bg-background hover:border-foreground/20 hover:bg-muted/60",
                  ].join(" ")}
                >
                  {filter.label}

                  <span
                    className={[
                      "ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] leading-none",
                      isActive ? "bg-background/15 text-current" : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================
          TEMPLATE GRID
      ========================================================= */}

      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <Link key={template.id} href={`/templates/${template.id}`} className="group block">
              <article className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-border hover:shadow-2xl">
                {/* ==================================================
                    TEMPLATE PREVIEW
                =================================================== */}

                <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-t-2xl bg-muted/20 px-8 py-8">
                  {/* Ambient glow */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/2.5 blur-3xl transition-all duration-500 group-hover:bg-black/5" />

                  {/* Main paper shadow */}
                  <div className="pointer-events-none absolute left-1/2 top-[53%] h-[78%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-black/15 blur-2xl transition-all duration-500 group-hover:translate-y-[calc(-50%+4px)] group-hover:bg-black/20" />

                  {/* Secondary paper shadow */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[51%] -translate-x-1/2 -translate-y-1/2 rotate-2 rounded-[5px] bg-black/6 blur-md transition-transform duration-500 group-hover:rotate-3" />

                  {/* =================================================
                      A4 PAPER
                  ================================================== */}

                  <div className="relative h-[88%] w-auto overflow-hidden rounded-[5px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.16)] ring-1 ring-black/4 transition-all duration-500 ease-out group-hover:scale-[1.025] group-hover:-rotate-1 group-hover:shadow-[0_24px_55px_rgba(0,0,0,0.2)]">
                    <Image
                      src={template.thumbnail}
                      alt={`${template.name} resume template preview`}
                      width={794}
                      height={1123}
                      priority={false}
                      className="block h-full w-auto object-contain"
                    />

                    {/* Subtle glass reflection */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/8 via-transparent to-black/2.5" />
                  </div>

                  {/* Preview pill */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-black/6 bg-white/85 px-3 py-1.5 text-[10px] font-medium tracking-wide text-foreground/65 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:bottom-5 group-hover:opacity-100">
                    Preview template
                  </div>
                </div>

                {/* ==================================================
                    TEMPLATE INFORMATION
                =================================================== */}

                <div className="border-t border-border/60 bg-background px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      {/* Category */}
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {formatCategory(template.category)}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="truncate text-[15px] font-semibold tracking-[-0.015em]">
                        {template.name}
                      </h3>

                      {/* Description */}
                      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {template.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 group-hover:border-foreground/20 group-hover:bg-foreground group-hover:text-background">
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 10h11M11 6l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        /* ========================================================
           EMPTY STATE
        ========================================================= */

        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/10 px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-background shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            >
              <path
                d="M6 3.75h9.5L19 7.25v13A.75.75 0 0 1 18.25 21H6a.75.75 0 0 1-.75-.75V4.5A.75.75 0 0 1 6 3.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M15 3.75V7.5h3.75M8.5 11h7M8.5 14.5h7M8.5 18h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h3 className="text-sm font-semibold">No templates found</h3>

          <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted-foreground">
            There are no templates available in this category yet. Try another category to explore
            more designs.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-5 rounded-full"
            onClick={() => setActiveFilter("all")}
          >
            View all templates
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllTemplateShow;
