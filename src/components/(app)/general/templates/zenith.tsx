import {
  Award,
  Briefcase,
  ExternalLink,
  GitBranch,
  Globe,
  GraduationCap,
  Heart,
  Languages,
  Link2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import type { ResumeData } from "@/data/resume";

interface ZenithProps {
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

  if (/^\d{4}$/.test(value)) {
    return value;
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

  return (
    <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
      {start}
      {start && end ? " – " : ""}
      {end}
    </span>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
        {children}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ContactItem({
  href,
  icon,
  children,
}: {
  href?: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  const content = (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background">
        {icon}
      </span>
      <span className="min-w-0 break-all">{children}</span>
    </span>
  );

  if (!href) {
    return <div>{content}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="transition-colors hover:text-primary"
    >
      {content}
    </a>
  );
}

export function Zenith({ resume }: ZenithProps) {
  const { personal } = resume;

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
    <article className="mx-auto w-full max-w-[210mm] bg-background text-foreground shadow-2xl print:max-w-none print:shadow-none">
      <div className="px-[16mm] py-[16mm] sm:px-[18mm] sm:py-[17mm]">
        {/* ============================================================
            HEADER
        ============================================================ */}
        <header className="relative overflow-hidden rounded-2xl border border-border bg-muted/30 px-7 py-8">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-primary" />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <Sparkles className="size-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  Professional Resume
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {personal.firstName}{" "}
                <span className="text-muted-foreground">
                  {personal.lastName}
                </span>
              </h1>

              {personal.jobTitle ? (
                <p className="mt-3 text-base font-medium text-muted-foreground">
                  {personal.jobTitle}
                </p>
              ) : null}
            </div>

            {personal.photo ? (
              <img
                src={personal.photo}
                alt={`${personal.firstName} ${personal.lastName}`}
                className="size-24 shrink-0 rounded-2xl object-cover ring-1 ring-border"
              />
            ) : null}
          </div>

          <div className="mt-7 grid gap-3 border-t border-border/60 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            {personal.email ? (
              <ContactItem
                href={`mailto:${personal.email}`}
                icon={<Mail className="size-3.5" />}
              >
                {personal.email}
              </ContactItem>
            ) : null}

            {personal.phone ? (
              <ContactItem
                href={`tel:${personal.phone}`}
                icon={<Phone className="size-3.5" />}
              >
                {personal.phone}
              </ContactItem>
            ) : null}

            {personal.location ? (
              <ContactItem icon={<MapPin className="size-3.5" />}>
                {personal.location}
              </ContactItem>
            ) : null}

            {personal.website ? (
              <ContactItem
                href={personal.website}
                icon={<Globe className="size-3.5" />}
              >
                {personal.website.replace(/^https?:\/\//, "")}
              </ContactItem>
            ) : null}

            {personal.linkedin ? (
              <ContactItem
                href={personal.linkedin}
                icon={<Link2 className="size-3.5" />}
              >
                LinkedIn
              </ContactItem>
            ) : null}

            {personal.github ? (
              <ContactItem
                href={personal.github}
                icon={<GitBranch className="size-3.5" />}
              >
                GitHub
              </ContactItem>
            ) : null}

            {personal.portfolio ? (
              <ContactItem
                href={personal.portfolio}
                icon={<ExternalLink className="size-3.5" />}
              >
                Portfolio
              </ContactItem>
            ) : null}
          </div>
        </header>

        {/* ============================================================
            SUMMARY
        ============================================================ */}
        {resume.summary ? (
          <section className="mt-10">
            <SectionTitle>Profile</SectionTitle>
            <p className="max-w-4xl text-[13.5px] leading-7 text-muted-foreground">
              {resume.summary}
            </p>
          </section>
        ) : null}

        {/* ============================================================
            EXPERIENCE
        ============================================================ */}
        {hasExperience ? (
          <section className="mt-10">
            <SectionTitle>Experience</SectionTitle>

            <div className="space-y-8">
              {resume.experience.map((experience) => (
                <article
                  key={experience.id}
                  className="break-inside-avoid grid gap-4 sm:grid-cols-[130px_1fr] sm:gap-6"
                >
                  <div className="sm:border-r sm:border-border sm:pr-5">
                    <DateRange
                      startDate={experience.startDate}
                      endDate={experience.endDate}
                      current={experience.current}
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold tracking-tight">
                      {experience.position}
                    </h3>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                      <span className="font-medium">{experience.company}</span>
                      {experience.location ? (
                        <>
                          <span>·</span>
                          <span>{experience.location}</span>
                        </>
                      ) : null}
                      {experience.employmentType ? (
                        <>
                          <span>·</span>
                          <span>{experience.employmentType}</span>
                        </>
                      ) : null}
                    </div>

                    {experience.description ? (
                      <p className="mt-3 text-[13px] leading-6 text-muted-foreground">
                        {experience.description}
                      </p>
                    ) : null}

                    {experience.achievements.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {experience.achievements.map((achievement) => (
                          <li
                            key={achievement}
                            className="relative pl-4 text-[13px] leading-6 text-muted-foreground"
                          >
                            <span className="absolute left-0 top-[0.55em] size-1.5 rounded-full bg-primary" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* ============================================================
            EDUCATION + PROJECTS
        ============================================================ */}
        {(hasEducation || hasProjects) && (
          <section className="mt-10">
            <div className="grid gap-10 lg:grid-cols-2">
              {hasEducation ? (
                <div>
                  <SectionTitle>Education</SectionTitle>
                  <div className="space-y-6">
                    {resume.education.map((education) => (
                      <article
                        key={education.id}
                        className="break-inside-avoid"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-[14px] font-semibold">
                            {education.degree}
                            {education.fieldOfStudy
                              ? ` in ${education.fieldOfStudy}`
                              : ""}
                          </h3>
                          <DateRange
                            startDate={education.startDate}
                            endDate={education.endDate}
                            current={education.current}
                          />
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          {education.institution}
                          {education.location ? ` · ${education.location}` : ""}
                        </p>
                        {education.grade ? (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {education.grade}
                          </p>
                        ) : null}
                        {education.description ? (
                          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
                            {education.description}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {hasProjects ? (
                <div>
                  <SectionTitle>Projects</SectionTitle>
                  <div className="space-y-6">
                    {resume.projects.map((project) => (
                      <article key={project.id} className="break-inside-avoid">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[14px] font-semibold">
                              {project.name}
                            </h3>
                            {project.role ? (
                              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                                {project.role}
                              </p>
                            ) : null}
                          </div>
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground transition-colors hover:text-primary"
                              aria-label={`Open ${project.name}`}
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          ) : null}
                        </div>

                        <p className="mt-2.5 text-[13px] leading-6 text-muted-foreground">
                          {project.description}
                        </p>

                        {project.technologies &&
                        project.technologies.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {project.achievements &&
                        project.achievements.length > 0 ? (
                          <ul className="mt-3 space-y-1">
                            {project.achievements.map((achievement) => (
                              <li
                                key={achievement}
                                className="text-[12.5px] leading-5 text-muted-foreground"
                              >
                                — {achievement}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        )}

        {/* ============================================================
            SKILLS
        ============================================================ */}
        {hasSkills ? (
          <section className="mt-10">
            <SectionTitle>Expertise</SectionTitle>
            <div className="grid gap-6 sm:grid-cols-2">
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-md border border-border bg-background px-2.5 py-1 text-[13px] text-foreground"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ============================================================
            ADDITIONAL INFORMATION
        ============================================================ */}
        {(hasCertifications ||
          hasLanguages ||
          hasAwards ||
          hasPublications ||
          hasVolunteer ||
          hasReferences ||
          hasInterests ||
          hasCustomSections) && (
          <section className="mt-10">
            <SectionTitle>Additional Information</SectionTitle>

            <div className="grid gap-8 sm:grid-cols-2">
              {/* CERTIFICATIONS */}
              {hasCertifications ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="size-4 text-primary" />
                    Certifications
                  </h3>
                  <div className="space-y-4">
                    {resume.certifications.map((cert) => (
                      <article key={cert.id}>
                        <p className="text-[13.5px] font-medium">{cert.name}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {cert.issuer}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                          {cert.issueDate ? (
                            <span>Issued {cert.issueDate}</span>
                          ) : null}
                          {cert.expiryDate ? (
                            <span>Expires {cert.expiryDate}</span>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* LANGUAGES */}
              {hasLanguages ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Languages className="size-4 text-primary" />
                    Languages
                  </h3>
                  <div className="space-y-2.5">
                    {resume.languages.map((language) => (
                      <div
                        key={language.id}
                        className="flex items-center justify-between gap-4 border-b border-border pb-2.5 last:border-0 last:pb-0"
                      >
                        <span className="text-[13.5px] font-medium">
                          {language.name}
                        </span>
                        <span className="text-sm capitalize text-muted-foreground">
                          {language.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* AWARDS */}
              {hasAwards ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Award className="size-4 text-primary" />
                    Awards
                  </h3>
                  <div className="space-y-4">
                    {resume.awards.map((award) => (
                      <article key={award.id}>
                        <p className="text-[13.5px] font-medium">
                          {award.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {award.issuer} · {award.date}
                        </p>
                        {award.description ? (
                          <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                            {award.description}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* PUBLICATIONS */}
              {hasPublications ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 text-sm font-semibold">Publications</h3>
                  <div className="space-y-4">
                    {resume.publications.map((pub) => (
                      <article key={pub.id}>
                        <p className="text-[13.5px] font-medium">{pub.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {pub.publisher} · {pub.date}
                        </p>
                        {pub.description ? (
                          <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                            {pub.description}
                          </p>
                        ) : null}
                        {pub.url ? (
                          <a
                            href={pub.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                          >
                            Read publication
                            <ExternalLink className="size-3" />
                          </a>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* VOLUNTEER */}
              {hasVolunteer ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 text-sm font-semibold">Volunteer</h3>
                  <div className="space-y-4">
                    {resume.volunteer.map((vol) => (
                      <article key={vol.id}>
                        <p className="text-[13.5px] font-medium">{vol.role}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {vol.organization}
                        </p>
                        <div className="mt-1">
                          <DateRange
                            startDate={vol.startDate}
                            endDate={vol.endDate}
                            current={vol.current}
                          />
                        </div>
                        <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                          {vol.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* REFERENCES */}
              {hasReferences ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 text-sm font-semibold">References</h3>
                  <div className="space-y-4">
                    {resume.references.map((ref) => (
                      <article key={ref.id}>
                        <p className="text-[13.5px] font-medium">{ref.name}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {ref.position} · {ref.company}
                        </p>
                        {ref.relationship ? (
                          <p className="mt-1 text-xs font-medium text-primary">
                            {ref.relationship}
                          </p>
                        ) : null}
                        {ref.email ? (
                          <p className="mt-1.5 text-sm text-muted-foreground">
                            {ref.email}
                          </p>
                        ) : null}
                        {ref.phone ? (
                          <p className="text-sm text-muted-foreground">
                            {ref.phone}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* INTERESTS */}
              {hasInterests ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Heart className="size-4 text-primary" />
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resume.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-md border border-border px-2.5 py-1 text-[13px] text-muted-foreground"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* CUSTOM SECTIONS */}
              {hasCustomSections
                ? resume.customSections.map((section) => (
                    <div key={section.id} className="break-inside-avoid">
                      <h3 className="mb-3 text-sm font-semibold">
                        {section.title}
                      </h3>
                      {section.description ? (
                        <p className="mb-3 text-[13px] leading-6 text-muted-foreground">
                          {section.description}
                        </p>
                      ) : null}
                      <div className="space-y-4">
                        {section.items.map((item) => (
                          <article key={item.id}>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[13.5px] font-medium">
                                  {item.title}
                                </p>
                                {item.subtitle ? (
                                  <p className="mt-0.5 text-sm text-muted-foreground">
                                    {item.subtitle}
                                  </p>
                                ) : null}
                              </div>
                              {item.date ? (
                                <span className="whitespace-nowrap text-xs text-muted-foreground">
                                  {item.date}
                                </span>
                              ) : null}
                            </div>
                            {item.description ? (
                              <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                                {item.description}
                              </p>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </section>
        )}

        {/* ============================================================
            FOOTER
        ============================================================ */}
        <footer className="mt-12 flex flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              {personal.firstName} {personal.lastName}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {personal.jobTitle}
          </span>
        </footer>
      </div>
    </article>
  );
}

export default Zenith;
