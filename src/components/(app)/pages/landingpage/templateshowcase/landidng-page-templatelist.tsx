"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Crown, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { RESUME_TEMPLATES } from "@/components/(app)/general/templates/all-templates";
import { Button } from "@/components/ui/button";

/* ============================================================
   TYPES
   ============================================================ */

type ResumeTemplate = (typeof RESUME_TEMPLATES)[number];

/* ============================================================
   CONSTANTS
   ============================================================ */

const INITIAL_TEMPLATE_COUNT = 8;

/* ============================================================
   TEMPLATE CARD
   ============================================================ */

interface TemplateCardProps {
  template: ResumeTemplate;
  onUseTemplate: (template: ResumeTemplate) => void;
}

function TemplateCard({ template, onUseTemplate }: TemplateCardProps) {
  const isPremium = template.plan === "premium";

  return (
    <article
      className="
        group
        w-[250px]
        shrink-0
        snap-start
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
        sm:w-[270px]
        lg:w-[285px]
      "
    >
      {/* ======================================================
          MOCKUP
          ====================================================== */}

      <div className="p-3 sm:p-3.5">
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            bg-background
            shadow-sm
          "
        >
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
        </div>
      </div>

      {/* ======================================================
          CARD CONTENT
          ====================================================== */}

      <div className="px-4 pb-4 pt-1 sm:px-4.5 sm:pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold tracking-tight">{template.name}</h3>

            <div
              className="
                mt-1
                flex
                items-center
                gap-1.5
                text-[10px]
                capitalize
                text-muted-foreground
              "
            >
              <span>{template.category}</span>

              <span className="opacity-40">•</span>

              <span>Template {template.number}</span>
            </div>
          </div>

          {/* Plan */}

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

        {/* Description */}

        <p
          className="
            mt-3
            line-clamp-2
            min-h-[34px]
            text-[11px]
            leading-5
            text-muted-foreground
          "
        >
          {template.description}
        </p>

        {/* ====================================================
            MOBILE ACTION
            ==================================================== */}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="
            mt-4
            h-9
            w-full
            rounded-xl
            text-xs
            font-semibold
            sm:hidden
          "
          onClick={() => onUseTemplate(template)}
        >
          Use template
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>

      {/* ======================================================
          DESKTOP HOVER ACTION
          ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          hidden
        "
      />

      <div className="relative hidden sm:block">
        <div
          className="
            absolute
            inset-x-3
            bottom-[118px]
            z-10
            flex
            translate-y-2
            justify-center
            opacity-0
            transition-all
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <Button
            type="button"
            size="sm"
            className="
              h-9
              rounded-xl
              px-4
              text-xs
              font-semibold
              shadow-lg
            "
            onClick={() => onUseTemplate(template)}
          >
            Use template
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function LandingPageTemplates() {
  const router = useRouter();

  const { isLoaded, isSignedIn } = useAuth();

  const { openSignIn } = useClerk();

  const scrollRef = useRef<HTMLDivElement>(null);

  const [showAll, setShowAll] = useState(false);

  /* ==========================================================
     VISIBLE TEMPLATES
     ========================================================== */

  const visibleTemplates = showAll
    ? RESUME_TEMPLATES
    : RESUME_TEMPLATES.slice(0, INITIAL_TEMPLATE_COUNT);

  /* ==========================================================
     USE TEMPLATE
     ========================================================== */

  const handleUseTemplate = (template: ResumeTemplate) => {
    /*
     * Wait until Clerk knows the authentication state.
     */

    if (!isLoaded) {
      return;
    }

    /*
     * User is already authenticated.
     *
     * We intentionally only go to /app.
     */

    if (isSignedIn) {
      router.push("/app");
      return;
    }

    /*
     * User is not authenticated.
     *
     * Clerk Core 3 compatible programmatic sign-in.
     *
     * No <SignedIn />
     * No <SignedOut />
     */

    openSignIn({
      forceRedirectUrl: "/app",
    });
  };

  /* ==========================================================
     HORIZONTAL SCROLL
     ========================================================== */

  const scrollTemplates = (direction: "left" | "right") => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const amount = Math.min(container.clientWidth * 0.8, 850);

    container.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  /* ==========================================================
     SHOW ALL
     ========================================================== */

  const handleShowAll = () => {
    setShowAll((current) => !current);

    /*
     * Return the horizontal gallery to the beginning
     * whenever the view changes.
     */

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    });
  };

  return (
    <section
      id="templates"
      className="
        relative
        overflow-hidden
        py-20
        sm:py-24
        lg:py-28
      "
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* ====================================================
            HEADER
            ==================================================== */}

        <div
          className="
            flex
            flex-col
            gap-7
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          {/* ==================================================
              TITLE AREA
              ================================================== */}

          <div className="max-w-2xl">
            {/* Eyebrow */}

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

            {/* Main heading */}

            <h2
              className="
                text-3xl
                font-bold
                tracking-[-0.04em]
                text-foreground
                sm:text-4xl
                lg:text-5xl
            "
            >
              Start with a resume
              <span className="block text-muted-foreground">that already looks professional.</span>
            </h2>

            {/* Description */}

            <p
              className="
                mt-5
                max-w-xl
                text-sm
                leading-6
                text-muted-foreground
                sm:text-base
                sm:leading-7
              "
            >
              Explore professionally designed templates built for different careers, industries, and
              personal styles.
            </p>
          </div>

          {/* ==================================================
              DESKTOP CONTROLS
              ================================================== */}

          <div className="flex items-center gap-2">
            {/* Previous */}

            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous templates"
              className="
                h-10
                w-10
                rounded-xl
              "
              onClick={() => scrollTemplates("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Next */}

            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next templates"
              className="
                h-10
                w-10
                rounded-xl
              "
              onClick={() => scrollTemplates("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Show all */}

            <Button
              type="button"
              variant="outline"
              className="
                h-10
                rounded-xl
                px-4
                text-xs
                font-semibold
              "
              onClick={handleShowAll}
            >
              {showAll ? "Show less" : "Show all"}

              <ArrowRight
                className={`
                  ml-2
                  h-3.5
                  w-3.5
                  transition-transform
                  duration-200
                  ${showAll ? "-rotate-90" : "rotate-0"}
                `}
              />
            </Button>
          </div>
        </div>

        {/* ====================================================
            TEMPLATE GALLERY
            ==================================================== */}

        <div className="relative mt-12">
          {/* ==================================================
              LEFT EDGE FADE
              ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              top-0
              z-10
              hidden
              w-10
              bg-linear-to-r
              from-background
              to-transparent
              lg:block
            "
          />

          {/* ==================================================
              RIGHT EDGE FADE
              ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              right-0
              top-0
              z-10
              hidden
              w-10
              bg-linear-to-l
              from-background
              to-transparent
              lg:block
            "
          />

          {/* ==================================================
              SCROLLABLE TEMPLATE ROW
              ================================================== */}

          <div
            ref={scrollRef}
            className="
              flex
              snap-x
              snap-mandatory
              gap-4
              overflow-x-auto
              pb-5
              pr-1
              scrollbar-none
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
              sm:gap-5
            "
          >
            {visibleTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUseTemplate={handleUseTemplate}
              />
            ))}
          </div>
        </div>

        {/* ====================================================
            MOBILE SWIPE HINT
            ==================================================== */}

        {!showAll && (
          <div
            className="
              mt-1
              flex
              items-center
              justify-center
              gap-2
              text-[10px]
              font-medium
              text-muted-foreground
              sm:hidden
            "
          >
            <ChevronLeft className="h-3 w-3" />
            Swipe to explore templates
            <ChevronRight className="h-3 w-3" />
          </div>
        )}

        {/* ====================================================
            SHOW ALL / SHOW LESS
            ==================================================== */}

        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="outline"
            className="
              h-10
              rounded-xl
              px-5
              text-xs
              font-semibold
            "
            onClick={handleShowAll}
          >
            {showAll ? (
              <>
                Show less
                <ChevronLeft className="ml-2 h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Explore all {RESUME_TEMPLATES.length} templates
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>

        {/* ====================================================
            TRUST / FEATURES
            ==================================================== */}

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
          {/* Professional layouts */}

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-muted-foreground
            "
          >
            <span
              className="
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-full
                border
              "
            >
              <Check className="h-3 w-3" />
            </span>
            Professional layouts
          </div>

          <div className="hidden h-4 w-px bg-border sm:block" />

          {/* A4 */}

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-muted-foreground
            "
          >
            <span
              className="
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-full
                border
              "
            >
              <Check className="h-3 w-3" />
            </span>
            A4 ready
          </div>

          <div className="hidden h-4 w-px bg-border sm:block" />

          {/* Easy editing */}

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-muted-foreground
            "
          >
            <span
              className="
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-full
                border
              "
            >
              <Check className="h-3 w-3" />
            </span>
            Easy to customize
          </div>
        </div>
      </div>
    </section>
  );
}
