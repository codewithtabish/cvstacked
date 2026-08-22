import {
  Award,
  ExternalLink,
  GitGraph,
  Globe,
  GraduationCap,
  Heart,
  Languages,
  Link,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type { ResumeData } from "@/data/resume";

interface TaboshProps {
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
    <span className="whitespace-nowrap text-[10px] font-medium tracking-wide text-muted-foreground">
      {start}
      {start && end ? " — " : ""}
      {end}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="size-1.5 shrink-0 rounded-full bg-primary" />

      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
        {children}
      </h2>

      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ContactLink({
  href,
  icon,
  children,
}: {
  href?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      {icon}

      <span className="break-all">{children}</span>
    </a>
  );
}

function SkillGroup({
  category,
  skills,
}: {
  category: string;
  skills: ResumeData["skills"];
}) {
  return (
    <div>
      <h3 className="mb-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {category}
      </h3>

      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-md border border-border bg-muted/40 px-2 py-1 text-[10px] font-medium text-foreground"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Tabosh({ resume }: TaboshProps) {
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

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(skill);

    return groups;
  }, {});

  return (
    <article className="mx-auto w-full max-w-[210mm] overflow-hidden bg-background text-foreground shadow-2xl print:max-w-none print:shadow-none">
      <div className="min-h-[297mm] px-[16mm] py-[15mm] sm:px-[18mm] sm:py-[16mm] print:min-h-0">
        {/* ============================================================
            HEADER
        ============================================================ */}

        <header className="border-b-2 border-foreground/10 pb-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="size-3.5 text-primary" />

                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-primary">
                  Resume
                </span>
              </div>

              <h1 className="text-[38px] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[46px]">
                {personal.firstName}{" "}
                <span className="text-primary">{personal.lastName}</span>
              </h1>

              {personal.jobTitle ? (
                <p className="mt-3 text-[13px] font-semibold tracking-[-0.01em] text-muted-foreground">
                  {personal.jobTitle}
                </p>
              ) : null}
            </div>

            {personal.photo ? (
              <div className="shrink-0">
                <img
                  src={personal.photo}
                  alt={`${personal.firstName} ${personal.lastName}`}
                  className="size-[82px] rounded-2xl object-cover ring-1 ring-border"
                />
              </div>
            ) : null}
          </div>

          <div className="mt-6 grid gap-x-5 gap-y-2 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {personal.email ? (
              <ContactLink
                href={`mailto:${personal.email}`}
                icon={<Mail className="size-3.5 shrink-0 text-primary" />}
              >
                {personal.email}
              </ContactLink>
            ) : null}

            {personal.phone ? (
              <ContactLink
                href={`tel:${personal.phone}`}
                icon={<Phone className="size-3.5 shrink-0 text-primary" />}
              >
                {personal.phone}
              </ContactLink>
            ) : null}

            {personal.location ? (
              <span className="inline-flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                <MapPin className="size-3.5 shrink-0 text-primary" />
                <span className="break-words">{personal.location}</span>
              </span>
            ) : null}

            {personal.website ? (
              <ContactLink
                href={personal.website}
                icon={<Globe className="size-3.5 shrink-0 text-primary" />}
              >
                {personal.website.replace(/^https?:\/\//, "")}
              </ContactLink>
            ) : null}

            {personal.linkedin ? (
              <ContactLink
                href={personal.linkedin}
                icon={<Link className="size-3.5 shrink-0 text-primary" />}
              >
                LinkedIn
              </ContactLink>
            ) : null}

            {personal.github ? (
              <ContactLink
                href={personal.github}
                icon={<GitGraph className="size-3.5 shrink-0 text-primary" />}
              >
                GitHub
              </ContactLink>
            ) : null}

            {personal.portfolio ? (
              <ContactLink
                href={personal.portfolio}
                icon={
                  <ExternalLink className="size-3.5 shrink-0 text-primary" />
                }
              >
                Portfolio
              </ContactLink>
            ) : null}
          </div>
        </header>

        {/* ============================================================
            SUMMARY
        ============================================================ */}

        {resume.summary ? (
          <section className="border-b border-border py-7">
            <SectionHeading>Profile</SectionHeading>

            <p className="text-[11.5px] leading-[1.8] text-muted-foreground">
              {resume.summary}
            </p>
          </section>
        ) : null}

        {/* ============================================================
            EXPERIENCE
        ============================================================ */}

        {hasExperience ? (
          <section className="py-8">
            <SectionHeading>Experience</SectionHeading>

            <div className="space-y-7">
              {resume.experience.map((experience) => (
                <article
                  key={experience.id}
                  className="break-inside-avoid border-l-2 border-primary/20 pl-4"
                >
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-6">
                    <div>
                      <h3 className="text-[13px] font-bold leading-tight tracking-[-0.01em]">
                        {experience.position}
                      </h3>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] font-medium text-muted-foreground">
                        <span>{experience.company}</span>

                        {experience.location ? (
                          <>
                            <span className="text-border">•</span>
                            <span>{experience.location}</span>
                          </>
                        ) : null}

                        {experience.employmentType ? (
                          <>
                            <span className="text-border">•</span>
                            <span>{experience.employmentType}</span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <DateRange
                        startDate={experience.startDate}
                        endDate={experience.endDate}
                        current={experience.current}
                      />
                    </div>
                  </div>

                  {experience.description ? (
                    <p className="mt-3 text-[10.5px] leading-[1.75] text-muted-foreground">
                      {experience.description}
                    </p>
                  ) : null}

                  {experience.achievements.length > 0 ? (
                    <ul className="mt-3 space-y-1.5">
                      {experience.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="relative pl-4 text-[10.5px] leading-[1.7] text-muted-foreground"
                        >
                          <span className="absolute left-0 top-[0.62em] size-1.5 rounded-full bg-primary" />
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

        {/* ============================================================
            EDUCATION + SKILLS
        ============================================================ */}

        {(hasEducation || hasSkills) && (
          <section className="border-t border-border py-8">
            <div className="grid gap-9 sm:grid-cols-[1.1fr_0.9fr] sm:gap-12">
              {hasEducation ? (
                <div className="break-inside-avoid">
                  <SectionHeading>Education</SectionHeading>

                  <div className="space-y-6">
                    {resume.education.map((education) => (
                      <article
                        key={education.id}
                        className="break-inside-avoid"
                      >
                        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-5">
                          <div>
                            <h3 className="text-[12px] font-bold leading-tight">
                              {education.degree}
                              {education.fieldOfStudy
                                ? ` in ${education.fieldOfStudy}`
                                : ""}
                            </h3>

                            <p className="mt-1.5 text-[10px] font-medium text-muted-foreground">
                              {education.institution}
                              {education.location
                                ? ` · ${education.location}`
                                : ""}
                            </p>

                            {education.grade ? (
                              <p className="mt-1.5 text-[9.5px] text-muted-foreground">
                                {education.grade}
                              </p>
                            ) : null}

                            {education.description ? (
                              <p className="mt-2 text-[10px] leading-[1.7] text-muted-foreground">
                                {education.description}
                              </p>
                            ) : null}
                          </div>

                          <div className="sm:text-right">
                            <DateRange
                              startDate={education.startDate}
                              endDate={education.endDate}
                              current={education.current}
                            />
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {hasSkills ? (
                <div className="break-inside-avoid">
                  <SectionHeading>Skills</SectionHeading>

                  <div className="space-y-5">
                    {Object.entries(groupedSkills).map(([category, skills]) => (
                      <SkillGroup
                        key={category}
                        category={category}
                        skills={skills}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        )}

        {/* ============================================================
            PROJECTS
        ============================================================ */}

        {hasProjects ? (
          <section className="border-t border-border py-8">
            <SectionHeading>Selected Projects</SectionHeading>

            <div className="grid gap-5 sm:grid-cols-2">
              {resume.projects.map((project) => (
                <article
                  key={project.id}
                  className="break-inside-avoid rounded-xl border border-border bg-muted/20 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[12px] font-bold">{project.name}</h3>

                      {project.role ? (
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                          {project.role}
                        </p>
                      ) : null}
                    </div>

                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                        aria-label={`Open ${project.name}`}
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}
                  </div>

                  <p className="mt-3 text-[10px] leading-[1.7] text-muted-foreground">
                    {project.description}
                  </p>

                  {project.technologies && project.technologies.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-md border border-border bg-background px-2 py-1 text-[8.5px] font-medium text-muted-foreground"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {project.achievements && project.achievements.length > 0 ? (
                    <ul className="mt-3 space-y-1">
                      {project.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="text-[9.5px] leading-[1.6] text-muted-foreground"
                        >
                          — {achievement}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* ============================================================
            SECONDARY INFORMATION
        ============================================================ */}

        {(hasCertifications ||
          hasLanguages ||
          hasAwards ||
          hasPublications ||
          hasVolunteer ||
          hasReferences ||
          hasInterests ||
          hasCustomSections) && (
          <section className="border-t border-border py-8">
            <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {/* CERTIFICATIONS */}

              {hasCertifications ? (
                <div className="break-inside-avoid">
                  <SectionHeading>Certifications</SectionHeading>

                  <div className="space-y-4">
                    {resume.certifications.map((certification) => (
                      <article key={certification.id}>
                        <div className="flex gap-2.5">
                          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />

                          <div className="min-w-0">
                            <h3 className="text-[10.5px] font-bold leading-[1.45]">
                              {certification.name}
                            </h3>

                            <p className="mt-1 text-[9.5px] text-muted-foreground">
                              {certification.issuer}
                            </p>

                            <div className="mt-1 flex flex-wrap gap-x-2 text-[8.5px] text-muted-foreground">
                              {certification.issueDate ? (
                                <span>Issued {certification.issueDate}</span>
                              ) : null}

                              {certification.expiryDate ? (
                                <span>Expires {certification.expiryDate}</span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* LANGUAGES */}

              {hasLanguages ? (
                <div className="break-inside-avoid">
                  <SectionHeading>Languages</SectionHeading>

                  <div className="space-y-3">
                    {resume.languages.map((language) => (
                      <div
                        key={language.id}
                        className="flex items-center justify-between gap-4 border-b border-border/70 pb-2.5 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <Languages className="size-3.5 text-primary" />

                          <span className="text-[10.5px] font-semibold">
                            {language.name}
                          </span>
                        </div>

                        <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
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
                  <SectionHeading>Awards</SectionHeading>

                  <div className="space-y-4">
                    {resume.awards.map((award) => (
                      <article key={award.id}>
                        <div className="flex gap-2.5">
                          <Award className="mt-0.5 size-3.5 shrink-0 text-primary" />

                          <div>
                            <h3 className="text-[10.5px] font-bold">
                              {award.title}
                            </h3>

                            <p className="mt-1 text-[9.5px] text-muted-foreground">
                              {award.issuer} · {award.date}
                            </p>

                            {award.description ? (
                              <p className="mt-1.5 text-[9.5px] leading-[1.65] text-muted-foreground">
                                {award.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* PUBLICATIONS */}

              {hasPublications ? (
                <div className="break-inside-avoid">
                  <SectionHeading>Publications</SectionHeading>

                  <div className="space-y-4">
                    {resume.publications.map((publication) => (
                      <article key={publication.id}>
                        <h3 className="text-[10.5px] font-bold leading-[1.45]">
                          {publication.title}
                        </h3>

                        <p className="mt-1 text-[9px] text-muted-foreground">
                          {publication.publisher} · {publication.date}
                        </p>

                        {publication.description ? (
                          <p className="mt-1.5 text-[9.5px] leading-[1.65] text-muted-foreground">
                            {publication.description}
                          </p>
                        ) : null}

                        {publication.url ? (
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1.5 inline-flex items-center gap-1 text-[8.5px] font-semibold text-primary hover:underline"
                          >
                            Read publication
                            <ExternalLink className="size-2.5" />
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
                  <SectionHeading>Volunteer</SectionHeading>

                  <div className="space-y-4">
                    {resume.volunteer.map((volunteer) => (
                      <article key={volunteer.id}>
                        <h3 className="text-[10.5px] font-bold">
                          {volunteer.role}
                        </h3>

                        <p className="mt-1 text-[9.5px] text-muted-foreground">
                          {volunteer.organization}
                        </p>

                        <div className="mt-1">
                          <DateRange
                            startDate={volunteer.startDate}
                            endDate={volunteer.endDate}
                            current={volunteer.current}
                          />
                        </div>

                        <p className="mt-1.5 text-[9.5px] leading-[1.65] text-muted-foreground">
                          {volunteer.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* REFERENCES */}

              {hasReferences ? (
                <div className="break-inside-avoid">
                  <SectionHeading>References</SectionHeading>

                  <div className="space-y-4">
                    {resume.references.map((reference) => (
                      <article key={reference.id}>
                        <h3 className="text-[10.5px] font-bold">
                          {reference.name}
                        </h3>

                        <p className="mt-1 text-[9.5px] text-muted-foreground">
                          {reference.position} · {reference.company}
                        </p>

                        {reference.relationship ? (
                          <p className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.1em] text-primary">
                            {reference.relationship}
                          </p>
                        ) : null}

                        {reference.email ? (
                          <p className="mt-1.5 text-[9px] text-muted-foreground">
                            {reference.email}
                          </p>
                        ) : null}

                        {reference.phone ? (
                          <p className="mt-0.5 text-[9px] text-muted-foreground">
                            {reference.phone}
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
                  <SectionHeading>Interests</SectionHeading>

                  <div className="flex flex-wrap gap-2">
                    {resume.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[9.5px] font-medium text-muted-foreground"
                      >
                        <Heart className="size-2.5 text-primary" />
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
                      <SectionHeading>{section.title}</SectionHeading>

                      {section.description ? (
                        <p className="mb-4 text-[9.5px] leading-[1.65] text-muted-foreground">
                          {section.description}
                        </p>
                      ) : null}

                      <div className="space-y-4">
                        {section.items.map((item) => (
                          <article key={item.id}>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-[10.5px] font-bold">
                                  {item.title}
                                </h3>

                                {item.subtitle ? (
                                  <p className="mt-1 text-[9px] text-muted-foreground">
                                    {item.subtitle}
                                  </p>
                                ) : null}
                              </div>

                              {item.date ? (
                                <span className="whitespace-nowrap text-[8.5px] uppercase tracking-[0.08em] text-muted-foreground">
                                  {item.date}
                                </span>
                              ) : null}
                            </div>

                            {item.description ? (
                              <p className="mt-1.5 text-[9.5px] leading-[1.65] text-muted-foreground">
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

        <footer className="mt-2 flex flex-col gap-2 border-t-2 border-foreground/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-3.5 text-primary" />

            <span className="text-[8.5px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {personal.firstName} {personal.lastName}
            </span>
          </div>

          {personal.jobTitle ? (
            <span className="text-[8.5px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {personal.jobTitle}
            </span>
          ) : null}
        </footer>
      </div>
    </article>
  );
}

export default Tabosh;
