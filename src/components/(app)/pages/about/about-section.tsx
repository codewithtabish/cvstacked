"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ExternalLink,
  GitBranchPlus,
  Globe,
  Share2,
  SortAscIcon,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const displayFont = "font-serif";
const monoFont = "font-mono";

/* ------------------------------------------------------------------ */
/*  Founder social links                                               */
/* ------------------------------------------------------------------ */

const FOUNDER_SOCIALS = [
  {
    label: "Website",
    href: "http://codewithtabish.com/",
    icon: Globe,
  },
  {
    label: "GitHub",
    href: "https://github.com/codewithtabish",
    icon: GitBranchPlus,
  },
  {
    label: "X",
    href: "https://x.com/codewithtabish",
    icon: X,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/codewithtabish",
    icon: SortAscIcon,
  },
] as const;

function SocialIconLink({
  href,
  label,
  icon: Icon,
  className,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "group inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200",
        "hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Icon className="size-4 transition-transform duration-200 group-hover:scale-110" />
    </a>
  );
}

function FounderSocials() {
  return (
    <>
      {/* Desktop / tablet — horizontal row */}
      <div className="mt-8 hidden flex-wrap items-center gap-2.5 sm:flex">
        {FOUNDER_SOCIALS.map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <SocialIconLink href={s.href} label={s.label} icon={s.icon} />
          </motion.div>
        ))}
        <span
          className={cn(
            monoFont,
            "ml-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
          )}
        >
          Connect
        </span>
      </div>

      {/* Mobile — single trigger + popover */}
      <div className="mt-8 sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 rounded-full px-4"
              aria-label="Open social links"
            >
              <Share2 className="size-4" />
              Connect
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" sideOffset={8} className="w-64 p-0">
            <div className="border-b border-border px-4 py-3">
              <p
                className={cn(
                  monoFont,
                  "text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
                )}
              >
                Connect with Talha
              </p>
            </div>
            <ul className="p-2">
              {FOUNDER_SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                      <s.icon className="size-3.5" />
                    </span>
                    <span className="flex-1 font-medium">{s.label}</span>
                    <ExternalLink className="size-3.5 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared primitives                                                  */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        monoFont,
        "inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary",
      )}
    >
      <span className="size-1 rounded-full bg-primary" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          displayFont,
          "mt-4 text-3xl leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-5xl",
        )}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function CreateResumeCTA() {
  return (
    <Button asChild size="lg" className="group h-11 rounded-full px-6">
      <Link href="/app">
        Create your resume{" "}
        <ArrowRight
          data-icon="inline-end"
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/*  Sections (unchanged structure)                                     */
/* ------------------------------------------------------------------ */

function AboutHero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden px-6 pt-20 pb-20 sm:pt-28 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 bg-[linear-gradient(to_right,hsl(var(--border)/.65)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.65)_1px,transparent_1px)] bg-size-[52px_52px] mask-[radial-gradient(ellipse_72%_62%_at_50%_0%,black,transparent)]"
      />
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { x: [0, 14, 0], y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-0 left-[15%] -z-10 size-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Eyebrow>About CVStacked</Eyebrow>
        </motion.div>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06 }}
          className={cn(
            displayFont,
            "mx-auto mt-5 max-w-4xl text-balance text-4xl leading-[1.06] tracking-tight text-foreground sm:text-6xl",
          )}
        >
          Better tools for people building their careers.
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
        >
          CVStacked helps people create clear, professional resumes—so their experience can take the
          lead.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <CreateResumeCTA />
          <Button asChild variant="outline" size="lg" className="h-11 rounded-full px-6">
            <Link href="/templates">Explore templates</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  const reduce = useReducedMotion();
  return (
    <section className="border-y border-border bg-muted/25 px-6 py-20 sm:py-28">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center"
      >
        <SectionHeading
          eyebrow="What CVStacked is"
          title="A better place to start your professional story."
        />
        <div className="space-y-5 text-[15px] leading-7 text-muted-foreground">
          <p>
            Creating a resume should not mean wrestling with outdated templates, inconsistent
            formatting, or a tool that gets in the way. CVStacked gives you a more considered
            foundation for presenting your work.
          </p>
          <p>
            Choose a thoughtful template, make the design your own, build versions for different
            opportunities, export with confidence, and use practical AI assistance when you need it.
          </p>
          <div className="grid gap-2 pt-2 sm:grid-cols-2">
            {[
              "Professional templates",
              "Design control",
              "Resume versions",
              "PDF export",
              "AI optimization",
              "Job-focused guidance",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="size-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function VisionSection() {
  const reduce = useReducedMotion();
  return (
    <section className="px-6 py-20 sm:py-28">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl text-center"
      >
        <Eyebrow>Our vision</Eyebrow>
        <h2
          className={cn(
            displayFont,
            "mt-4 text-balance text-3xl leading-tight tracking-tight text-foreground sm:text-5xl",
          )}
        >
          Career tools should be intelligent, personal, and genuinely pleasant to use.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
          The future is not just another document editor. It is a calmer, more useful way for people
          to communicate their skills, experience, and potential.
        </p>
      </motion.div>
    </section>
  );
}

function MissionSection() {
  const reduce = useReducedMotion();
  return (
    <section className="px-6 py-8 sm:py-12">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border bg-card px-6 py-14 sm:px-12 sm:py-20"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_55%_90%_at_100%_0%,hsl(var(--primary)/.12),transparent_70%)]"
        />
        <div className="relative max-w-3xl">
          <Eyebrow>Our mission</Eyebrow>
          <h2
            className={cn(
              displayFont,
              "mt-4 text-3xl leading-tight tracking-tight text-foreground sm:text-5xl",
            )}
          >
            Make professional career presentation more accessible, thoughtful, and effective.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
            We build with simplicity, strong design, and useful technology so job seekers can spend
            less energy on formatting—and more on the experience they have earned.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Founder — enhanced with socials                                    */
/* ------------------------------------------------------------------ */

function FounderSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_42%_65%_at_18%_52%,hsl(var(--primary)/.11),transparent_72%)]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-center">
        {/* Portrait */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.55 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div
            aria-hidden
            className="absolute inset-4 rounded-[2rem] border border-primary/20 bg-primary/5"
          />
          <div
            aria-hidden
            className="absolute inset-x-10 top-12 h-72 rounded-full bg-primary/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-35 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] bg-size-[18px_18px] mask-[radial-gradient(ellipse_at_center,black,transparent_72%)]"
          />
          <motion.div
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-4/5 overflow-hidden rounded-[2rem] border border-border/70 bg-card/60"
          >
            <Image
              src="/images/real/tabishtwo.png"
              alt="Talha Tabish, Founder and CEO of CodeWithTabish"
              fill
              sizes="(min-width: 1024px) 42vw, 90vw"
              className="object-contain object-bottom p-4 sm:p-6"
              priority
            />
          </motion.div>
          <span
            className={cn(
              monoFont,
              "absolute right-3 bottom-5 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[10px] uppercase tracking-[.16em] text-muted-foreground shadow-sm backdrop-blur",
            )}
          >
            Build · Ship · Improve
          </span>
        </motion.div>

        {/* Story + socials */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <Eyebrow>Founder story</Eyebrow>
          <h2
            className={cn(displayFont, "mt-4 text-3xl tracking-tight text-foreground sm:text-5xl")}
          >
            Talha Tabish
          </h2>
          <p className={cn(monoFont, "mt-3 text-[11px] uppercase tracking-[.18em] text-primary")}>
            Founder & CEO, CodeWithTabish
          </p>

          <div className="mt-7 max-w-xl space-y-4 text-[15px] leading-7 text-muted-foreground">
            <p>
              Talha is an independent software builder and the person behind CodeWithTabish. He
              designs, builds, and ships products end to end—turning ideas into software people can
              actually use.
            </p>
            <p>
              Through CodeWithTabish he experiments across web applications, mobile apps, SaaS
              products, AI-powered tools, developer tools, browser extensions, automation systems,
              productivity products, and other digital platforms.
            </p>
            <p>
              CVStacked is one of those products: a career-focused resume builder with its own
              roadmap, templates, pricing, and product vision—built to help people present their
              experience with clarity.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Think", "Design", "Build", "Ship", "Improve"].map((step) => (
              <span
                key={step}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
              >
                {step}
              </span>
            ))}
          </div>

          {/* Social presence */}
          <FounderSocials />
        </motion.div>
      </div>
    </section>
  );
}

