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

import type { ResumeData, ResumeSkill } from "@/data/resume";

interface MeridianProps {
  resume: ResumeData;
}

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
    <span className="whitespace-nowrap font-mono text-[10px] tracking-[0.04em] text-muted-foreground">
      {start}
      {start && end ? " \u2192 " : ""}
      {end}
    </span>
  );
}

/** Small L-shaped bracket used to frame the header block, like an
 * instrument reticle. Purely structural — echoes the "spec sheet"
 * motif carried through section tags and the skill meters below. */
function CornerMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const sides: Record<typeof position, string> = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute size-3.5 border-foreground/70 ${sides[position]}`}
    />
  );
}

/** Section heading rendered as a technical annotation: a short
 * mono "spec code" (EXP, EDU, SKL…) followed by the label and a
 * hairline rule — not a numbered sequence, just a consistent tag. */
function SectionHeading({
  tag,
  children,
}: {
  tag: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-baseline gap-3">
      <span className="font-mono text-[10px] font-semibold tracking-[0.3em] text-primary">
        {tag}
      </span>

      <h2 className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.2em] text-foreground">
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
    <>
      <span className="text-primary">{icon}</span>
      <span className="min-w-0 break-all">{children}</span>
    </>
  );

  const className =
    "flex items-center gap-2 text-[11px] text-muted-foreground transition-colors hover:text-primary";

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  );
}

const LEVEL_WIDTH: Record<NonNullable<ResumeSkill["level"]>, string> = {
  beginner: "30%",
  intermediate: "55%",
  advanced: "80%",
  expert: "100%",
};

function SkillMeter({ skill }: { skill: ResumeSkill }) {
  const width = skill.level ? LEVEL_WIDTH[skill.level] : "65%";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11.5px] font-medium text-foreground">
          {skill.name}
        </span>

        {skill.level ? (
          <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted-foreground">
            {skill.level}
          </span>
        ) : null}
      </div>

      <div className="mt-1.5 h-[3px] w-full bg-border">
        <div className="h-full bg-primary" style={{ width }} />
      </div>
    </div>
  );
}

/* ============================================================
   TEMPLATE
   ============================================================ */

export function Meridian({ resume }: MeridianProps) {
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

  const groupedSkills = resume.skills.reduce<Record<string, ResumeSkill[]>>(
    (groups, skill) => {
      const category = skill.category || "Skills";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);

      return groups;
    },
    {},
  );

  return (
    <article className="mx-auto bg-red-500 w-full max-w-[210mm] bg-background text-foreground shadow-2xl print:max-w-none print:shadow-none">
      <div className="px-[16mm] py-[16mm] sm:px-[19mm] sm:py-[18mm]">
        {/* ============================================================
            HEADER — framed like an instrument plate
        ============================================================ */}

        <header className="relative border border-border p-7 sm:p-8">
          <CornerMark position="tl" />
          <CornerMark position="tr" />
          <CornerMark position="bl" />
          <CornerMark position="br" />

          <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
                Curriculum Vitae
              </span>

              <h1 className="mt-3 text-[38px] font-bold uppercase leading-[0.95] tracking-[-0.02em] sm:text-[46px]">
                {personal.firstName} {personal.lastName}
              </h1>

              {personal.jobTitle ? (
                <p className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <span className="inline-block size-1.5 bg-primary" />
                  {personal.jobTitle}
                </p>
              ) : null}
            </div>

            {personal.photo ? (
              <img
                src={personal.photo}
                alt={`${personal.firstName} ${personal.lastName}`}
                className="size-20 shrink-0 rounded-none border border-border object-cover grayscale"
              />
            ) : null}
          </div>

          <div className="mt-6 grid gap-2.5 border-t border-dashed border-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
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
                icon={<Link className="size-3.5" />}
              >
                LinkedIn
              </ContactItem>
            ) : null}

            {personal.github ? (
              <ContactItem
                href={personal.github}
                icon={<GitGraph className="size-3.5" />}
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
            <SectionHeading tag="ABT">Profile</SectionHeading>

            <p className="max-w-[165mm] text-[12.5px] leading-[1.8] text-muted-foreground">
              {resume.summary}
            </p>
          </section>
        ) : null}

        {/* ============================================================
            EXPERIENCE — vertical rail with tick nodes (real timeline)
        ============================================================ */}

        {hasExperience ? (
          <section className="mt-10">
            <SectionHeading tag="EXP">Experience</SectionHeading>

            <div className="relative border-l-2 border-foreground/80 pl-7">
              {resume.experience.map((experience) => (
                <article
                  key={experience.id}
                  className="relative break-inside-avoid pb-8 last:pb-0"
                >
                  <span className="absolute -left-[31px] top-1 size-[9px] border-2 border-background bg-primary" />

                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-[14px] font-semibold tracking-tight">
                      {experience.position}
                    </h3>

                    <DateRange
                      startDate={experience.startDate}
                      endDate={experience.endDate}
                      current={experience.current}
                    />
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-muted-foreground">
                    <span>{experience.company}</span>

                    {experience.location ? (
                      <>
                        <span className="text-border">/</span>
                        <span>{experience.location}</span>
                      </>
                    ) : null}

                    {experience.employmentType ? (
                      <>
                        <span className="text-border">/</span>
                        <span>{experience.employmentType}</span>
                      </>
                    ) : null}
                  </div>

                  {experience.description ? (
                    <p className="mt-3 text-[11.5px] leading-[1.7] text-muted-foreground">
                      {experience.description}
                    </p>
                  ) : null}

                  {experience.achievements.length > 0 ? (
                    <ul className="mt-3 space-y-1.5">
                      {experience.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="relative pl-4 text-[11.5px] leading-[1.65] text-muted-foreground"
                        >
                          <span className="absolute left-0 top-[0.6em] h-px w-2.5 bg-primary" />
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
          <section className="mt-10 grid gap-10 sm:grid-cols-2">
            {hasEducation ? (
              <div>
                <SectionHeading tag="EDU">Education</SectionHeading>

                <div className="space-y-6">
                  {resume.education.map((education) => (
                    <article key={education.id} className="break-inside-avoid">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h3 className="text-[12.5px] font-semibold">
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

                      <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                        {education.institution}
                        {education.location
                          ? ` \u00b7 ${education.location}`
                          : ""}
                      </p>

                      {education.grade ? (
                        <p className="mt-1.5 text-[10.5px] text-muted-foreground">
                          {education.grade}
                        </p>
                      ) : null}

                      {education.description ? (
                        <p className="mt-2 text-[10.5px] leading-[1.6] text-muted-foreground">
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
                <SectionHeading tag="SKL">Expertise</SectionHeading>

                <div className="space-y-6">
                  {Object.entries(groupedSkills).map(([category, skills]) => (
                    <div key={category}>
                      <h3 className="mb-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {category}
                      </h3>

                      <div className="space-y-2.5">
                        {skills.map((skill) => (
                          <SkillMeter key={skill.id} skill={skill} />
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
          <section className="mt-10">
            <SectionHeading tag="PRJ">Projects</SectionHeading>

            <div className="grid gap-6 sm:grid-cols-2">
              {resume.projects.map((project) => (
                <article
                  key={project.id}
                  className="break-inside-avoid border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[12.5px] font-semibold">
                        {project.name}
                      </h3>

                      {project.role ? (
                        <p className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
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

                  <p className="mt-2.5 text-[11px] leading-[1.65] text-muted-foreground">
                    {project.description}
                  </p>

                  {project.technologies && project.technologies.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="border border-border px-1.5 py-0.5 font-mono text-[8.5px] text-muted-foreground"
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
                          className="text-[10.5px] leading-[1.55] text-muted-foreground"
                        >
                          \u2014 {achievement}
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
            ADDITIONAL — two column grid
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
            <SectionHeading tag="ADD">Additional Information</SectionHeading>

            <div className="grid gap-9 sm:grid-cols-2">
              {hasCertifications ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3.5 flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.08em]">
                    <ShieldCheck className="size-3.5 text-primary" />
                    Certifications
                  </h3>

                  <div className="space-y-3.5">
                    {resume.certifications.map((certification) => (
                      <article key={certification.id}>
                        <p className="text-[11px] font-medium">
                          {certification.name}
                        </p>

                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {certification.issuer}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-3 font-mono text-[9px] text-muted-foreground">
                          {certification.issueDate ? (
                            <span>Issued {certification.issueDate}</span>
                          ) : null}

                          {certification.expiryDate ? (
                            <span>Expires {certification.expiryDate}</span>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {hasLanguages ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3.5 flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.08em]">
                    <Languages className="size-3.5 text-primary" />
                    Languages
                  </h3>

                  <div className="space-y-2.5">
                    {resume.languages.map((language) => (
                      <div
                        key={language.id}
                        className="flex items-center justify-between gap-4 border-b border-dashed border-border pb-2.5 last:border-0"
                      >
                        <span className="text-[11px] font-medium">
                          {language.name}
                        </span>

                        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                          {language.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {hasAwards ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3.5 flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.08em]">
                    <Award className="size-3.5 text-primary" />
                    Awards
                  </h3>

                  <div className="space-y-3.5">
                    {resume.awards.map((award) => (
                      <article key={award.id}>
                        <p className="text-[11px] font-medium">{award.title}</p>

                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {award.issuer} \u00b7 {award.date}
                        </p>

                        {award.description ? (
                          <p className="mt-1.5 text-[10.5px] leading-[1.6] text-muted-foreground">
                            {award.description}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {hasPublications ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.08em]">
                    Publications
                  </h3>

                  <div className="space-y-3.5">
                    {resume.publications.map((publication) => (
                      <article key={publication.id}>
                        <p className="text-[11px] font-medium leading-[1.4]">
                          {publication.title}
                        </p>

                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {publication.publisher} \u00b7 {publication.date}
                        </p>

                        {publication.description ? (
                          <p className="mt-1.5 text-[10.5px] leading-[1.6] text-muted-foreground">
                            {publication.description}
                          </p>
                        ) : null}

                        {publication.url ? (
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1.5 inline-flex items-center gap-1 text-[9.5px] font-medium text-primary hover:underline"
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

              {hasVolunteer ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.08em]">
                    Volunteer
                  </h3>

                  <div className="space-y-3.5">
                    {resume.volunteer.map((volunteer) => (
                      <article key={volunteer.id}>
                        <p className="text-[11px] font-medium">
                          {volunteer.role}
                        </p>

                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {volunteer.organization}
                        </p>

                        <div className="mt-1">
                          <DateRange
                            startDate={volunteer.startDate}
                            endDate={volunteer.endDate}
                            current={volunteer.current}
                          />
                        </div>

                        <p className="mt-1.5 text-[10.5px] leading-[1.6] text-muted-foreground">
                          {volunteer.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {hasReferences ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.08em]">
                    References
                  </h3>

                  <div className="space-y-3.5">
                    {resume.references.map((reference) => (
                      <article key={reference.id}>
                        <p className="text-[11px] font-medium">
                          {reference.name}
                        </p>

                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {reference.position} \u00b7 {reference.company}
                        </p>

                        {reference.relationship ? (
                          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-primary">
                            {reference.relationship}
                          </p>
                        ) : null}

                        {reference.email ? (
                          <p className="mt-1.5 text-[10px] text-muted-foreground">
                            {reference.email}
                          </p>
                        ) : null}

                        {reference.phone ? (
                          <p className="text-[10px] text-muted-foreground">
                            {reference.phone}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {hasInterests ? (
                <div className="break-inside-avoid">
                  <h3 className="mb-3.5 flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.08em]">
                    <Heart className="size-3.5 text-primary" />
                    Interests
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {resume.interests.map((interest) => (
                      <span
                        key={interest}
                        className="border border-border px-2.5 py-1 text-[10.5px] text-muted-foreground"
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
                      <h3 className="mb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.08em]">
                        {section.title}
                      </h3>

                      {section.description ? (
                        <p className="mb-3.5 text-[10.5px] leading-[1.6] text-muted-foreground">
                          {section.description}
                        </p>
                      ) : null}

                      <div className="space-y-3.5">
                        {section.items.map((item) => (
                          <article key={item.id}>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[11px] font-medium">
                                  {item.title}
                                </p>

                                {item.subtitle ? (
                                  <p className="mt-1 text-[10px] text-muted-foreground">
                                    {item.subtitle}
                                  </p>
                                ) : null}
                              </div>

                              {item.date ? (
                                <span className="whitespace-nowrap font-mono text-[9px] text-muted-foreground">
                                  {item.date}
                                </span>
                              ) : null}
                            </div>

                            {item.description ? (
                              <p className="mt-1.5 text-[10.5px] leading-[1.6] text-muted-foreground">
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
            FOOTER — mirrors the header's instrument frame
        ============================================================ */}

        <footer className="relative mt-10 border border-border p-4">
          <CornerMark position="tl" />
          <CornerMark position="br" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-3.5 text-primary" />

              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {personal.firstName} {personal.lastName}
              </span>
            </div>

            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {personal.jobTitle}
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
}

export default Meridian;
