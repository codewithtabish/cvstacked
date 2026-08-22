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
import type { ReactNode } from "react";

import type { ResumeData } from "@/data/resume";

interface AuroraProps {
  resume: ResumeData;
  /**
   * Optional id placed directly on the A4 root <article>.
   * Point DownloadPdfButton's elementId at THIS id.
   */
  id?: string;
}

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

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
    <span className="whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.1em] text-black/70">
      {start}
      {start && end ? " — " : ""}
      {end}
    </span>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="text-[14px] font-bold uppercase tracking-[0.16em] text-black">
        {children}
      </h2>
      <div className="h-px flex-1 bg-black/15" />
    </div>
  );
}

function ContactLink({
  href,
  icon,
  children,
}: {
  href?: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-black/75 transition-colors hover:text-black"
    >
      {icon}
      <span className="break-all">{children}</span>
    </a>
  );
}

export function Aurora({ resume, id }: AuroraProps) {
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
    <article
      id={id}
      className="mx-auto bg-white text-black shadow-2xl print:shadow-none"
      style={{
        width: `${A4_WIDTH_MM}mm`,
        minHeight: `${A4_HEIGHT_MM}mm`,
        boxSizing: "border-box",
      }}
    >
      <div
        className="print:min-h-0"
        style={{
          minHeight: `${A4_HEIGHT_MM}mm`,
          paddingTop: "10mm",
          paddingBottom: "10mm",
          paddingLeft: "11mm",
          paddingRight: "12mm",
          boxSizing: "border-box",
        }}
      >
        {/* ============================================================
            HEADER
        ============================================================ */}
        <header className="border-b border-black/15 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                  Professional Resume
                </span>
              </div>

              <h1 className="text-[46px] font-semibold leading-[0.92] tracking-[-0.05em] text-black sm:text-[54px]">
                {personal.firstName}
                <span className="block text-black/80">{personal.lastName}</span>
              </h1>

              <p className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-black/70">
                {personal.jobTitle}
              </p>
            </div>

            {personal.photo ? (
              <div className="shrink-0">
                <img
                  src={personal.photo}
                  alt={`${personal.firstName} ${personal.lastName}`}
                  className="size-[84px] rounded-full object-cover ring-1 ring-black/10 ring-offset-4 ring-offset-white"
                />
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-black/10 pt-5">
            {personal.email ? (
              <ContactLink
                href={`mailto:${personal.email}`}
                icon={<Mail className="size-3.5 text-primary" />}
              >
                {personal.email}
              </ContactLink>
            ) : null}

            {personal.phone ? (
              <ContactLink
                href={`tel:${personal.phone}`}
                icon={<Phone className="size-3.5 text-primary" />}
              >
                {personal.phone}
              </ContactLink>
            ) : null}

            {personal.location ? (
              <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-black/70">
                <MapPin className="size-3.5 text-primary" />
                {personal.location}
              </span>
            ) : null}

            {personal.website ? (
              <ContactLink
                href={personal.website}
                icon={<Globe className="size-3.5 text-primary" />}
              >
                {personal.website.replace(/^https?:\/\//, "")}
              </ContactLink>
            ) : null}

            {personal.linkedin ? (
              <ContactLink
                href={personal.linkedin}
                icon={<Link className="size-3.5 text-primary" />}
              >
                LinkedIn
              </ContactLink>
            ) : null}

            {personal.github ? (
              <ContactLink
                href={personal.github}
                icon={<GitGraph className="size-3.5 text-primary" />}
              >
                GitHub
              </ContactLink>
            ) : null}

            {personal.portfolio ? (
              <ContactLink
                href={personal.portfolio}
                icon={<ExternalLink className="size-3.5 text-primary" />}
              >
                Portfolio
              </ContactLink>
            ) : null}
          </div>
        </header>

        {/* ============================================================
            MAIN CONTENT
        ============================================================ */}
        <main className="pt-9">
          {/* SUMMARY */}
          {resume.summary ? (
            <section className="mb-10">
              <SectionHeading>Profile</SectionHeading>
              <p className="max-w-[175mm] text-[14px] leading-[1.75] text-black/80">
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
                      <div>
                        <h3 className="text-[16px] font-semibold leading-tight tracking-[-0.01em] text-black">
                          {experience.position}
                        </h3>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-black/70">
                          <span>{experience.company}</span>
                          {experience.location ? (
                            <>
                              <span className="text-black/30">•</span>
                              <span>{experience.location}</span>
                            </>
                          ) : null}
                          {experience.employmentType ? (
                            <>
                              <span className="text-black/30">•</span>
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
                      <p className="mt-3 text-[13.5px] leading-[1.7] text-black/75">
                        {experience.description}
                      </p>
                    ) : null}

                    {experience.achievements.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {experience.achievements.map((achievement) => (
                          <li
                            key={achievement}
                            className="relative pl-4 text-[13.5px] leading-[1.65] text-black/75"
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
                      <h3 className="text-[15px] font-semibold text-black">
                        {education.degree}
                        {education.fieldOfStudy
                          ? ` in ${education.fieldOfStudy}`
                          : ""}
                      </h3>

                      <p className="mt-1 text-[13px] font-medium text-black/70">
                        {education.institution}
                        {education.location ? ` · ${education.location}` : ""}
                      </p>

                      {education.grade ? (
                        <p className="mt-1.5 text-[12.5px] text-black/65">
                          {education.grade}
                        </p>
                      ) : null}

                      {education.description ? (
                        <p className="mt-2 text-[13px] leading-[1.65] text-black/75">
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

          {/* SKILLS */}
          {hasSkills ? (
            <section className="mb-10 break-inside-avoid">
              <SectionHeading>Expertise</SectionHeading>

              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {Object.entries(groupedSkills).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.15em] text-black/60">
                      {category}
                    </h3>

                    <div className="flex flex-wrap gap-x-2.5 gap-y-1.5">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="text-[13.5px] font-medium text-black"
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

          {/* PROJECTS */}
          {hasProjects ? (
            <section className="mb-10">
              <SectionHeading>Selected Projects</SectionHeading>

              <div className="grid gap-6 sm:grid-cols-2">
                {resume.projects.map((project) => (
                  <article
                    key={project.id}
                    className="break-inside-avoid border-l-2 border-primary/40 pl-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[15px] font-semibold text-black">
                          {project.name}
                        </h3>
                        {project.role ? (
                          <p className="mt-1 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-primary">
                            {project.role}
                          </p>
                        ) : null}
                      </div>
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-black/50 transition-colors hover:text-black"
                          aria-label={`Open ${project.name}`}
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      ) : null}
                    </div>

                    <p className="mt-2.5 text-[13px] leading-[1.65] text-black/75">
                      {project.description}
                    </p>

                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-sm bg-black/5 px-2 py-0.5 text-[11px] font-medium text-black/70"
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
                            className="text-[12.5px] leading-[1.55] text-black/75"
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

          {/* ADDITIONAL INFORMATION */}
          {(hasCertifications ||
            hasLanguages ||
            hasAwards ||
            hasPublications ||
            hasVolunteer ||
            hasReferences ||
            hasInterests ||
            hasCustomSections) && (
            <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {hasCertifications ? (
                <section className="break-inside-avoid">
                  <SectionHeading>Certifications</SectionHeading>
                  <div className="space-y-4">
                    {resume.certifications.map((certification) => (
                      <article key={certification.id}>
                        <div className="flex gap-2.5">
                          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                          <div className="min-w-0">
                            <h3 className="text-[13.5px] font-semibold leading-[1.4] text-black">
                              {certification.name}
                            </h3>
                            <p className="mt-1 text-[12.5px] text-black/70">
                              {certification.issuer}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-x-2 text-[11.5px] text-black/60">
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
                </section>
              ) : null}

              {hasLanguages ? (
                <section className="break-inside-avoid">
                  <SectionHeading>Languages</SectionHeading>
                  <div className="space-y-3">
                    {resume.languages.map((language) => (
                      <div
                        key={language.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <Languages className="size-4 text-primary" />
                          <span className="text-[13.5px] font-medium text-black">
                            {language.name}
                          </span>
                        </div>
                        <span className="text-[12px] uppercase tracking-[0.1em] text-black/60">
                          {language.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {hasAwards ? (
                <section className="break-inside-avoid">
                  <SectionHeading>Awards</SectionHeading>
                  <div className="space-y-4">
                    {resume.awards.map((award) => (
                      <article key={award.id}>
                        <div className="flex gap-2.5">
                          <Award className="mt-0.5 size-4 shrink-0 text-primary" />
                          <div>
                            <h3 className="text-[13.5px] font-semibold text-black">
                              {award.title}
                            </h3>
                            <p className="mt-1 text-[12.5px] text-black/70">
                              {award.issuer} · {award.date}
                            </p>
                            {award.description ? (
                              <p className="mt-1.5 text-[12.5px] leading-[1.6] text-black/75">
                                {award.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {hasPublications ? (
                <section className="break-inside-avoid">
                  <SectionHeading>Publications</SectionHeading>
                  <div className="space-y-4">
                    {resume.publications.map((publication) => (
                      <article key={publication.id}>
                        <h3 className="text-[13.5px] font-semibold leading-[1.4] text-black">
                          {publication.title}
                        </h3>
                        <p className="mt-1 text-[12px] text-black/70">
                          {publication.publisher} · {publication.date}
                        </p>
                        {publication.description ? (
                          <p className="mt-1.5 text-[12.5px] leading-[1.6] text-black/75">
                            {publication.description}
                          </p>
                        ) : null}
                        {publication.url ? (
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-medium text-primary hover:underline"
                          >
                            Read publication
                            <ExternalLink className="size-3" />
                          </a>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {hasVolunteer ? (
                <section className="break-inside-avoid">
                  <SectionHeading>Volunteer</SectionHeading>
                  <div className="space-y-4">
                    {resume.volunteer.map((volunteer) => (
                      <article key={volunteer.id}>
                        <h3 className="text-[13.5px] font-semibold text-black">
                          {volunteer.role}
                        </h3>
                        <p className="mt-1 text-[12.5px] text-black/70">
                          {volunteer.organization}
                        </p>
                        <p className="mt-1 text-[11.5px] uppercase tracking-[0.1em] text-black/60">
                          <DateRange
                            startDate={volunteer.startDate}
                            endDate={volunteer.endDate}
                            current={volunteer.current}
                          />
                        </p>
                        <p className="mt-1.5 text-[12.5px] leading-[1.6] text-black/75">
                          {volunteer.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {hasReferences ? (
                <section className="break-inside-avoid">
                  <SectionHeading>References</SectionHeading>
                  <div className="space-y-4">
                    {resume.references.map((reference) => (
                      <article key={reference.id}>
                        <h3 className="text-[13.5px] font-semibold text-black">
                          {reference.name}
                        </h3>
                        <p className="mt-1 text-[12.5px] text-black/70">
                          {reference.position} · {reference.company}
                        </p>
                        {reference.relationship ? (
                          <p className="mt-1 text-[11.5px] uppercase tracking-[0.1em] text-primary">
                            {reference.relationship}
                          </p>
                        ) : null}
                        {reference.email ? (
                          <p className="mt-1.5 text-[12px] text-black/70">
                            {reference.email}
                          </p>
                        ) : null}
                        {reference.phone ? (
                          <p className="mt-0.5 text-[12px] text-black/70">
                            {reference.phone}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {hasInterests ? (
                <section className="break-inside-avoid">
                  <SectionHeading>Interests</SectionHeading>
                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {resume.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1.5 text-[12.5px] text-black/75"
                      >
                        <Heart className="size-3.5 text-primary" />
                        {interest}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              {hasCustomSections
                ? resume.customSections.map((section) => (
                    <section key={section.id} className="break-inside-avoid">
                      <SectionHeading>{section.title}</SectionHeading>
                      {section.description ? (
                        <p className="mb-4 text-[12.5px] leading-[1.6] text-black/75">
                          {section.description}
                        </p>
                      ) : null}
                      <div className="space-y-4">
                        {section.items.map((item) => (
                          <article key={item.id}>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-[13.5px] font-semibold text-black">
                                  {item.title}
                                </h3>
                                {item.subtitle ? (
                                  <p className="mt-1 text-[12px] text-black/70">
                                    {item.subtitle}
                                  </p>
                                ) : null}
                              </div>
                              {item.date ? (
                                <span className="whitespace-nowrap text-[11.5px] uppercase tracking-[0.08em] text-black/60">
                                  {item.date}
                                </span>
                              ) : null}
                            </div>
                            {item.description ? (
                              <p className="mt-1.5 text-[12.5px] leading-[1.6] text-black/75">
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
        </main>

        {/* FOOTER */}
        <footer className="mt-12 flex items-center justify-between border-t border-black/15 pt-5">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="size-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/60">
              {personal.firstName} {personal.lastName}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.14em] text-black/60">
            {personal.jobTitle}
          </span>
        </footer>
      </div>
    </article>
  );
}

export default Aurora;
