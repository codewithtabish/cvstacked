"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ScanSearch,
  Sparkles,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// ---------------------------------------------------------
// Content
// ---------------------------------------------------------

const WEAK = {
  summary:
    "I am a software engineer with experience in building things and working with teams. I have done many projects.",
  experience: [
    {
      role: "Software Engineer",
      company: "Some Company",
      bullet: "Worked on various projects and helped the team.",
    },
  ],
  project: "Built a web application using some technologies.",
  skills: ["JavaScript", "HTML", "CSS", "React"],
};

const STRONG = {
  summary:
    "Senior Software Engineer with 8+ years designing scalable web platforms and distributed systems used by millions of users.",
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Northstar Technologies",
      bullet:
        "Led architecture of a high-traffic SaaS platform serving 2.4M+ monthly users and reduced API latency by 42%.",
    },
  ],
  project:
    "Real-time analytics platform processing 100M+ events/month with 60% lower query latency.",
  skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "AWS"],
};

// ---------------------------------------------------------
// Main Component
// ---------------------------------------------------------

export default function BeforeAfter() {
  const [phase, setPhase] = useState<
    "idle" | "scanning" | "detecting" | "transforming" | "done"
  >("idle");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const clearTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const runSequence = () => {
      if (cancelled) return;

      // Start the next cycle after a short idle period.
      timeoutRef.current = setTimeout(() => {
        if (cancelled) return;

        setPhase("scanning");

        timeoutRef.current = setTimeout(() => {
          if (cancelled) return;

          setPhase("detecting");

          timeoutRef.current = setTimeout(() => {
            if (cancelled) return;

            setPhase("transforming");

            timeoutRef.current = setTimeout(() => {
              if (cancelled) return;

              setPhase("done");

              timeoutRef.current = setTimeout(() => {
                if (cancelled) return;

                setPhase("idle");
                runSequence();
              }, 2900);
            }, 1400);
          }, 1400);
        }, 2000);
      }, 800);
    };

    runSequence();

    return () => {
      cancelled = true;
      clearTimer();
    };
  }, []);

  const isScanning = phase === "scanning" || phase === "detecting";
  const showStrong = phase === "transforming" || phase === "done";

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
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground"
          >
            <ScanSearch className="h-3.5 w-3.5 text-primary" />
            Live Transformation
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-serif text-[2.1rem] leading-[1.15] tracking-tight sm:text-[2.5rem] lg:text-[2.85rem]"
          >
            Watch weak language become{" "}
            <span className="text-primary">interview-ready</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground"
          >
            Our AI scans every section, detects weak phrasing, and rewrites it
            into strong, achievement-focused content in real time.
          </motion.p>
        </div>

        {/* Visual Comparison */}
        <div className="mt-14 grid items-start gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-8">
          {/* ========== BEFORE CARD ========== */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-4.5 w-4.5 text-destructive" />
              </div>

              <span className="text-[14px] font-semibold text-destructive">
                Before AI
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
              {/* Header */}
              <div className="border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />

                  <span className="text-[12px] font-medium text-muted-foreground">
                    Weak Resume
                  </span>
                </div>
              </div>

              <div className="relative p-5">
                {/* Summary */}
                <div className="mb-4">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Profile
                  </p>

                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {WEAK.summary}
                  </p>
                </div>

                {/* Experience */}
                <div className="mb-4">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Experience
                  </p>

                  <p className="text-[13px] font-medium">
                    {WEAK.experience[0].role}
                  </p>

                  <p className="text-[12px] text-muted-foreground">
                    {WEAK.experience[0].company}
                  </p>

                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                    • {WEAK.experience[0].bullet}
                  </p>
                </div>

                {/* Project */}
                <div className="mb-4">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Project
                  </p>

                  <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                    {WEAK.project}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {WEAK.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scanning overlay */}
                <AnimatePresence>
                  {isScanning && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="absolute left-0 right-0 h-[2.5px] bg-linear-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_18px_3px_rgba(251,191,36,0.6)]"
                        animate={{ top: ["0%", "100%"] }}
                        transition={{
                          duration: 2.4,
                          ease: "linear",
                          repeat: Infinity,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Detect badges */}
                <AnimatePresence>
                  {phase === "detecting" && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-3 top-16 z-20 flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[10px] font-semibold text-background shadow-lg"
                      >
                        <AlertTriangle className="h-3 w-3 text-destructive" />
                        Weak phrasing
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.15 }}
                        className="absolute right-3 top-40 z-20 flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[10px] font-semibold text-background shadow-lg"
                      >
                        <AlertTriangle className="h-3 w-3 text-destructive" />
                        Low-impact bullet
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ========== AFTER CARD ========== */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
              </div>

              <span className="text-[14px] font-semibold text-emerald-600 dark:text-emerald-400">
                After AI
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
              {/* Header */}
              <div className="border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />

                  <span className="text-[12px] font-medium text-muted-foreground">
                    Strengthened Resume
                  </span>
                </div>
              </div>

              <div className="relative p-5">
                <AnimatePresence mode="wait">
                  {!showStrong ? (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="h-16 rounded-lg bg-muted/50" />
                      <div className="h-20 rounded-lg bg-muted/50" />
                      <div className="h-14 rounded-lg bg-muted/50" />
                      <div className="h-10 rounded-lg bg-muted/50" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="strong"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Summary */}
                      <div className="mb-4">
                        <div className="mb-1.5 flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Profile
                          </p>

                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            Strengthened
                          </span>
                        </div>

                        <p className="text-[13px] leading-relaxed text-foreground">
                          {STRONG.summary}
                        </p>
                      </div>

                      {/* Experience */}
                      <div className="mb-4">
                        <div className="mb-1.5 flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Experience
                          </p>

                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            Strengthened
                          </span>
                        </div>

                        <p className="text-[13px] font-medium">
                          {STRONG.experience[0].role}
                        </p>

                        <p className="text-[12px] text-muted-foreground">
                          {STRONG.experience[0].company}
                        </p>

                        <p className="mt-1 text-[12.5px] leading-relaxed text-foreground">
                          • {STRONG.experience[0].bullet}
                        </p>
                      </div>

                      {/* Project */}
                      <div className="mb-4">
                        <div className="mb-1.5 flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Project
                          </p>

                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            Strengthened
                          </span>
                        </div>

                        <p className="text-[12.5px] leading-relaxed text-foreground">
                          {STRONG.project}
                        </p>
                      </div>

                      {/* Skills */}
                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Skills
                          </p>

                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            Strengthened
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {STRONG.skills.map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Status + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="mt-12 flex flex-col items-center gap-5"
        >
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-[13px] text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />

            {phase === "idle" && "Ready to analyze…"}
            {phase === "scanning" && "Scanning every section…"}
            {phase === "detecting" && "Weak language detected"}
            {phase === "transforming" && "Rewriting with impact…"}
            {phase === "done" && "Resume fully strengthened"}
          </div>

          <Button
            size="lg"
            className="h-12 rounded-full px-7 text-[14.5px] font-medium"
          >
            Transform Your Resume
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
