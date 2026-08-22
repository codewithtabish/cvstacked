"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ResumeData } from "@/data/resume";

// ---------------------------------------------------------
// Weak → Strong content
// ---------------------------------------------------------

const WEAK = {
  summary:
    "I am a software engineer with experience in building things and working with teams.",

  experience: "Worked on various projects and helped the team.",

  project: "Built a web application using some technologies.",

  education: "Bachelor Degree – Some University",

  skills: ["JavaScript", "HTML", "CSS", "React"],
};

const STRONG = {
  summary:
    "Senior Software Engineer with 8+ years designing scalable web platforms and distributed systems used by millions of users.",

  experience:
    "Led architecture of a high-traffic SaaS platform serving 2.4M+ monthly users and reduced API latency by 42%.",

  project:
    "Real-time analytics platform processing 100M+ events/month with 60% lower query latency.",

  education: "B.S. in Computer Science – UC Berkeley · 3.8/4.0",

  skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "AWS"],
};

// ---------------------------------------------------------
// Phase type
// ---------------------------------------------------------

type DemoPhase =
  | "idle"
  | "scan-summary"
  | "detect-summary"
  | "fix-summary"
  | "scan-experience"
  | "detect-experience"
  | "fix-experience"
  | "scan-projects"
  | "detect-projects"
  | "fix-projects"
  | "scan-education"
  | "detect-education"
  | "fix-education"
  | "scan-skills"
  | "detect-skills"
  | "fix-skills"
  | "done";

// ---------------------------------------------------------
// Live AI Demo
// ---------------------------------------------------------

