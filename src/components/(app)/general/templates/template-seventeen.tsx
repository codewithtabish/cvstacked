"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { ResumeData } from "@/data/resume";
import { DEFAULT_RESUME_DESIGN, RESUME_FONT_FAMILIES, RESUME_THEMES } from "@/data/resume-design";

interface TemplateSeventeenProps {
  resume: ResumeData;
  id?: string;
}

function getTypographyScale(scale: string) {
  switch (scale) {
    case "compact":
      return {
        name: "26px",
        jobTitle: "11px",
        body: "9.5px",
        small: "8px",
        section: "9.5px",
        lineHeight: 1.42,
        sectionGap: "13px",
        itemGap: "8px",
      };
    case "comfortable":
      return {
        name: "32px",
        jobTitle: "12.5px",
        body: "10.5px",
        small: "8.5px",
        section: "11px",
        lineHeight: 1.58,
        sectionGap: "18px",
        itemGap: "12px",
      };
    case "standard":
    default:
      return {
        name: "29px",
        jobTitle: "12px",
        body: "10px",
        small: "8px",
        section: "10px",
        lineHeight: 1.5,
        sectionGap: "15px",
        itemGap: "10px",
      };
  }
}

function SectionHeading({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "10px",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#111827",
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "0.15em",
          lineHeight: 1.2,
          textTransform: "uppercase",
        }}
      >
        {children}
      </h2>
      <div
        aria-hidden="true"
        style={{
          flex: 1,
          height: "1px",
          background: `linear-gradient(90deg, ${accent} 0%, transparent 100%)`,
        }}
      />
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
        margin: "5px 0 0",
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: "3px",
      }}
    >
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "7px",
            color: textColor,
            fontSize,
            lineHeight,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "4px",
              height: "4px",
              marginTop: "5px",
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

export function TemplateSeventeen({ resume, id = "resume-page" }: TemplateSeventeenProps) {
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
    padding: "13mm 14mm 12mm",
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
      data-template="professional"
      data-template-id="professional"
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
          gap: "20px",
          marginBottom: "16px",
          paddingBottom: "14px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            style={{
              margin: 0,
              color: colors.text,
              fontSize: typography.name,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            {resume.personal.firstName || "Your"} {resume.personal.lastName || "Name"}
          </h1>

          {resume.personal.jobTitle && (
            <p
              style={{
                margin: "5px 0 0",
                color: colors.accent,
                fontSize: typography.jobTitle,
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              {resume.personal.jobTitle}
            </p>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 14px",
              marginTop: "9px",
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
                    lineHeight: 1.35,
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
              width: "66px",
              height: "66px",
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
              borderRadius: "5px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
            }}
          >
            <Image
              src={resume.personal.photo}
              alt={`${resume.personal.firstName || "Your"} ${resume.personal.lastName || "Name"}`}
              fill
              sizes="66px"
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
              {resume.experience.map((exp) => (
                <div key={exp.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: typography.body,
                          fontWeight: 800,
                          color: colors.text,
                        }}
                      >
                        {exp.position}
                      </h3>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: typography.small,
                          fontWeight: 700,
                          color: colors.accent,
                        }}
                      >
                        {exp.company}
                        {exp.location ? ` · ${exp.location}` : ""}
                      </p>
                    </div>
                    <DateRange
                      startDate={exp.startDate}
                      endDate={exp.endDate}
                      current={exp.current}
                      color={colors.textSubtle}
                      fontSize={typography.small}
                    />
                  </div>
                  {exp.description && (
                    <p style={{ ...bodyTextStyle, marginTop: "4px" }}>{exp.description}</p>
                  )}
                  <BulletList
                    items={exp.achievements || []}
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
              gap: "20px",
            }}
          >
            {resume.education.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Education</SectionHeading>
                {resume.education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: "8px" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: typography.body,
                        fontWeight: 800,
                        color: colors.text,
                      }}
                    >
                      {edu.degree}
                      {edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}
                    </h3>
                    <p
                      style={{
                        margin: "1px 0 0",
                        fontSize: typography.small,
                        fontWeight: 700,
                        color: colors.accent,
                      }}
                    >
                      {edu.institution}
                    </p>
                    <DateRange
                      startDate={edu.startDate}
                      endDate={edu.endDate}
                      current={edu.current}
                      color={colors.textSubtle}
                      fontSize={typography.small}
                    />
                  </div>
                ))}
              </div>
            )}

            {resume.skills.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Skills</SectionHeading>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px",
                  }}
                >
                  {resume.skills.map((skill) => (
                    <span
                      key={skill.id}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "3px",
                        border: `1px solid ${colors.border}`,
                        fontSize: typography.small,
                        fontWeight: 650,
                        color: colors.text,
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

        {/* Projects, Certifications, Languages, Interests, Publications, Volunteer, References, Custom — same professional style as previous templates */}
        {resume.projects.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Selected Projects</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {resume.projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    padding: "9px 11px",
                    borderRadius: "4px",
                    backgroundColor: colors.surface || "#F8FAFC",
                    borderLeft: `3px solid ${colors.accent}`,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: typography.body,
                      fontWeight: 800,
                      color: colors.text,
                    }}
                  >
                    {project.name}
                  </h3>
                  {project.role && (
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: typography.small,
                        fontWeight: 700,
                        color: colors.accent,
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

        {/* Continue with the remaining sections using the same clean professional patterns shown above */}
        {(resume.certifications.length > 0 || resume.awards.length > 0) && (
          <section>
            <SectionHeading accent={colors.accent}>Certifications & Awards</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
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
              gap: "20px",
            }}
          >
            {resume.languages.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Languages</SectionHeading>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px" }}>
                  {resume.languages.map((l) => (
                    <span key={l.id}>
                      <strong style={{ fontSize: typography.body }}>{l.name}</strong>{" "}
                      <span style={{ fontSize: typography.small, color: colors.textSubtle }}>
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
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
                  {resume.interests.map((i) => (
                    <span key={i} style={{ fontSize: typography.small, color: colors.textMuted }}>
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

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
              <div key={v.id} style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
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
                  <p style={{ ...bodyTextStyle, marginTop: "3px" }}>{v.description}</p>
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
                gap: "10px",
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

export default TemplateSeventeen;
