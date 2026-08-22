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
  Sparkles,
} from "lucide-react";

import type { ResumeData } from "@/data/resume";

interface TabishProps {
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
    <span className="inline-flex items-center whitespace-nowrap rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
      {start}
      {start && end ? " — " : ""}
      {end}
    </span>
  );
}

function SectionHeading({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-[8px] font-bold text-primary-foreground">
        {number}
      </span>

      <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-foreground">
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
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex min-w-0 items-center gap-2 text-[10px] font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-background transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
        {icon}
      </span>

      <span className="break-all">{children}</span>
    </a>
  );
}

function TimelineDot() {
  return (
    <span className="absolute -left-[5px] top-1.5 flex size-2.5 items-center justify-center rounded-full border-2 border-background bg-primary ring-1 ring-primary/30" />
  );
}

export function Aleena({ resume }: TabishProps) {
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

  // Section numbers are derived from the rendered sections instead of
  // mutating a variable during render. This keeps the component pure and
  // prevents React's "Cannot reassign variable after render completes" error.
  const sectionKeys = [
    ...(resume.summary ? ["profile"] : []),
    ...(hasExperience ? ["experience"] : []),
    ...(hasProjects ? ["projects"] : []),
    ...(hasEducation ? ["education"] : []),
    ...(hasSkills ? ["skills"] : []),
    ...(hasCertifications ? ["certifications"] : []),
    ...(hasLanguages ? ["languages"] : []),
    ...(hasAwards ? ["awards"] : []),
    ...(hasPublications ? ["publications"] : []),
    ...(hasVolunteer ? ["volunteer"] : []),
    ...(hasReferences ? ["references"] : []),
    ...(hasInterests ? ["interests"] : []),
    ...(hasCustomSections
      ? resume.customSections.map((section) => `custom:${section.id}`)
      : []),
  ];

  const getSectionNumber = (key: string) => {
    const index = sectionKeys.indexOf(key);
    return index >= 0 ? String(index + 1).padStart(2, "0") : "00";
  };

  return (
    <article className="mx-auto w-full max-w-[210mm] overflow-hidden bg-background text-foreground shadow-2xl print:max-w-none print:shadow-none">
      <div className="min-h-[297mm]">
        {/* ============================================================
            HEADER
        ============================================================ */}

        <header className="relative overflow-hidden border-b border-border">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative px-[16mm] pb-7 pt-[15mm] sm:px-[18mm]">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2.5 py-1">
                  <Sparkles className="size-3 text-primary" />

                  <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Professional Resume
                  </span>
                </div>

                <h1 className="text-[38px] font-bold leading-[0.95] tracking-[-0.045em] sm:text-[46px]">
                  {personal.firstName}{" "}
                  <span className="text-primary">{personal.lastName}</span>
                </h1>

                {personal.jobTitle ? (
                  <p className="mt-4 text-[13px] font-semibold tracking-[-0.01em] text-muted-foreground">
                    {personal.jobTitle}
                  </p>
                ) : null}
              </div>

              {personal.photo ? (
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-2xl bg-primary/10" />

                  <img
                    src={personal.photo}
                    alt={`${personal.firstName} ${personal.lastName}`}
                    className="relative size-[82px] rounded-2xl object-cover ring-1 ring-border"
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-7 grid gap-2.5 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="inline-flex min-w-0 items-center gap-2 text-[10px] font-medium text-muted-foreground">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                    <MapPin className="size-3" />
                  </span>

                  <span className="break-words">{personal.location}</span>
                </div>
              ) : null}

              {personal.website ? (
                <ContactItem
                  href={personal.website}
                  icon={<ExternalLink className="size-3" />}
                >
                  {personal.website.replace(/^https?:\/\//, "")}
                </ContactItem>
              ) : null}

              {personal.linkedin ? (
                <ContactItem
                  href={personal.linkedin}
                  icon={<span className="text-[9px] font-bold">in</span>}
                >
                  LinkedIn
                </ContactItem>
              ) : null}

              {personal.github ? (
                <ContactItem
                  href={personal.github}
                  icon={<span className="text-[9px] font-bold">GH</span>}
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
          </div>
        </header>

        {/* ============================================================
            MAIN
        ============================================================ */}

        <main className="grid gap-0 sm:grid-cols-[minmax(0,1.55fr)_minmax(190px,0.75fr)]">
          {/* ==========================================================
              PRIMARY COLUMN
          ========================================================== */}

          <div className="px-[16mm] py-8 sm:px-[18mm] sm:pr-8">
            {/* SUMMARY */}

            {resume.summary ? (
              <section className="mb-9">
                <SectionHeading number={getSectionNumber("profile")}>
                  Profile
                </SectionHeading>

                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-[11px] leading-[1.75] text-muted-foreground">
                    {resume.summary}
                  </p>
                </div>
              </section>
            ) : null}

            {/* EXPERIENCE */}

            {hasExperience ? (
              <section className="mb-9">
                <SectionHeading number={getSectionNumber("experience")}>
                  Experience
                </SectionHeading>

                <div className="relative ml-1 border-l border-border pl-5">
                  <div className="space-y-7">
                    {resume.experience.map((experience) => (
                      <article
                        key={experience.id}
                        className="relative break-inside-avoid"
                      >
                        <TimelineDot />

                        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-5">
                          <div>
                            <h3 className="text-[13px] font-bold leading-tight tracking-[-0.01em]">
                              {experience.position}
                            </h3>

                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-muted-foreground">
                              <span className="font-semibold text-primary">
                                {experience.company}
                              </span>

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
                          <p className="mt-3 text-[10.5px] leading-[1.7] text-muted-foreground">
                            {experience.description}
                          </p>
                        ) : null}

                        {experience.achievements.length > 0 ? (
                          <ul className="mt-3 space-y-1.5">
                            {experience.achievements.map((achievement) => (
                              <li
                                key={achievement}
                                className="relative pl-4 text-[10.5px] leading-[1.65] text-muted-foreground"
                              >
                                <span className="absolute left-0 top-[0.58em] size-1.5 rounded-full bg-primary" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {/* PROJECTS */}

            {hasProjects ? (
              <section className="mb-9">
                <SectionHeading number={getSectionNumber("projects")}>
                  Selected Projects
                </SectionHeading>

                <div className="grid gap-4">
                  {resume.projects.map((project) => (
                    <article
                      key={project.id}
                      className="break-inside-avoid rounded-xl border border-border bg-card p-4 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-[12px] font-bold tracking-[-0.01em]">
                            {project.name}
                          </h3>

                          {project.role ? (
                            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-primary">
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
                            className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        ) : null}
                      </div>

                      <p className="mt-3 text-[10px] leading-[1.7] text-muted-foreground">
                        {project.description}
                      </p>

                      {project.technologies &&
                      project.technologies.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.technologies.map((technology) => (
                            <span
                              key={technology}
                              className="rounded-md border border-border bg-muted/40 px-2 py-1 text-[8px] font-semibold text-muted-foreground"
                            >
                              {technology}
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
                              className="text-[9.5px] leading-[1.55] text-muted-foreground"
                            >
                              <span className="mr-1.5 text-primary">→</span>
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
              <section className="mb-9 break-inside-avoid">
                <SectionHeading number={getSectionNumber("education")}>
                  Education
                </SectionHeading>

                <div className="space-y-5">
                  {resume.education.map((education) => (
                    <article
                      key={education.id}
                      className="rounded-xl border border-border bg-muted/20 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <GraduationCap className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="text-[12px] font-bold">
                                {education.degree}
                                {education.fieldOfStudy
                                  ? ` in ${education.fieldOfStudy}`
                                  : ""}
                              </h3>

                              <p className="mt-1 text-[10px] font-medium text-muted-foreground">
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
                            <p className="mt-2 text-[9px] font-semibold text-primary">
                              {education.grade}
                            </p>
                          ) : null}

                          {education.description ? (
                            <p className="mt-2 text-[10px] leading-[1.65] text-muted-foreground">
                              {education.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* ==========================================================
              SIDEBAR
          ========================================================== */}

          <aside className="border-t border-border bg-muted/20 px-[16mm] py-8 sm:border-l sm:border-t-0 sm:px-7">
            {/* SKILLS */}

            {hasSkills ? (
              <section className="mb-8 break-inside-avoid">
                <SectionHeading number={getSectionNumber("skills")}>
                  Expertise
                </SectionHeading>

                <div className="space-y-5">
                  {Object.entries(groupedSkills).map(([category, skills]) => (
                    <div key={category}>
                      <h3 className="mb-2.5 text-[8px] font-bold uppercase tracking-[0.16em] text-primary">
                        {category}
                      </h3>

                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded-md border border-border bg-background px-2 py-1.5 text-[9px] font-medium text-foreground"
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

            {/* CERTIFICATIONS */}

            {hasCertifications ? (
              <section className="mb-8 break-inside-avoid">
                <SectionHeading number={getSectionNumber("certifications")}>
                  Certifications
                </SectionHeading>

                <div className="space-y-4">
                  {resume.certifications.map((certification) => (
                    <article key={certification.id} className="flex gap-2.5">
                      <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />

                      <div className="min-w-0">
                        <h3 className="text-[10px] font-bold leading-[1.4]">
                          {certification.name}
                        </h3>

                        <p className="mt-1 text-[9px] text-muted-foreground">
                          {certification.issuer}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-2 text-[8px] text-muted-foreground">
                          {certification.issueDate ? (
                            <span>Issued {certification.issueDate}</span>
                          ) : null}

                          {certification.expiryDate ? (
                            <span>Expires {certification.expiryDate}</span>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* LANGUAGES */}

            {hasLanguages ? (
              <section className="mb-8 break-inside-avoid">
                <SectionHeading number={getSectionNumber("languages")}>
                  Languages
                </SectionHeading>

                <div className="space-y-3">
                  {resume.languages.map((language) => (
                    <div
                      key={language.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <Languages className="size-3.5 text-primary" />

                        <span className="text-[10px] font-semibold">
                          {language.name}
                        </span>
                      </div>

                      <span className="rounded-full bg-background px-2 py-1 text-[7.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                        {language.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* AWARDS */}

            {hasAwards ? (
              <section className="mb-8 break-inside-avoid">
                <SectionHeading number={getSectionNumber("awards")}>
                  Awards
                </SectionHeading>

                <div className="space-y-4">
                  {resume.awards.map((award) => (
                    <article key={award.id} className="flex gap-2.5">
                      <Award className="mt-0.5 size-3.5 shrink-0 text-primary" />

                      <div>
                        <h3 className="text-[10px] font-bold">{award.title}</h3>

                        <p className="mt-1 text-[8.5px] text-muted-foreground">
                          {award.issuer} · {award.date}
                        </p>

                        {award.description ? (
                          <p className="mt-1.5 text-[9px] leading-[1.6] text-muted-foreground">
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
              <section className="mb-8 break-inside-avoid">
                <SectionHeading number={getSectionNumber("publications")}>
                  Publications
                </SectionHeading>

                <div className="space-y-4">
                  {resume.publications.map((publication) => (
                    <article key={publication.id}>
                      <h3 className="text-[10px] font-bold leading-[1.4]">
                        {publication.title}
                      </h3>

                      <p className="mt-1 text-[8.5px] text-muted-foreground">
                        {publication.publisher} · {publication.date}
                      </p>

                      {publication.description ? (
                        <p className="mt-1.5 text-[9px] leading-[1.6] text-muted-foreground">
                          {publication.description}
                        </p>
                      ) : null}

                      {publication.url ? (
                        <a
                          href={publication.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1 text-[8px] font-semibold text-primary hover:underline"
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
              <section className="mb-8 break-inside-avoid">
                <SectionHeading number={getSectionNumber("volunteer")}>
                  Volunteer
                </SectionHeading>

                <div className="space-y-4">
                  {resume.volunteer.map((volunteer) => (
                    <article key={volunteer.id}>
                      <h3 className="text-[10px] font-bold">
                        {volunteer.role}
                      </h3>

                      <p className="mt-1 text-[9px] font-medium text-primary">
                        {volunteer.organization}
                      </p>

                      <div className="mt-1">
                        <DateRange
                          startDate={volunteer.startDate}
                          endDate={volunteer.endDate}
                          current={volunteer.current}
                        />
                      </div>

                      <p className="mt-1.5 text-[9px] leading-[1.6] text-muted-foreground">
                        {volunteer.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* REFERENCES */}

            {hasReferences ? (
              <section className="mb-8 break-inside-avoid">
                <SectionHeading number={getSectionNumber("references")}>
                  References
                </SectionHeading>

                <div className="space-y-4">
                  {resume.references.map((reference) => (
                    <article
                      key={reference.id}
                      className="rounded-lg border border-border bg-background p-3"
                    >
                      <h3 className="text-[10px] font-bold">
                        {reference.name}
                      </h3>

                      <p className="mt-1 text-[8.5px] text-muted-foreground">
                        {reference.position} · {reference.company}
                      </p>

                      {reference.relationship ? (
                        <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-primary">
                          {reference.relationship}
                        </p>
                      ) : null}

                      {reference.email ? (
                        <p className="mt-1.5 break-all text-[8.5px] text-muted-foreground">
                          {reference.email}
                        </p>
                      ) : null}

                      {reference.phone ? (
                        <p className="mt-0.5 text-[8.5px] text-muted-foreground">
                          {reference.phone}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* INTERESTS */}

            {hasInterests ? (
              <section className="mb-8 break-inside-avoid">
                <SectionHeading number={getSectionNumber("interests")}>
                  Interests
                </SectionHeading>

                <div className="flex flex-wrap gap-2">
                  {resume.interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1.5 text-[8.5px] font-medium text-muted-foreground"
                    >
                      <Heart className="size-2.5 text-primary" />
                      {interest}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {/* CUSTOM SECTIONS */}

            {hasCustomSections
              ? resume.customSections.map((section) => (
                  <section key={section.id} className="mb-8 break-inside-avoid">
                    <SectionHeading
                      number={getSectionNumber(`custom:${section.id}`)}
                    >
                      {section.title}
                    </SectionHeading>

                    {section.description ? (
                      <p className="mb-4 text-[9px] leading-[1.6] text-muted-foreground">
                        {section.description}
                      </p>
                    ) : null}

                    <div className="space-y-4">
                      {section.items.map((item) => (
                        <article key={item.id}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-[10px] font-bold">
                                {item.title}
                              </h3>

                              {item.subtitle ? (
                                <p className="mt-1 text-[8.5px] text-muted-foreground">
                                  {item.subtitle}
                                </p>
                              ) : null}
                            </div>

                            {item.date ? (
                              <span className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                                {item.date}
                              </span>
                            ) : null}
                          </div>

                          {item.description ? (
                            <p className="mt-1.5 text-[9px] leading-[1.6] text-muted-foreground">
                              {item.description}
                            </p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </section>
                ))
              : null}
          </aside>
        </main>

        {/* ============================================================
            FOOTER
        ============================================================ */}

        <footer className="flex items-center justify-between border-t border-border px-[16mm] py-4 sm:px-[18mm]">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="size-3 text-primary" />

            <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {personal.firstName} {personal.lastName}
            </span>
          </div>

          <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {personal.jobTitle}
          </span>
        </footer>
      </div>
    </article>
  );
}

export default Aleena;
