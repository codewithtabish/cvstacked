"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  GripVertical,
  Lock,
  LogIn,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Upload,
  WandSparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type OptimizerStatus = "idle" | "uploading" | "ready" | "analyzing" | "completed";

interface AnalysisStep {
  title: string;
  description: string;
}

interface OptimizationResult {
  jobMatch: number;
  keywordCoverage: number;
  relevantExperience: "Strong" | "Good" | "Needs review";
}

interface FloatingKeyword {
  label: string;
  position: string;
  delay: number;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    title: "Reading your resume",
    description: "Understanding your experience and career story.",
  },
  {
    title: "Understanding the job",
    description: "Identifying the requirements of your target role.",
  },
  {
    title: "Matching your experience",
    description: "Connecting relevant experience to the opportunity.",
  },
  {
    title: "Improving relevant content",
    description: "Strengthening clarity, relevance, and professional phrasing.",
  },
  {
    title: "Preparing your tailored resume",
    description: "Organizing the recommendations for your review.",
  },
];

const FLOATING_KEYWORDS: FloatingKeyword[] = [
  { label: "React", position: "left-[2%] top-[22%]", delay: 0 },
  { label: "Next.js", position: "right-[1%] top-[18%]", delay: 0.4 },
  { label: "TypeScript", position: "left-[-2%] top-[48%]", delay: 0.8 },
  { label: "Leadership", position: "right-[-2%] top-[46%]", delay: 1.2 },
  { label: "Frontend", position: "left-[4%] bottom-[18%]", delay: 1.6 },
  { label: "5+ years", position: "right-[3%] bottom-[16%]", delay: 2 },
];

const SAMPLE_JOB_DESCRIPTION = `Senior Frontend Engineer

We are looking for an experienced frontend engineer to build scalable, accessible web applications.

Requirements:
• 5+ years of frontend development experience
• Strong React and TypeScript experience
• Experience with Next.js
• Understanding of modern frontend architecture
• Strong communication and leadership skills
• Experience improving performance and accessibility`;

const SAMPLE_BEFORE = "Built web applications using React and worked with frontend technologies.";

const SAMPLE_AFTER =
  "Built scalable React applications with TypeScript, focusing on performance, accessibility, and maintainable frontend architecture.";

/* -------------------------------------------------------------------------- */
/* Animation helpers                                                          */
/* -------------------------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* -------------------------------------------------------------------------- */
/* Small reusable components                                                   */
/* -------------------------------------------------------------------------- */

function SectionEyebrow({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: typeof Sparkles;
}) {
  return (
    <Badge variant="secondary" className="gap-1.5 rounded-full border px-3 py-1 font-medium">
      {Icon ? <Icon className="size-3.5" /> : null}
      {children}
    </Badge>
  );
}

