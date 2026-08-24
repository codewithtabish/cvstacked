"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Check,
  ChevronRight,
  Crown,
  Download,
  FileText,
  Infinity as InfinityIcon,
  Layers,
  Palette,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  WandSparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
  FREE_PLAN,
  PRICING_CURRENCY,
  PRICING_INTERVAL,
  PRICING_PLANS,
  PRO_PLAN,
  PRO_PRICE,
  type PricingFeature,
  type PricingPlan,
} from "@/data/pricing";

/* -------------------------------------------------------------------------
 * Visual tokens
 *
 * These are decorative accent values only — layout and surface colors still
 * come from the project's shadcn theme (bg-background, bg-card, border,
 * text-foreground / text-muted-foreground, primary, etc). "signal" is the
 * amber "highlighter" accent used to evoke keyword/ATS matching, the one
 * visual idea this page is allowed to repeat. Use it with restraint.
 * ---------------------------------------------------------------------- */

const SIGNAL = "#F0A83A";
const SIGNAL_SOFT = "rgba(240,168,58,0.16)";
const INK = "#131B2E";

/* -------------------------------------------------------------------------
 * Formatting helpers
 * ---------------------------------------------------------------------- */

function formatPrice(amount: number, currency: string): string {
  return `${currency}${amount}`;
}

/**
 * Renders a plan's limits without ever leaking a raw `null` to the UI.
 * `null` is interpreted as "unlimited" — the only interpretation the
 * existing data model supports — and a finite number is shown as-is,
 * including 0.
 */
function formatLimitValue(value: number | null): string {
  if (value === null) return "Unlimited";
  return String(value);
}

/* -------------------------------------------------------------------------
 * Static copy/icon lookups
 *
 * These map known, fixed shapes from the data model (limit keys, common
 * feature labels) to presentation. They never invent pricing facts — every
 * number, inclusion, or value still comes from PRICING_PLANS. Unknown
 * feature labels fall back to a generic treatment so new plans/features
 * added later render correctly without code changes.
 * ---------------------------------------------------------------------- */

const LIMIT_META: {
  key: keyof PricingPlan["limits"];
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "resumes", label: "Resumes", icon: FileText },
  { key: "templates", label: "Templates", icon: Layers },
  { key: "aiOptimizations", label: "AI optimizations", icon: Brain },
  { key: "exports", label: "Exports", icon: Download },
];

type FeatureCopy = {
  icon: React.ComponentType<{ className?: string }>;
  blurb: string;
};

const FEATURE_COPY: Record<string, FeatureCopy> = {
  "AI resume optimization": {
    icon: Brain,
    blurb:
      "Pro rewrites weak bullet points and phrasing so your experience reads clearly and lands with hiring managers.",
  },
  "ATS keyword analysis": {
    icon: ScanSearch,
    blurb:
      "See which keywords applicant tracking systems look for and where your resume is missing them.",
  },
  "Job description matching": {
    icon: Target,
    blurb:
      "Paste in a job description and tailor your resume to what that specific role is asking for.",
  },
  "Multiple resume versions": {
    icon: Layers,
    blurb:
      "Keep a different version for every role you're targeting, instead of editing one resume over and over.",
  },
  "Resume templates": {
    icon: Palette,
    blurb: "Every template in the library, from minimal to detail-rich.",
  },
  "Advanced customization": {
    icon: WandSparkles,
    blurb: "Fine-tune fonts, color themes, and layout so your resume looks like yours.",
  },
};

const FEATURE_FALLBACK_ICON = Sparkles;

/* -------------------------------------------------------------------------
 * Motion variants
 * ---------------------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardEnter: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

/* -------------------------------------------------------------------------
 * Props
 * ---------------------------------------------------------------------- */

