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
} from "lucide-react";
import type { ReactNode } from "react";

import type { ResumeData } from "@/data/resume";

interface SolsticeProps {
  resume: ResumeData;
}

/* ============================================================
   A4 PAGE CONSTANTS
   This template is fixed to a real A4 sheet (210mm x 297mm) —
   not a responsive/fluid width — so it renders identically on
   screen and when exported to PDF (html2canvas, jsPDF, print).
   ============================================================ */

const PAGE_STYLES = `
  @page { size: A4; margin: 0; }
  @media print {
    .solstice-page {
      width: 210mm !important;
      min-height: 297mm !important;
      box-shadow: none !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

/* ============================================================
   HELPERS
   ============================================================ */

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
    <span className="whitespace-nowrap text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      {start}
      {start && end ? " – " : ""}
      {end}
    </span>
  );
}

/** Every heading in this template carries the same signature: a
 * short, thick underline in the theme's primary color sitting
 * directly beneath the label — the recurring mark the whole page
 * is built around. */
function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 inline-block border-b-[3px] border-primary pb-1 text-[12px] font-bold uppercase tracking-[0.16em] text-foreground">
      {children}
    </h2>
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
    <>
      <span className="text-primary">{icon}</span>
      <span className="min-w-0 break-all">{children}</span>
    </>
  );

  const className =
    "flex items-center gap-1.5 text-[9.5px] text-muted-foreground transition-colors hover:text-primary";

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  );
}

/* ============================================================
   TEMPLATE
   ============================================================ */

export function Solstice({ resume }: SolsticeProps) {
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
    <>
      <style>{PAGE_STYLES}</style>

      <article className="solstice-page mx-auto min-h-[297mm] w-[210mm] bg-background text-foreground shadow-2xl print:shadow-none">
        <div className="px-[14mm] py-[13mm]">
          {/* ============================================================
              HEADER
          ============================================================ */}

          <header className="flex items-end justify-between gap-6">
            <div className="min-w-0">
              <h1 className="border-b-4 border-primary pb-2 text-[40px] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]">
                {personal.firstName} {personal.lastName}
              </h1>

              {personal.jobTitle ? (
                <span className="mt-3 inline-block bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-foreground">
                  {personal.jobTitle}
                </span>
              ) : null}
            </div>

            {personal.photo ? (
              <img
                src={personal.photo}
                alt={`${personal.firstName} ${personal.lastName}`}
                className="size-[72px] shrink-0 rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-background"
              />
            ) : null}
          </header>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3.5">
            {personal.email ? (
              <ContactItem
                href={`mailto:${personal.email}`}
                icon={<Mail className="size-3" />}
              >
                {personal.email}
              </ContactItem>
            ) : null}

            {personal.phone ? (
              <ContactItem
                href={`tel:${personal.phone}`}
                icon={<Phone className="size-3" />}
              >
                {personal.phone}
              </ContactItem>
            ) : null}

            {personal.location ? (
              <ContactItem icon={<MapPin className="size-3" />}>
                {personal.location}
              </ContactItem>
            ) : null}

            {personal.website ? (
              <ContactItem
                href={personal.website}
                icon={<Globe className="size-3" />}
              >
                {personal.website.replace(/^https?:\/\//, "")}
              </ContactItem>
            ) : null}

            {personal.linkedin ? (
              <ContactItem
                href={personal.linkedin}
                icon={<Link className="size-3" />}
              >
                LinkedIn
              </ContactItem>
            ) : null}

            {personal.github ? (
              <ContactItem
                href={personal.github}
                icon={<GitGraph className="size-3" />}
              >
                GitHub
              </ContactItem>
            ) : null}

            {personal.portfolio ? (
              <ContactItem
                href={personal.portfolio}
                icon={<ExternalLink className="size-3" />}
              >
                Portfolio
              </ContactItem>
            ) : null}
          </div>

          {/* ============================================================
              SUMMARY
          ============================================================ */}

          {resume.summary ? (
            <section className="mt-7">
              <SectionHeading>Profile</SectionHeading>

              <p className="text-[10.5px] leading-[1.7] text-muted-foreground">
                {resume.summary}
              </p>
            </section>
          ) : null}

          {/* ============================================================
              EXPERIENCE
          ============================================================ */}

          {hasExperience ? (
            <section className="mt-7">
              <SectionHeading>Experience</SectionHeading>

              <div className="space-y-5">
                {resume.experience.map((experience) => (
                  <article
                    key={experience.id}
                    className="break-inside-avoid border-l-[3px] border-primary/25 pl-3.5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      <h3 className="text-[12px] font-bold tracking-tight">
                        {experience.position}
                      </h3>

                      <DateRange
                        startDate={experience.startDate}
                        endDate={experience.endDate}
                        current={experience.current}
                      />
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[10px] font-semibold text-primary">
                      <span>{experience.company}</span>

                      {experience.location ? (
                        <span className="font-normal text-muted-foreground">
                          · {experience.location}
                        </span>
                      ) : null}

                      {experience.employmentType ? (
                        <span className="font-normal text-muted-foreground">
                          · {experience.employmentType}
                        </span>
                      ) : null}
                    </div>

                    {experience.description ? (
                      <p className="mt-2 text-[10px] leading-[1.6] text-muted-foreground">
                        {experience.description}
                      </p>
                    ) : null}

                    {experience.achievements.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {experience.achievements.map((achievement) => (
                          <li
                            key={achievement}
                            className="relative pl-3.5 text-[10px] leading-[1.55] text-muted-foreground"
                          >
                            <span className="absolute left-0 top-[0.5em] size-1 rounded-full bg-primary" />
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
            <section className="mt-7 grid grid-cols-2 gap-9">
              {hasEducation ? (
                <div>
                  <SectionHeading>Education</SectionHeading>

                  <div className="space-y-4">
                    {resume.education.map((education) => (
                      <article
                        key={education.id}
                        className="break-inside-avoid"
                      >
                        <h3 className="text-[11px] font-bold">
                          {education.degree}
                          {education.fieldOfStudy
                            ? ` in ${education.fieldOfStudy}`
                            : ""}
                        </h3>

                        <p className="mt-1 text-[9.5px] font-semibold text-primary">
                          {education.institution}
                        </p>

                        <div className="mt-0.5 flex flex-wrap items-center justify-between gap-2">
                          {education.location ? (
                            <span className="text-[9px] text-muted-foreground">
                              {education.location}
                            </span>
                          ) : (
                            <span />
                          )}

                          <DateRange
                            startDate={education.startDate}
                            endDate={education.endDate}
                            current={education.current}
                          />
                        </div>

                        {education.grade ? (
                          <p className="mt-1 text-[9px] text-muted-foreground">
                            {education.grade}
                          </p>
                        ) : null}

                        {education.description ? (
                          <p className="mt-1.5 text-[9px] leading-[1.55] text-muted-foreground">
                            {education.description}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {hasSkills ? (
                <div>
                  <SectionHeading>Expertise</SectionHeading>

                  <div className="space-y-4">
                    {Object.entries(groupedSkills).map(([category, skills]) => (
                      <div key={category}>
                        <h3 className="mb-1.5 text-[8.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          {category}
                        </h3>

                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((skill) => (
                            <span
                              key={skill.id}
                              className="border-b-2 border-primary/60 text-[10px] font-medium text-foreground"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          )}

          {/* ============================================================
              PROJECTS
          ============================================================ */}

          {hasProjects ? (
            <section className="mt-7">
              <SectionHeading>Projects</SectionHeading>

              <div className="grid grid-cols-2 gap-5">
                {resume.projects.map((project) => (
                  <article key={project.id} className="break-inside-avoid">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[11px] font-bold">{project.name}</h3>

                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-muted-foreground hover:text-primary"
                          aria-label={`Open ${project.name}`}
                        >
                          <ExternalLink className="size-3" />
                        </a>
                      ) : null}
                    </div>

                    {project.role ? (
                      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-primary">
                        {project.role}
                      </p>
                    ) : null}

                    <p className="mt-1.5 text-[9.5px] leading-[1.55] text-muted-foreground">
                      {project.description}
                    </p>

                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
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
                      <ul className="mt-2 space-y-0.5">
                        {project.achievements.map((achievement) => (
                          <li
                            key={achievement}
                            className="text-[9px] leading-[1.5] text-muted-foreground"
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
            <section className="mt-7">
              <SectionHeading>Additional Information</SectionHeading>

              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {hasCertifications ? (
                  <div className="break-inside-avoid">
                    <h3 className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.06em]">
                      <ShieldCheck className="size-3 text-primary" />
                      Certifications
                    </h3>

                    <div className="space-y-2.5">
                      {resume.certifications.map((certification) => (
                        <article key={certification.id}>
                          <p className="text-[9.5px] font-semibold">
                            {certification.name}
                          </p>

                          <p className="mt-0.5 text-[9px] text-muted-foreground">
                            {certification.issuer}
                            {certification.issueDate
                              ? ` · ${certification.issueDate}`
                              : ""}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {hasLanguages ? (
                  <div className="break-inside-avoid">
                    <h3 className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.06em]">
                      <Languages className="size-3 text-primary" />
                      Languages
                    </h3>

                    <div className="space-y-1.5">
                      {resume.languages.map((language) => (
                        <div
                          key={language.id}
                          className="flex items-center justify-between gap-4"
                        >
                          <span className="text-[9.5px] font-medium">
                            {language.name}
                          </span>

                          <span className="text-[8.5px] uppercase tracking-[0.08em] text-muted-foreground">
                            {language.proficiency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {hasAwards ? (
                  <div className="break-inside-avoid">
                    <h3 className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.06em]">
                      <Award className="size-3 text-primary" />
                      Awards
                    </h3>

                    <div className="space-y-2.5">
                      {resume.awards.map((award) => (
                        <article key={award.id}>
                          <p className="text-[9.5px] font-semibold">
                            {award.title}
                          </p>

                          <p className="mt-0.5 text-[9px] text-muted-foreground">
                            {award.issuer} · {award.date}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {hasPublications ? (
                  <div className="break-inside-avoid">
                    <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.06em]">
                      Publications
                    </h3>

                    <div className="space-y-2.5">
                      {resume.publications.map((publication) => (
                        <article key={publication.id}>
                          <p className="text-[9.5px] font-semibold leading-[1.4]">
                            {publication.title}
                          </p>

                          <p className="mt-0.5 text-[9px] text-muted-foreground">
                            {publication.publisher} · {publication.date}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {hasVolunteer ? (
                  <div className="break-inside-avoid">
                    <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.06em]">
                      Volunteer
                    </h3>

                    <div className="space-y-2.5">
                      {resume.volunteer.map((volunteer) => (
                        <article key={volunteer.id}>
                          <p className="text-[9.5px] font-semibold">
                            {volunteer.role}
                          </p>

                          <p className="mt-0.5 text-[9px] text-muted-foreground">
                            {volunteer.organization}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {hasReferences ? (
                  <div className="break-inside-avoid">
                    <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.06em]">
                      References
                    </h3>

                    <div className="space-y-2.5">
                      {resume.references.map((reference) => (
                        <article key={reference.id}>
                          <p className="text-[9.5px] font-semibold">
                            {reference.name}
                          </p>

                          <p className="mt-0.5 text-[9px] text-muted-foreground">
                            {reference.position} · {reference.company}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                {hasInterests ? (
                  <div className="break-inside-avoid">
                    <h3 className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.06em]">
                      <Heart className="size-3 text-primary" />
                      Interests
                    </h3>

                    <div className="flex flex-wrap gap-1.5">
                      {resume.interests.map((interest) => (
                        <span
                          key={interest}
                          className="text-[9.5px] text-muted-foreground"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {hasCustomSections
                  ? resume.customSections.map((section) => (
                      <div key={section.id} className="break-inside-avoid">
                        <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.06em]">
                          {section.title}
                        </h3>

                        {section.description ? (
                          <p className="mb-2 text-[9px] leading-[1.55] text-muted-foreground">
                            {section.description}
                          </p>
                        ) : null}

                        <div className="space-y-2.5">
                          {section.items.map((item) => (
                            <article key={item.id}>
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-[9.5px] font-semibold">
                                  {item.title}
                                </p>

                                {item.date ? (
                                  <span className="whitespace-nowrap text-[8.5px] text-muted-foreground">
                                    {item.date}
                                  </span>
                                ) : null}
                              </div>

                              {item.subtitle ? (
                                <p className="mt-0.5 text-[9px] text-muted-foreground">
                                  {item.subtitle}
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

          <footer className="mt-8 flex items-center justify-between border-t-4 border-primary pt-3">
            <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {personal.firstName} {personal.lastName}
            </span>

            <GraduationCap className="size-3.5 text-primary" />

            <span className="text-[8.5px] uppercase tracking-[0.14em] text-muted-foreground">
              {personal.jobTitle}
            </span>
          </footer>
        </div>
      </article>
    </>
  );
}

export default Solstice;