function FeatureIcon({ icon: Icon }: { icon: typeof Target }) {
  return (
    <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
      <Icon className="size-5 text-foreground" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Navbar                                                                     */
/* -------------------------------------------------------------------------- */

function OptimizerNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
          >
            Alentah
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
            <Link
              href="/templates"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Templates
            </Link>

            <Link
              href="/ai-resume-optimizer"
              aria-current="page"
              className="rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground"
            >
              AI Resume
            </Link>

            <Link
              href="/pricing"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">
              <LogIn className="mr-2 size-4" />
              Log in
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link href="/app">Create Resume</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function OptimizerHero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp}>
            <SectionEyebrow icon={Sparkles}>AI-powered resume optimization</SectionEyebrow>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl"
          >
            Tailor your resume to the job you want.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
          >
            Upload your resume, add the job description, and let Alentah help you highlight the
            experience, skills, and achievements that matter most for the role.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              User-controlled edits
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5" />
              Privacy-conscious workflow
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5" />
              No fabricated experience
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Resume Upload                                                              */
/* -------------------------------------------------------------------------- */

interface ResumeUploadProps {
  file: File | null;
  dragging: boolean;
  disabled: boolean;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

function ResumeUpload({ file, dragging, disabled, onFileSelect, onRemove }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (candidate: File | undefined) => {
      if (!candidate) return;

      const extension = candidate.name.split(".").pop()?.toLowerCase();

      if (extension !== "pdf" && extension !== "docx") {
        return;
      }

      if (candidate.size > MAX_FILE_SIZE) {
        return;
      }

      onFileSelect(candidate);
    },
    [onFileSelect],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    validateAndSelect(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (disabled) return;

    validateAndSelect(event.dataTransfer.files?.[0]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold tracking-tight">Your resume</h2>
        <p className="mt-1 text-sm text-muted-foreground">Upload the resume you want to tailor.</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={handleInputChange}
        disabled={disabled}
        aria-label="Upload resume"
      />

      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="rounded-xl border bg-muted/30 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-background">
                <FileText className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatFileSize(file.size)}</span>
                  <span aria-hidden="true">•</span>
                  <span>{file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX"}</span>
                  <Badge variant="outline" className="ml-1 gap-1">
                    <Check className="size-3" />
                    Ready
                  </Badge>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                aria-label="Remove resume"
                className="shrink-0"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            <Separator className="my-4" />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              Replace file
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            onClick={() => !disabled && inputRef.current?.click()}
            onKeyDown={handleKeyDown}
            onDragOver={(event: any) => {
              event.preventDefault();
            }}
            onDragEnter={(event: any) => {
              event.preventDefault();
            }}
            onDrop={handleDrop}
            className={cn(
              "group relative flex min-h-[245px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-6 text-center transition-all",
              "hover:border-foreground/30 hover:bg-muted/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              dragging && "border-foreground/50 bg-muted/50 shadow-sm",
              disabled && "pointer-events-none opacity-60",
            )}
          >
            <motion.div
              animate={
                dragging
                  ? {
                      scale: 1.08,
                      y: -3,
                    }
                  : {
                      scale: 1,
                      y: 0,
                    }
              }
              transition={{ duration: 0.2 }}
              className="mb-4 flex size-12 items-center justify-center rounded-xl border bg-background shadow-sm"
            >
              <Upload className="size-5" />
            </motion.div>

            <p className="text-sm font-medium">
              {dragging ? "Drop your resume here" : "Drop your resume here"}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              or{" "}
              <span className="font-medium text-foreground underline underline-offset-4">
                browse files
              </span>
            </p>

            <p className="mt-4 text-xs text-muted-foreground">PDF or DOCX · Up to 10 MB</p>

            {dragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 pointer-events-none border-2 border-foreground/20"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Job Description                                                            */
/* -------------------------------------------------------------------------- */

interface JobDescriptionInputProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

function JobDescriptionInput({ value, disabled, onChange }: JobDescriptionInputProps) {
  return (
    <div className="flex min-h-full flex-col space-y-4">
      <div>
        <h2 className="font-semibold tracking-tight">Target job</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste the job description you&apos;re applying for.
        </p>
      </div>

      <div className="relative flex-1">
        <Textarea
          value={value}
          onChange={(event: any) => onChange(event.target.value)}
          disabled={disabled}
          placeholder="Paste the job description here..."
          className="min-h-[245px] resize-none rounded-xl bg-background pr-4 text-sm leading-6 shadow-none focus-visible:ring-1"
          aria-label="Target job description"
        />

        <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-background/90 px-2 py-1 text-[11px] text-muted-foreground">
          {value.length.toLocaleString()} characters
        </div>
      </div>

      {!value && (
        <button
          type="button"
          onClick={() => onChange(SAMPLE_JOB_DESCRIPTION)}
          disabled={disabled}
          className="self-start text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          Use sample job description
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Optimize button                                                           */
/* -------------------------------------------------------------------------- */

function OptimizeButton({
  disabled,
  loading,
  onClick,
}: {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="lg"
      disabled={disabled || loading}
      onClick={onClick}
      className="h-12 w-full px-6 sm:w-auto"
    >
      {loading ? (
        <>
          <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          Preparing analysis...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 size-4 transition-transform group-hover:rotate-12" />
          Optimize My Resume
        </>
      )}
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* Workspace                                                                  */
/* -------------------------------------------------------------------------- */

interface OptimizerWorkspaceProps {
  file: File | null;
  jobDescription: string;
  dragging: boolean;
  status: OptimizerStatus;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  onJobDescriptionChange: (value: string) => void;
  onOptimize: () => void;
  onDragStateChange: (dragging: boolean) => void;
}

function OptimizerWorkspace({
  file,
  jobDescription,
  dragging,
  status,
  onFileSelect,
  onRemoveFile,
  onJobDescriptionChange,
  onOptimize,
  onDragStateChange,
}: OptimizerWorkspaceProps) {
  const canOptimize = Boolean(file) && jobDescription.trim().length > 0 && status !== "analyzing";

  return (
    <section id="optimizer" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.99 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="overflow-hidden border shadow-sm">
            <div className="border-b bg-muted/20 px-5 py-4 sm:px-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">Resume optimizer</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Your resume + the role you want = a more focused application.
                  </p>
                </div>

                <Badge variant="outline" className="w-fit gap-1.5">
                  <Zap className="size-3" />
                  Frontend demo
                </Badge>
              </div>
            </div>

            <div
              onDragEnter={() => onDragStateChange(true)}
              onDragLeave={() => onDragStateChange(false)}
              className={cn("p-5 transition-colors sm:p-7", dragging && "bg-muted/20")}
            >
              <div className="grid gap-7 lg:grid-cols-2">
                <ResumeUpload
                  file={file}
                  dragging={dragging}
                  disabled={status === "analyzing"}
                  onFileSelect={onFileSelect}
                  onRemove={onRemoveFile}
                />

                <JobDescriptionInput
                  value={jobDescription}
                  disabled={status === "analyzing"}
                  onChange={onJobDescriptionChange}
                />
              </div>

              <Separator className="my-7" />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="size-3.5" />
                  <span>Alentah improves your existing experience — it does not invent it.</span>
                </div>

                <OptimizeButton
                  disabled={!canOptimize}
                  loading={status === "uploading"}
                  onClick={onOptimize}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Resume scan preview                                                        */
/* -------------------------------------------------------------------------- */

function ResumeScanPreview({ file, analysisStep }: { file: File | null; analysisStep: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[510px]">
      <div className="relative aspect-[0.77] w-full overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 top-1/2 z-10 h-[92%] w-[70%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border bg-background shadow-xl"
        >
          <div className="flex h-11 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <FileText className="size-3.5 text-muted-foreground" />
              <span className="max-w-[180px] truncate text-[10px] font-medium">
                {file?.name || "resume.pdf"}
              </span>
            </div>

            <span className="text-[9px] text-muted-foreground">Preview</span>
          </div>

          <div className="space-y-4 p-5">
            <div>
              <div className="h-4 w-32 rounded bg-foreground/80" />
              <div className="mt-2 h-2 w-24 rounded bg-muted-foreground/40" />
            </div>

            <div className="space-y-1.5">
              <div className="h-1.5 w-full rounded bg-muted" />
              <div className="h-1.5 w-[92%] rounded bg-muted" />
              <div className="h-1.5 w-[84%] rounded bg-muted" />
            </div>

            <div>
              <div className="mb-2 h-2 w-20 rounded bg-foreground/60" />
              <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded bg-muted" />
                <div className="h-1.5 w-[95%] rounded bg-muted" />
                <div className="h-1.5 w-[87%] rounded bg-muted" />
                <div className="h-1.5 w-[90%] rounded bg-muted" />
                <div className="h-1.5 w-[75%] rounded bg-muted" />
              </div>
            </div>

            <div>
              <div className="mb-2 h-2 w-14 rounded bg-foreground/60" />
              <div className="flex flex-wrap gap-1.5">
                {["React", "Next.js", "TypeScript", "Leadership"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded border bg-muted/50 px-2 py-1 text-[8px] text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 h-2 w-16 rounded bg-foreground/60" />
              <div className="space-y-1.5">
                <div className="h-1.5 w-[96%] rounded bg-muted" />
                <div className="h-1.5 w-[80%] rounded bg-muted" />
                <div className="h-1.5 w-[88%] rounded bg-muted" />
              </div>
            </div>
          </div>

          {!reduceMotion && (
            <motion.div
              aria-hidden="true"
              initial={{ top: "0%" }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute left-0 right-0 z-20 h-px bg-foreground/70 shadow-[0_0_12px_hsl(var(--foreground)/0.35)]"
            />
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-background to-transparent opacity-90" />
        </motion.div>

        {!reduceMotion &&
          FLOATING_KEYWORDS.map((keyword) => (
            <motion.div
              key={keyword.label}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: [0.35, 1, 0.35],
                scale: [0.96, 1, 0.96],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: keyword.delay,
                ease: "easeInOut",
              }}
              className={cn(
                "absolute z-20 rounded-full border bg-background px-2.5 py-1 text-[10px] font-medium shadow-sm",
                keyword.position,
              )}
            >
              {keyword.label}
            </motion.div>
          ))}

        <div className="absolute inset-x-0 bottom-0 z-30 mx-auto flex max-w-[310px] items-center justify-center">
          <Badge variant="secondary" className="gap-2 rounded-full border shadow-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground/30" />
              <span className="relative inline-flex size-2 rounded-full bg-foreground/70" />
            </span>
            Alentah AI is analyzing
          </Badge>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Currently analyzing step {analysisStep + 1} of {ANALYSIS_STEPS.length}.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Analysis steps                                                             */
/* -------------------------------------------------------------------------- */

function AnalysisSteps({ currentStep }: { currentStep: number }) {
  return (
    <div className="space-y-2">
      {ANALYSIS_STEPS.map((step, index) => {
        const complete = index < currentStep;
        const active = index === currentStep;

        return (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className={cn(
              "flex items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors",
              active && "bg-muted/60",
              !active && !complete && "border-transparent",
            )}
          >
            <div
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                complete && "bg-foreground text-background",
                active && "border-foreground",
                !complete && !active && "border-muted-foreground/30",
              )}
            >
              {complete ? (
                <Check className="size-3" />
              ) : active ? (
                <motion.span
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.3, repeat: Infinity }}
                  className="size-1.5 rounded-full bg-foreground"
                />
              ) : null}
            </div>

            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm font-medium",
                  !active && !complete && "text-muted-foreground",
                )}
              >
                {step.title}
              </p>

              <AnimatePresence initial={false}>
                {active && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-1 overflow-hidden text-xs leading-5 text-muted-foreground"
                  >
                    {step.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* AI Analysis                                                                */
/* -------------------------------------------------------------------------- */

function AiAnalysis({ file, analysisStep }: { file: File | null; analysisStep: number }) {
  const progress = Math.min(100, Math.round(((analysisStep + 1) / ANALYSIS_STEPS.length) * 100));

  return (
    <section aria-live="polite" aria-label="AI resume analysis" className="border-y bg-muted/10">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-6">
              <Badge variant="outline" className="gap-2">
                <ScanSearch className="size-3.5" />
                AI analysis in progress
              </Badge>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Looking for the strongest connection between your experience and this role.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Alentah is analyzing your resume against the target job. This demo uses frontend
                timing; the same state can later be driven by a real AI API.
              </p>
            </div>

            <div className="max-w-lg">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium">{ANALYSIS_STEPS[analysisStep]?.title}</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>

              <Progress value={progress} className="h-1.5" />

              <div className="mt-6">
                <AnalysisSteps currentStep={analysisStep} />
              </div>
            </div>
          </div>

          <ResumeScanPreview file={file} analysisStep={analysisStep} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Result metrics                                                             */
/* -------------------------------------------------------------------------- */

function ResultMetric({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Before / After                                                             */
/* -------------------------------------------------------------------------- */

function BeforeAfterPreview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="overflow-hidden shadow-none">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Before</p>
            <p className="text-xs text-muted-foreground">Sample content</p>
          </div>

          <Badge variant="outline">Original</Badge>
        </div>

        <div className="p-5">
          <p className="text-sm leading-7 text-muted-foreground">{SAMPLE_BEFORE}</p>
        </div>
      </Card>

      <Card className="overflow-hidden shadow-none">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Tailored</p>
            <p className="text-xs text-muted-foreground">Sample content</p>
          </div>

          <Badge variant="secondary" className="gap-1">
            <Sparkles className="size-3" />
            Improved
          </Badge>
        </div>

        <div className="p-5">
          <p className="text-sm leading-7 text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 text-foreground">{SAMPLE_AFTER}</span>
          </p>
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Optimization result                                                       */
/* -------------------------------------------------------------------------- */

function OptimizationResult({
  result,
  onReview,
  onStartOver,
}: {
  result: OptimizationResult;
  onReview: () => void;
  onStartOver: () => void;
}) {
  return (
    <section aria-live="polite" className="border-y bg-muted/10">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="gap-1.5">
              <Check className="size-3.5" />
              Analysis complete
            </Badge>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your tailored resume is ready.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              We&apos;ve identified the most relevant parts of your experience for this role. These
              demo values are illustrative and will be replaced by real API results.
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-4xl">
            <div className="grid gap-3 sm:grid-cols-3">
              <ResultMetric label="Job match" value={`${result.jobMatch}%`} helper="Demo value" />
              <ResultMetric
                label="Relevant experience"
                value={result.relevantExperience}
                helper="Demo assessment"
              />
              <ResultMetric
                label="Keyword coverage"
                value={`${result.keywordCoverage}%`}
                helper="Demo value"
              />
            </div>

            <div className="mt-5">
              <BeforeAfterPreview />
            </div>

            <div className="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={onStartOver}>
                <RotateCcw className="mr-2 size-4" />
                Start Over
              </Button>

              <Button type="button" size="lg" onClick={onReview}>
                Review My Resume
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* How It Works                                                               */
/* -------------------------------------------------------------------------- */

const HOW_IT_WORKS = [
  {
    number: "01",
    title: "Upload your resume",
    description: "Start with the experience you already have.",
  },
  {
    number: "02",
    title: "Add the job description",
    description: "Tell Alentah what role you&apos;re targeting.",
  },
  {
    number: "03",
    title: "Optimize with AI",
    description: "Get a resume tailored around the most relevant parts of your background.",
  },
];

function HowItWorks() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="max-w-2xl">
            <SectionEyebrow icon={WandSparkles}>How it works</SectionEyebrow>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              From your resume to a job-focused version.
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                className="group rounded-xl border bg-background p-6 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                    {step.number}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>

                <h3 className="mt-12 text-lg font-semibold tracking-tight">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Features                                                                   */
/* -------------------------------------------------------------------------- */

const FEATURES = [
  {
    icon: Target,
    title: "Relevant Experience",
    description: "Bring the most relevant parts of your background forward.",
  },
  {
    icon: ScanSearch,
    title: "Job-Specific Keywords",
    description: "Identify language and skills that matter for the target role.",
  },
  {
    icon: WandSparkles,
    title: "Stronger Writing",
    description: "Improve clarity, impact and professional phrasing.",
  },
  {
    icon: FileText,
    title: "ATS-Friendly Structure",
    description: "Keep your resume clear and easy for hiring systems to parse.",
  },
];

function OptimizerFeatures() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="max-w-2xl">
            <SectionEyebrow icon={Zap}>Built around relevance</SectionEyebrow>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Better focus without changing who you are.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The goal is not to create a different career story. It&apos;s to make your existing
              experience clearer and more relevant to the opportunity in front of you.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="rounded-xl border bg-background p-5 transition-colors hover:bg-muted/30"
              >
                <FeatureIcon icon={feature.icon} />

                <h3 className="mt-5 font-semibold tracking-tight">{feature.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Privacy                                                                    */
/* -------------------------------------------------------------------------- */

function PrivacySection() {
  const trustItems = [
    {
      icon: Lock,
      text: "Private resume handling",
    },
    {
      icon: GripVertical,
      text: "User-controlled edits",
    },
    {
      icon: ShieldCheck,
      text: "No fabricated experience",
    },
    {
      icon: FileText,
      text: "Review before download",
    },
  ];

  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="flex size-11 items-center justify-center rounded-xl border bg-muted/30">
              <ShieldCheck className="size-5" />
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight">
              Your experience stays yours.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Alentah helps you present your existing experience more effectively. AI should enhance
              your resume, not invent your career.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl border bg-muted/20 px-4 py-4"
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Final CTA                                                                  */
/* -------------------------------------------------------------------------- */

function FinalCta({ onOptimize }: { onOptimize: () => void }) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden rounded-2xl border bg-muted/20 px-6 py-12 text-center sm:px-10 sm:py-16"
        >
          <div className="relative z-10 mx-auto max-w-2xl">
            <SectionEyebrow icon={Sparkles}>Ready for the next opportunity?</SectionEyebrow>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to tailor your resume?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Upload your resume and target the next opportunity with confidence.
            </p>

            <Button type="button" size="lg" onClick={onOptimize} className="mt-7">
              <Sparkles className="mr-2 size-4" />
              Optimize My Resume
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Utility                                                                    */
/* -------------------------------------------------------------------------- */

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function AiResumeOptimizer() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<OptimizerStatus>("idle");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [dragging, setDragging] = useState(false);

  const analysisTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAnalysisTimer = useCallback(() => {
    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
      analysisTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearAnalysisTimer();
    };
  }, [clearAnalysisTimer]);

  const handleFileSelect = useCallback((file: File) => {
    setResumeFile(file);
    setStatus("ready");
    setResult(null);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setResumeFile(null);
    setStatus("idle");
    setResult(null);
  }, []);

  const handleStartOver = useCallback(() => {
    clearAnalysisTimer();

    setResumeFile(null);
    setJobDescription("");
    setAnalysisStep(0);
    setResult(null);
    setDragging(false);
    setStatus("idle");

    window.requestAnimationFrame(() => {
      document.getElementById("optimizer")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, [clearAnalysisTimer]);

  /*
   * Integration point:
   * - Check authentication here.
   * - If unauthenticated, open your real login/signup flow.
   * - Do not create fake authentication state in this page.
   */
  const handleAuthenticationHandoff = useCallback((destination: string) => {
    // Replace this with the application's actual auth guard/modal.
    window.location.href = destination;
  }, []);

  /*
   * Integration point:
   * - Send resumeFile to your resume parsing endpoint.
   * - Send jobDescription to your AI optimization endpoint.
   * - Stream actual analysis events back into analysisStep.
   *
   * The frontend demo below intentionally simulates those events.
   */
  const handleOptimize = useCallback(() => {
    if (!resumeFile || !jobDescription.trim()) {
      return;
    }

    clearAnalysisTimer();
    setResult(null);
    setAnalysisStep(0);
    setStatus("analyzing");

    let step = 0;

    const runStep = () => {
      if (step < ANALYSIS_STEPS.length) {
        setAnalysisStep(step);

        step += 1;

        analysisTimerRef.current = setTimeout(runStep, 1400);
        return;
      }

      /*
       * Integration point:
       * Replace these demo values with the actual API response.
       * These numbers are intentionally not calculated from the uploaded file.
       */
      setResult({
        jobMatch: 87,
        keywordCoverage: 92,
        relevantExperience: "Strong",
      });

      setStatus("completed");
    };

    runStep();
  }, [clearAnalysisTimer, jobDescription, resumeFile]);

  const handleReview = useCallback(() => {
    /*
     * Integration point:
     * - Persist the optimization result.
     * - Verify authentication.
     * - Redirect to the authenticated resume editor.
     */
    handleAuthenticationHandoff("/app");
  }, [handleAuthenticationHandoff]);

  const handleFinalCta = useCallback(() => {
    document.getElementById("optimizer")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <OptimizerHero />

      <AnimatePresence mode="wait">
        {status === "analyzing" ? (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AiAnalysis file={resumeFile} analysisStep={analysisStep} />
          </motion.div>
        ) : status === "completed" && result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OptimizationResult
              result={result}
              onReview={handleReview}
              onStartOver={handleStartOver}
            />
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <OptimizerWorkspace
              file={resumeFile}
              jobDescription={jobDescription}
              dragging={dragging}
              status={status}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
              onJobDescriptionChange={setJobDescription}
              onOptimize={handleOptimize}
              onDragStateChange={setDragging}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <HowItWorks />

      <OptimizerFeatures />

      <PrivacySection />

      <FinalCta onOptimize={handleFinalCta} />
    </main>
  );
}