export type PricingPageComponentProps = {
  /** Route used for the primary "create a resume" CTAs. */
  createResumeHref?: string;
  /**
   * Resolves the href for an individual plan's CTA button. Defaults to the
   * app's resume-creation route for every plan, since checkout / auth flows
   * live elsewhere. Override this to point Pro at a checkout route once one
   * exists.
   */
  getPlanHref?: (plan: PricingPlan) => string;
};

export function PricingPageComponent({
  createResumeHref = "/resume/new",
  getPlanHref,
}: PricingPageComponentProps) {
  const resolvePlanHref = getPlanHref ?? (() => createResumeHref);

  return (
    <main className="relative">
      <PricingHero createResumeHref={createResumeHref} />
      <PricingCardsSection resolvePlanHref={resolvePlanHref} />
      <ProBenefits />
      <ProductShowcase />
      <PricingComparison />
      <TrustSection />
      <PricingFAQ />
      <PricingCTA createResumeHref={createResumeHref} />
    </main>
  );
}

/* -------------------------------------------------------------------------
 * 1. Hero
 * ---------------------------------------------------------------------- */

const FLOATING_CHIPS = [
  { label: "ATS Ready", icon: ShieldCheck },
  { label: "AI Optimized", icon: Brain },
  { label: "Professional Template", icon: Palette },
];