function AILiveDemo({ resume }: { resume: ResumeData }) {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Start asynchronously.
    // This avoids calling setState synchronously inside the effect.
    timers.push(
      setTimeout(() => {
        setPhase("scan-summary");
      }, 100),
    );

    // -------------------------------------------------------
    // Summary
    // -------------------------------------------------------

    timers.push(
      setTimeout(() => {
        setPhase("detect-summary");
      }, 1400),
    );

    timers.push(
      setTimeout(() => {
        setPhase("fix-summary");
      }, 2300),
    );

    // -------------------------------------------------------
    // Experience
    // -------------------------------------------------------

    timers.push(
      setTimeout(() => {
        setPhase("scan-experience");
      }, 2800),
    );

    timers.push(
      setTimeout(() => {
        setPhase("detect-experience");
      }, 3700),
    );

    timers.push(
      setTimeout(() => {
        setPhase("fix-experience");
      }, 4600),
    );

    // -------------------------------------------------------
    // Projects
    // -------------------------------------------------------

    timers.push(
      setTimeout(() => {
        setPhase("scan-projects");
      }, 5100),
    );

    timers.push(
      setTimeout(() => {
        setPhase("detect-projects");
      }, 6000),
    );

    timers.push(
      setTimeout(() => {
        setPhase("fix-projects");
      }, 6900),
    );

    // -------------------------------------------------------
    // Education
    // -------------------------------------------------------

    timers.push(
      setTimeout(() => {
        setPhase("scan-education");
      }, 7400),
    );

    timers.push(
      setTimeout(() => {
        setPhase("detect-education");
      }, 8200),
    );

    timers.push(
      setTimeout(() => {
        setPhase("fix-education");
      }, 9000),
    );

    // -------------------------------------------------------
    // Skills
    // -------------------------------------------------------

    timers.push(
      setTimeout(() => {
        setPhase("scan-skills");
      }, 9500),
    );

    timers.push(
      setTimeout(() => {
        setPhase("detect-skills");
      }, 10300),
    );

    timers.push(
      setTimeout(() => {
        setPhase("fix-skills");
      }, 11100),
    );

    // -------------------------------------------------------
    // Complete
    // -------------------------------------------------------

    timers.push(
      setTimeout(() => {
        setPhase("done");
      }, 11800),
    );

    // -------------------------------------------------------
    // Restart
    // -------------------------------------------------------

    timers.push(
      setTimeout(() => {
        setCycle((currentCycle) => currentCycle + 1);
      }, 13500),
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [cycle]);

  const isScanning = phase.startsWith("scan-") || phase.startsWith("detect-");

  const summaryFixed = !["idle", "scan-summary", "detect-summary"].includes(
    phase,
  );

  const experienceFixed = ![
    "idle",
    "scan-summary",
    "detect-summary",
    "fix-summary",
    "scan-experience",
    "detect-experience",
  ].includes(phase);

  const projectsFixed = ![
    "idle",
    "scan-summary",
    "detect-summary",
    "fix-summary",
    "scan-experience",
    "detect-experience",
    "fix-experience",
    "scan-projects",
    "detect-projects",
  ].includes(phase);

  const educationFixed = ![
    "idle",
    "scan-summary",
    "detect-summary",
    "fix-summary",
    "scan-experience",
    "detect-experience",
    "fix-experience",
    "scan-projects",
    "detect-projects",
    "fix-projects",
    "scan-education",
    "detect-education",
  ].includes(phase);

  const skillsFixed = phase === "fix-skills" || phase === "done";

  const showSummaryDetect = phase === "detect-summary";
  const showExperienceDetect = phase === "detect-experience";
  const showProjectsDetect = phase === "detect-projects";
  const showEducationDetect = phase === "detect-education";
  const showSkillsDetect = phase === "detect-skills";

  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <div className="pointer-events-none absolute -inset-10 rounded-[2rem] bg-primary/10 blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
      >
        {/* Top bar */}

        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>

            <span className="text-[13px] font-medium">AI Resume Engine</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-[11px] text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Scrollable content */}

        <div
          className="relative max-h-[480px] overflow-y-auto p-5"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* PROFILE */}

          <DemoSection
            title="Profile"
            fixed={summaryFixed}
            detecting={showSummaryDetect}
            detectLabel="Weak phrasing"
          >
            <AnimatePresence mode="wait">
              {!summaryFixed ? (
                <motion.p
                  key="weak-sum"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[12.5px] leading-relaxed text-muted-foreground"
                >
                  {WEAK.summary}
                </motion.p>
              ) : (
                <motion.p
                  key="strong-sum"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12.5px] leading-relaxed text-foreground"
                >
                  {STRONG.summary}
                </motion.p>
              )}
            </AnimatePresence>
          </DemoSection>

          {/* EXPERIENCE */}

          <DemoSection
            title="Experience"
            fixed={experienceFixed}
            detecting={showExperienceDetect}
            detectLabel="Low-impact bullet"
          >
            <p className="text-[13px] font-semibold">
              {resume.experience[0]?.position || "Senior Software Engineer"}
            </p>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {resume.experience[0]?.company || "Northstar Technologies"}
            </p>

            <AnimatePresence mode="wait">
              {!experienceFixed ? (
                <motion.p
                  key="weak-exp"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-[12px] leading-relaxed text-muted-foreground"
                >
                  • {WEAK.experience}
                </motion.p>
              ) : (
                <motion.p
                  key="strong-exp"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-[12px] leading-relaxed text-foreground"
                >
                  • {STRONG.experience}
                </motion.p>
              )}
            </AnimatePresence>
          </DemoSection>

          {/* PROJECTS */}

          <DemoSection
            title="Projects"
            fixed={projectsFixed}
            detecting={showProjectsDetect}
            detectLabel="Vague description"
          >
            <p className="text-[13px] font-semibold">
              {resume.projects[0]?.name || "Atlas Analytics Platform"}
            </p>

            <AnimatePresence mode="wait">
              {!projectsFixed ? (
                <motion.p
                  key="weak-proj"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground"
                >
                  {WEAK.project}
                </motion.p>
              ) : (
                <motion.p
                  key="strong-proj"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-[12px] leading-relaxed text-foreground"
                >
                  {STRONG.project}
                </motion.p>
              )}
            </AnimatePresence>
          </DemoSection>

          {/* EDUCATION */}

          <DemoSection
            title="Education"
            fixed={educationFixed}
            detecting={showEducationDetect}
            detectLabel="Missing details"
          >
            <AnimatePresence mode="wait">
              {!educationFixed ? (
                <motion.p
                  key="weak-edu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[12.5px] text-muted-foreground"
                >
                  {WEAK.education}
                </motion.p>
              ) : (
                <motion.p
                  key="strong-edu"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1 }}
                  className="text-[12.5px] text-foreground"
                >
                  {STRONG.education}
                </motion.p>
              )}
            </AnimatePresence>
          </DemoSection>

          {/* SKILLS */}

          <DemoSection
            title="Skills"
            fixed={skillsFixed}
            detecting={showSkillsDetect}
            detectLabel="Generic skills"
          >
            <AnimatePresence mode="wait">
              {!skillsFixed ? (
                <motion.div
                  key="weak-skills"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-1.5"
                >
                  {WEAK.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="strong-skills"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-1.5"
                >
                  {STRONG.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </DemoSection>
        </div>

        {/* Scanning line */}

        <AnimatePresence>
          {isScanning && (
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-12 bottom-12 z-20 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-primary to-transparent"
                animate={{
                  top: ["0%", "100%"],
                }}
                transition={{
                  duration: 2.2,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status bar */}

        <div className="border-t border-border px-4 py-2.5">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />

            {phase === "idle" && "Ready to analyze…"}

            {phase.includes("scan") && "Scanning sections…"}

            {phase.includes("detect") && "Weak language detected"}

            {phase.includes("fix") && "Rewriting with impact…"}

            {phase === "done" && "All sections strengthened"}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------
// Demo section helper
// ---------------------------------------------------------

function DemoSection({
  title,
  fixed,
  detecting,
  detectLabel,
  children,
}: {
  title: string;
  fixed: boolean;
  detecting: boolean;
  detectLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>

        <AnimatePresence>
          {fixed && (
            <motion.div
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500"
            >
              <CheckCircle2 className="h-3 w-3" />
              Strengthened
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative rounded-xl border border-border bg-muted/30 p-3.5">
        {children}

        <AnimatePresence>
          {detecting && (
            <motion.div
              initial={{
                opacity: 0,
                y: 8,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -6,
              }}
              className="absolute -right-1 -top-2 z-10 flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[10px] font-semibold text-background shadow-lg"
            >
              <AlertTriangle className="h-3 w-3 text-destructive" />

              {detectLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Capability cards
// ---------------------------------------------------------

const capabilities = [
  {
    icon: ScanSearch,
    title: "Smart Detection",
    description:
      "AI scans every section and flags weak phrasing, vague bullets, and missing impact in real time.",
  },
  {
    icon: Wand2,
    title: "Intelligent Rewriting",
    description:
      "Weak language is automatically rewritten into strong, achievement-focused statements that impress recruiters.",
  },
  {
    icon: Target,
    title: "Job Description Tailoring",
    description:
      "Paste any job description and the resume instantly adapts keywords, tone, and focus to match the role.",
  },
  {
    icon: ShieldCheck,
    title: "ATS Optimization",
    description:
      "Every resume is structured and keyword-optimized to pass Applicant Tracking Systems with high confidence.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "From upload or form to a polished, interview-ready resume in under five minutes — no design skills needed.",
  },
  {
    icon: Sparkles,
    title: "Human-Approved Quality",
    description:
      "AI improvements are designed to sound natural and professional, never robotic or over-optimized.",
  },
];

// ---------------------------------------------------------
// Main Section
// ---------------------------------------------------------

export default function AICapabilities({ resume }: { resume: ResumeData }) {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28">
      {/* Background */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,hsl(var(--primary)/0.07),transparent_65%)]" />

      <div className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-primary/5 blur-[110px]" />

      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-primary/5 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Engine
          </motion.div>

          <motion.h2
            initial={{
              opacity: 0,
              y: 16,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.05,
            }}
            className="font-serif text-[2.1rem] leading-[1.15] tracking-tight sm:text-[2.5rem] lg:text-[2.85rem]"
          >
            AI that actually{" "}
            <span className="text-primary">improves your resume</span>
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 14,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.1,
            }}
            className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground"
          >
            Our AI doesn’t just check grammar. It detects weak language,
            strengthens achievements, optimizes for ATS, and can tailor your
            entire resume to any job description.
          </motion.p>
        </div>

        {/* Content grid */}

        <div className="mt-16 grid items-start gap-12 lg:mt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Live Demo */}

          <div className="order-2 lg:order-1">
            <AILiveDemo resume={resume} />
          </div>

          {/* Capabilities */}

          <div className="order-1 space-y-4 lg:order-2">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;

              return (
                <motion.div
                  key={capability.title}
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: "-40px",
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex gap-4 rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/25 hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-[15px] font-semibold tracking-tight">
                      {capability.title}
                    </h3>

                    <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                      {capability.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.2,
          }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <Button
            size="lg"
            className="h-12 rounded-full px-7 text-[14.5px] font-medium"
          >
            Try the AI Engine Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-[13px] text-muted-foreground">
            No credit card required · See results in under 60 seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
}
