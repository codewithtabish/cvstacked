"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code2,
  FileCheck2,
  FileText,
  FolderKanban,
  GraduationCap,
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
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
// Component
// ---------------------------------------------------------

export default function HeroFormGenerate({ resume }: HeroProps) {
  const [step, setStep] = useState(0);

  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  const { personal } = resume;

  const steps = [
    {
      id: "personal",
      label: "Personal Info",
      icon: User,
    },
    {
      id: "summary",
      label: "Professional Summary",
      icon: FileText,
    },
    {
      id: "experience",
      label: "Work Experience",
      icon: Briefcase,
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderKanban,
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
    },
    {
      id: "skills",
      label: "Skills & More",
      icon: Code2,
    },
  ];

  // ---------------------------------------------------------
  // Clear all animation timers
  // ---------------------------------------------------------

  const clearTimers = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
  }, []);

  // ---------------------------------------------------------
  // Run animation sequence
  // ---------------------------------------------------------

  const runSequence = useCallback(() => {
    clearTimers();

    setStep(0);

    const sequence = [
      { delay: 700, value: 1 },
      { delay: 2000, value: 2 },
      { delay: 3400, value: 3 },
      { delay: 4800, value: 4 },
      { delay: 6100, value: 5 },
      { delay: 7400, value: 6 },
      { delay: 8700, value: 7 },
    ];

    sequence.forEach(({ delay, value }) => {
      const timer = setTimeout(() => {
        setStep(value);
      }, delay);

      timeoutIds.current.push(timer);
    });
  }, [clearTimers]);

  // ---------------------------------------------------------
  // Start animation + restart after completion
  // ---------------------------------------------------------

  useEffect(() => {
    const startTimer = setTimeout(() => {
      runSequence();
    }, 0);

    const restartTimer = setInterval(() => {
      runSequence();
    }, 10700);

    return () => {
      clearTimeout(startTimer);
      clearInterval(restartTimer);
      clearTimers();
    };
  }, [clearTimers, runSequence]);

  // ---------------------------------------------------------
  // Visibility states
  // ---------------------------------------------------------

  const showPersonal = step >= 1;
  const showSummary = step >= 2;
  const showExperience = step >= 3;
  const showProjects = step >= 4;
  const showEducation = step >= 5;
  const showSkills = step >= 6;
  const isDone = step >= 7;

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_80%_15%,hsl(var(--primary)/0.12),transparent_65%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_40%_at_10%_90%,hsl(var(--primary)/0.05),transparent_60%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-16 sm:gap-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8 lg:py-28">
        {/* =====================================================
            LEFT
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground">
            <FileCheck2 className="h-3.5 w-3.5 text-primary" />
            Create Resume from Form
          </div>

          <h1 className="font-serif text-[2.4rem] leading-[1.1] tracking-tight sm:text-[2.9rem] lg:text-[3.25rem]">
            Fill the fields.{" "}
            <span className="text-primary">Get a polished resume.</span>
          </h1>

          <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-muted-foreground">
            Enter your personal info, experience, projects, education and
            skills. Our system instantly turns it into a professional, ATS-ready
            resume.
          </p>

          {/* Live form progress */}
          <div className="mt-8 space-y-2.5">
            {steps.map((item, index) => {
              const active = step === index + 1;
              const completed = step > index + 1;
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * index }}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-all ${
                    active
                      ? "border-primary/40 bg-primary/5"
                      : completed
                        ? "border-border bg-muted/30"
                        : "border-border/60 bg-background"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      completed
                        ? "bg-emerald-500/15 text-emerald-500"
                        : active
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-[13px] font-medium ${
                        active || completed
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </p>
                  </div>

                  {active && (
                    <motion.div
                      layoutId="active-dot"
                      className="h-2 w-2 rounded-full bg-primary"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-11 rounded-full px-6 text-[14.5px] font-medium sm:h-12 sm:px-7"
            >
              Start Filling Form
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-full px-5 text-[14.5px] sm:h-12"
            >
              See Templates
            </Button>
          </div>
        </motion.div>

        {/* =====================================================
            RIGHT — LIVE RESUME
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1,
          }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
            <div className="pointer-events-none absolute -inset-12 rounded-[2.5rem] bg-primary/12 blur-[90px]" />

            <div
              className="relative overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-border"
              style={{ aspectRatio: "210 / 297" }}
            >
              <div className="absolute left-0 top-0 h-full w-[3px] bg-primary" />

              <div className="h-full overflow-y-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* =====================================================
                    PERSONAL
                ====================================================== */}

                <AnimatePresence>
                  {showPersonal && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="mb-1 flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3 text-primary" />

                            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-primary">
                              Professional Resume
                            </span>
                          </div>

                          <h2 className="font-serif text-[22px] font-semibold leading-[0.95]">
                            {personal.firstName}

                            <span className="block text-foreground/80">
                              {personal.lastName}
                            </span>
                          </h2>

                          <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                            {personal.jobTitle}
                          </p>
                        </div>

                        <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-primary/20">
                          {personal.photo ? (
                            <Image
                              src={personal.photo}
                              alt={`${personal.firstName} ${personal.lastName}`}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-[12px] font-bold text-primary">
                              {personal.firstName?.[0]}
                              {personal.lastName?.[0]}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-2 text-[9px] text-muted-foreground">
                        {personal.email && <span>{personal.email}</span>}

                        {personal.email && personal.location && <span>·</span>}

                        {personal.location && <span>{personal.location}</span>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* =====================================================
                    SUMMARY
                ====================================================== */}

                <AnimatePresence>
                  {showSummary && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3.5"
                    >
                      <SectionTitle>Profile</SectionTitle>

                      <p className="text-[10px] leading-[1.55] text-foreground/90">
                        {resume.summary}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* =====================================================
                    EXPERIENCE
                ====================================================== */}

                <AnimatePresence>
                  {showExperience && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3.5"
                    >
                      <SectionTitle>Experience</SectionTitle>

                      {resume.experience.slice(0, 2).map((experience) => (
                        <div key={experience.id} className="mb-2">
                          <div className="flex justify-between gap-2">
                            <p className="text-[10.5px] font-semibold">
                              {experience.position}
                            </p>

                            <span className="text-[8px] text-muted-foreground">
                              {experience.startDate?.slice(0, 4)} —{" "}
                              {experience.current
                                ? "Present"
                                : experience.endDate?.slice(0, 4)}
                            </span>
                          </div>

                          <p className="text-[9px] text-muted-foreground">
                            {experience.company}

                            {experience.location
                              ? ` · ${experience.location}`
                              : ""}
                          </p>

                          {experience.achievements?.[0] && (
                            <p className="mt-0.5 text-[9px] leading-[1.4] text-foreground/85">
                              • {experience.achievements[0]}
                            </p>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* =====================================================
                    PROJECTS
                ====================================================== */}

                <AnimatePresence>
                  {showProjects && resume.projects?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3.5"
                    >
                      <SectionTitle>Projects</SectionTitle>

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

                          <p className="mt-0.5 text-[9px] leading-[1.4] text-foreground/90">
                            {project.description}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* =====================================================
                    EDUCATION
                ====================================================== */}

                <AnimatePresence>
                  {showEducation && resume.education?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3.5"
                    >
                      <SectionTitle>Education</SectionTitle>

                      {resume.education.slice(0, 1).map((education) => (
                        <div key={education.id}>
                          <p className="text-[10.5px] font-semibold">
                            {education.degree}

                            {education.fieldOfStudy
                              ? ` in ${education.fieldOfStudy}`
                              : ""}
                          </p>

                          <p className="text-[9px] text-muted-foreground">
                            {education.institution}

                            {education.grade ? ` · ${education.grade}` : ""}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* =====================================================
                    SKILLS
                ====================================================== */}

                <AnimatePresence>
                  {showSkills && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <SectionTitle>Expertise</SectionTitle>

                      <div className="flex flex-wrap gap-1.5">
                        {resume.skills.slice(0, 8).map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded bg-muted px-1.5 py-0.5 text-[8.5px] font-medium"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>

                      {/* Certifications */}
                      {resume.certifications?.length > 0 && (
                        <div className="mt-2.5">
                          <p className="mb-1 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                            Certifications
                          </p>

                          {resume.certifications
                            .slice(0, 2)
                            .map((certification) => (
                              <p
                                key={certification.id}
                                className="text-[9px] text-foreground/90"
                              >
                                {certification.name}
                              </p>
                            ))}
                        </div>
                      )}

                      {/* Languages */}
                      {resume.languages?.length > 0 && (
                        <div className="mt-2">
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

                {/* =====================================================
                    DONE
                ====================================================== */}

                <AnimatePresence>
                  {isDone && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Resume Generated
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="mt-5 text-center text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Live preview · updates as you fill the form
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// Section Title
// ---------------------------------------------------------

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <h3 className="text-[9px] font-bold uppercase tracking-[0.15em]">
        {children}
      </h3>

      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
