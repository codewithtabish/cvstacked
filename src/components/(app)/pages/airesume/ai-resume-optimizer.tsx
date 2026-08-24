"use client";

/**
 * /ai-resume-optimizer — public marketing page for CVSTACKED's AI Resume Optimizer.
 *
 * Theme-aware (light + dark) via shadcn tokens.
 * No navbar / footer / auth. Single CTA → /app
 * Scroll arrows: hero ↓ + floating ↑ to top
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Check,
  FileText,
  Layers,
  ListChecks,
  Lock,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const displayFont = "font-[family-name:var(--font-display)]";
const monoFont = "font-[family-name:var(--font-mono)]";

/* ------------------------------------------------------------------ */
/*  Shared demo data                                                   */
/* ------------------------------------------------------------------ */

const RESUME_EXPERIENCE = [
  { text: "Built scalable web applications", tier: "high" as const },
  { text: "Improved frontend performance", tier: "high" as const },
  { text: "Led frontend architecture decisions", tier: "high" as const },
  { text: "Collaborated with product designers", tier: "mid" as const },
  { text: "Maintained internal tooling", tier: "low" as const },
];

const RESUME_SKILLS = ["React", "Next.js", "TypeScript", "Accessibility", "Performance"];

const JOB_REQUIREMENTS = [
  "React",
  "TypeScript",
  "Next.js",
  "Frontend Architecture",
  "Performance",
  "Accessibility",
  "Leadership",
];

const KEYWORDS = [
  { term: "React", state: "match" as const },
  { term: "Next.js", state: "match" as const },
  { term: "TypeScript", state: "match" as const },
  { term: "Accessibility", state: "match" as const },
  { term: "Frontend Architecture", state: "recommended" as const },
  { term: "Leadership", state: "relevant" as const },
];

const PIPELINE_STAGES = [
  {
    n: "01",
    label: "Read your resume",
    detail: "CVSTACKED parses structure, roles, and accomplishments.",
  },
  {
    n: "02",
    label: "Understand the job",
    detail: "The target role's requirements are extracted from its description.",
  },
  {
    n: "03",
    label: "Extract requirements",
    detail: "Skills, tools, and responsibilities are identified and ranked.",
  },
  {
    n: "04",
    label: "Match your experience",
    detail: "Each requirement is compared against your existing background.",
  },
  {
    n: "05",
    label: "Identify important keywords",
    detail: "Role-specific language is surfaced for relevance and ATS parsing.",
  },
  {
    n: "06",
    label: "Improve relevance",
    detail: "Wording is sharpened without changing what you actually did.",
  },
  {
    n: "07",
    label: "Prepare a tailored resume",
    detail: "A focused version is ready for your review.",
  },
];

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        monoFont,
        "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary",
      )}
    >
      <span className="h-[3px] w-[3px] rounded-full bg-primary" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          displayFont,
          "mt-4 text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.12] tracking-tight text-foreground",
        )}
      >
        {title}
      </h2>
      {sub && (
        <p className="mt-4 text-[15px] sm:text-base leading-relaxed text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}

function KeywordChip({
  label,
  state,
  delay = 0,
}: {
  label: string;
  state: "match" | "relevant" | "recommended";
  delay?: number;
}) {
  const styles = {
    match: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    relevant: "bg-primary/10 text-primary border-primary/30",
    recommended: "bg-muted text-muted-foreground border-border",
  }[state];

  const tag = {
    match: "Match",
    relevant: "Relevant",
    recommended: "Recommended",
  }[state];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay }}
      className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5", styles)}
    >
      <span className="text-[13px] font-medium text-foreground">{label}</span>
      <span className={cn(monoFont, "text-[10px] uppercase tracking-wider opacity-90")}>
        {state === "match" && <Check className="inline h-3 w-3 -mt-0.5 mr-0.5" />}
        {tag}
      </span>
    </motion.div>
  );
}

