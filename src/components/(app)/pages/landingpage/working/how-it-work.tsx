"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Create or Upload",
    description:
      "Start from scratch with our smart form or simply upload your existing resume. We support PDF, DOCX, and more.",
    icon: Upload,
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    number: "02",
    title: "AI Analyzes & Improves",
    description:
      "Our AI scans every section, detects weak language, strengthens achievements, and optimizes for ATS systems.",
    icon: Sparkles,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    number: "03",
    title: "Tailor to Any Job",
    description:
      "Paste a job description and watch your resume instantly adapt — keywords, tone, and focus aligned to the role.",
    icon: Target,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    number: "04",
    title: "Export & Apply",
    description:
      "Download a perfectly formatted, ATS-friendly resume in PDF or DOCX. Ready to send in under 5 minutes.",
    icon: Download,
    accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
];

const container: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,hsl(var(--primary)/0.07),transparent_65%)]" />

      <div className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />

      <div className="pointer-events-none absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-amber-500/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground"
          >
            <FileText className="h-3.5 w-3.5 text-primary" />
            Simple 4-step process
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-serif text-[2.1rem] leading-[1.15] tracking-tight sm:text-[2.5rem] lg:text-[2.85rem]"
          >
            From blank page to <span className="text-primary">interview-ready</span> in minutes
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground"
          >
            No complicated tools. No design skills needed. Just follow these four steps and walk
            away with a resume that recruiters actually want to read.
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-5"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div key={step.number} variants={item} className="group relative">
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="pointer-events-none absolute left-[calc(100%+0.25rem)] top-10 hidden h-px w-[calc(100%-0.5rem)] bg-linear-to-r from-border to-transparent lg:block" />
                )}

                <div className="relative h-full rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md">
                  {/* Number + Icon */}
                  <div className="mb-5 flex items-start justify-between">
                    <span className="font-serif text-[1.6rem] font-semibold tracking-tight text-muted-foreground/40">
                      {step.number}
                    </span>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${step.accent} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-[1.05rem] font-semibold tracking-tight text-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>

                  {/* Subtle bottom accent on hover */}
                  <div className="absolute bottom-0 left-6 right-6 h-px origin-left scale-x-0 bg-linear-to-r from-primary/40 to-transparent transition-transform duration-400 group-hover:scale-x-100" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-14 flex flex-col items-center justify-center gap-5 sm:mt-16 sm:flex-row"
        >
          <Button size="lg" className="h-12 rounded-full px-7 text-[14.5px] font-medium">
            Start Building Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 text-[13.5px] text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            No credit card required · Takes under 5 minutes
          </div>
        </motion.div>
      </div>
    </section>
  );
}
