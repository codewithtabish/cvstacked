"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code2,
  FileText,
  FolderKanban,
  GraduationCap,
  Sparkles,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ResumeData } from "@/data/resume";

// ---------------------------------------------------------
// Steps
// ---------------------------------------------------------

const formSteps = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "summary", label: "Professional Summary", icon: FileText },
  { id: "experience", label: "Work Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills & More", icon: Code2 },
];

// ---------------------------------------------------------
// Live Form Builder Section
// ---------------------------------------------------------

export default function LiveFormBuilder({ resume }: { resume: ResumeData }) {
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  const { personal } = resume;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Start the sequence asynchronously.
    // This avoids a synchronous setState call inside the effect.
    timers.push(
      setTimeout(() => {
        setStep(0);
      }, 0),
    );

    timers.push(
      setTimeout(() => {
        setStep(1);
      }, 600),
    );

    timers.push(
      setTimeout(() => {
        setStep(2);
      }, 1800),
    );

    timers.push(
      setTimeout(() => {
        setStep(3);
      }, 3200),
    );

    timers.push(
      setTimeout(() => {
        setStep(4);
      }, 4600),
    );

    timers.push(
      setTimeout(() => {
        setStep(5);
      }, 5900),
    );

    timers.push(
      setTimeout(() => {
        setStep(6);
      }, 7200),
    );

    timers.push(
      setTimeout(() => {
        setStep(7);
      }, 8500),
    );

    timers.push(
      setTimeout(() => {
        setCycle((currentCycle) => currentCycle + 1);
      }, 10500),
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [cycle]);

  const showPersonal = step >= 1;
  const showSummary = step >= 2;
  const showExperience = step >= 3;
  const showProjects = step >= 4;
  const showEducation = step >= 5;
  const showSkills = step >= 6;
  const isDone = step >= 7;

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
            <FileText className="h-3.5 w-3.5 text-primary" />
            Guided Form Builder
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-serif text-[2.1rem] leading-[1.15] tracking-tight sm:text-[2.5rem] lg:text-[2.85rem]"
          >
            Fill the form.{" "}
            <span className="text-primary">Watch your resume appear.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground"
          >
            Enter your details section by section. The live preview updates in
            real time and turns everything into a clean, ATS-ready resume.
          </motion.p>
        </div>

        {/* Main content */}
        <div className="mt-16 grid items-center gap-12 lg:mt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Left – Steps */}
          <div className="order-2 space-y-3 lg:order-1">
            {formSteps.map((item, index) => {
              const active = step === index + 1;
              const completed = step > index + 1;
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.06 * index }}
                  className={`flex items-center gap-3.5 rounded-2xl border px-4 py-3.5 transition-all ${
                    active
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : completed
                        ? "border-border bg-muted/30"
                        : "border-border/60 bg-background"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      completed
                        ? "bg-emerald-500/15 text-emerald-500"
                        : active
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-[14px] font-medium ${
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
                      layoutId="form-active-dot"
                      className="h-2.5 w-2.5 rounded-full bg-primary"
                    />
                  )}
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <Button
                size="lg"
                className="h-12 rounded-full px-7 text-[14.5px] font-medium"
              >
                Start Filling the Form
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Right – Live Resume Preview */}
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
              <div className="pointer-events-none absolute -inset-12 rounded-[2.5rem] bg-primary/12 blur-[90px]" />

              <div
                className="relative overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-border"
                style={{ aspectRatio: "210 / 297" }}
              >
                <div className="absolute left-0 top-0 h-full w-[3px] bg-primary" />

                <div className="h-full overflow-y-auto px-5 py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {/* Header */}
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

                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
                            {personal.photo ? (
                              <Image
                                src={personal.photo}
                                alt={`${personal.firstName} ${personal.lastName}`}
                                fill
                                sizes="44px"
                                unoptimized
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
                          <span>{personal.email}</span>

                          <span>·</span>

                          <span>{personal.location}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Summary */}
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

                  {/* Experience */}
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

                  {/* Projects */}
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

                  {/* Education */}
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

                  {/* Skills */}
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

                  {/* Done badge */}
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
                  Live preview · updates as you fill each section
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// Helper
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