function PricingHero({ createResumeHref }: { createResumeHref: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Decorative background: soft ink glow + faint grid, purely visual */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-1/2 top-[-12rem] h-[28rem] w-2xl -translate-x-1/2 rounded-full blur-3xl opacity-[0.16]"
          style={{ background: INK }}
        />
        <div
          className="absolute right-[8%] top-24 h-64 w-64 rounded-full blur-3xl opacity-[0.14]"
          style={{ background: SIGNAL }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-20 text-center sm:pb-28 sm:pt-28">
        <motion.div
          initial={reduceMotion ? undefined : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeUp}>
            <Badge
              variant="outline"
              className="gap-1.5 rounded-full border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: SIGNAL }} />
              Simple pricing. Powerful resumes.
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 max-w-3xl text-balance font-serif text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Build a resume that gets noticed.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Start free and build a professional resume in minutes. Upgrade to Pro when you want
            AI-powered optimization, ATS analysis, and every template — tailored to the job you
            actually want.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="group h-11 px-6 text-sm">
              <Link href={createResumeHref}>
                Create your resume
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-11 px-6 text-sm">
              <a href="#compare">Compare plans</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating marketing chips — visual only, not calculated results */}
        <div className="relative mt-16 hidden w-full max-w-lg items-center justify-center sm:flex">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {FLOATING_CHIPS.map((chip, i) => (
              <motion.div
                key={chip.label}
                initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -6, 0] }}
                transition={
                  reduceMotion
                    ? { duration: 0.5, delay: 0.15 * i, ease: "easeOut" }
                    : {
                        opacity: { duration: 0.5, delay: 0.15 * i, ease: "easeOut" },
                        y: {
                          duration: 3.4 + i * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.6 + i * 0.3,
                        },
                      }
                }
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground shadow-sm"
              >
                <chip.icon className="h-3.5 w-3.5" style={{ color: SIGNAL }} />
                {chip.label}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * 2. Billing indicator
 * ---------------------------------------------------------------------- */

function BillingIndicator() {
  return (
    <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
      <Check className="h-3.5 w-3.5" style={{ color: SIGNAL }} />
      Billed {PRICING_INTERVAL}ly, in {PRICING_CURRENCY}
      {" · "}cancel anytime
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 3. Pricing cards
 * ---------------------------------------------------------------------- */

function PricingFeatureRow({ feature }: { feature: PricingFeature }) {
  const copy = FEATURE_COPY[feature.label];
  const Icon = feature.included ? Check : X;

  return (
    <li className="flex items-start gap-3 py-2 text-sm">
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full",
          feature.included ? "bg-foreground/6 text-foreground" : "text-muted-foreground/50",
        )}
        style={feature.included ? { color: SIGNAL, backgroundColor: SIGNAL_SOFT } : undefined}
        aria-hidden="true"
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span
        className={cn(
          "flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5",
          feature.included ? "text-foreground" : "text-muted-foreground/70",
        )}
      >
        <span>{feature.label}</span>
        {feature.value && (
          <span className="text-xs font-medium text-muted-foreground">{feature.value}</span>
        )}
      </span>
      <span className="sr-only">
        {copy ? copy.blurb : feature.included ? "Included" : "Not included"}
      </span>
    </li>
  );
}

function PricingLimits({ limits }: { limits: PricingPlan["limits"] }) {
  return (
    <dl className="grid grid-cols-2 gap-3">
      {LIMIT_META.map(({ key, label, icon: Icon }) => {
        const value = limits[key];
        const isUnlimited = value === null;
        return (
          <div
            key={key}
            className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2"
          >
            {isUnlimited ? (
              <InfinityIcon className="h-3.5 w-3.5 flex-none text-muted-foreground" />
            ) : (
              <Icon className="h-3.5 w-3.5 flex-none text-muted-foreground" />
            )}
            <div className="flex min-w-0 flex-col">
              <dt className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
                {label}
              </dt>
              <dd className="text-xs font-semibold text-foreground">{formatLimitValue(value)}</dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}

function PricingCard({ plan, href }: { plan: PricingPlan; href: string }) {
  const isPopular = Boolean(plan.popular);

  return (
    <motion.div variants={cardEnter} className="relative h-full">
      {isPopular && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[1.4rem] opacity-70 blur-sm motion-safe:animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${SIGNAL}, transparent 55%)`,
          }}
          aria-hidden="true"
        />
      )}
      <Card
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[1.4rem] p-7 sm:p-8",
          isPopular
            ? "border-transparent bg-card shadow-xl shadow-black/6 ring-1 ring-(--pricing-ring) sm:scale-[1.03]"
            : "border border-border bg-card/60",
        )}
        style={isPopular ? ({ "--pricing-ring": SIGNAL } as React.CSSProperties) : undefined}
      >
        {isPopular && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-[0.10]"
            style={{
              background: `radial-gradient(60% 100% at 50% 0%, ${SIGNAL}, transparent)`,
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            {isPopular && <Crown className="h-4 w-4" style={{ color: SIGNAL }} />}
            {plan.name}
          </h3>
          {isPopular && (
            <Badge
              className="rounded-full border-none px-2.5 py-1 text-[11px] font-semibold text-white"
              style={{ backgroundColor: SIGNAL }}
            >
              Most popular
            </Badge>
          )}
        </div>

        <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
          {plan.description}
        </p>

        <div className="relative mt-6 flex items-end gap-1.5">
          <span className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {formatPrice(plan.monthlyPrice, plan.currency)}
          </span>
          <span className="pb-1 text-sm text-muted-foreground">/ {plan.period}</span>
        </div>

        <Button
          asChild
          size="lg"
          className={cn(
            "relative mt-7 h-11 w-full text-sm font-medium",
            !isPopular && "bg-foreground/6 text-foreground hover:bg-foreground/10",
          )}
          variant={isPopular ? "default" : "outline"}
          style={
            isPopular
              ? { backgroundColor: SIGNAL, color: INK, borderColor: "transparent" }
              : undefined
          }
        >
          <Link href={href}>{plan.cta}</Link>
        </Button>

        <Separator className="relative my-7" />

        <ul className="relative flex-1 divide-y divide-border/60">
          {plan.features.map((feature) => (
            <PricingFeatureRow key={feature.label} feature={feature} />
          ))}
        </ul>

        <Separator className="relative my-7" />

        <div className="relative">
          <PricingLimits limits={plan.limits} />
        </div>
      </Card>
    </motion.div>
  );
}

function PricingCardsSection({
  resolvePlanHref,
}: {
  resolvePlanHref: (plan: PricingPlan) => string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <BillingIndicator />
        </div>

        <motion.div
          initial={reduceMotion ? undefined : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 sm:items-start"
        >
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} href={resolvePlanHref(plan)} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * 4. Why Pro
 * ---------------------------------------------------------------------- */

function ProBenefits() {
  const reduceMotion = useReducedMotion();

  const benefits = PRO_PLAN.features
    .filter((feature) => feature.included)
    .map((feature) => ({
      feature,
      copy: FEATURE_COPY[feature.label],
    }));

  return (
    <section className="border-t border-border bg-muted/30 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Why {PRO_PLAN.name}
          </span>
          <h2 className="mt-3 text-balance font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Everything Free gets you started with — Pro helps you win the interview.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {PRO_PLAN.name} is {formatPrice(PRO_PRICE, PRICING_CURRENCY)}/{PRICING_INTERVAL} —
            cancel anytime.
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map(({ feature, copy }) => {
            const Icon = copy?.icon ?? FEATURE_FALLBACK_ICON;
            return (
              <motion.div
                key={feature.label}
                variants={fadeUp}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: SIGNAL_SOFT, color: SIGNAL }}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">{feature.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {copy?.blurb ?? feature.value ?? "Included with the Pro plan."}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * 5. Product showcase
 * ---------------------------------------------------------------------- */

const SHOWCASE_CHIPS = [
  { label: "ATS Optimized", icon: ShieldCheck, className: "left-[-6%] top-[10%]" },
  { label: "AI Suggestions", icon: Brain, className: "right-[-8%] top-[6%]" },
  { label: "Keyword Match", icon: ScanSearch, className: "left-[-4%] bottom-[18%]" },
  { label: "Ready to Export", icon: Download, className: "right-[-6%] bottom-[8%]" },
];

function ProductShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          background: `radial-gradient(50% 60% at 50% 40%, ${INK}, transparent)`,
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20, scale: 0.97 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          animate={
            reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: [0, -8, 0], scale: 1 }
          }
          transition={
            reduceMotion
              ? { duration: 0.7, ease: "easeOut" }
              : {
                  opacity: { duration: 0.7, ease: "easeOut" },
                  scale: { duration: 0.7, ease: "easeOut" },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                }
          }
          className="relative z-10 w-full rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-black/8"
        >
          {/* Fictional resume preview — visual only */}
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Resume — Product Designer</span>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: SIGNAL_SOFT, color: SIGNAL }}
            >
              98% match
            </span>
          </div>
          <div className="mt-4 space-y-2.5">
            <div className="h-2.5 w-3/4 rounded-full bg-foreground/10" />
            <div className="h-2 w-full rounded-full bg-foreground/6" />
            <div className="h-2 w-5/6 rounded-full bg-foreground/6" />
            <div className="h-2 w-2/3 rounded-full bg-foreground/6" />
          </div>
          <div className="mt-5 space-y-2.5">
            <div className="h-2.5 w-1/2 rounded-full bg-foreground/10" />
            <div className="h-2 w-full rounded-full bg-foreground/6" />
            <div className="h-2 w-4/5 rounded-full bg-foreground/6" />
          </div>
        </motion.div>

        {SHOWCASE_CHIPS.map((chip, i) => (
          <motion.div
            key={chip.label}
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            animate={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: 1, y: [0, i % 2 === 0 ? -7 : 7, 0] }
            }
            transition={
              reduceMotion
                ? { duration: 0.5, delay: 0.2 + i * 0.12, ease: "easeOut" }
                : {
                    opacity: { duration: 0.5, delay: 0.2 + i * 0.12, ease: "easeOut" },
                    scale: { duration: 0.5, delay: 0.2 + i * 0.12, ease: "easeOut" },
                    y: {
                      duration: 4 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4 + i * 0.3,
                    },
                  }
            }
            className={cn(
              "absolute z-20 hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground shadow-md sm:flex",
              chip.className,
            )}
          >
            <chip.icon className="h-3 w-3" style={{ color: SIGNAL }} />
            {chip.label}
          </motion.div>
        ))}
      </div>

      <p className="relative z-10 mx-auto mt-10 max-w-sm text-center text-xs text-muted-foreground">
        Illustrative preview. Match scores and suggestions shown are for demonstration only.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * 6. Feature comparison
 * ---------------------------------------------------------------------- */

function getFeature(plan: PricingPlan, label: string): PricingFeature | undefined {
  return plan.features.find((f) => f.label === label);
}

function ComparisonCell({ feature }: { feature: PricingFeature | undefined }) {
  if (!feature || !feature.included) {
    return (
      <span className="flex items-center justify-center text-muted-foreground/40">
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  if (feature.value) {
    return <span className="text-xs font-medium text-foreground">{feature.value}</span>;
  }
  return (
    <span className="flex items-center justify-center" style={{ color: SIGNAL }}>
      <Check className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">Included</span>
    </span>
  );
}

function PricingComparison() {
  const reduceMotion = useReducedMotion();

  // Union of every feature label across every plan, so a newly added plan
  // or feature is picked up automatically — nothing here is hardcoded.
  const featureLabels = React.useMemo(() => {
    const seen = new Set<string>();
    const labels: string[] = [];
    for (const plan of PRICING_PLANS) {
      for (const feature of plan.features) {
        if (!seen.has(feature.label)) {
          seen.add(feature.label);
          labels.push(feature.label);
        }
      }
    }
    return labels;
  }, []);

  return (
    <section id="compare" className="scroll-mt-20 border-t border-border px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-lg text-center"
        >
          <h2 className="text-balance font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Everything you need to build a better resume
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            A closer look at what&apos;s included in each plan.
          </p>
        </motion.div>

        {/* Desktop: full comparison table */}
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-12 hidden overflow-hidden rounded-2xl border border-border sm:block"
        >
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Feature comparison between plans</caption>
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th scope="col" className="px-5 py-4 text-left font-medium text-muted-foreground">
                  Feature
                </th>
                {PRICING_PLANS.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className="px-5 py-4 text-center font-semibold text-foreground"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {plan.popular && <Crown className="h-3.5 w-3.5" style={{ color: SIGNAL }} />}
                      {plan.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureLabels.map((label, i) => (
                <tr
                  key={label}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    i % 2 === 1 && "bg-muted/20",
                  )}
                >
                  <th scope="row" className="px-5 py-3.5 text-left font-normal text-foreground">
                    {label}
                  </th>
                  {PRICING_PLANS.map((plan) => (
                    <td key={plan.id} className="px-5 py-3.5 text-center">
                      <ComparisonCell feature={getFeature(plan, label)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile: horizontally scrollable per-plan cards */}
        <div className="mt-10 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:hidden">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="w-[80%] flex-none snap-start rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                {plan.popular && <Crown className="h-3.5 w-3.5" style={{ color: SIGNAL }} />}
                {plan.name}
              </div>
              <ul className="mt-3 divide-y divide-border/60">
                {featureLabels.map((label) => {
                  const feature = getFeature(plan, label);
                  return (
                    <li
                      key={label}
                      className="flex items-center justify-between gap-3 py-2.5 text-xs"
                    >
                      <span className="text-muted-foreground">{label}</span>
                      <ComparisonCell feature={feature} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * 7. Trust section
 * ---------------------------------------------------------------------- */

function TrustSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-border bg-muted/30 px-6 py-16 sm:py-20">
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center"
      >
        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
        <p className="text-balance font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          Start free. Upgrade when you need more.
        </p>
        <p className="text-sm text-muted-foreground">Your resume should work as hard as you do.</p>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * 8. FAQ
 * ---------------------------------------------------------------------- */

function buildFaqItems(): { question: string; answer: string }[] {
  const freeResumeLimit = FREE_PLAN.limits.resumes;
  const proAiFeature = getFeature(PRO_PLAN, "AI resume optimization");
  const proAtsFeature = getFeature(PRO_PLAN, "ATS keyword analysis");
  const proTemplatesFeature = getFeature(PRO_PLAN, "Resume templates");
  const freeTemplatesFeature = getFeature(FREE_PLAN, "Resume templates");
  const freeExportFeature = getFeature(FREE_PLAN, "PDF export");

  return [
    {
      question: "Is the Free plan actually free?",
      answer: `Yes. The ${FREE_PLAN.name} plan is ${formatPrice(
        FREE_PLAN.monthlyPrice,
        FREE_PLAN.currency,
      )} with no time limit and no card required. It includes ${
        freeTemplatesFeature?.value ?? "a set of templates"
      } and enough to build a genuinely professional resume.`,
    },
    {
      question: "Can I export my resume as a PDF?",
      answer: freeExportFeature?.included
        ? "Yes, PDF export is included on every plan, including Free."
        : "PDF export is available on select plans — check the comparison table above for details.",
    },
    {
      question: `Can I upgrade to ${PRO_PLAN.name} later?`,
      answer: `Yes. You can start on ${FREE_PLAN.name} and upgrade to ${
        PRO_PLAN.name
      } whenever you need it — your existing resumes carry over.`,
    },
    {
      question: `What do I get with ${PRO_PLAN.name}?`,
      answer: `${PRO_PLAN.description} That's on top of everything included in ${FREE_PLAN.name}.`,
    },
    {
      question: `Are ${PRO_PLAN.name} templates included?`,
      answer: proTemplatesFeature?.value
        ? `Yes — ${PRO_PLAN.name} includes ${proTemplatesFeature.value.toLowerCase()}, versus ${
            freeTemplatesFeature?.value ?? "a limited set"
          } on ${FREE_PLAN.name}.`
        : `Yes, template access is expanded on ${PRO_PLAN.name}.`,
    },
    {
      question: "Can I create multiple resumes?",
      answer:
        freeResumeLimit === null
          ? `Yes, resume versions are unlimited on every plan.`
          : `${FREE_PLAN.name} includes up to ${freeResumeLimit} resume${
              freeResumeLimit === 1 ? "" : "s"
            }. ${PRO_PLAN.name} removes that limit, so you can keep a tailored version for every role.`,
    },
    {
      question: `Does ${PRO_PLAN.name} include AI optimization?`,
      answer:
        proAiFeature?.included && proAtsFeature?.included
          ? `Yes. ${PRO_PLAN.name} includes AI-powered resume optimization and ATS keyword analysis, so you can see how your resume reads and where it can be stronger.`
          : `AI features are outlined in the comparison table above.`,
    },
    {
      question: "Is billing monthly?",
      answer: `Yes, billing runs ${PRICING_INTERVAL}ly in ${PRICING_CURRENCY} and you can cancel anytime.`,
    },
  ];
}

function PricingFAQ() {
  const reduceMotion = useReducedMotion();
  const faqItems = React.useMemo(() => buildFaqItems(), []);

  return (
    <section className="border-t border-border px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-balance font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Questions, answered
          </h2>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-10"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, i) => (
              <AccordionItem key={item.question} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium text-foreground">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * 9. Final CTA
 * ---------------------------------------------------------------------- */

function PricingCTA({ createResumeHref }: { createResumeHref: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-border px-6 py-24 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          background: `radial-gradient(45% 65% at 50% 100%, ${SIGNAL}, transparent)`,
        }}
        aria-hidden="true"
      />
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto flex max-w-lg flex-col items-center text-center"
      >
        <h2 className="text-balance font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          Ready to build your next resume?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Start free and create a professional resume in minutes.
        </p>
        <motion.div whileHover={reduceMotion ? undefined : { y: -2 }} className="mt-8">
          <Button asChild size="lg" className="group h-12 px-7 text-sm">
            <Link href={createResumeHref}>
              Create resume
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
