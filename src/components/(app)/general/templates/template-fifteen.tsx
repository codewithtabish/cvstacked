"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { ResumeData } from "@/data/resume";
import { DEFAULT_RESUME_DESIGN, RESUME_FONT_FAMILIES, RESUME_THEMES } from "@/data/resume-design";

interface TemplateFifteenProps {
  resume: ResumeData;
  id?: string;
}

function getTypographyScale(scale: string) {
  switch (scale) {
    case "compact":
      return {
        name: "25px",
        jobTitle: "10.5px",
        body: "9px",
        small: "7.5px",
        section: "9px",
        lineHeight: 1.4,
        sectionGap: "11px",
        itemGap: "7px",
      };
    case "comfortable":
      return {
        name: "30px",
        jobTitle: "12px",
        body: "10px",
        small: "8px",
        section: "10px",
        lineHeight: 1.52,
        sectionGap: "16px",
        itemGap: "10px",
      };
    case "standard":
    default:
      return {
        name: "27px",
        jobTitle: "11px",
        body: "9.5px",
        small: "8px",
        section: "9.5px",
        lineHeight: 1.45,
        sectionGap: "13px",
        itemGap: "8px",
      };
  }
}

function SectionHeading({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        marginBottom: "8px",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: "3px",
          height: "11px",
          borderRadius: "1px",
          backgroundColor: accent,
          flexShrink: 0,
        }}
      />
      <h2
        style={{
          margin: 0,
          color: "#111827",
          fontSize: "9.5px",
          fontWeight: 800,
          letterSpacing: "0.13em",
          lineHeight: 1.2,
          textTransform: "uppercase",
        }}
      >
        {children}
      </h2>
    </div>
  );
}

