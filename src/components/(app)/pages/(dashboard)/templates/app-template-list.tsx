"use client";

import { ArrowLeft, Grid2X2, List as ListIcon, Lock, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { RESUME_TEMPLATES } from "@/components/(app)/general/templates/all-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ResumeTemplate = (typeof RESUME_TEMPLATES)[number];
type PlanFilter = "all" | "free" | "premium";
type SortOption = "featured" | "name-asc" | "name-desc";
type ViewMode = "grid" | "list";

interface AppTemplateListProps {
  hasPremiumAccess: boolean;
  isLoadingAccess?: boolean;
  backHref?: string;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "name-asc",
    label: "Name A–Z",
  },
  {
    value: "name-desc",
    label: "Name Z–A",
  },
];

function formatCategory(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function buildEditorHref(templateId: string) {
  return `/app/resumes/new/${templateId}`;
}

export default function AppTemplateList({
  hasPremiumAccess,
  isLoadingAccess = false,
  backHref = "/app/resumes",
}: AppTemplateListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [plan, setPlan] = useState<PlanFilter>("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(RESUME_TEMPLATES.map((template) => template.category)));

    return ["all", ...unique];
  }, []);

  const filteredTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const result = RESUME_TEMPLATES.filter((template) => {
      const matchesQuery =
        query.length === 0 ||
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query);

      const matchesCategory = category === "all" || template.category === category;

      const matchesPlan = plan === "all" || template.plan === plan;

      return matchesQuery && matchesCategory && matchesPlan;
    });

    if (sort === "name-asc") {
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "name-desc") {
      return [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [searchQuery, category, plan, sort]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 || category !== "all" || plan !== "all" || sort !== "featured";

  function clearFilters() {
    setSearchQuery("");
    setCategory("all");
    setPlan("all");
    setSort("featured");
  }

  const resultCountLabel =
    filteredTemplates.length === 1 ? "1 template" : `${filteredTemplates.length} templates`;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex w-full flex-col gap-7">
        {/* Header */}
        <div>
          <Link
            href={backHref}
            className="group inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to resumes
          </Link>
        </div>

        {/* Introduction */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Choose a template
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Start with a professionally designed resume template. Customize your content,
            typography, colors, and layout in the editor.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search templates..."
            aria-label="Search templates"
            className="pl-9"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {resultCountLabel}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[150px]" aria-label="Filter by category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item === "all" ? "All Categories" : formatCategory(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Plan */}
            <Select value={plan} onValueChange={(value) => setPlan(value as PlanFilter)}>
              <SelectTrigger className="w-[140px]" aria-label="Filter by access">
                <SelectValue placeholder="Access" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
              <SelectTrigger className="w-[140px]" aria-label="Sort templates">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>

              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
                Clear filters
              </Button>
            )}

            {/* View mode */}
            <div className="ml-1 flex items-center rounded-md border border-border bg-muted/30 p-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "size-8 cursor-pointer rounded-sm",
                      viewMode === "grid"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground",
                    )}
                  >
                    <Grid2X2 className="size-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>Grid view</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "size-8 cursor-pointer rounded-sm",
                      viewMode === "list"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground",
                    )}
                  >
                    <ListIcon className="size-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>List view</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoadingAccess ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <TemplateCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <TemplateListItemSkeleton key={index} />
              ))}
            </div>
          )
        ) : filteredTemplates.length === 0 ? (
          <TemplateEmptyState onClear={clearFilters} />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                hasPremiumAccess={hasPremiumAccess}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredTemplates.map((template) => (
              <TemplateListItem
                key={template.id}
                template={template}
                hasPremiumAccess={hasPremiumAccess}
              />
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared                                                                     */
/* -------------------------------------------------------------------------- */

function PlanBadge({ plan }: { plan: ResumeTemplate["plan"] }) {
  if (plan === "premium") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <Lock className="size-3" aria-hidden="true" />
        Premium
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
      Free
    </span>
  );
}

function TemplateActionLabel({
  template,
  hasPremiumAccess,
}: {
  template: ResumeTemplate;
  hasPremiumAccess: boolean;
}) {
  if (template.plan === "premium" && !hasPremiumAccess) {
    return "Unlock with Premium";
  }

  return "Use Template";
}

/* -------------------------------------------------------------------------- */
/* Grid Card                                                                  */
/* -------------------------------------------------------------------------- */

function TemplateCard({
  template,
  hasPremiumAccess,
}: {
  template: ResumeTemplate;
  hasPremiumAccess: boolean;
}) {
  const isLocked = template.plan === "premium" && !hasPremiumAccess;

  const href = isLocked ? "/app/pricing" : buildEditorHref(template.id);

  return (
    <Link
      href={href}
      aria-label={`${template.name}, ${formatCategory(template.category)}, ${
        template.plan === "premium" ? "premium template" : "free template"
      }`}
      className="
        group
        flex
        cursor-pointer
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-border
        bg-card
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-foreground/20
        hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.22)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        motion-reduce:transform-none
        motion-reduce:transition-none
      "
    >
      {/* Resume Preview */}
      <div className="relative aspect-794/1123 w-full overflow-hidden bg-muted/40 p-4">
        <div className="relative h-full w-full overflow-hidden rounded-sm border border-black/4 bg-background shadow-[0_1px_2px_rgba(0,0,0,0.06),0_6px_20px_rgba(0,0,0,0.07)]">
          <Image
            src={template.thumbnail}
            alt={`${template.name} resume template preview`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
            className="object-cover"
          />

          {/* Very subtle hover layer */}
          <div className="pointer-events-none absolute inset-0 bg-black/1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">{template.name}</h3>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatCategory(template.category)}
            </p>
          </div>

          <PlanBadge plan={template.plan} />
        </div>

        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
          {template.description}
        </p>

        {/* Action */}
        <div
          className={cn(
            "mt-auto inline-flex h-9 w-full items-center justify-center rounded-md border text-sm font-medium transition-colors duration-200",
            isLocked
              ? "border-border bg-background text-foreground group-hover:bg-muted"
              : "border-transparent bg-primary text-primary-foreground group-hover:bg-primary/90",
          )}
        >
          {TemplateActionLabel({
            template,
            hasPremiumAccess,
          })}
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* List Item                                                                  */
/* -------------------------------------------------------------------------- */

function TemplateListItem({
  template,
  hasPremiumAccess,
}: {
  template: ResumeTemplate;
  hasPremiumAccess: boolean;
}) {
  const isLocked = template.plan === "premium" && !hasPremiumAccess;

  const href = isLocked ? "/app/pricing" : buildEditorHref(template.id);

  return (
    <Link
      href={href}
      aria-label={`${template.name}, ${formatCategory(template.category)}, ${
        template.plan === "premium" ? "premium template" : "free template"
      }`}
      className="
        group
        flex
        cursor-pointer
        flex-col
        gap-4
        rounded-xl
        border
        border-border
        bg-card
        p-4
        transition-all
        duration-300
        ease-out
        hover:-translate-y-0.5
        hover:border-foreground/20
        hover:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.18)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        motion-reduce:transform-none
        motion-reduce:transition-none
        sm:flex-row
        sm:items-center
      "
    >
      {/* Preview */}
      <div className="relative aspect-794/1123 w-24 shrink-0 overflow-hidden rounded-sm border border-black/4 bg-muted/40 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.06)] sm:w-20">
        <Image
          src={template.thumbnail}
          alt={`${template.name} resume template preview`}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      {/* Information */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{template.name}</h3>

          <PlanBadge plan={template.plan} />
        </div>

        <p className="text-xs text-muted-foreground">{formatCategory(template.category)}</p>

        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground sm:max-w-md">
          {template.description}
        </p>
      </div>

      {/* Action */}
      <div
        className={cn(
          "inline-flex h-9 w-full shrink-0 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors duration-200 sm:w-auto",
          isLocked
            ? "border-border bg-background text-foreground group-hover:bg-muted"
            : "border-transparent bg-primary text-primary-foreground group-hover:bg-primary/90",
        )}
      >
        {TemplateActionLabel({
          template,
          hasPremiumAccess,
        })}
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeletons                                                                  */
/* -------------------------------------------------------------------------- */

function TemplateCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-794/1123 w-full animate-pulse bg-muted motion-reduce:animate-none" />

      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-3 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="mt-1 h-8 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
      </div>
    </div>
  );
}

function TemplateListItemSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="aspect-794/1123 w-24 shrink-0 animate-pulse rounded-sm bg-muted motion-reduce:animate-none sm:w-20" />

      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
      </div>

      <div className="h-8 w-full animate-pulse rounded bg-muted motion-reduce:animate-none sm:w-32" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function TemplateEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
      <p className="text-sm font-medium text-foreground">No templates found</p>

      <p className="max-w-xs text-sm text-muted-foreground">
        Try adjusting your search or filters.
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClear}
        className="cursor-pointer"
      >
        Clear filters
      </Button>
    </div>
  );
}
