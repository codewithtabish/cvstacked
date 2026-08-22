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

interface AtlasProps {
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
    <span className="whitespace-nowrap text-[11px] font-medium tracking-wide text-muted-foreground">
      {start}
      {start && end ? " — " : ""}
      {end}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground">
        {children}
      </h2>

      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
        {children}
      </h2>

      <div className="mt-2 h-px w-8 bg-primary" />
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
      className="flex min-w-0 items-start gap-2.5 text-[10.5px] leading-[1.5] text-muted-foreground transition-colors hover:text-primary"
    >
      <span className="mt-0.5 shrink-0 text-primary">{icon}</span>

      <span className="break-all">{children}</span>
    </a>
  );
}

export function Atlas({ resume }: AtlasProps) {
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
      <div className="grid min-h-[297mm] grid-cols-1 sm:grid-cols-[62mm_1fr]">
        {/* ============================================================
            SIDEBAR
        ============================================================ */}

        <aside className="border-b border-border bg-muted/30 px-[10mm] py-[13mm] sm:border-b-0 sm:border-r sm:px-[9mm] sm:py-[14mm]">
          {/* PROFILE */}

          <div className="mb-9">
            {personal.photo ? (
              <div className="mb-6">
                <img
                  src={personal.photo}
                  alt={`${personal.firstName} ${personal.lastName}`}
                  className="size-[78px] rounded-xl object-cover ring-1 ring-border"
                />
              </div>
            ) : (
              <div className="mb-6 flex size-[58px] items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
                {personal.firstName?.charAt(0)}
                {personal.lastName?.charAt(0)}
              </div>
            )}

            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-3 text-primary" />

              <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-primary">
                Professional Resume
              </span>
            </div>

            <h1 className="text-[30px] font-bold leading-[0.98] tracking-[-0.04em]">
              {personal.firstName}
              <span className="block">{personal.lastName}</span>
            </h1>

            {personal.jobTitle ? (
              <p className="mt-4 text-[12px] font-medium leading-[1.5] text-muted-foreground">
                {personal.jobTitle}
              </p>
            ) : null}
          </div>

          {/* CONTACT */}

          <section className="mb-9">
            <SidebarHeading>Contact</SidebarHeading>

            <div className="space-y-3.5">
              {personal.email ? (
                <ContactLink
                  href={`mailto:${personal.email}`}
                  icon={<Mail className="size-3" />}
                >
                  {personal.email}
                </ContactLink>
              ) : null}

              {personal.phone ? (
                <ContactLink
                  href={`tel:${personal.phone}`}
                  icon={<Phone className="size-3" />}
                >
                  {personal.phone}
                </ContactLink>
              ) : null}

              {personal.location ? (
                <div className="flex items-start gap-2.5 text-[10.5px] leading-[1.5] text-muted-foreground">
                  <MapPin className="mt-0.5 size-3 shrink-0 text-primary" />

                  <span>{personal.location}</span>
                </div>
              ) : null}

              {personal.website ? (
                <ContactLink
                  href={personal.website}
                  icon={<Globe className="size-3" />}
                >
                  {personal.website.replace(/^https?:\/\//, "")}
                </ContactLink>
              ) : null}

              {personal.linkedin ? (
                <ContactLink
                  href={personal.linkedin}
                  icon={<Link className="size-3" />}
                >
                  LinkedIn
                </ContactLink>
              ) : null}

              {personal.github ? (
                <ContactLink
                  href={personal.github}
                  icon={<GitGraph className="size-3" />}
                >
                  GitHub
                </ContactLink>
              ) : null}

              {personal.portfolio ? (
                <ContactLink
                  href={personal.portfolio}
                  icon={<ExternalLink className="size-3" />}
                >
                  Portfolio
                </ContactLink>
              ) : null}
            </div>
          </section>

          {/* SKILLS */}

          {hasSkills ? (
            <section className="mb-9">
              <SidebarHeading>Expertise</SidebarHeading>

              <div className="space-y-5">
                {Object.entries(groupedSkills).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="mb-2 text-[8.5px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      {category}
                    </h3>

                    <div className="space-y-1.5">
                      {skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="text-[10.5px] font-medium leading-[1.45] text-foreground"
                        >
                          {skill.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* LANGUAGES */}

          {hasLanguages ? (
            <section className="mb-9">
              <SidebarHeading>Languages</SidebarHeading>

              <div className="space-y-3">
                {resume.languages.map((language) => (
                  <div
                    key={language.id}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <Languages className="size-3 text-primary" />

                      <span className="text-[10.5px] font-medium">
                        {language.name}
                      </span>
                    </div>

                    <span className="text-right text-[8px] uppercase tracking-[0.08em] text-muted-foreground">
                      {language.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* CERTIFICATIONS */}

          {hasCertifications ? (
            <section className="mb-9">
              <SidebarHeading>Certifications</SidebarHeading>

              <div className="space-y-4">
                {resume.certifications.map((certification) => (
                  <div
                    key={certification.id}
                    className="flex items-start gap-2.5"
                  >
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />

                    <div className="min-w-0">
                      <h3 className="text-[10px] font-semibold leading-[1.4]">
                        {certification.name}
                      </h3>

                      <p className="mt-1 text-[9px] leading-[1.4] text-muted-foreground">
                        {certification.issuer}
                      </p>

                      {certification.issueDate ? (
                        <p className="mt-1 text-[8px] text-muted-foreground">
                          {certification.issueDate}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* INTERESTS */}

          {hasInterests ? (
            <section>
              <SidebarHeading>Interests</SidebarHeading>

              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {resume.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 text-[9.5px] text-muted-foreground"
                  >
                    <Heart className="size-2.5 text-primary" />

                    {interest}
                  </span>
                ))}
              </div>
            </section>
          ) : null}
        </aside>

        {/* ============================================================
            MAIN CONTENT
        ============================================================ */}

        <main className="min-w-0 px-[10mm] py-[13mm] sm:px-[12mm] sm:py-[14mm]">
          {/* SUMMARY */}

          {resume.summary ? (
            <section className="mb-10">
              <SectionHeading>Profile</SectionHeading>

              <p className="text-[12px] leading-[1.8] text-muted-foreground">
                {resume.summary}
              </p>
            </section>
          ) : null}

          {/* EXPERIENCE */}

          {hasExperience ? (
            <section className="mb-10">
              <SectionHeading>Experience</SectionHeading>

              <div className="space-y-8">
                {resume.experience.map((experience) => (
                  <article key={experience.id} className="break-inside-avoid">
                    <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-6">
                      <div className="min-w-0">
                        <h3 className="text-[14px] font-bold leading-[1.25] tracking-[-0.015em]">
                          {experience.position}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] font-medium text-muted-foreground">
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
                      <p className="mt-3.5 text-[11px] leading-[1.75] text-muted-foreground">
                        {experience.description}
                      </p>
                    ) : null}

                    {experience.achievements.length > 0 ? (
                      <ul className="mt-3.5 space-y-2">
                        {experience.achievements.map((achievement) => (
                          <li
                            key={achievement}
                            className="relative pl-4 text-[11px] leading-[1.7] text-muted-foreground"
                          >
                            <span className="absolute left-0 top-[0.6em] size-1.5 rounded-full bg-primary" />

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

          {/* EDUCATION */}

          {hasEducation ? (
            <section className="mb-10 break-inside-avoid">
              <SectionHeading>Education</SectionHeading>

              <div className="space-y-6">
                {resume.education.map((education) => (
                  <article
                    key={education.id}
                    className="grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-6"
                  >
                    <div>
                      <h3 className="text-[13px] font-bold leading-[1.35]">
                        {education.degree}

                        {education.fieldOfStudy
                          ? ` in ${education.fieldOfStudy}`
                          : ""}
                      </h3>

                      <p className="mt-1.5 text-[10.5px] font-medium text-muted-foreground">
                        {education.institution}

                        {education.location ? ` · ${education.location}` : ""}
                      </p>

                      {education.grade ? (
                        <p className="mt-1.5 text-[10px] text-muted-foreground">
                          {education.grade}
                        </p>
                      ) : null}

                      {education.description ? (
                        <p className="mt-2.5 text-[10.5px] leading-[1.7] text-muted-foreground">
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
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {/* PROJECTS */}

          {hasProjects ? (
            <section className="mb-10">
              <SectionHeading>Selected Projects</SectionHeading>

              <div className="grid gap-7 sm:grid-cols-2">
                {resume.projects.map((project) => (
                  <article
                    key={project.id}
                    className="break-inside-avoid border-t-2 border-primary/30 pt-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-[12.5px] font-bold leading-[1.35]">
                          {project.name}
                        </h3>

                        {project.role ? (
                          <p className="mt-1.5 text-[8.5px] font-bold uppercase tracking-[0.13em] text-primary">
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

                    <p className="mt-2.5 text-[10px] leading-[1.7] text-muted-foreground">
                      {project.description}
                    </p>

                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-sm bg-muted px-1.5 py-0.5 text-[8px] font-medium text-muted-foreground"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {project.achievements && project.achievements.length > 0 ? (
                      <ul className="mt-3 space-y-1.5">
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

          {/* SECONDARY INFORMATION */}

          {(hasAwards ||
            hasPublications ||
            hasVolunteer ||
            hasReferences ||
            hasCustomSections) && (
            <div className="grid gap-x-9 gap-y-9 sm:grid-cols-2">
              {/* AWARDS */}

              {hasAwards ? (
                <section className="break-inside-avoid">
                  <SectionHeading>Awards</SectionHeading>

                  <div className="space-y-5">
                    {resume.awards.map((award) => (
                      <article
                        key={award.id}
                        className="flex items-start gap-2.5"
                      >
                        <Award className="mt-0.5 size-3.5 shrink-0 text-primary" />

                        <div>
                          <h3 className="text-[10.5px] font-bold">
                            {award.title}
                          </h3>

                          <p className="mt-1 text-[9px] text-muted-foreground">
                            {award.issuer} · {award.date}
                          </p>

                          {award.description ? (
                            <p className="mt-1.5 text-[9.5px] leading-[1.6] text-muted-foreground">
                              {award.description}
                            </p>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* PUBLICATIONS */}

              {hasPublications ? (
                <section className="break-inside-avoid">
                  <SectionHeading>Publications</SectionHeading>

                  <div className="space-y-5">
                    {resume.publications.map((publication) => (
                      <article key={publication.id}>
                        <h3 className="text-[10.5px] font-bold leading-[1.4]">
                          {publication.title}
                        </h3>

                        <p className="mt-1 text-[9px] text-muted-foreground">
                          {publication.publisher} · {publication.date}
                        </p>

                        {publication.description ? (
                          <p className="mt-1.5 text-[9.5px] leading-[1.6] text-muted-foreground">
                            {publication.description}
                          </p>
                        ) : null}

                        {publication.url ? (
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-[8.5px] font-medium text-primary hover:underline"
                          >
                            Read publication
                            <ExternalLink className="size-2.5" />
                          </a>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* VOLUNTEER */}

              {hasVolunteer ? (
                <section className="break-inside-avoid">
                  <SectionHeading>Volunteer</SectionHeading>

                  <div className="space-y-5">
                    {resume.volunteer.map((volunteer) => (
                      <article key={volunteer.id}>
                        <h3 className="text-[10.5px] font-bold">
                          {volunteer.role}
                        </h3>

                        <p className="mt-1 text-[9.5px] text-muted-foreground">
                          {volunteer.organization}
                        </p>

                        <div className="mt-1.5">
                          <DateRange
                            startDate={volunteer.startDate}
                            endDate={volunteer.endDate}
                            current={volunteer.current}
                          />
                        </div>

                        <p className="mt-1.5 text-[9.5px] leading-[1.6] text-muted-foreground">
                          {volunteer.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* REFERENCES */}

              {hasReferences ? (
                <section className="break-inside-avoid">
                  <SectionHeading>References</SectionHeading>

                  <div className="space-y-5">
                    {resume.references.map((reference) => (
                      <article key={reference.id}>
                        <h3 className="text-[10.5px] font-bold">
                          {reference.name}
                        </h3>

                        <p className="mt-1 text-[9.5px] text-muted-foreground">
                          {reference.position} · {reference.company}
                        </p>

                        {reference.relationship ? (
                          <p className="mt-1 text-[8.5px] font-medium uppercase tracking-[0.1em] text-primary">
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
                </section>
              ) : null}

              {/* CUSTOM SECTIONS */}

              {hasCustomSections
                ? resume.customSections.map((section) => (
                    <section key={section.id} className="break-inside-avoid">
                      <SectionHeading>{section.title}</SectionHeading>

                      {section.description ? (
                        <p className="mb-4 text-[9.5px] leading-[1.6] text-muted-foreground">
                          {section.description}
                        </p>
                      ) : null}

                      <div className="space-y-5">
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
                                <span className="whitespace-nowrap text-[8px] uppercase tracking-[0.08em] text-muted-foreground">
                                  {item.date}
                                </span>
                              ) : null}
                            </div>

                            {item.description ? (
                              <p className="mt-1.5 text-[9.5px] leading-[1.6] text-muted-foreground">
                                {item.description}
                              </p>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    </section>
                  ))
                : null}
            </div>
          )}

          {/* FOOTER */}

          <footer className="mt-12 flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-3.5 text-primary" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {personal.firstName} {personal.lastName}
              </span>
            </div>

            <span className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground">
              {personal.jobTitle}
            </span>
          </footer>
        </main>
      </div>
    </article>
  );
}

export default Atlas;
