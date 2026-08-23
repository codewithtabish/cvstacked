"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { ResumeData } from "@/data/resume";
import { DEFAULT_RESUME_DESIGN, RESUME_FONT_FAMILIES, RESUME_THEMES } from "@/data/resume-design";

interface TemplateNineteenProps {
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
      <div
        aria-hidden="true"
        style={{
          width: "4px",
          height: "12px",
          borderRadius: "1px",
          backgroundColor: accent,
          flexShrink: 0,
        }}
      />
      <h2
        style={{
          margin: 0,
          color: "#111827",
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "0.14em",
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
              borderRadius: "1px",
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

export function TemplateNineteen({ resume, id = "resume-page" }: TemplateNineteenProps) {
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
    padding: "12mm 13mm 11mm",
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
      data-template="technical"
      data-template-id="technical"
      data-theme={resume.themeId}
      data-font={resume.fontFamilyId}
      data-typography-scale={resume.typographyScale}
    >
      {/* ============================================================
          HEADER
          ============================================================ */}
      <header
        style={{
          display: "grid",
          gridTemplateColumns: resume.personal.photo ? "1fr 62px" : "1fr",
          gap: "16px",
          alignItems: "center",
          marginBottom: "15px",
          paddingBottom: "13px",
          borderBottom: `2px solid ${colors.accent}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
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
                margin: "5px 0 0",
                color: colors.accent,
                fontSize: typography.jobTitle,
                fontWeight: 700,
                letterSpacing: "0.02em",
                lineHeight: 1.3,
              }}
            >
              {resume.personal.jobTitle}
            </p>
          )}

          {/* Contact — 3 column feel */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "4px 10px",
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
              width: "62px",
              height: "62px",
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
              sizes="62px"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </header>

      {/* ============================================================
          MAIN CONTENT
          ============================================================ */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: typography.sectionGap,
        }}
      >
        {/* PROFILE */}
        {resume.summary?.trim() && (
          <section>
            <SectionHeading accent={colors.accent}>Profile</SectionHeading>
            <p style={bodyTextStyle}>{resume.summary}</p>
          </section>
        )}

        {/* EXPERIENCE */}
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
                      gap: "12px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 800,
                          lineHeight: 1.3,
                        }}
                      >
                        {experience.position}
                      </h3>
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.accent,
                          fontSize: typography.small,
                          fontWeight: 700,
                          lineHeight: 1.3,
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
                    <p style={{ ...bodyTextStyle, marginTop: "4px" }}>{experience.description}</p>
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

        {/* EDUCATION */}
        {resume.education.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Education</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "12px",
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
                      lineHeight: 1.3,
                    }}
                  >
                    {education.degree}
                    {education.fieldOfStudy ? ` — ${education.fieldOfStudy}` : ""}
                  </h3>
                  <p
                    style={{
                      margin: "2px 0 0",
                      color: colors.accent,
                      fontSize: typography.small,
                      fontWeight: 700,
                    }}
                  >
                    {education.institution}
                    {education.location ? ` · ${education.location}` : ""}
                  </p>
                  <DateRange
                    startDate={education.startDate}
                    endDate={education.endDate}
                    current={education.current}
                    color={colors.textSubtle}
                    fontSize={typography.small}
                  />
                  {(education.grade || education.description) && (
                    <p style={{ ...bodyTextStyle, marginTop: "3px" }}>
                      {[education.grade, education.description].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS — 3 COLUMN GRID */}
        {resume.skills.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Skills</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "6px",
              }}
            >
              {resume.skills.map((skill) => (
                <span
                  key={skill.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px 6px",
                    borderRadius: "3px",
                    backgroundColor: colors.surface || "#F1F5F9",
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    fontSize: typography.small,
                    fontWeight: 650,
                    lineHeight: 1.2,
                    textAlign: "center",
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {resume.projects.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Selected Projects</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "10px",
              }}
            >
              {resume.projects.map((project) => {
                const technologies = project.technologies || [];
                const achievements = project.achievements || [];

                return (
                  <div
                    key={project.id}
                    style={{
                      padding: "9px 11px",
                      borderRadius: "4px",
                      backgroundColor: colors.surface || "#F8FAFC",
                      borderTop: `3px solid ${colors.accent}`,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: typography.body,
                        fontWeight: 800,
                        lineHeight: 1.3,
                      }}
                    >
                      {project.name}
                    </h3>

                    {project.role && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.accent,
                          fontSize: typography.small,
                          fontWeight: 700,
                        }}
                      >
                        {project.role}
                      </p>
                    )}

                    <p style={{ ...bodyTextStyle, marginTop: "3px" }}>{project.description}</p>

                    {technologies.length > 0 && (
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: colors.textSubtle,
                          fontSize: typography.small,
                          fontWeight: 600,
                          lineHeight: 1.35,
                        }}
                      >
                        {technologies.join(" · ")}
                      </p>
                    )}

                    {achievements.length > 0 && (
                      <BulletList
                        items={achievements}
                        textColor={colors.textMuted}
                        fontSize={typography.small}
                        lineHeight={1.4}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS + AWARDS — 3 COLUMN when possible */}
        {(resume.certifications.length > 0 || resume.awards.length > 0) && (
          <section>
            <SectionHeading accent={colors.accent}>Certifications & Awards</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              {resume.certifications.map((certification) => (
                <div key={certification.id}>
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: typography.body,
                      fontWeight: 750,
                      lineHeight: 1.3,
                    }}
                  >
                    {certification.name}
                  </h3>
                  <p
                    style={{
                      margin: "2px 0 0",
                      color: colors.textMuted,
                      fontSize: typography.small,
                      lineHeight: 1.35,
                    }}
                  >
                    {certification.issuer}
                    {certification.issueDate ? ` · ${certification.issueDate}` : ""}
                  </p>
                </div>
              ))}

              {resume.awards.map((award) => (
                <div key={award.id}>
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: typography.body,
                      fontWeight: 750,
                      lineHeight: 1.3,
                    }}
                  >
                    {award.title}
                  </h3>
                  <p
                    style={{
                      margin: "2px 0 0",
                      color: colors.textMuted,
                      fontSize: typography.small,
                    }}
                  >
                    {award.issuer} · {award.date}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LANGUAGES + INTERESTS — 3 COLUMN */}
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
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "5px 12px",
                  }}
                >
                  {resume.languages.map((language) => (
                    <div
                      key={language.id}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "5px",
                      }}
                    >
                      <span
                        style={{
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 700,
                        }}
                      >
                        {language.name}
                      </span>
                      <span
                        style={{
                          color: colors.textSubtle,
                          fontSize: typography.small,
                        }}
                      >
                        {language.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resume.interests.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Interests</SectionHeading>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "4px 10px",
                  }}
                >
                  {resume.interests.map((interest) => (
                    <span
                      key={interest}
                      style={{
                        color: colors.textMuted,
                        fontSize: typography.small,
                        lineHeight: 1.35,
                      }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* PUBLICATIONS */}
        {resume.publications.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Publications</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {resume.publications.map((publication) => (
                <div key={publication.id}>
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: typography.body,
                      fontWeight: 750,
                    }}
                  >
                    {publication.title}
                  </h3>
                  <p
                    style={{
                      margin: "1px 0 0",
                      color: colors.textMuted,
                      fontSize: typography.small,
                    }}
                  >
                    {publication.publisher} · {publication.date}
                  </p>
                  {publication.description && (
                    <p style={{ ...bodyTextStyle, marginTop: "2px" }}>{publication.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VOLUNTEER */}
        {resume.volunteer.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Volunteer Experience</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: typography.itemGap,
              }}
            >
              {resume.volunteer.map((volunteer) => (
                <div key={volunteer.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 750,
                        }}
                      >
                        {volunteer.role}
                      </h3>
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.accent,
                          fontSize: typography.small,
                          fontWeight: 700,
                        }}
                      >
                        {volunteer.organization}
                      </p>
                    </div>

                    <DateRange
                      startDate={volunteer.startDate}
                      endDate={volunteer.endDate}
                      current={volunteer.current}
                      color={colors.textSubtle}
                      fontSize={typography.small}
                    />
                  </div>

                  {volunteer.description && (
                    <p style={{ ...bodyTextStyle, marginTop: "3px" }}>{volunteer.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REFERENCES — 3 COLUMN */}
        {resume.references.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>References</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "10px",
              }}
            >
              {resume.references.map((reference) => (
                <div key={reference.id}>
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: typography.body,
                      fontWeight: 750,
                    }}
                  >
                    {reference.name}
                  </h3>
                  <p
                    style={{
                      margin: "2px 0 0",
                      color: colors.accent,
                      fontSize: typography.small,
                      fontWeight: 700,
                    }}
                  >
                    {reference.position}
                    {reference.company ? ` · ${reference.company}` : ""}
                  </p>
                  {(reference.email || reference.phone) && (
                    <p
                      style={{
                        margin: "2px 0 0",
                        color: colors.textMuted,
                        fontSize: typography.small,
                      }}
                    >
                      {[reference.email, reference.phone].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CUSTOM SECTIONS */}
        {resume.customSections.length > 0 &&
          resume.customSections.map((section) => (
            <section key={section.id}>
              <SectionHeading accent={colors.accent}>{section.title}</SectionHeading>

              {section.description && (
                <p style={{ ...bodyTextStyle, marginBottom: "6px" }}>{section.description}</p>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {section.items.map((item) => (
                  <div key={item.id}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 750,
                        }}
                      >
                        {item.title}
                      </h3>
                      {item.date && (
                        <span
                          style={{
                            color: colors.textSubtle,
                            fontSize: typography.small,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.date}
                        </span>
                      )}
                    </div>

                    {item.subtitle && (
                      <p
                        style={{
                          margin: "1px 0 0",
                          color: colors.accent,
                          fontSize: typography.small,
                          fontWeight: 700,
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
              </div>
            </section>
          ))}
      </main>
    </article>
  );
}

export default TemplateNineteen;
