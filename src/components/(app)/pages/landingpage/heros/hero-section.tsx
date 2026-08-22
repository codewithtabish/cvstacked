"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  FileText,
  Sparkles,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ResumeData } from "@/data/resume";

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------

interface HeroProps {
  resume: ResumeData;
}

// ---------------------------------------------------------
// Weak placeholders
// ---------------------------------------------------------

const WEAK_SUMMARY =
  "I am a software engineer with experience in building things and working with teams. I have done many projects and know several languages.";

const WEAK_EXPERIENCE = [
  {
    position: "Software Engineer",
    company: "Some Company",
    meta: "2020 — Present",
    line: "Worked on various projects and helped the team.",
  },
];

const WEAK_PROJECT = {
  name: "My Project",
  role: "Developer",
  description: "Built a web application using some technologies.",
};

const WEAK_EDUCATION = {
  degree: "Bachelor Degree",
  institution: "Some University",
};

const WEAK_SKILLS = ["JavaScript", "HTML", "CSS", "React", "Node.js"];

// ---------------------------------------------------------
// Intelligent Resume Preview
// ---------------------------------------------------------

type PreviewPhase =
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

function IntelligentResumePreview({ resume }: { resume: ResumeData }) {
  const [phase, setPhase] = useState<PreviewPhase>("idle");
  const [scanY, setScanY] = useState(-12);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { personal } = resume;

  // ---------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ---------------------------------------------------------
  // Scroll detection
  // ---------------------------------------------------------

  const checkScrollable = useCallback(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const hasOverflow = element.scrollHeight > element.clientHeight + 4;

    const isAtBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 8;

    setShowScrollHint(hasOverflow && !isAtBottom);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const handleScroll = () => {
      checkScrollable();
    };

    element.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    const timer = setTimeout(handleScroll, 300);

    return () => {
      element.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [checkScrollable, phase]);

  // ---------------------------------------------------------
  // Animation sequence
  // ---------------------------------------------------------

  const startSequence = useCallback(() => {
    clearTimers();

    let y = -10;

    const schedule = (callback: () => void, delay: number) => {
      const timer = setTimeout(callback, delay);
      timersRef.current.push(timer);
    };

    schedule(() => {
      setPhase("idle");
      setScanY(-12);
    }, 0);

    schedule(() => {
      setPhase("scan-summary");
    }, 500);

    schedule(() => {
      setPhase("detect-summary");
    }, 1700);

    schedule(() => {
      setPhase("fix-summary");
    }, 2700);

    schedule(() => {
      setPhase("scan-experience");
    }, 3100);

    schedule(() => {
      setPhase("detect-experience");
    }, 4300);

    schedule(() => {
      setPhase("fix-experience");
    }, 5300);

    schedule(() => {
      setPhase("scan-projects");
    }, 5700);

    schedule(() => {
      setPhase("detect-projects");
    }, 6900);

    schedule(() => {
      setPhase("fix-projects");
    }, 7900);

    schedule(() => {
      setPhase("scan-education");
    }, 8300);

    schedule(() => {
      setPhase("detect-education");
    }, 9300);

    schedule(() => {
      setPhase("fix-education");
    }, 10200);

    schedule(() => {
      setPhase("scan-skills");
    }, 10600);

    schedule(() => {
      setPhase("detect-skills");
    }, 11600);

    schedule(() => {
      setPhase("fix-skills");
    }, 12500);

    schedule(() => {
      setPhase("done");
    }, 13100);

    // Restart asynchronously after the completed animation.
    schedule(() => {
      // eslint-disable-next-line react-hooks/immutability
      startSequence();
    }, 14600);

    intervalRef.current = setInterval(() => {
      y += 1.35;
      setScanY(y);

      if (y > 130) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 30);
  }, [clearTimers]);

  // ---------------------------------------------------------
  // Start animation
  // ---------------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      startSequence();
    }, 0);

    return () => {
      clearTimeout(timer);
      clearTimers();
    };
  }, [startSequence, clearTimers]);

  // ---------------------------------------------------------
  // Derived states
  // ---------------------------------------------------------

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
    <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[440px]">
      <div className="pointer-events-none absolute -inset-12 rounded-[2.5rem] bg-primary/15 blur-[90px]" />

      <div className="pointer-events-none absolute -bottom-10 -right-8 h-48 w-48 rounded-full bg-amber-500/10 blur-[70px]" />

      <motion.div
        initial={{ opacity: 0, y: 28, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-border"
        style={{ aspectRatio: "210 / 297" }}
      >
        <div className="absolute left-0 top-0 h-full w-[3px] bg-primary" />

        <div
          ref={scrollRef}
          className="relative h-full overflow-y-auto px-5 py-5 text-foreground [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
        >
          {/* Header */}

          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" />

                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-primary">
                  Professional Resume
                </span>
              </div>

              <h2 className="font-serif text-[22px] font-semibold leading-[0.95] tracking-tight sm:text-[24px]">
                {personal.firstName}

                <span className="block text-foreground/80">
                  {personal.lastName}
                </span>
              </h2>

              {personal.jobTitle && (
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                  {personal.jobTitle}
                </p>
              )}
            </div>

            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
              {personal.photo ? (
                <Image
                  src={personal.photo}
                  alt={`${personal.firstName} ${personal.lastName}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-[13px] font-bold text-primary">
                  {personal.firstName?.[0]}
                  {personal.lastName?.[0]}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-x-2.5 gap-y-0.5 border-b border-border pb-2.5 text-[9px] font-medium text-muted-foreground">
            {personal.email && <span>{personal.email}</span>}

            {personal.phone && (
              <>
                <span>·</span>
                <span>{personal.phone}</span>
              </>
            )}

            {personal.location && (
              <>
                <span>·</span>
                <span>{personal.location}</span>
              </>
            )}
          </div>

          {/* Profile */}

          <Section
            title="Profile"
            fixed={summaryFixed}
            detecting={showSummaryDetect}
            detectLabel="Weak phrasing detected"
          >
            <AnimatePresence mode="wait">
              {!summaryFixed ? (
                <motion.p
                  key="weak"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] leading-[1.55] text-muted-foreground"
                >
                  {WEAK_SUMMARY}
                </motion.p>
              ) : (
                <motion.p
                  key="real"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] leading-[1.55] text-foreground"
                >
                  {resume.summary}
                </motion.p>
              )}
            </AnimatePresence>
          </Section>

          {/* Experience */}

          <Section
            title="Experience"
            fixed={experienceFixed}
            detecting={showExperienceDetect}
            detectLabel="Low-impact bullets detected"
          >
            <AnimatePresence mode="wait">
              {!experienceFixed ? (
                <motion.div
                  key="weak-exp"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {WEAK_EXPERIENCE.map((item, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between gap-2">
                        <p className="text-[10.5px] font-semibold text-muted-foreground">
                          {item.position}
                        </p>

                        <span className="text-[8px] text-muted-foreground/70">
                          {item.meta}
                        </span>
                      </div>

                      <p className="text-[9px] text-muted-foreground/80">
                        {item.company}
                      </p>

                      <p className="mt-0.5 text-[9px] text-muted-foreground/70">
                        {item.line}
                      </p>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="real-exp"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {resume.experience.slice(0, 2).map((exp) => (
                    <div key={exp.id} className="mb-2.5">
                      <div className="flex justify-between gap-2">
                        <p className="text-[10.5px] font-semibold">
                          {exp.position}
                        </p>

                        <span className="shrink-0 text-[8px] font-medium uppercase tracking-wider text-muted-foreground">
                          {exp.startDate?.slice(0, 4)} —{" "}
                          {exp.current ? "Present" : exp.endDate?.slice(0, 4)}
                        </span>
                      </div>

                      <p className="text-[9px] font-medium text-muted-foreground">
                        {exp.company}
                        {exp.location ? ` · ${exp.location}` : ""}
                      </p>

                      {exp.achievements?.[0] && (
                        <p className="mt-0.5 text-[9px] leading-[1.45] text-foreground/85">
                          • {exp.achievements[0]}
                        </p>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Section>

          {/* Projects */}

          {resume.projects?.length > 0 && (
            <Section
              title="Projects"
              fixed={projectsFixed}
              detecting={showProjectsDetect}
              detectLabel="Vague project description"
            >
              <AnimatePresence mode="wait">
                {!projectsFixed ? (
                  <motion.div
                    key="weak-proj"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-[10.5px] font-semibold text-muted-foreground">
                      {WEAK_PROJECT.name}
                    </p>

                    <p className="text-[8.5px] font-medium text-primary/70">
                      {WEAK_PROJECT.role}
                    </p>

                    <p className="mt-0.5 text-[9px] text-muted-foreground/80">
                      {WEAK_PROJECT.description}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="real-proj"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {resume.projects.slice(0, 1).map((project) => (
                      <div key={project.id}>
                        <p className="text-[10.5px] font-semibold">
                          {project.name}
                        </p>

                        {project.role && (
                          <p className="text-[8.5px] font-semibold uppercase tracking-wider text-primary">
                            {project.role}
                          </p>
                        )}

                        <p className="mt-0.5 text-[9px] leading-[1.45] text-foreground/90">
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>
          )}

          {/* Education */}

          {resume.education?.length > 0 && (
            <Section
              title="Education"
              fixed={educationFixed}
              detecting={showEducationDetect}
              detectLabel="Missing details detected"
            >
              <AnimatePresence mode="wait">
                {!educationFixed ? (
                  <motion.div
                    key="weak-edu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-[10.5px] font-semibold text-muted-foreground">
                      {WEAK_EDUCATION.degree}
                    </p>

                    <p className="text-[9px] text-muted-foreground/80">
                      {WEAK_EDUCATION.institution}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="real-edu"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {resume.education.slice(0, 1).map((edu) => (
                      <div key={edu.id}>
                        <p className="text-[10.5px] font-semibold">
                          {edu.degree}
                          {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                        </p>

                        <p className="text-[9px] text-muted-foreground">
                          {edu.institution}
                          {edu.grade ? ` · ${edu.grade}` : ""}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>
          )}

          {/* Skills */}

          <Section
            title="Expertise"
            fixed={skillsFixed}
            detecting={showSkillsDetect}
            detectLabel="Generic skills detected"
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
                  {WEAK_SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-muted px-1.5 py-0.5 text-[8.5px] font-medium text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="real-skills"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills.slice(0, 8).map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded bg-muted px-1.5 py-0.5 text-[8.5px] font-medium text-foreground/85"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>

                  {resume.certifications?.length > 0 && (
                    <div className="pt-1">
                      <p className="mb-1 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                        Certifications
                      </p>

                      {resume.certifications.slice(0, 2).map((cert) => (
                        <p
                          key={cert.id}
                          className="text-[9px] text-foreground/90"
                        >
                          {cert.name}
                        </p>
                      ))}
                    </div>
                  )}

                  {resume.languages?.length > 0 && (
                    <div className="pt-1">
                      <p className="mb-1 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                        Languages
                      </p>

                      <p className="text-[9px] text-foreground/90">
                        {resume.languages
                          .map(
                            (language) =>
                              `${language.name} (${language.proficiency})`,
                          )
                          .join(" · ")}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Section>
        </div>

        {/* Scroll Hint */}

        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2"
            >
              <div className="flex flex-col items-center gap-0.5 rounded-full bg-background/90 px-2.5 py-1.5 shadow-md ring-1 ring-border backdrop-blur-sm">
                <ChevronDown className="h-4 w-4 animate-bounce text-primary" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan line */}

        <AnimatePresence>
          {isScanning && (
            <motion.div
              className="pointer-events-none absolute left-0 right-0 z-40"
              style={{ top: `${scanY}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="h-[2.5px] w-full bg-linear-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_3px_rgba(251,191,36,0.7)]" />

              <div className="absolute -top-4 left-0 h-10 w-full bg-linear-to-b from-transparent via-amber-400/20 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done overlay */}

        <AnimatePresence>
          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/4 to-transparent"
            />
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-5 text-center text-[10.5px] tracking-wide text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI scans every section · detects weak language · strengthens it
        </span>
      </p>
    </div>
  );
}

// ---------------------------------------------------------
// Section helper
// ---------------------------------------------------------

function Section({
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
    <div className="mb-3.5">
      <div className="mb-1.5 flex items-center gap-2">
        <h3 className="text-[9px] font-bold uppercase tracking-[0.15em]">
          {title}
        </h3>

        <div className="h-px flex-1 bg-border" />

        {fixed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 text-[8px] font-semibold text-emerald-500"
          >
            <CheckCircle2 className="h-3 w-3" />
            Fixed
          </motion.div>
        )}
      </div>

      <div className="relative">
        {children}

        <AnimatePresence>
          {detecting && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left rounded-full bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {detecting && (
            <motion.div
              initial={{
                opacity: 0,
                y: 6,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -5,
              }}
              className="absolute -right-1 top-full z-30 mt-1 flex items-center gap-1 rounded-md bg-foreground px-1.5 py-0.5 text-[7.5px] font-semibold text-background shadow-lg"
            >
              <AlertTriangle className="h-2.5 w-2.5 text-destructive" />
              {detectLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Framer Motion variants
// ---------------------------------------------------------

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.07 * i,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// ---------------------------------------------------------
// Hero
// ---------------------------------------------------------

export default function Hero({ resume }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_82%_18%,hsl(var(--primary)/0.12),transparent_65%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_10%_90%,hsl(var(--primary)/0.05),transparent_60%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 sm:gap-16 sm:px-6 sm:py-20 md:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-8 lg:py-28">
        {/* Left */}

        <motion.div initial="hidden" animate="show" className="max-w-xl">
          <motion.div
            custom={0}
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-primary" />
            AI Resume Builder
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="font-serif text-[2.4rem] leading-[1.1] tracking-tight sm:text-[2.9rem] lg:text-[3.25rem]"
          >
            Build a resume that{" "}
            <span className="text-primary">gets interviews</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-muted-foreground"
          >
            Create, upload, or tailor your resume to any job description. Our AI
            makes it ATS-friendly and human-approved in minutes.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            className="mt-7 flex flex-wrap gap-2.5"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-medium">
              <Briefcase className="h-3.5 w-3.5 text-primary" />
              Tailor to Job Description
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-medium">
              <Upload className="h-3.5 w-3.5 text-primary" />
              Upload Existing Resume
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-medium">
              <FileText className="h-3.5 w-3.5 text-primary" />
              20+ Pro Templates
            </div>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button
              size="lg"
              className="h-11 rounded-full px-6 text-[14.5px] font-medium sm:h-12 sm:px-7"
            >
              Start Building Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-full px-5 text-[14.5px] sm:h-12"
            >
              Upload Resume
            </Button>
          </motion.div>

          <motion.div
            custom={5}
            variants={fadeUp}
            className="mt-10 flex items-center gap-6 text-[13px] text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">40k+</span>
              resumes created
            </div>

            <div className="h-3 w-px bg-border" />

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">92%</span>
              ATS pass rate
            </div>

            <div className="h-3 w-px bg-border" />

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">4.9</span>
              average rating
            </div>
          </motion.div>
        </motion.div>

        {/* Right */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
            y: 16,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 1.05,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.12,
          }}
          className="relative flex justify-center lg:justify-end"
        >
          <IntelligentResumePreview resume={resume} />
        </motion.div>
      </div>
    </section>
  );
}
