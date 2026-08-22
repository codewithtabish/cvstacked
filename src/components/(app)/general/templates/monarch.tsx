import {
  Award,
  BriefcaseBusiness,
  ExternalLink,
  GraduationCap,
  Heart,
  Languages,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import type { ResumeData } from "@/data/resume";

interface MonarchProps {
  resume: ResumeData;
}

function formatDate(date?: string) {
  if (!date) return "";

  const value = date.trim();

  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-");

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(Number(year), Number(month) - 1));
  }

  return value;
}

function DateRange({
  startDate,
  endDate,
  current,
}: {
  startDate?: string;
  endDate?: string;
  current?: boolean;
}) {
  const start = formatDate(startDate);
  const end = current ? "Present" : formatDate(endDate);

  if (!start && !end) return null;

  return (
    <span className="whitespace-nowrap text-[8.5px] font-semibold tracking-wide text-muted-foreground">
      {start}
      {start && end ? " — " : ""}
      {end}
    </span>
  );
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="h-px w-5 bg-current opacity-50" />
      <h2 className="text-[8px] font-bold uppercase tracking-[0.22em]">
        {children}
      </h2>
    </div>
  );
}

function MainHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
        {children}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ContactRow({
  href,
  icon,
  children,
}: {
  href?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const content = (
    <span className="flex min-w-0 items-start gap-2.5">
      <span className="mt-0.5 shrink-0 opacity-80">{icon}</span>
      <span className="min-w-0 break-words">{children}</span>
    </span>
  );

  if (!href) return content;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="transition-opacity hover:opacity-70"
    >
      {content}
    </a>
  );
}