function WhySection() {
  const reduce = useReducedMotion();
  const points = [
    ["Clarity over complexity", "Powerful tools should remain understandable."],
    ["Design with purpose", "Typography and layout should help your experience read well."],
    ["Useful AI", "Assistance should strengthen your voice—not replace it."],
    ["Professional by default", "Start with a stronger foundation, not a broken template."],
  ];
  return (
    <section className="border-y border-border bg-muted/25 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Why CVStacked" title="Why build another resume builder?">
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Because too many people still have to fight the tool instead of focusing on their story.
          </p>
        </SectionHeading>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {points.map(([title, copy], index) => (
            <motion.div
              key={title}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="bg-card p-6"
            >
              <span className={cn(monoFont, "text-xs text-primary")}>0{index + 1}</span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  const reduce = useReducedMotion();
  return (
    <section className="px-6 py-20 sm:py-28">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl text-center"
      >
        <Eyebrow>Roadmap mindset</Eyebrow>
        <h2 className={cn(displayFont, "mt-4 text-3xl tracking-tight text-foreground sm:text-4xl")}>
          We&apos;re just getting started.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          New templates, deeper customization, stronger AI assistance, and more career-focused tools
          will keep evolving with the product. No inflated promises—just steady, useful progress.
        </p>
      </motion.div>
    </section>
  );
}

function FinalCTA() {
  const reduce = useReducedMotion();
  return (
    <section className="px-6 pt-8 pb-24 sm:pb-32">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 sm:py-20"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] bg-size-[20px_20px]"
        />
        <div className="relative mx-auto max-w-2xl">
          <Sparkles className="mx-auto size-5" />
          <h2 className={cn(displayFont, "mt-5 text-3xl tracking-tight sm:text-5xl")}>
            Your next opportunity deserves a better resume.
          </h2>
          <p className="mt-5 text-base leading-7 text-primary-foreground/80">
            Build a professional resume with CVStacked and put your experience in the best possible
            light.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-full bg-background px-6 text-foreground hover:bg-background/85"
            >
              <Link href="/app">
                Create my resume <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-full border-primary-foreground/30 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/templates">Explore templates</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function AboutPageSection() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AboutHero />
      <AboutSection />
      <VisionSection />
      <MissionSection />
      <FounderSection />
      <WhySection />
      <RoadmapSection />
      <FinalCTA />
    </div>
  );
}
