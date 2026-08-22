import {
  Award,
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

interface PrismProps {
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
    <div className="mb-5">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
        {children}
      </h2>
      {/* Short double underline */}
      <div className="mt-2 flex flex-col gap-[3px]">
        <div className="h-[2px] w-10 rounded-full bg-primary" />
        <div className="h-[1.5px] w-6 rounded-full bg-primary/50" />
      </div>
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
    <span className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
      <span className="text-primary">{icon}</span>
      <span className="min-w-0 break-all">{children}</span>
    </span>
  );

  if (!href) return <div>{content}</div>;

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

export function Prism({ resume }: PrismProps) {
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
      <div className="min-h-[297mm] px-[16mm] py-[15mm] sm:px-[18mm] sm:py-[16mm] print:min-h-0">
        {/* ============================================================
            HEADER
        ============================================================ */}
        <header className="mb-9 border-b border-border pb-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2.5 flex items-center gap-2">
                <Sparkles className="size-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                  Professional Resume
                </span>
              </div>

              <h1 className="text-[40px] font-bold leading-[1.05] tracking-tight sm:text-[46px]">
                {personal.firstName}{" "}
                <span className="text-muted-foreground">
                  {personal.lastName}
                </span>
              </h1>

              {personal.jobTitle ? (
                <p className="mt-3 text-[15px] font-medium text-muted-foreground">
                  {personal.jobTitle}
                </p>
              ) : null}
            </div>

            {personal.photo ? (
              <img
                src={personal.photo}
                alt={`${personal.firstName} ${personal.lastName}`}
                className="size-[84px] shrink-0 rounded-2xl object-cover ring-1 ring-border"
              />
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
            {personal.email && (
              <ContactItem
                href={`mailto:${personal.email}`}
                icon={<Mail className="size-3.5" />}
              >
                {personal.email}
              </ContactItem>
            )}

            {personal.phone && (
              <ContactItem
                href={`tel:${personal.phone}`}
                icon={<Phone className="size-3.5" />}
              >
                {personal.phone}
              </ContactItem>
            )}

            {personal.location && (
              <ContactItem icon={<MapPin className="size-3.5" />}>
                {personal.location}
              </ContactItem>
            )}

            {personal.website && (
              <ContactItem
                href={personal.website}
                icon={<Globe className="size-3.5" />}
              >
                {personal.website.replace(/^https?:\/\//, "")}
              </ContactItem>
            )}

            {personal.linkedin && (
              <ContactItem
                href={personal.linkedin}
                icon={<Link2 className="size-3.5" />}
              >
                LinkedIn
              </ContactItem>
            )}

            {personal.github && (
              <ContactItem
                href={personal.github}
                icon={<GitBranch className="size-3.5" />}
              >
                GitHub
              </ContactItem>
            )}

            {personal.portfolio && (
              <ContactItem
                href={personal.portfolio}
                icon={<ExternalLink className="size-3.5" />}
              >
                Portfolio
              </ContactItem>
            )}
          </div>
        </header>

        {/* ============================================================
            SUMMARY
        ============================================================ */}
        {resume.summary ? (
          <section className="mb-9">
            <SectionTitle>Profile</SectionTitle>
            <p className="max-w-[175mm] text-[13.5px] leading-7 text-muted-foreground">
              {resume.summary}
            </p>
          </section>
        ) : null}

        {/* ============================================================
            EXPERIENCE
        ============================================================ */}
        {hasExperience ? (
          <section className="mb-9">
            <SectionTitle>Experience</SectionTitle>

            <div className="space-y-7">
              {resume.experience.map((experience) => (
                <article
                  key={experience.id}
                  className="break-inside-avoid border-l-2 border-primary/25 pl-5"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-tight">
                        {experience.position}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-muted-foreground">
                        <span className="font-medium">
                          {experience.company}
                        </span>
                        {experience.location && (
                          <>
                            <span>·</span>
                            <span>{experience.location}</span>
                          </>
                        )}
                        {experience.employmentType && (
                          <>
                            <span>·</span>
                            <span>{experience.employmentType}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <DateRange
                      startDate={experience.startDate}
                      endDate={experience.endDate}
                      current={experience.current}
                    />
                  </div>

                  {experience.description ? (
                    <p className="mt-2.5 text-[13px] leading-6 text-muted-foreground">
                      {experience.description}
                    </p>
                  ) : null}

                  {experience.achievements.length > 0 ? (
                    <ul className="mt-3 space-y-1.5">
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
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* ============================================================
            EDUCATION + PROJECTS
        ============================================================ */}
        {(hasEducation || hasProjects) && (
          <section className="mb-9">
            <div className="grid gap-10 lg:grid-cols-2">
              {hasEducation ? (
                <div>
                  <SectionTitle>Education</SectionTitle>
                  <div className="space-y-5">
                    {resume.education.map((edu) => (
                      <article key={edu.id} className="break-inside-avoid">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-[14px] font-semibold">
                            {edu.degree}
                            {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                          </h3>
                          <DateRange
                            startDate={edu.startDate}
                            endDate={edu.endDate}
                            current={edu.current}
                          />
                        </div>
                        <p className="mt-1 text-[13px] text-muted-foreground">
                          {edu.institution}
                          {edu.location ? ` · ${edu.location}` : ""}
                        </p>
                        {edu.grade && (
                          <p className="mt-1 text-[12.5px] text-muted-foreground">
                            {edu.grade}
                          </p>
                        )}
                        {edu.description && (
                          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
                            {edu.description}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {hasProjects ? (
                <div>
                  <SectionTitle>Projects</SectionTitle>
                  <div className="space-y-5">
                    {resume.projects.map((project) => (
                      <article key={project.id} className="break-inside-avoid">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[14px] font-semibold">
                              {project.name}
                            </h3>
                            {project.role && (
                              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                                {project.role}
                              </p>
                            )}
                          </div>
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground transition-colors hover:text-primary"
                              aria-label={`Open ${project.name}`}
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          )}
                        </div>

                        <p className="mt-2.5 text-[13px] leading-6 text-muted-foreground">
                          {project.description}
                        </p>

                        {project.technologies &&
                          project.technologies.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {project.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-md border border-border bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                        {project.achievements &&
                          project.achievements.length > 0 && (
                            <ul className="mt-3 space-y-1">
                              {project.achievements.map((a) => (
                                <li
                                  key={a}
                                  className="text-[12.5px] leading-5 text-muted-foreground"
                                >
                                  — {a}
                                </li>
                              ))}
                            </ul>
                          )}
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
          <section className="mb-9">
            <SectionTitle>Expertise</SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-md border border-border bg-background px-3 py-1 text-[13px] text-foreground"
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
          <section className="mb-6">
            <SectionTitle>Additional Information</SectionTitle>

            <div className="grid gap-8 sm:grid-cols-2">
              {hasCertifications && (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 flex items-center gap-2 text-[13.5px] font-semibold">
                    <ShieldCheck className="size-4 text-primary" />
                    Certifications
                  </h3>
                  <div className="space-y-3.5">
                    {resume.certifications.map((cert) => (
                      <article key={cert.id}>
                        <p className="text-[13.5px] font-medium">{cert.name}</p>
                        <p className="mt-0.5 text-[13px] text-muted-foreground">
                          {cert.issuer}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                          {cert.issueDate && (
                            <span>Issued {cert.issueDate}</span>
                          )}
                          {cert.expiryDate && (
                            <span>Expires {cert.expiryDate}</span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {hasLanguages && (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 flex items-center gap-2 text-[13.5px] font-semibold">
                    <Languages className="size-4 text-primary" />
                    Languages
                  </h3>
                  <div className="space-y-2.5">
                    {resume.languages.map((lang) => (
                      <div
                        key={lang.id}
                        className="flex items-center justify-between gap-4 border-b border-border pb-2 last:border-0 last:pb-0"
                      >
                        <span className="text-[13.5px] font-medium">
                          {lang.name}
                        </span>
                        <span className="text-[12.5px] capitalize text-muted-foreground">
                          {lang.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasAwards && (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 flex items-center gap-2 text-[13.5px] font-semibold">
                    <Award className="size-4 text-primary" />
                    Awards
                  </h3>
                  <div className="space-y-3.5">
                    {resume.awards.map((award) => (
                      <article key={award.id}>
                        <p className="text-[13.5px] font-medium">
                          {award.title}
                        </p>
                        <p className="mt-0.5 text-[13px] text-muted-foreground">
                          {award.issuer} · {award.date}
                        </p>
                        {award.description && (
                          <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                            {award.description}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {hasPublications && (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 text-[13.5px] font-semibold">
                    Publications
                  </h3>
                  <div className="space-y-3.5">
                    {resume.publications.map((pub) => (
                      <article key={pub.id}>
                        <p className="text-[13.5px] font-medium">{pub.title}</p>
                        <p className="mt-0.5 text-[13px] text-muted-foreground">
                          {pub.publisher} · {pub.date}
                        </p>
                        {pub.description && (
                          <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                            {pub.description}
                          </p>
                        )}
                        {pub.url && (
                          <a
                            href={pub.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                          >
                            Read publication
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {hasVolunteer && (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 text-[13.5px] font-semibold">
                    Volunteer
                  </h3>
                  <div className="space-y-3.5">
                    {resume.volunteer.map((vol) => (
                      <article key={vol.id}>
                        <p className="text-[13.5px] font-medium">{vol.role}</p>
                        <p className="mt-0.5 text-[13px] text-muted-foreground">
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
              )}

              {hasReferences && (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 text-[13.5px] font-semibold">
                    References
                  </h3>
                  <div className="space-y-3.5">
                    {resume.references.map((ref) => (
                      <article key={ref.id}>
                        <p className="text-[13.5px] font-medium">{ref.name}</p>
                        <p className="mt-0.5 text-[13px] text-muted-foreground">
                          {ref.position} · {ref.company}
                        </p>
                        {ref.relationship && (
                          <p className="mt-1 text-xs font-medium text-primary">
                            {ref.relationship}
                          </p>
                        )}
                        {ref.email && (
                          <p className="mt-1.5 text-[13px] text-muted-foreground">
                            {ref.email}
                          </p>
                        )}
                        {ref.phone && (
                          <p className="text-[13px] text-muted-foreground">
                            {ref.phone}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {hasInterests && (
                <div className="break-inside-avoid">
                  <h3 className="mb-3 flex items-center gap-2 text-[13.5px] font-semibold">
                    <Heart className="size-4 text-primary" />
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resume.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-md border border-border px-3 py-1 text-[13px] text-muted-foreground"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hasCustomSections &&
                resume.customSections.map((section) => (
                  <div key={section.id} className="break-inside-avoid">
                    <h3 className="mb-3 text-[13.5px] font-semibold">
                      {section.title}
                    </h3>
                    {section.description && (
                      <p className="mb-3 text-[13px] leading-6 text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                    <div className="space-y-3.5">
                      {section.items.map((item) => (
                        <article key={item.id}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[13.5px] font-medium">
                                {item.title}
                              </p>
                              {item.subtitle && (
                                <p className="mt-0.5 text-[13px] text-muted-foreground">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                            {item.date && (
                              <span className="whitespace-nowrap text-xs text-muted-foreground">
                                {item.date}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ============================================================
            FOOTER
        ============================================================ */}
        <footer className="mt-10 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-3.5 text-primary" />
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

export default Prism;