export function Monarch({ resume }: MonarchProps) {
  const { personal } = resume;

  const accent = resume.accentColor || "#2563EB";

  const hasExperience = resume.experience.length > 0;
  const hasEducation = resume.education.length > 0;
  const hasSkills = resume.skills.length > 0;
  const hasProjects = resume.projects.length > 0;
  const hasCertifications = resume.certifications.length > 0;
  const hasLanguages = resume.languages.length > 0;
  const hasAwards = resume.awards.length > 0;
  const hasPublications = resume.publications.length > 0;
  const hasVolunteer = resume.volunteer.length > 0;
  const hasReferences = resume.references.length > 0;
  const hasInterests = resume.interests.length > 0;
  const hasCustomSections = resume.customSections.length > 0;

  const groupedSkills = resume.skills.reduce<
    Record<string, typeof resume.skills>
  >((groups, skill) => {
    const category = skill.category || "Skills";

    if (!groups[category]) groups[category] = [];
    groups[category].push(skill);

    return groups;
  }, {});

  return (
    <>
      <style>{`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .monarch-resume {
            width: 210mm !important;
            min-height: 297mm !important;
            max-width: 210mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }

          .monarch-page {
            min-height: 297mm !important;
          }

          .monarch-no-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .monarch-page-break {
            break-before: page;
            page-break-before: always;
          }
        }
      `}</style>

      <article
        className="monarch-resume mx-auto w-full max-w-[210mm] overflow-hidden bg-background text-foreground shadow-[0_24px_70px_rgba(15,23,42,0.18)] print:max-w-none print:shadow-none"
        style={{ "--monarch-accent": accent } as React.CSSProperties}
      >
        <div className="monarch-page grid min-h-[297mm] grid-cols-[65mm_1fr]">
          {/* ==========================================================
              LEFT SIDEBAR
          =========================================================== */}
          <aside
            className="relative overflow-hidden px-[9mm] py-[10mm] text-white"
            style={{ backgroundColor: accent }}
          >
            {/* Decorative geometry */}
            <div
              className="absolute -right-20 -top-20 size-44 rounded-full border-[18px] border-white/10"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -left-24 size-48 rounded-full border-[22px] border-white/10"
              aria-hidden="true"
            />

            <div className="relative z-10">
              {/* Photo */}
              {personal.photo ? (
                <div className="mb-6">
                  <div className="size-[30mm] overflow-hidden rounded-2xl border-2 border-white/30 bg-white/10 p-1 shadow-lg">
                    <img
                      src={personal.photo}
                      alt={`${personal.firstName} ${personal.lastName}`}
                      className="size-full rounded-xl object-cover"
                    />
                  </div>
                </div>
              ) : null}

              {/* Contact */}
              {(personal.email ||
                personal.phone ||
                personal.location ||
                personal.website ||
                personal.linkedin ||
                personal.github ||
                personal.portfolio) && (
                <section className="mb-7 monarch-no-break">
                  <SidebarLabel>Contact</SidebarLabel>

                  <div className="space-y-3 text-[8.5px] leading-[1.45] text-white/85">
                    {personal.email ? (
                      <ContactRow
                        href={`mailto:${personal.email}`}
                        icon={<Mail className="size-3" />}
                      >
                        {personal.email}
                      </ContactRow>
                    ) : null}

                    {personal.phone ? (
                      <ContactRow
                        href={`tel:${personal.phone}`}
                        icon={<Phone className="size-3" />}
                      >
                        {personal.phone}
                      </ContactRow>
                    ) : null}

                    {personal.location ? (
                      <ContactRow icon={<MapPin className="size-3" />}>
                        {personal.location}
                      </ContactRow>
                    ) : null}

                    {personal.website ? (
                      <ContactRow
                        href={personal.website}
                        icon={<ExternalLink className="size-3" />}
                      >
                        {personal.website.replace(/^https?:\/\//, "")}
                      </ContactRow>
                    ) : null}

                    {personal.linkedin ? (
                      <ContactRow
                        href={personal.linkedin}
                        icon={<span className="text-[8px] font-bold">in</span>}
                      >
                        LinkedIn
                      </ContactRow>
                    ) : null}

                    {personal.github ? (
                      <ContactRow
                        href={personal.github}
                        icon={<span className="text-[7px] font-bold">GH</span>}
                      >
                        GitHub
                      </ContactRow>
                    ) : null}

                    {personal.portfolio ? (
                      <ContactRow
                        href={personal.portfolio}
                        icon={<ExternalLink className="size-3" />}
                      >
                        Portfolio
                      </ContactRow>
                    ) : null}
                  </div>
                </section>
              )}

              {/* Skills */}
              {hasSkills ? (
                <section className="mb-7 monarch-no-break">
                  <SidebarLabel>Expertise</SidebarLabel>

                  <div className="space-y-4">
                    {Object.entries(groupedSkills).map(([category, skills]) => (
                      <div key={category}>
                        <p className="mb-2 text-[7px] font-bold uppercase tracking-[0.16em] text-white/60">
                          {category}
                        </p>

                        <div className="space-y-2.5">
                          {skills.map((skill) => (
                            <div key={skill.id}>
                              <div className="mb-1 flex items-center justify-between gap-2">
                                <span className="text-[8.5px] font-medium">
                                  {skill.name}
                                </span>

                                {skill.level ? (
                                  <span className="text-[6.5px] uppercase tracking-wide text-white/55">
                                    {skill.level}
                                  </span>
                                ) : null}
                              </div>

                              <div className="h-1 overflow-hidden rounded-full bg-white/15">
                                <div
                                  className="h-full rounded-full bg-white/85"
                                  style={{
                                    width:
                                      skill.level === "expert"
                                        ? "100%"
                                        : skill.level === "advanced"
                                          ? "82%"
                                          : skill.level === "intermediate"
                                            ? "64%"
                                            : "42%",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Languages */}
              {hasLanguages ? (
                <section className="mb-7 monarch-no-break">
                  <SidebarLabel>Languages</SidebarLabel>

                  <div className="space-y-2.5 text-[8.5px]">
                    {resume.languages.map((language) => (
                      <div
                        key={language.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="flex items-center gap-2">
                          <Languages className="size-3 opacity-75" />
                          {language.name}
                        </span>
                        <span className="text-[6.5px] uppercase tracking-wide text-white/60">
                          {language.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Certifications */}
              {hasCertifications ? (
                <section className="mb-7 monarch-no-break">
                  <SidebarLabel>Certifications</SidebarLabel>

                  <div className="space-y-3.5">
                    {resume.certifications.map((certification) => (
                      <div key={certification.id} className="flex gap-2">
                        <ShieldCheck className="mt-0.5 size-3 shrink-0 opacity-80" />
                        <div className="min-w-0">
                          <p className="text-[8px] font-semibold leading-[1.35]">
                            {certification.name}
                          </p>
                          <p className="mt-0.5 text-[7px] text-white/60">
                            {certification.issuer}
                          </p>
                          {certification.issueDate ? (
                            <p className="mt-0.5 text-[6.5px] text-white/50">
                              {certification.issueDate}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Interests */}
              {hasInterests ? (
                <section className="mb-7 monarch-no-break">
                  <SidebarLabel>Interests</SidebarLabel>

                  <div className="flex flex-wrap gap-1.5">
                    {resume.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[7.5px] font-medium text-white/85"
                      >
                        <Heart className="size-2.5" />
                        {interest}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Awards */}
              {hasAwards ? (
                <section className="mb-7 monarch-no-break">
                  <SidebarLabel>Awards</SidebarLabel>

                  <div className="space-y-3.5">
                    {resume.awards.map((award) => (
                      <div key={award.id} className="flex gap-2">
                        <Award className="mt-0.5 size-3 shrink-0 opacity-80" />
                        <div className="min-w-0">
                          <p className="text-[8px] font-semibold leading-[1.35]">
                            {award.title}
                          </p>
                          <p className="mt-0.5 text-[7px] text-white/60">
                            {award.issuer} · {award.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </aside>

          {/* ==========================================================
              MAIN CONTENT
          =========================================================== */}
          <main className="min-w-0 bg-background px-[10mm] py-[10mm]">
            {/* Header */}
            <header className="mb-8 border-b border-border pb-6">
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <div
                    className="mb-3 h-1 w-10 rounded-full"
                    style={{ backgroundColor: accent }}
                  />

                  <h1 className="text-[31px] font-black leading-[0.98] tracking-[-0.05em] text-foreground">
                    {personal.firstName}
                    {personal.lastName ? (
                      <>
                        <br />
                        <span style={{ color: accent }}>
                          {personal.lastName}
                        </span>
                      </>
                    ) : null}
                  </h1>

                  {personal.jobTitle ? (
                    <p className="mt-3 text-[9.5px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {personal.jobTitle}
                    </p>
                  ) : null}
                </div>

                <div
                  className="mt-1 hidden size-12 shrink-0 rounded-full sm:block"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, transparent)`,
                    opacity: 0.14,
                  }}
                  aria-hidden="true"
                />
              </div>
            </header>

            {/* Profile */}
            {resume.summary ? (
              <section className="mb-7 monarch-no-break">
                <MainHeading>Profile</MainHeading>
                <p className="text-[9.5px] leading-[1.75] text-muted-foreground">
                  {resume.summary}
                </p>
              </section>
            ) : null}

            {/* Experience */}
            {hasExperience ? (
              <section className="mb-7">
                <MainHeading>Experience</MainHeading>

                <div className="space-y-6">
                  {resume.experience.map((experience, index) => (
                    <article
                      key={experience.id}
                      className="relative pl-5 monarch-no-break"
                    >
                      <span
                        className="absolute left-0 top-1.5 size-2 rounded-full ring-4 ring-background"
                        style={{ backgroundColor: accent }}
                      />

                      {index < resume.experience.length - 1 ? (
                        <span
                          className="absolute left-[3.5px] top-4 h-[calc(100%+12px)] w-px opacity-20"
                          style={{ backgroundColor: accent }}
                        />
                      ) : null}

                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-[11px] font-bold leading-[1.25]">
                            {experience.position}
                          </h3>

                          <p
                            className="mt-1 text-[8.5px] font-bold"
                            style={{ color: accent }}
                          >
                            {experience.company}
                          </p>

                          {(experience.location ||
                            experience.employmentType) && (
                            <p className="mt-0.5 text-[7.5px] text-muted-foreground">
                              {experience.location}
                              {experience.location && experience.employmentType
                                ? " · "
                                : ""}
                              {experience.employmentType}
                            </p>
                          )}
                        </div>

                        <DateRange
                          startDate={experience.startDate}
                          endDate={experience.endDate}
                          current={experience.current}
                        />
                      </div>

                      {experience.description ? (
                        <p className="mt-2.5 text-[8.5px] leading-[1.65] text-muted-foreground">
                          {experience.description}
                        </p>
                      ) : null}

                      {experience.achievements.length > 0 ? (
                        <ul className="mt-2.5 space-y-1">
                          {experience.achievements.map((achievement) => (
                            <li
                              key={achievement}
                              className="relative pl-3.5 text-[8.5px] leading-[1.6] text-muted-foreground"
                            >
                              <span
                                className="absolute left-0 top-[0.62em] size-1 rounded-full"
                                style={{ backgroundColor: accent }}
                              />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Projects */}
            {hasProjects ? (
              <section className="mb-7">
                <MainHeading>Selected Projects</MainHeading>

                <div className="grid gap-3">
                  {resume.projects.map((project) => (
                    <article
                      key={project.id}
                      className="rounded-xl border border-border bg-muted/20 p-3.5 monarch-no-break"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-[10px] font-bold">
                            {project.name}
                          </h3>

                          {project.role ? (
                            <p
                              className="mt-1 text-[7px] font-bold uppercase tracking-[0.13em]"
                              style={{ color: accent }}
                            >
                              {project.role}
                            </p>
                          ) : null}
                        </div>

                        {project.url ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${project.name}`}
                            className="shrink-0"
                            style={{ color: accent }}
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        ) : null}
                      </div>

                      <p className="mt-2 text-[8.5px] leading-[1.6] text-muted-foreground">
                        {project.description}
                      </p>

                      {project.technologies &&
                      project.technologies.length > 0 ? (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {project.technologies.map((technology) => (
                            <span
                              key={technology}
                              className="rounded-full border border-border bg-background px-1.5 py-1 text-[6.5px] font-semibold text-muted-foreground"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {project.achievements &&
                      project.achievements.length > 0 ? (
                        <ul className="mt-2.5 space-y-1">
                          {project.achievements.map((achievement) => (
                            <li
                              key={achievement}
                              className="text-[7.5px] leading-[1.55] text-muted-foreground"
                            >
                              <span className="mr-1" style={{ color: accent }}>
                                →
                              </span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Education */}
            {hasEducation ? (
              <section className="mb-7">
                <MainHeading>Education</MainHeading>

                <div className="space-y-4">
                  {resume.education.map((education) => (
                    <article
                      key={education.id}
                      className="flex gap-3 monarch-no-break"
                    >
                      <div
                        className="flex size-7 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: `${accent}15`,
                          color: accent,
                        }}
                      >
                        <GraduationCap className="size-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[9.5px] font-bold">
                              {education.degree}
                              {education.fieldOfStudy
                                ? ` in ${education.fieldOfStudy}`
                                : ""}
                            </h3>

                            <p className="mt-0.5 text-[8px] font-medium text-muted-foreground">
                              {education.institution}
                              {education.location
                                ? ` · ${education.location}`
                                : ""}
                            </p>
                          </div>

                          <DateRange
                            startDate={education.startDate}
                            endDate={education.endDate}
                            current={education.current}
                          />
                        </div>

                        {education.grade ? (
                          <p
                            className="mt-1.5 text-[7.5px] font-semibold"
                            style={{ color: accent }}
                          >
                            {education.grade}
                          </p>
                        ) : null}

                        {education.description ? (
                          <p className="mt-1.5 text-[8px] leading-[1.55] text-muted-foreground">
                            {education.description}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Publications */}
            {hasPublications ? (
              <section className="mb-7">
                <MainHeading>Publications</MainHeading>

                <div className="space-y-3.5">
                  {resume.publications.map((publication) => (
                    <article key={publication.id} className="monarch-no-break">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[9px] font-bold">
                            {publication.title}
                          </h3>
                          <p className="mt-0.5 text-[7.5px] text-muted-foreground">
                            {publication.publisher} · {publication.date}
                          </p>
                        </div>

                        {publication.url ? (
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0"
                            style={{ color: accent }}
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        ) : null}
                      </div>

                      {publication.description ? (
                        <p className="mt-1.5 text-[8px] leading-[1.55] text-muted-foreground">
                          {publication.description}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Volunteer */}
            {hasVolunteer ? (
              <section className="mb-7">
                <MainHeading>Volunteer</MainHeading>

                <div className="space-y-3.5">
                  {resume.volunteer.map((volunteer) => (
                    <article key={volunteer.id} className="monarch-no-break">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[9px] font-bold">
                            {volunteer.role}
                          </h3>
                          <p
                            className="mt-0.5 text-[7.5px] font-semibold"
                            style={{ color: accent }}
                          >
                            {volunteer.organization}
                          </p>
                        </div>

                        <DateRange
                          startDate={volunteer.startDate}
                          endDate={volunteer.endDate}
                          current={volunteer.current}
                        />
                      </div>

                      <p className="mt-1.5 text-[8px] leading-[1.55] text-muted-foreground">
                        {volunteer.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* References */}
            {hasReferences ? (
              <section className="mb-7">
                <MainHeading>References</MainHeading>

                <div className="grid grid-cols-2 gap-3">
                  {resume.references.map((reference) => (
                    <article
                      key={reference.id}
                      className="rounded-lg border border-border bg-muted/20 p-3 monarch-no-break"
                    >
                      <h3 className="text-[8.5px] font-bold">
                        {reference.name}
                      </h3>
                      <p className="mt-0.5 text-[7px] text-muted-foreground">
                        {reference.position} · {reference.company}
                      </p>

                      {reference.relationship ? (
                        <p
                          className="mt-1 text-[6.5px] font-bold uppercase tracking-wide"
                          style={{ color: accent }}
                        >
                          {reference.relationship}
                        </p>
                      ) : null}

                      {reference.email ? (
                        <p className="mt-1.5 break-all text-[7px] text-muted-foreground">
                          {reference.email}
                        </p>
                      ) : null}

                      {reference.phone ? (
                        <p className="mt-0.5 text-[7px] text-muted-foreground">
                          {reference.phone}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Custom sections */}
            {hasCustomSections
              ? resume.customSections.map((section) => (
                  <section key={section.id} className="mb-7 monarch-no-break">
                    <MainHeading>{section.title}</MainHeading>

                    {section.description ? (
                      <p className="mb-3 text-[8px] leading-[1.55] text-muted-foreground">
                        {section.description}
                      </p>
                    ) : null}

                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <article key={item.id}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-[8.5px] font-bold">
                                {item.title}
                              </h3>
                              {item.subtitle ? (
                                <p className="mt-0.5 text-[7px] text-muted-foreground">
                                  {item.subtitle}
                                </p>
                              ) : null}
                            </div>

                            {item.date ? (
                              <span className="whitespace-nowrap text-[6.5px] font-semibold text-muted-foreground">
                                {item.date}
                              </span>
                            ) : null}
                          </div>

                          {item.description ? (
                            <p className="mt-1 text-[7.5px] leading-[1.55] text-muted-foreground">
                              {item.description}
                            </p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </section>
                ))
              : null}

            {/* Small footer */}
            <footer className="mt-8 flex items-center justify-between border-t border-border pt-3">
              <span className="text-[6.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {personal.firstName} {personal.lastName}
              </span>

              <span
                className="text-[6.5px] font-bold uppercase tracking-[0.16em]"
                style={{ color: accent }}
              >
                Professional Resume
              </span>
            </footer>
          </main>
        </div>
      </article>
    </>
  );
}

export default Monarch;