function BulletList({
  items,
  textColor,
  fontSize,
  lineHeight,
}: {
  items: string[];
  textColor: string;
  fontSize: string;
  lineHeight: number;
}) {
  if (!items?.length) return null;

  return (
    <ul
      style={{
        margin: "4px 0 0",
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: "2.5px",
      }}
    >
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "6px",
            color: textColor,
            fontSize,
            lineHeight,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "3.5px",
              height: "3.5px",
              marginTop: "4.5px",
              borderRadius: "50%",
              backgroundColor: textColor,
              flexShrink: 0,
              opacity: 0.6,
            }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DateRange({
  startDate,
  endDate,
  current,
  color,
  fontSize,
}: {
  startDate?: string;
  endDate?: string;
  current?: boolean;
  color: string;
  fontSize: string;
}) {
  if (!startDate && !endDate) return null;
  const end = current ? "Present" : endDate;

  return (
    <span
      style={{
        color,
        fontSize,
        fontWeight: 600,
        whiteSpace: "nowrap",
        lineHeight: 1.3,
      }}
    >
      {startDate}
      {startDate && end ? " – " : ""}
      {end}
    </span>
  );
}

export function TemplateFifteen({ resume, id = "resume-page" }: TemplateFifteenProps) {
  const theme = RESUME_THEMES[resume.themeId] ?? RESUME_THEMES[DEFAULT_RESUME_DESIGN.themeId];

  const font =
    RESUME_FONT_FAMILIES[resume.fontFamilyId] ??
    RESUME_FONT_FAMILIES[DEFAULT_RESUME_DESIGN.fontFamilyId];

  const typography = getTypographyScale(
    resume.typographyScale || DEFAULT_RESUME_DESIGN.typographyScale,
  );

  const colors = theme.colors;

  const pageStyle: CSSProperties = {
    width: "210mm",
    minWidth: "210mm",
    minHeight: "297mm",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    fontFamily: font.family,
    padding: "11mm 12mm 10mm",
    margin: "0 auto",
    overflow: "visible",
    color: colors.text,
  };

  const bodyTextStyle: CSSProperties = {
    margin: 0,
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: typography.lineHeight,
  };

  return (
    <article
      id={id}
      className="resume-page"
      style={pageStyle}
      data-template="compact"
      data-template-id="compact"
      data-theme={resume.themeId}
      data-font={resume.fontFamilyId}
      data-typography-scale={resume.typographyScale}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          marginBottom: "12px",
          paddingBottom: "10px",
          borderBottom: `1.5px solid ${colors.accent}`,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            style={{
              margin: 0,
              color: colors.text,
              fontSize: typography.name,
              fontWeight: 850,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {resume.personal.firstName || "Your"} {resume.personal.lastName || "Name"}
          </h1>

          {resume.personal.jobTitle && (
            <p
              style={{
                margin: "4px 0 0",
                color: colors.accent,
                fontSize: typography.jobTitle,
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {resume.personal.jobTitle}
            </p>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "3px 12px",
              marginTop: "7px",
            }}
          >
            {[
              resume.personal.email,
              resume.personal.phone,
              resume.personal.location,
              resume.personal.website,
              resume.personal.linkedin,
              resume.personal.github,
            ]
              .filter(Boolean)
              .map((value, idx) => (
                <span
                  key={idx}
                  style={{
                    color: colors.textSubtle,
                    fontSize: typography.small,
                    lineHeight: 1.3,
                    overflowWrap: "anywhere",
                  }}
                >
                  {value}
                </span>
              ))}
          </div>
        </div>

        {resume.personal.photo && (
          <div
            style={{
              width: "58px",
              height: "58px",
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
              borderRadius: "4px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
            }}
          >
            <Image
              src={resume.personal.photo}
              alt={`${resume.personal.firstName || "Your"} ${resume.personal.lastName || "Name"}`}
              fill
              sizes="58px"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </header>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: typography.sectionGap,
        }}
      >
        {resume.summary?.trim() && (
          <section>
            <SectionHeading accent={colors.accent}>Profile</SectionHeading>
            <p style={bodyTextStyle}>{resume.summary}</p>
          </section>
        )}

        {resume.experience.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Experience</SectionHeading>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: typography.itemGap,
              }}
            >
              {resume.experience.map((experience) => (
                <div key={experience.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 800,
                          lineHeight: 1.25,
                        }}
                      >
                        {experience.position}
                      </h3>
                      <p
                        style={{
                          margin: "1px 0 0",
                          color: colors.accent,
                          fontSize: typography.small,
                          fontWeight: 700,
                        }}
                      >
                        {experience.company}
                        {experience.location ? ` · ${experience.location}` : ""}
                      </p>
                    </div>
                    <DateRange
                      startDate={experience.startDate}
                      endDate={experience.endDate}
                      current={experience.current}
                      color={colors.textSubtle}
                      fontSize={typography.small}
                    />
                  </div>
                  {experience.description && (
                    <p style={{ ...bodyTextStyle, marginTop: "3px" }}>{experience.description}</p>
                  )}
                  <BulletList
                    items={experience.achievements || []}
                    textColor={colors.textMuted}
                    fontSize={typography.body}
                    lineHeight={typography.lineHeight}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {(resume.education.length > 0 || resume.skills.length > 0) && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {resume.education.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Education</SectionHeading>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                  }}
                >
                  {resume.education.map((education) => (
                    <div key={education.id}>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 800,
                          lineHeight: 1.25,
                        }}
                      >
                        {education.degree}
                        {education.fieldOfStudy ? ` — ${education.fieldOfStudy}` : ""}
                      </h3>
                      <p
                        style={{
                          margin: "1px 0 0",
                          color: colors.accent,
                          fontSize: typography.small,
                          fontWeight: 700,
                        }}
                      >
                        {education.institution}
                      </p>
                      <DateRange
                        startDate={education.startDate}
                        endDate={education.endDate}
                        current={education.current}
                        color={colors.textSubtle}
                        fontSize={typography.small}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resume.skills.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Skills</SectionHeading>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                  }}
                >
                  {resume.skills.map((skill) => (
                    <span
                      key={skill.id}
                      style={{
                        padding: "3px 7px",
                        borderRadius: "3px",
                        backgroundColor: colors.surface || "#F1F5F9",
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                        fontSize: typography.small,
                        fontWeight: 650,
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {resume.projects.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Projects</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {resume.projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    padding: "7px 9px",
                    borderRadius: "4px",
                    backgroundColor: colors.surface || "#F8FAFC",
                    borderLeft: `2.5px solid ${colors.accent}`,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: typography.body,
                      fontWeight: 800,
                    }}
                  >
                    {project.name}
                  </h3>
                  {project.role && (
                    <p
                      style={{
                        margin: "1px 0 0",
                        color: colors.accent,
                        fontSize: typography.small,
                        fontWeight: 700,
                      }}
                    >
                      {project.role}
                    </p>
                  )}
                  <p style={{ ...bodyTextStyle, marginTop: "3px" }}>{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Remaining sections follow the same compact pattern */}
        {(resume.certifications.length > 0 || resume.awards.length > 0) && (
          <section>
            <SectionHeading accent={colors.accent}>Certifications & Awards</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {resume.certifications.map((c) => (
                <div key={c.id}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: typography.body,
                      fontWeight: 750,
                      color: colors.text,
                    }}
                  >
                    {c.name}
                  </h3>
                  <p
                    style={{
                      margin: "1px 0 0",
                      fontSize: typography.small,
                      color: colors.textMuted,
                    }}
                  >
                    {c.issuer}
                    {c.issueDate ? ` · ${c.issueDate}` : ""}
                  </p>
                </div>
              ))}
              {resume.awards.map((a) => (
                <div key={a.id}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: typography.body,
                      fontWeight: 750,
                      color: colors.text,
                    }}
                  >
                    {a.title}
                  </h3>
                  <p
                    style={{
                      margin: "1px 0 0",
                      fontSize: typography.small,
                      color: colors.textMuted,
                    }}
                  >
                    {a.issuer} · {a.date}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(resume.languages.length > 0 || resume.interests.length > 0) && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {resume.languages.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Languages</SectionHeading>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px 12px",
                  }}
                >
                  {resume.languages.map((l) => (
                    <span key={l.id} style={{ fontSize: typography.body }}>
                      <strong>{l.name}</strong>{" "}
                      <span style={{ color: colors.textSubtle, fontSize: typography.small }}>
                        {l.proficiency}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {resume.interests.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Interests</SectionHeading>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "3px 10px",
                  }}
                >
                  {resume.interests.map((i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: typography.small,
                        color: colors.textMuted,
                      }}
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Publications, Volunteer, References, Custom — same compact style */}
        {resume.publications.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Publications</SectionHeading>
            {resume.publications.map((p) => (
              <div key={p.id} style={{ marginBottom: "6px" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: typography.body,
                    fontWeight: 750,
                    color: colors.text,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    margin: "1px 0 0",
                    fontSize: typography.small,
                    color: colors.textMuted,
                  }}
                >
                  {p.publisher} · {p.date}
                </p>
              </div>
            ))}
          </section>
        )}

        {resume.volunteer.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Volunteer Experience</SectionHeading>
            {resume.volunteer.map((v) => (
              <div key={v.id} style={{ marginBottom: "7px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: typography.body,
                        fontWeight: 750,
                        color: colors.text,
                      }}
                    >
                      {v.role}
                    </h3>
                    <p
                      style={{
                        margin: "1px 0 0",
                        fontSize: typography.small,
                        fontWeight: 700,
                        color: colors.accent,
                      }}
                    >
                      {v.organization}
                    </p>
                  </div>
                  <DateRange
                    startDate={v.startDate}
                    endDate={v.endDate}
                    current={v.current}
                    color={colors.textSubtle}
                    fontSize={typography.small}
                  />
                </div>
                {v.description && (
                  <p style={{ ...bodyTextStyle, marginTop: "2px" }}>{v.description}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {resume.references.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>References</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {resume.references.map((r) => (
                <div key={r.id}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: typography.body,
                      fontWeight: 750,
                      color: colors.text,
                    }}
                  >
                    {r.name}
                  </h3>
                  <p
                    style={{
                      margin: "1px 0 0",
                      fontSize: typography.small,
                      fontWeight: 700,
                      color: colors.accent,
                    }}
                  >
                    {r.position}
                    {r.company ? ` · ${r.company}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.customSections.map((section) => (
          <section key={section.id}>
            <SectionHeading accent={colors.accent}>{section.title}</SectionHeading>
            {section.items.map((item) => (
              <div key={item.id} style={{ marginBottom: "6px" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: typography.body,
                    fontWeight: 750,
                    color: colors.text,
                  }}
                >
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p
                    style={{
                      margin: "1px 0 0",
                      fontSize: typography.small,
                      fontWeight: 700,
                      color: colors.accent,
                    }}
                  >
                    {item.subtitle}
                  </p>
                )}
                {item.description && (
                  <p style={{ ...bodyTextStyle, marginTop: "2px" }}>{item.description}</p>
                )}
              </div>
            ))}
          </section>
        ))}
      </main>
    </article>
  );
}

export default TemplateFifteen;
