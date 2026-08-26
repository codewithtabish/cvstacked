"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { Check, Crown, Eye, Grid2X2, List, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { RESUME_TEMPLATES } from "@/components/(app)/general/templates/all-templates";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { seniorSoftwareEngineerResume } from "@/data/resume";

type ResumeTemplate = (typeof RESUME_TEMPLATES)[number];
type ViewMode = "grid" | "list";

interface TemplateCardProps {
  template: ResumeTemplate;
  viewMode: ViewMode;
  onPreview: (template: ResumeTemplate) => void;
}

function TemplateCard({ template, viewMode, onPreview }: TemplateCardProps) {
  const isPremium = template.plan === "premium";

  if (viewMode === "grid") {
    return (
      <article
        className="
          group
          relative
          overflow-hidden
          rounded-2xl
          border
          bg-card
          text-card-foreground
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        <div className="p-3 sm:p-3.5">
          <div className="relative overflow-hidden rounded-xl border bg-background shadow-sm">
            <Image
              src={template.thumbnail}
              alt={`${template.name} resume template`}
              width={794}
              height={1123}
              priority={template.number <= 4}
              className="
                block
                h-auto
                w-full
                object-cover
                object-top
                transition-transform
                duration-500
                group-hover:scale-[1.015]
              "
            />

            {isPremium && (
              <div
                className="
                  absolute
                  right-3
                  top-3
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  bg-background/95
                  px-2.5
                  py-1.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-foreground
                  shadow-sm
                  backdrop-blur
                "
              >
                <Crown className="h-3 w-3 text-amber-500" />
                Premium
              </div>
            )}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                hidden
                justify-center
                bg-linear-to-t
                from-black/50
                via-black/15
                to-transparent
                px-4
                pb-5
                pt-16
                sm:flex
                sm:translate-y-2
                sm:opacity-0
                sm:transition-all
                sm:duration-300
                sm:group-hover:translate-y-0
                sm:group-hover:opacity-100
              "
            >
              <Button
                type="button"
                size="sm"
                className="
                  pointer-events-auto
                  h-9
                  rounded-xl
                  px-4
                  text-xs
                  font-semibold
                  shadow-lg
                "
                onClick={() => onPreview(template)}
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 pt-1 sm:px-4.5 sm:pb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold tracking-tight">{template.name}</h3>

              <div className="mt-1 flex items-center gap-1.5 text-[10px] capitalize text-muted-foreground">
                <span>{template.category}</span>
                <span className="opacity-40">•</span>
                <span>Template {template.number}</span>
              </div>
            </div>

            <span
              className="
                inline-flex
                shrink-0
                items-center
                gap-1
                rounded-full
                border
                px-2
                py-1
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-muted-foreground
              "
            >
              {isPremium ? (
                <Crown className="h-2.5 w-2.5 text-amber-500" />
              ) : (
                <Check className="h-2.5 w-2.5 text-emerald-500" />
              )}
              {template.plan}
            </span>
          </div>

          <p className="mt-3 line-clamp-2 min-h-[34px] text-[11px] leading-5 text-muted-foreground">
            {template.description}
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 h-9 w-full rounded-xl text-xs font-semibold sm:hidden"
            onClick={() => onPreview(template)}
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Preview
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article
      className="
        group
        relative
        flex
        flex-col
        overflow-hidden
        rounded-2xl
        border
        bg-card
        text-card-foreground
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
        sm:flex-row
      "
    >
      <div
        className="
          relative
          w-full
          shrink-0
          border-b
          bg-muted/20
          p-3
          sm:w-[190px]
          sm:border-b-0
          sm:border-r
        "
      >
        <div className="relative overflow-hidden rounded-xl border bg-background">
          <Image
            src={template.thumbnail}
            alt={`${template.name} resume template`}
            width={794}
            height={1123}
            priority={template.number <= 4}
            className="
              block
              h-auto
              w-full
              object-cover
              object-top
              transition-transform
              duration-500
              group-hover:scale-[1.015]
            "
          />

          {isPremium && (
            <div
              className="
                absolute
                left-2
                top-2
                inline-flex
                items-center
                gap-1
                rounded-full
                border
                bg-background/95
                px-2
                py-1
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.1em]
                shadow-sm
                backdrop-blur
              "
            >
              <Crown className="h-2.5 w-2.5 text-amber-500" />
              Premium
            </div>
          )}
        </div>
      </div>

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          justify-between
          gap-5
          p-5
          sm:flex-row
          sm:items-center
          sm:p-6
        "
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight">{template.name}</h3>

            <span
              className="
                inline-flex
                items-center
                gap-1
                rounded-full
                border
                px-2
                py-1
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-muted-foreground
              "
            >
              {isPremium ? (
                <Crown className="h-2.5 w-2.5 text-amber-500" />
              ) : (
                <Check className="h-2.5 w-2.5 text-emerald-500" />
              )}
              {template.plan}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-2 text-xs capitalize text-muted-foreground">
            <span>{template.category}</span>
            <span className="opacity-40">•</span>
            <span>Template {template.number}</span>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {template.description}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 shrink-0 rounded-xl px-4 text-xs font-semibold"
          onClick={() => onPreview(template)}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Preview
        </Button>
      </div>
    </article>
  );
}