function AnimatedCounter({
  to,
  suffix = "%",
  trigger,
}: {
  to: number;
  suffix?: string;
  trigger: boolean;
}) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!trigger) return;

    if (reduce) {
      const id = setTimeout(() => setValue(to), 0);
      return () => clearTimeout(id);
    }

    const steps = [0, Math.round(to * 0.28), Math.round(to * 0.54), Math.round(to * 0.78), to];
    let i = 0;
    const id = setInterval(() => {
      setValue(steps[i]);
      i++;
      if (i >= steps.length) clearInterval(id);
    }, 180);
    return () => clearInterval(id);
  }, [trigger, to, reduce]);

  return (
    <span className={cn(monoFont, "text-primary")}>
      {value}
      {suffix}
    </span>
  );
}

function CreateResumeButton({
  size = "lg",
  className,
}: {
  size?: "default" | "lg";
  className?: string;
}) {
  return (
    <Button
      asChild
      size={size}
      className={cn("group rounded-full px-7 h-12 text-[15px] font-medium", className)}
    >
      <Link href="/app" aria-label="Create your resume with CVSTACKED">
        Create Resume
        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Button>
  );
}

function GridBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.35]"
      style={{
        backgroundImage:
          "linear-gradient(to right, hsl(var(--border) / 0.6) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.6) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll arrows                                                      */
/* ------------------------------------------------------------------ */

/** Floating ↑ button – appears after scrolling down */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.22 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Hero ↓ indicator – sits at the bottom of the hero */
function HeroScrollDown() {
  const reduce = useReducedMotion();

  const scrollDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.85,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <div className="mt-10 flex justify-center pb-4">
      <button
        onClick={scrollDown}
        aria-label="Scroll down"
        className="group flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
      >
        <span className={cn(monoFont, "text-[10px] uppercase tracking-[0.18em]")}>Scroll</span>
        <motion.div
          animate={reduce ? {} : { y: [0, 6, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/80 shadow-sm backdrop-blur-sm transition-colors group-hover:border-primary/40 group-hover:bg-primary/5"
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mid-page CTA                                                       */
/* ------------------------------------------------------------------ */

function MidCtaSection() {
  return (
    <section className="relative px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-12 text-center sm:px-10 sm:py-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,hsl(var(--primary)/0.1),transparent_70%)]"
          />
          <p
            className={cn(monoFont, "relative text-[11px] uppercase tracking-[0.2em] text-primary")}
          >
            Start in minutes
          </p>
          <h3
            className={cn(
              displayFont,
              "relative mt-3 text-2xl sm:text-3xl tracking-tight text-foreground",
            )}
          >
            Put your experience in the right context.
          </h3>
          <p className="relative mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
            Create a resume, choose a target role, and let CVSTACKED help you focus what matters.
          </p>
          <div className="relative mt-8 flex justify-center">
            <CreateResumeButton />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero product visual                                                */
/* ------------------------------------------------------------------ */

const HERO_SIGNALS = [
  { label: "React", top: "8%", left: "4%" },
  { label: "Leadership", top: "18%", left: "80%" },
  { label: "Performance", top: "48%", left: "-6%" },
  { label: "Accessibility", top: "72%", left: "84%" },
  { label: "TypeScript", top: "86%", left: "2%" },
  { label: "Next.js", top: "58%", left: "88%" },
];

function HeroProductVisual() {
  const reduce = useReducedMotion();
  const [scanning, setScanning] = useState(0);
  const detections = [
    "Experience detected",
    "Skills detected",
    "Keywords identified",
    "Role relevance calculated",
  ];

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setScanning((s) => (s + 1) % detections.length), 1900);
    return () => clearInterval(id);
  }, [reduce, detections.length]);

  return (
    <div className="relative mx-auto mt-16 min-h-[720px] w-full max-w-3xl pb-8 sm:min-h-[820px]">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_40%,hsl(var(--primary)/0.12),transparent_70%)] blur-3xl"
      />

      {HERO_SIGNALS.map((s, i) => (
        <motion.div
          key={s.label}
          className={cn(
            monoFont,
            "absolute hidden sm:block rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] tracking-wide text-primary",
          )}
          style={{ top: s.top, left: s.left }}
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 0.85 } : { opacity: [0.35, 0.9, 0.35], y: [0, -8, 0] }}
          transition={{
            duration: 5 + i,
            repeat: reduce ? 0 : Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          {s.label}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto w-[280px] overflow-hidden rounded-[6px] border border-black/5 bg-[#F7F4EC] text-[#211D17] shadow-2xl shadow-black/20 ring-1 ring-black/5 sm:w-[360px] dark:border-white/10 dark:bg-[#211F1B] dark:text-[#F7F4EC] dark:shadow-black/60 dark:ring-white/10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply dark:opacity-[0.025] dark:mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <p className={cn(displayFont, "text-lg sm:text-xl")}>Senior Frontend Engineer</p>
          <p
            className={cn(
              monoFont,
              "mt-1 text-[10px] uppercase tracking-[0.16em] text-[#8B8375] dark:text-[#BEB5A6]",
            )}
          >
            Professional Summary
          </p>
          <div className="mt-2 h-[6px] w-full rounded-full bg-black/10 dark:bg-white/10" />
          <div className="mt-1.5 h-[6px] w-4/5 rounded-full bg-black/10 dark:bg-white/10" />
          <div className="mt-1.5 h-[6px] w-3/5 rounded-full bg-black/10 dark:bg-white/10" />

          <p
            className={cn(
              monoFont,
              "mt-6 text-[10px] uppercase tracking-[0.16em] text-[#8B8375] dark:text-[#BEB5A6]",
            )}
          >
            Experience
          </p>

          <p className="mt-2 text-[13px] font-medium">Frontend Engineer — 2022 — Present</p>
          <ul className="mt-2 space-y-1.5">
            {[
              "Built scalable web applications",
              "Improved frontend performance",
              "Developed React interfaces",
              "Worked with TypeScript",
              "Led migration to Next.js App Router",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-1.5 text-[12px] leading-snug text-black/70 dark:text-white/72"
              >
                <span className="mt-1.5 h-[3px] w-[3px] flex-none rounded-full bg-[#8B8375] dark:bg-[#BEB5A6]" />
                {line}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[13px] font-medium">Frontend Developer — 2020 — 2022</p>
          <ul className="mt-2 space-y-1.5">
            {[
              "Shipped accessible UI components",
              "Partnered with design on visual systems",
              "Reduced bundle size across core routes",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-1.5 text-[12px] leading-snug text-black/70 dark:text-white/72"
              >
                <span className="mt-1.5 h-[3px] w-[3px] flex-none rounded-full bg-[#8B8375] dark:bg-[#BEB5A6]" />
                {line}
              </li>
            ))}
          </ul>

          <p
            className={cn(
              monoFont,
              "mt-6 text-[10px] uppercase tracking-[0.16em] text-[#8B8375] dark:text-[#BEB5A6]",
            )}
          >
            Skills
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {RESUME_SKILLS.map((s) => (
              <span
                key={s}
                className="rounded-full bg-black/6 px-2 py-0.5 text-[10px] text-black/75 dark:bg-white/8 dark:text-white/75"
              >
                {s}
              </span>
            ))}
          </div>

          <p
            className={cn(
              monoFont,
              "mt-6 text-[10px] uppercase tracking-[0.16em] text-[#8B8375] dark:text-[#BEB5A6]",
            )}
          >
            Education
          </p>
          <p className="mt-2 text-[12.5px] font-medium">B.S. Computer Science</p>
          <p className="text-[11.5px] text-black/60 dark:text-white/60">
            University of Washington — 2020
          </p>
        </div>

        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute inset-x-0 h-24 bg-linear-to-b from-transparent via-primary/20 to-transparent"
            animate={{ top: ["-10%", "104%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.div>

      <div className="mt-6 flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={detections[scanning]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className={cn(
              monoFont,
              "flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-[11px] text-primary backdrop-blur-sm",
            )}
          >
            <ScanLine className="h-3.5 w-3.5" />
            {detections[scanning]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Hero                                                            */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-4 sm:pt-28 md:pt-32">
      <GridBackdrop />
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Eyebrow>CVSTACKED · AI Resume Optimizer</Eyebrow>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            displayFont,
            "mt-5 text-[2.6rem] leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl",
          )}
        >
          Tailor your resume to the job you want.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-lg"
        >
          CVSTACKED reads the relationship between your experience and the role you&rsquo;re
          targeting, then helps you bring the right parts forward — clearly, and in the language the
          role actually calls for.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex justify-center"
        >
          <CreateResumeButton />
        </motion.div>
      </div>

      <HeroProductVisual />

      {/* ↓ arrow lives here – bottom of hero */}
      <HeroScrollDown />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Resume ↔ Job matching                                           */
/* ------------------------------------------------------------------ */

function JobMatchSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Resume × Role"
          title="Understand how your experience fits the role."
          sub="CVSTACKED lines up what you've done against what the role asks for — then shows you exactly where the overlap is."
        />

        <div
          ref={ref}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-4"
        >
          <div className="rounded-2xl border border-border bg-card p-6">
            <p
              className={cn(
                monoFont,
                "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
              )}
            >
              Your Resume
            </p>
            <p className={cn(displayFont, "mt-2 text-lg text-foreground")}>Frontend Engineer</p>
            <ul className="mt-4 space-y-2.5">
              {RESUME_EXPERIENCE.slice(0, 4).map((e) => (
                <li
                  key={e.text}
                  className="flex items-start gap-2 text-[13px] text-muted-foreground"
                >
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-primary" />
                  {e.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-row items-center justify-center gap-2 py-4 md:flex-col md:py-0">
            {["React", "TypeScript", "Next.js", "Accessibility", "Leadership"].map((k, i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.35 }}
                className="flex items-center gap-1.5"
              >
                <span className="hidden h-px w-6 bg-border md:block" />
                <span
                  className={cn(
                    monoFont,
                    "whitespace-nowrap rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-700 dark:text-emerald-400",
                  )}
                >
                  <Check className="mr-1 inline h-2.5 w-2.5" />
                  {k}
                </span>
                <span className="hidden h-px w-6 bg-border md:block" />
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p
              className={cn(
                monoFont,
                "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
              )}
            >
              Target Role
            </p>
            <p className={cn(displayFont, "mt-2 text-lg text-foreground")}>
              Senior Frontend Engineer
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {JOB_REQUIREMENTS.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-2 text-center">
          <p className={cn(displayFont, "text-5xl sm:text-6xl")}>
            <AnimatedCounter to={87} trigger={inView} />
          </p>
          <p
            className={cn(monoFont, "text-[11px] uppercase tracking-[0.2em] text-muted-foreground")}
          >
            Job Match
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Keyword intelligence                                            */
/* ------------------------------------------------------------------ */

function KeywordIntelligenceSection() {
  return (
    <section className="relative bg-muted/40 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Keyword Intelligence"
          title="Find the language that matters."
          sub="CVSTACKED surfaces the specific terms this role cares about, and shows how your resume currently measures up against them."
        />
        <div className="mt-12 flex flex-wrap gap-2.5">
          {KEYWORDS.map((k, i) => (
            <KeywordChip key={k.term} label={k.term} state={k.state} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Job requirements extraction                                     */
/* ------------------------------------------------------------------ */

function JobRequirementsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Role Understanding"
          title="CVSTACKED understands the job before tailoring the resume."
        />
        <div ref={ref} className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p
              className={cn(
                monoFont,
                "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
              )}
            >
              Job Description
            </p>
            <p className={cn(displayFont, "mt-2 text-lg text-foreground")}>
              Senior Frontend Engineer
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              &ldquo;We&rsquo;re looking for an experienced frontend engineer to build scalable,
              accessible web applications and help guide our frontend architecture.&rdquo;
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p
              className={cn(
                monoFont,
                "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
              )}
            >
              Extracted Requirements
            </p>
            <div className="mt-3 space-y-2">
              {JOB_REQUIREMENTS.map((r, i) => (
                <motion.div
                  key={r}
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.09, duration: 0.35 }}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <span className="text-[13px] text-foreground">{r}</span>
                  <BadgeCheck className="h-4 w-4 text-primary" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Before / after writing                                          */
/* ------------------------------------------------------------------ */

function BeforeAfterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const before = "Built web applications using React and worked with frontend technologies.";
  const after =
    "Built scalable React applications with TypeScript, focusing on performance, accessibility, and maintainable frontend architecture.";
  const additions = [
    "scalable",
    "TypeScript",
    "performance",
    "accessibility",
    "maintainable",
    "architecture",
  ];

  const renderAfter = () =>
    after.split(/(\s+)/).map((word, i) => {
      const clean = word.replace(/[.,]/g, "");
      const isNew = additions.includes(clean);
      return (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 + i * 0.02, duration: 0.3 }}
          className={cn(isNew && "rounded bg-primary/15 px-0.5 text-primary")}
        >
          {word}
        </motion.span>
      );
    });

  return (
    <section className="relative bg-muted/40 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Stronger Writing"
          title="Turn experience into stronger language."
          align="center"
        />

        <div ref={ref} className="mt-12 space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p
              className={cn(
                monoFont,
                "text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
              )}
            >
              Before
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{before}</p>
          </div>

          <div className="flex justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
              <Wand2 className="h-4 w-4 text-primary" />
            </div>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-card p-6">
            <p className={cn(monoFont, "text-[10px] uppercase tracking-[0.18em] text-primary")}>
              After
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground">{renderAfter()}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Experience relevance                                            */
/* ------------------------------------------------------------------ */

function ExperienceRelevanceSection() {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const tierMeta = {
    high: {
      label: "Highly relevant",
      color: "bg-emerald-500",
      text: "text-emerald-700 dark:text-emerald-400",
      width: "100%",
    },
    mid: {
      label: "Relevant",
      color: "bg-primary",
      text: "text-primary",
      width: "62%",
    },
    low: {
      label: "Less relevant",
      color: "bg-muted-foreground/40",
      text: "text-muted-foreground",
      width: "30%",
    },
  };

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Experience Relevance"
          title="Bring the right experience forward."
          sub="Not every line carries the same weight for a given role. CVSTACKED highlights what matters most for this one."
        />

        <ul ref={ref} className="mt-12 space-y-3">
          {RESUME_EXPERIENCE.map((e, i) => {
            const meta = tierMeta[e.tier];
            return (
              <motion.li
                key={e.text}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[14px] text-foreground">{e.text}</span>
                  <span
                    className={cn(
                      monoFont,
                      "flex-none text-[10px] uppercase tracking-wider",
                      meta.text,
                    )}
                  >
                    {meta.label}
                  </span>
                </div>
                <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: meta.width } : {}}
                    transition={{
                      delay: 0.2 + i * 0.08,
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                    className={cn("h-full rounded-full", meta.color)}
                  />
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. ATS pipeline                                                    */
/* ------------------------------------------------------------------ */

function AtsPipelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const stages = ["Resume", "Structure", "ATS Parser", "Keywords", "Requirements", "Relevance"];
  const checks = [
    "Clear structure",
    "Relevant keywords",
    "Readable formatting",
    "ATS-friendly hierarchy",
  ];

  return (
    <section className="relative bg-muted/40 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="ATS Optimization"
          title="Built to move through the systems that screen resumes."
        />

        <div
          ref={ref}
          className="relative mt-14 flex flex-wrap items-center justify-between gap-y-6"
        >
          <div
            aria-hidden
            className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-border sm:block"
          />
          {stages.map((s, i) => (
            <div
              key={s}
              className="relative z-10 flex min-w-[100px] flex-1 flex-col items-center gap-2 px-1"
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: i * 0.15, duration: 0.35 }}
                className="h-2.5 w-2.5 rounded-full bg-primary"
              />
              <span
                className={cn(
                  monoFont,
                  "text-center text-[10px] uppercase tracking-wide text-muted-foreground",
                )}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {checks.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex items-start gap-2 rounded-xl border border-border bg-card p-3.5"
            >
              <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-emerald-600 dark:text-emerald-400" />
              <span className="text-[13px] text-foreground">{c}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  8. Scroll-driven analysis pipeline                                 */
/* ------------------------------------------------------------------ */

function AiAnalysisPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(PIPELINE_STAGES.length - 1, Math.floor(v * PIPELINE_STAGES.length));
    setActive(idx);
  });

  return (
    <section
      ref={ref}
      className="relative px-6"
      style={{ height: `${PIPELINE_STAGES.length * 62}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center py-16">
        <div className="mx-auto w-full max-w-2xl">
          <SectionHeading
            eyebrow="How CVSTACKED Thinks"
            title="From resume to role-specific focus."
          />
          <div className="mt-12 space-y-1">
            {PIPELINE_STAGES.map((stage, i) => {
              const state = i < active ? "done" : i === active ? "active" : "upcoming";
              return (
                <div key={stage.n} className="flex items-start gap-4 py-3">
                  <span
                    className={cn(
                      monoFont,
                      "mt-0.5 flex-none text-[13px] transition-colors duration-300",
                      state === "upcoming" && "text-border",
                      state === "active" && "text-primary",
                      state === "done" && "text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    {state === "done" ? <Check className="h-3.5 w-3.5" /> : stage.n}
                  </span>
                  <div>
                    <p
                      className={cn(
                        "text-[15px] font-medium transition-colors duration-300 sm:text-base",
                        state === "upcoming"
                          ? "text-muted-foreground opacity-45"
                          : "text-foreground",
                      )}
                    >
                      {stage.label}
                    </p>
                    <AnimatePresence>
                      {state === "active" && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-1 text-[13px] leading-relaxed text-muted-foreground"
                        >
                          {stage.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  9. Product interface showcase                                      */
/* ------------------------------------------------------------------ */

function ProductShowcaseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [step, setStep] = useState<"suggest" | "applied">("suggest");
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setTimeout(() => setStep("applied"), 2200);
    return () => clearTimeout(id);
  }, [inView, reduce]);

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Inside CVSTACKED"
          title="A focused workspace for one resume, one role."
          align="center"
        />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
            <span className={cn(monoFont, "ml-3 text-[11px] text-muted-foreground")}>
              cvstacked.app — resume workspace
            </span>
          </div>

          <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-5">
              <p
                className={cn(
                  monoFont,
                  "text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
                )}
              >
                Resume Preview
              </p>
              <div className="mt-3 rounded-lg bg-[#F7F4EC] p-3 text-[#211D17]">
                <p className="text-[11px] font-semibold">Frontend Engineer</p>
                <div className="mt-2 space-y-1">
                  <div className="h-[4px] w-full rounded-full bg-black/10" />
                  <div className="h-[4px] w-4/5 rounded-full bg-black/10" />
                  <motion.div
                    animate={step === "applied" ? { backgroundColor: "rgba(201,164,99,0.5)" } : {}}
                    className="h-[4px] w-3/5 rounded-full bg-black/10"
                  />
                </div>
              </div>
            </div>

            <div className="p-5">
              <p
                className={cn(
                  monoFont,
                  "text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
                )}
              >
                AI Recommendation
              </p>
              <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                <p className="flex items-start gap-1.5 text-[12px] leading-snug text-foreground">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-none text-primary" />
                  Consider emphasizing your accessibility experience for this role.
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <AnimatePresence mode="wait">
                    {step === "suggest" ? (
                      <motion.span
                        key="suggest"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          monoFont,
                          "text-[10px] uppercase tracking-wider text-muted-foreground",
                        )}
                      >
                        Reviewing…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="applied"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          monoFont,
                          "flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400",
                        )}
                      >
                        <Check className="h-3 w-3" /> Applied · Resume updated
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="p-5">
              <p
                className={cn(
                  monoFont,
                  "text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
                )}
              >
                Job Match
              </p>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground">Job Match</span>
                  <span className={cn(monoFont, "text-[13px] text-primary")}>87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground">Keyword Coverage</span>
                  <span className={cn(monoFont, "text-[13px] text-primary")}>92%</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[12px] text-foreground">Strong relevant experience</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  10. Trust                                                          */
/* ------------------------------------------------------------------ */

function TrustSection() {
  const points = [
    { icon: FileText, text: "Uses your existing experience" },
    { icon: Layers, text: "User-controlled edits" },
    { icon: ShieldCheck, text: "Review before download" },
    { icon: Lock, text: "No fabricated experience" },
  ];

  return (
    <section className="relative bg-muted/40 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading
          eyebrow="Trust"
          title="AI should enhance your experience, not invent your career."
          align="center"
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {points.map((p, i) => (
            <motion.div
              key={p.text}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5"
            >
              <p.icon className="h-5 w-5 text-primary" />
              <span className="text-[12.5px] leading-snug text-foreground">{p.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  11. Feature showcase                                               */
/* ------------------------------------------------------------------ */

function FeatureShowcaseSection() {
  const features = [
    {
      icon: Target,
      title: "Relevant Experience",
      copy: "Bring the strongest parts of your background forward.",
      visual: (
        <div className="space-y-1.5">
          {["Led frontend architecture", "Improved performance", "Maintained tooling"].map(
            (t, i) => (
              <div key={t} className="flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${90 - i * 28}%` }}
                  />
                </div>
                <span className={cn(monoFont, "w-24 flex-none text-[10px] text-muted-foreground")}>
                  {t}
                </span>
              </div>
            ),
          )}
        </div>
      ),
    },
    {
      icon: ListChecks,
      title: "Job-Specific Keywords",
      copy: "Identify the language that matters for the target role.",
      visual: (
        <div className="flex flex-wrap gap-1.5">
          {["React", "Accessibility", "Architecture"].map((k) => (
            <span
              key={k}
              className="rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-700 dark:text-emerald-400"
            >
              {k}
            </span>
          ))}
        </div>
      ),
    },
    {
      icon: Wand2,
      title: "Stronger Writing",
      copy: "Improve clarity, impact, and professional phrasing.",
      visual: (
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground line-through opacity-60">
            worked with frontend technologies
          </p>
          <p className="text-[11px] text-primary">maintainable frontend architecture</p>
        </div>
      ),
    },
    {
      icon: ScanLine,
      title: "ATS-Friendly Structure",
      copy: "Keep information clear and parseable.",
      visual: (
        <div className="flex items-center gap-1.5">
          {["Resume", "Parser", "Structure"].map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className={cn(monoFont, "text-[10px] text-muted-foreground")}>{s}</span>
              {i < 2 && <ArrowRight className="h-3 w-3 text-border" />}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Everything CVSTACKED Checks"
          title="One system, four kinds of attention."
        />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <f.icon className="h-4 w-4 text-primary" />
              <p className={cn(displayFont, "mt-3 text-lg text-foreground")}>{f.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{f.copy}</p>
              <div className="mt-4 border-t border-border pt-4">{f.visual}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  12. How it works                                                   */
/* ------------------------------------------------------------------ */

function HowItWorksSection() {
  const steps = [
    {
      n: "01",
      label: "Create your resume",
      copy: "Start from your existing background.",
    },
    {
      n: "02",
      label: "Choose your target opportunity",
      copy: "Tell CVSTACKED which role you're aiming for.",
    },
    {
      n: "03",
      label: "Let CVSTACKED help focus your resume",
      copy: "Review a version tailored to that role.",
    },
  ];

  return (
    <section className="relative bg-muted/40 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="How It Works"
          title="Three steps. Your experience, focused."
          align="center"
        />
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className="text-center sm:text-left"
            >
              <span className={cn(monoFont, "text-[13px] text-primary")}>{s.n}</span>
              <p className={cn(displayFont, "mt-2 text-lg text-foreground")}>{s.label}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  13. Final CTA                                                      */
/* ------------------------------------------------------------------ */

function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden px-6 py-28 sm:py-36">
      <GridBackdrop />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,hsl(var(--primary)/0.12),transparent_70%)]"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2
          className={cn(
            displayFont,
            "text-3xl leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl",
          )}
        >
          Ready to build a resume that fits the opportunity?
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Create your resume with CVSTACKED and put your experience in the right context for every
          opportunity.
        </p>
        <div className="mt-9 flex justify-center">
          <CreateResumeButton />
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AiResumeOptimizerPage() {
  return (
    <div
      className={cn(
        fraunces.variable,
        inter.variable,
        mono.variable,
        "min-h-screen bg-background text-foreground font-(family-name:--font-body)",
      )}
    >
      {/* Floating ↑ button */}
      <ScrollToTopButton />

      <HeroSection />
      <JobMatchSection />
      <KeywordIntelligenceSection />
      <JobRequirementsSection />
      <BeforeAfterSection />
      <ExperienceRelevanceSection />
      <AtsPipelineSection />
      <AiAnalysisPipeline />
      <ProductShowcaseSection />
      <MidCtaSection />
      <TrustSection />
      <FeatureShowcaseSection />
      <HowItWorksSection />
      <FinalCtaSection />
    </div>
  );
}
