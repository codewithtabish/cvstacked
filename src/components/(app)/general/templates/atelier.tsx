import {
  Award,
  BookOpen,
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

interface AtelierProps {
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
    <span className="whitespace-nowrap text-[8px] font-medium text-muted-foreground">
      {start}
      {start && end ? " — " : ""}
      {end}
    </span>
  );
}

function SectionTitle({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className="h-[18px] w-[3px] rounded-full"
        style={{ backgroundColor: accent }}
      />
      <h2 className="text-[10px] font-extrabold uppercase tracking-[0.19em] text-foreground">
        {children}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ContactItem({
  icon,
  href,
  children,
}: {
  icon: React.ReactNode;
  href?: string;
  children: React.ReactNode;
}) {
  const body = (
    <span className="flex min-w-0 items-start gap-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="min-w-0 break-words">{children}</span>
    </span>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="transition-opacity hover:opacity-65"
    >
      {body}
    </a>
  ) : (
    body
  );
}

export function Atelier({ resume }: AtelierProps) {
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
            background: #fff !important;
          }

          .atelier-page {
            width: 210mm !important;
            min-height: 297mm !important;
            max-width: 210mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: 0 !important;
          }

          .atelier-avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .atelier-break {
            break-before: page;
            page-break-before: always;
          }
        }
      `}</style>

      <article className="atelier-page mx-auto w-full max-w-[210mm] overflow-hidden border border-border bg-background text-foreground shadow-[0_20px_65px_rgba(15,23,42,0.12)] print:shadow-none">
        <div className="min-h-[297mm] px-[11mm] py-[10mm]">
          {/* ==========================================================
              HEADER — NO BACKGROUND COLOR
          =========================================================== */}
          <header className="atelier-avoid-break border-b border-border pb-6">
            <div className="flex items-end justify-between gap-8">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-1.5 w-8 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                  <span
                    className="text-[7px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: accent }}
                  >
                    Resume / Portfolio
                  </span>
                </div>

                <h1 className="text-[34px] font-black leading-[0.95] tracking-[-0.055em]">
                  {personal.firstName}
                  {personal.lastName ? (
                    <>
                      {" "}
                      <span style={{ color: accent }}>{personal.lastName}</span>
                    </>
                  ) : null}
                </h1>

                {personal.jobTitle ? (
                  <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {personal.jobTitle}
                  </p>
                ) : null}
              </div>

              {personal.photo ? (
                <div
                  className="size-[31mm] shrink-0 overflow-hidden rounded-2xl border bg-background p-1"
                  style={{ borderColor: accent }}
                >
                  <img
                    src={personal.photo}
                    alt={`${personal.firstName} ${personal.lastName}`}
                    className="size-full rounded-xl object-cover"
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[7.5px] font-medium text-muted-foreground">
              {personal.email ? (
                <ContactItem
                  href={`mailto:${personal.email}`}
                  icon={<Mail className="size-3" style={{ color: accent }} />}
                >
                  {personal.email}
                </ContactItem>
              ) : null}

              {personal.phone ? (
                <ContactItem
                  href={`tel:${personal.phone}`}
                  icon={<Phone className="size-3" style={{ color: accent }} />}
                >
                  {personal.phone}
                </ContactItem>
              ) : null}

              {personal.location ? (
                <ContactItem
                  icon={<MapPin className="size-3" style={{ color: accent }} />}
                >
                  {personal.location}
                </ContactItem>
              ) : null}

              {personal.website ? (
                <ContactItem
                  href={personal.website}
                  icon={
                    <ExternalLink
                      className="size-3"
                      style={{ color: accent }}
                    />
                  }
                >
                  {personal.website.replace(/^https?:\/\//, "")}
                </ContactItem>
              ) : null}

              {personal.linkedin ? (
                <ContactItem
                  href={personal.linkedin}
                  icon={
                    <span
                      className="text-[7px] font-black"
                      style={{ color: accent }}
                    >
                      in
                    </span>
                  }
                >
                  LinkedIn
                </ContactItem>
              ) : null}

              {personal.github ? (
                <ContactItem
                  href={personal.github}
                  icon={
                    <span
                      className="text-[6px] font-black"
                      style={{ color: accent }}
                    >
                      GH
                    </span>
                  }
                >
                  GitHub
                </ContactItem>
              ) : null}

              {personal.portfolio ? (
                <ContactItem
                  href={personal.portfolio}
                  icon={
                    <ExternalLink
                      className="size-3"
                      style={{ color: accent }}
                    />
                  }
                >
                  Portfolio
                </ContactItem>
              ) : null}
            </div>
          </header>

          {/* ==========================================================
              PROFILE
          =========================================================== */}
          {resume.summary ? (
            <section className="mt-7 atelier-avoid-break">
              <SectionTitle accent={accent}>Profile</SectionTitle>

              <p className="max-w-[175mm] text-[9px] leading-[1.75] text-muted-foreground">
                {resume.summary}
              </p>
            </section>
          ) : null}

          {/* ==========================================================
              MAIN CONTENT — TWO COLUMN EDITORIAL GRID
          =========================================================== */}
          <div className="mt-7 grid grid-cols-[1fr_55mm] items-start gap-[9mm]">
            <main className="min-w-0">
              {/* Experience */}
              {hasExperience ? (
                <section className="mb-7">
                  <SectionTitle accent={accent}>Experience</SectionTitle>

                  <div className="space-y-6">
                    {resume.experience.map((experience, index) => (
                      <article
                        key={experience.id}
                        className="atelier-avoid-break relative pl-5"
                      >
                        <span
                          className="absolute left-0 top-1 size-2 rounded-full"
                          style={{ backgroundColor: accent }}
                        />

                        {index < resume.experience.length - 1 ? (
                          <span
                            className="absolute left-[3.5px] top-4 h-[calc(100%+14px)] w-px opacity-25"
                            style={{ backgroundColor: accent }}
                          />
                        ) : null}

                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-[10px] font-bold leading-[1.25]">
                              {experience.position}
                            </h3>

                            <p
                              className="mt-1 text-[8px] font-bold"
                              style={{ color: accent }}
                            >
                              {experience.company}
                            </p>

                            {experience.location ||
                            experience.employmentType ? (
                              <p className="mt-0.5 text-[7px] text-muted-foreground">
                                {experience.location}
                                {experience.location &&
                                experience.employmentType
                                  ? " · "
                                  : ""}
                                {experience.employmentType}
                              </p>
                            ) : null}
                          </div>

                          <DateRange
                            startDate={experience.startDate}
                            endDate={experience.endDate}
                            current={experience.current}
                          />
                        </div>

                        {experience.description ? (
                          <p className="mt-2.5 text-[8px] leading-[1.65] text-muted-foreground">
                            {experience.description}
                          </p>
                        ) : null}

                        {experience.achievements.length > 0 ? (
                          <ul className="mt-2 space-y-1">
                            {experience.achievements.map((achievement) => (
                              <li
                                key={achievement}
                                className="relative pl-3 text-[8px] leading-[1.55] text-muted-foreground"
                              >
                                <span
                                  className="absolute left-0 top-[0.6em] size-1 rounded-full"
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
                  <SectionTitle accent={accent}>Projects</SectionTitle>

                  <div className="space-y-4">
                    {resume.projects.map((project, index) => (
                      <article
                        key={project.id}
                        className="atelier-avoid-break border-b border-border pb-4 last:border-b-0"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-2">
                            <span
                              className="mt-0.5 text-[7px] font-black"
                              style={{ color: accent }}
                            >
                              0{index + 1}
                            </span>

                            <div className="min-w-0">
                              <h3 className="text-[9px] font-bold">
                                {project.name}
                              </h3>

                              {project.role ? (
                                <p
                                  className="mt-0.5 text-[6.5px] font-bold uppercase tracking-[0.13em]"
                                  style={{ color: accent }}
                                >
                                  {project.role}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0"
                              style={{ color: accent }}
                            >
                              <ExternalLink className="size-3" />
                            </a>
                          ) : null}
                        </div>

                        <p className="mt-2 pl-5 text-[7.8px] leading-[1.6] text-muted-foreground">
                          {project.description}
                        </p>

                        {project.technologies?.length ? (
                          <div className="mt-2 flex flex-wrap gap-1 pl-5">
                            {project.technologies.map((technology) => (
                              <span
                                key={technology}
                                className="rounded-full border border-border px-1.5 py-0.5 text-[6px] font-semibold text-muted-foreground"
                              >
                                {technology}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {project.achievements?.length ? (
                          <ul className="mt-2 space-y-0.5 pl-5">
                            {project.achievements.map((achievement) => (
                              <li
                                key={achievement}
                                className="text-[7px] leading-[1.5] text-muted-foreground"
                              >
                                <span
                                  className="mr-1 font-bold"
                                  style={{ color: accent }}
                                >
                                  +
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
                  <SectionTitle accent={accent}>Education</SectionTitle>

                  <div className="space-y-4">
                    {resume.education.map((education) => (
                      <article
                        key={education.id}
                        className="atelier-avoid-break flex gap-3"
                      >
                        <div
                          className="flex size-7 shrink-0 items-center justify-center rounded-lg border"
                          style={{
                            borderColor: `${accent}55`,
                            color: accent,
                          }}
                        >
                          <GraduationCap className="size-3.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-[8.5px] font-bold">
                                {education.degree}
                                {education.fieldOfStudy
                                  ? ` in ${education.fieldOfStudy}`
                                  : ""}
                              </h3>

                              <p className="mt-0.5 text-[7.5px] text-muted-foreground">
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
                              className="mt-1 text-[7px] font-bold"
                              style={{ color: accent }}
                            >
                              {education.grade}
                            </p>
                          ) : null}

                          {education.description ? (
                            <p className="mt-1.5 text-[7.5px] leading-[1.55] text-muted-foreground">
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
                  <SectionTitle accent={accent}>Publications</SectionTitle>

                  <div className="space-y-3.5">
                    {resume.publications.map((publication) => (
                      <article
                        key={publication.id}
                        className="atelier-avoid-break"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 gap-2">
                            <BookOpen
                              className="mt-0.5 size-3 shrink-0"
                              style={{ color: accent }}
                            />

                            <div>
                              <h3 className="text-[8px] font-bold">
                                {publication.title}
                              </h3>

                              <p className="mt-0.5 text-[7px] text-muted-foreground">
                                {publication.publisher} · {publication.date}
                              </p>
                            </div>
                          </div>

                          {publication.url ? (
                            <a
                              href={publication.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: accent }}
                            >
                              <ExternalLink className="size-3" />
                            </a>
                          ) : null}
                        </div>

                        {publication.description ? (
                          <p className="mt-1.5 pl-5 text-[7.5px] leading-[1.55] text-muted-foreground">
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
                  <SectionTitle accent={accent}>Volunteer</SectionTitle>

                  <div className="space-y-3.5">
                    {resume.volunteer.map((volunteer) => (
                      <article
                        key={volunteer.id}
                        className="atelier-avoid-break"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[8.5px] font-bold">
                              {volunteer.role}
                            </h3>

                            <p
                              className="mt-0.5 text-[7px] font-bold"
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

                        <p className="mt-1.5 text-[7.5px] leading-[1.55] text-muted-foreground">
                          {volunteer.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}
            </main>

            {/* ========================================================
                RIGHT SIDEBAR — WHITE / NO BACKGROUND COLOR
            ========================================================= */}
            <aside className="min-w-0 border-l border-border pl-[7mm]">
              {/* Skills */}
              {hasSkills ? (
                <section className="mb-7 atelier-avoid-break">
                  <SectionTitle accent={accent}>Expertise</SectionTitle>

                  <div className="space-y-4">
                    {Object.entries(groupedSkills).map(([category, skills]) => (
                      <div key={category}>
                        <p
                          className="mb-2 text-[6.5px] font-black uppercase tracking-[0.16em]"
                          style={{ color: accent }}
                        >
                          {category}
                        </p>

                        <div className="space-y-2.5">
                          {skills.map((skill) => (
                            <div key={skill.id}>
                              <div className="mb-1 flex items-center justify-between gap-2">
                                <span className="text-[7.5px] font-semibold">
                                  {skill.name}
                                </span>

                                {skill.level ? (
                                  <span className="text-[6px] font-medium text-muted-foreground">
                                    {skill.level}
                                  </span>
                                ) : null}
                              </div>

                              <div className="h-[3px] overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    backgroundColor: accent,
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
                <section className="mb-7 atelier-avoid-break">
                  <SectionTitle accent={accent}>Languages</SectionTitle>

                  <div className="space-y-2.5">
                    {resume.languages.map((language) => (
                      <div
                        key={language.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex min-w-0 items-center gap-1.5">
                          <Languages
                            className="size-3 shrink-0"
                            style={{ color: accent }}
                          />
                          <span className="text-[7.5px] font-semibold">
                            {language.name}
                          </span>
                        </div>

                        <span className="text-[6px] text-muted-foreground">
                          {language.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Certifications */}
              {hasCertifications ? (
                <section className="mb-7 atelier-avoid-break">
                  <SectionTitle accent={accent}>Certifications</SectionTitle>

                  <div className="space-y-3.5">
                    {resume.certifications.map((certification) => (
                      <div key={certification.id} className="flex gap-2">
                        <ShieldCheck
                          className="mt-0.5 size-3 shrink-0"
                          style={{ color: accent }}
                        />

                        <div className="min-w-0">
                          <p className="text-[7.5px] font-bold leading-[1.4]">
                            {certification.name}
                          </p>

                          <p className="mt-0.5 text-[6.5px] text-muted-foreground">
                            {certification.issuer}
                          </p>

                          {certification.issueDate ? (
                            <p className="mt-0.5 text-[6px] text-muted-foreground">
                              {certification.issueDate}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Awards */}
              {hasAwards ? (
                <section className="mb-7 atelier-avoid-break">
                  <SectionTitle accent={accent}>Awards</SectionTitle>

                  <div className="space-y-3.5">
                    {resume.awards.map((award) => (
                      <div key={award.id} className="flex gap-2">
                        <Award
                          className="mt-0.5 size-3 shrink-0"
                          style={{ color: accent }}
                        />

                        <div className="min-w-0">
                          <p className="text-[7.5px] font-bold leading-[1.4]">
                            {award.title}
                          </p>

                          <p className="mt-0.5 text-[6.5px] text-muted-foreground">
                            {award.issuer}
                          </p>

                          <p className="mt-0.5 text-[6px] text-muted-foreground">
                            {award.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Interests */}
              {hasInterests ? (
                <section className="mb-7 atelier-avoid-break">
                  <SectionTitle accent={accent}>Interests</SectionTitle>

                  <div className="space-y-2">
                    {resume.interests.map((interest) => (
                      <div
                        key={interest}
                        className="flex items-center gap-2 text-[7.5px] font-medium"
                      >
                        <Heart className="size-3" style={{ color: accent }} />
                        {interest}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* References */}
              {hasReferences ? (
                <section className="mb-7 atelier-avoid-break">
                  <SectionTitle accent={accent}>References</SectionTitle>

                  <div className="space-y-4">
                    {resume.references.map((reference) => (
                      <div key={reference.id}>
                        <p className="text-[8px] font-bold">{reference.name}</p>

                        <p className="mt-0.5 text-[6.5px] text-muted-foreground">
                          {reference.position}
                        </p>

                        <p className="text-[6.5px] text-muted-foreground">
                          {reference.company}
                        </p>

                        {reference.relationship ? (
                          <p
                            className="mt-1 text-[6px] font-bold uppercase tracking-wide"
                            style={{ color: accent }}
                          >
                            {reference.relationship}
                          </p>
                        ) : null}

                        {reference.email ? (
                          <p className="mt-1 break-all text-[6.5px] text-muted-foreground">
                            {reference.email}
                          </p>
                        ) : null}

                        {reference.phone ? (
                          <p className="text-[6.5px] text-muted-foreground">
                            {reference.phone}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>
          </div>

          {/* ==========================================================
              CUSTOM SECTIONS
          =========================================================== */}
          {hasCustomSections ? (
            <section className="mt-6">
              {resume.customSections.map((section) => (
                <div key={section.id} className="mb-7 atelier-avoid-break">
                  <SectionTitle accent={accent}>{section.title}</SectionTitle>

                  {section.description ? (
                    <p className="mb-3 text-[8px] leading-[1.55] text-muted-foreground">
                      {section.description}
                    </p>
                  ) : null}

                  <div className="grid grid-cols-2 gap-x-7 gap-y-4">
                    {section.items.map((item) => (
                      <article key={item.id}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-[8px] font-bold">
                              {item.title}
                            </h3>

                            {item.subtitle ? (
                              <p className="mt-0.5 text-[6.5px] text-muted-foreground">
                                {item.subtitle}
                              </p>
                            ) : null}
                          </div>

                          {item.date ? (
                            <span className="whitespace-nowrap text-[6px] font-medium text-muted-foreground">
                              {item.date}
                            </span>
                          ) : null}
                        </div>

                        {item.description ? (
                          <p className="mt-1 text-[7px] leading-[1.5] text-muted-foreground">
                            {item.description}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ) : null}

          {/* ==========================================================
              FOOTER
          =========================================================== */}
          <footer className="mt-7 flex items-center justify-between border-t border-border pt-3">
            <span className="text-[6px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {personal.firstName} {personal.lastName}
            </span>

            <span
              className="text-[6px] font-bold uppercase tracking-[0.18em]"
              style={{ color: accent }}
            >
              Professional Resume
            </span>
          </footer>
        </div>
      </article>
    </>
  );
}

export default Atelier;