export default function TemplatePageTemplates() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);

  const categories = useMemo(() => {
    const unique = new Set(RESUME_TEMPLATES.map((template) => template.category));

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return RESUME_TEMPLATES.filter((template) => {
      const matchesSearch =
        q.length === 0 ||
        template.name.toLowerCase().includes(q) ||
        template.category.toLowerCase().includes(q) ||
        template.description.toLowerCase().includes(q);

      const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;

      const matchesPlan = planFilter === "all" || template.plan === planFilter;

      return matchesSearch && matchesCategory && matchesPlan;
    });
  }, [searchQuery, categoryFilter, planFilter]);

  const handlePreview = (template: ResumeTemplate) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  const handleUseAfterPreview = () => {
    closePreview();

    if (!isLoaded) {
      return;
    }

    if (isSignedIn) {
      router.push("/app");
      return;
    }

    openSignIn({
      forceRedirectUrl: "/app",
    });
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 || categoryFilter !== "all" || planFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setPlanFilter("all");
  };

  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            <div className="max-w-3xl">
              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  bg-background/70
                  px-3
                  py-1.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-muted-foreground
                  backdrop-blur-sm
                "
              >
                <Sparkles className="h-3.5 w-3.5" />
                Resume templates
              </div>

              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-[-0.04em]
                  text-foreground
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Find a resume template
                <span className="block text-muted-foreground">that fits your career.</span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-2xl
                  text-sm
                  leading-6
                  text-muted-foreground
                  sm:text-base
                  sm:leading-7
                "
              >
                Explore professionally designed resume templates built for different careers,
                industries, experience levels, and personal styles.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                  aria-hidden="true"
                />

                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search templates..."
                  aria-label="Search resume templates"
                  className="h-11 rounded-xl pl-10 pr-4 text-sm"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter templates by category"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  bg-background
                  px-3
                  text-sm
                  text-foreground
                  outline-none
                  transition-colors
                  focus:border-ring
                  focus:ring-2
                  focus:ring-ring/20
                  lg:w-[190px]
                "
              >
                <option value="all">All categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={planFilter}
                onChange={(event) => setPlanFilter(event.target.value)}
                aria-label="Filter templates by plan"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  bg-background
                  px-3
                  text-sm
                  text-foreground
                  outline-none
                  transition-colors
                  focus:border-ring
                  focus:ring-2
                  focus:ring-ring/20
                  lg:w-[160px]
                "
              >
                <option value="all">All templates</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div
              className="
                flex
                flex-col
                gap-4
                border-b
                pb-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">
                  {filteredTemplates.length}

                  <span className="ml-1 font-normal text-muted-foreground">
                    {filteredTemplates.length === 1 ? "template" : "templates"}
                  </span>
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      text-xs
                      font-medium
                      text-muted-foreground
                      underline
                      underline-offset-4
                      transition-colors
                      hover:text-foreground
                    "
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <div
                className="inline-flex w-fit items-center rounded-xl border bg-muted/40 p-1"
                role="group"
                aria-label="Template view"
              >
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  onClick={() => setViewMode("grid")}
                  className={`
                    inline-flex
                    h-9
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    text-xs
                    font-medium
                    transition-all
                    ${
                      viewMode === "grid"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <Grid2X2 className="h-3.5 w-3.5" />
                  Grid
                </button>

                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  onClick={() => setViewMode("list")}
                  className={`
                    inline-flex
                    h-9
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    text-xs
                    font-medium
                    transition-all
                    ${
                      viewMode === "list"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <List className="h-3.5 w-3.5" />
                  List
                </button>
              </div>
            </div>
          </div>

          {filteredTemplates.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "mt-8 grid grid-cols-1 gap-4"
              }
            >
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  viewMode={viewMode}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          ) : (
            <div
              className="
                mt-8
                flex
                min-h-[360px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                bg-muted/20
                px-6
                py-16
                text-center
              "
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>

              <h2 className="mt-5 text-base font-semibold tracking-tight">No templates found</h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Try a different search term or remove one of the filters to see more resume
                templates.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-5 h-10 rounded-xl px-4 text-xs font-semibold"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          )}

          <div
            className="
              mx-auto
              mt-12
              flex
              max-w-3xl
              flex-col
              items-center
              justify-center
              gap-4
              text-center
              sm:flex-row
              sm:gap-7
            "
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border">
                <Check className="h-3 w-3" />
              </span>
              Professional layouts
            </div>

            <div className="hidden h-4 w-px bg-border sm:block" />

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border">
                <Check className="h-3 w-3" />
              </span>
              A4 ready
            </div>

            <div className="hidden h-4 w-px bg-border sm:block" />

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border">
                <Check className="h-3 w-3" />
              </span>
              Easy to customize
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          A4 PREVIEW DIALOG
          ============================================================ */}

      <Dialog
        open={!!previewTemplate}
        onOpenChange={(open) => {
          if (!open) {
            closePreview();
          }
        }}
      >
        <DialogContent
          className="
            flex
            h-[96dvh]
            w-[calc(100vw-1rem)]
            max-w-[900px]
            flex-col
            gap-0
            overflow-hidden
            p-0
            sm:h-[94dvh]
            sm:w-[calc(100vw-2rem)]
            sm:max-w-[900px]
            sm:rounded-2xl
          "
        >
          {/* HEADER */}

          <DialogHeader
            className="
              flex
              shrink-0
              flex-row
              items-center
              justify-between
              gap-3
              border-b
              bg-background
              px-4
              py-3
              pr-14
              sm:px-5
              sm:py-3.5
              sm:pr-16
            "
          >
            <div className="min-w-0 flex-1">
              <DialogTitle className="truncate text-sm font-semibold tracking-tight sm:text-base">
                {previewTemplate?.name}
              </DialogTitle>

              <p className="mt-0.5 truncate text-[11px] capitalize text-muted-foreground sm:text-xs">
                {previewTemplate?.category} • Template {previewTemplate?.number}
              </p>
            </div>

            {/* 
              DialogContent already renders the close button.
              We intentionally do NOT render another X here.
            */}

            <div className="flex shrink-0 items-center">
              <Button
                type="button"
                size="sm"
                className="
                  h-8
                  rounded-full
                  bg-amber-400
                  px-3
                  text-[11px]
                  font-semibold
                  text-amber-950
                  shadow-sm
                  hover:bg-amber-300
                  sm:h-9
                  sm:px-5
                  sm:text-xs
                "
                onClick={handleUseAfterPreview}
              >
                Use this template
              </Button>
            </div>
          </DialogHeader>

          {/* ========================================================
              PREVIEW AREA
              ======================================================== */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overflow-x-hidden
              bg-zinc-100
              dark:bg-zinc-900/80
            "
          >
            <div
              className="
                flex
                min-h-full
                w-full
                justify-center
                px-3
                py-4
                sm:px-6
                sm:py-6
                lg:px-8
                lg:py-8
              "
            >
              {previewTemplate && (
                <div
                  className="
                    relative
                    w-full
                    max-w-[794px]
                    shrink-0
                    self-start
                    bg-white
                    shadow-2xl
                    ring-1
                    ring-black/5
                  "
                  style={{
                    aspectRatio: "794 / 1123",
                  }}
                >
                  {/* 
                    IMPORTANT:
                    No overflow-hidden here.
                    This prevents the bottom of the resume from
                    being clipped by the preview container.
                  */}

                  <div
                    className="
                      absolute
                      inset-0
                      w-full
                      bg-white
                    "
                  >
                    <div className="h-full w-full">
                      <previewTemplate.component
                        resume={seniorSoftwareEngineerResume}
                        id={`preview-${previewTemplate.id}`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
