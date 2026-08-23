"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { ResumeData } from "@/data/resume";
import { DEFAULT_RESUME_DESIGN, RESUME_FONT_FAMILIES, RESUME_THEMES } from "@/data/resume-design";

// ============================================================
// TYPES
// ============================================================

interface TemplateThreeProps {
  id?: string;
  resume: ResumeData;
}

// ============================================================
// TYPOGRAPHY
// ============================================================

function getTypographyScale(scale: string) {
  switch (scale) {
    case "compact":
      return {
        name: "28px",
        jobTitle: "11px",
        body: "9.5px",
        small: "8px",
        section: "10px",
        lineHeight: 1.45,
        sectionGap: "15px",
        itemGap: "10px",
      };

    case "comfortable":
      return {
        name: "34px",
        jobTitle: "13px",
        body: "10.5px",
        small: "8.5px",
        section: "11px",
        lineHeight: 1.6,
        sectionGap: "21px",
        itemGap: "14px",
      };

    case "standard":
    default:
      return {
        name: "31px",
        jobTitle: "12px",
        body: "10px",
        small: "8px",
        section: "10.5px",
        lineHeight: 1.52,
        sectionGap: "18px",
        itemGap: "12px",
      };
  }
}

// ============================================================
// SECTION TITLE
// ============================================================

function SectionTitle({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <div
      style={{
        marginBottom: "10px",
      }}
    >
      <h2
        style={{
          width: "fit-content",
          margin: 0,
          paddingBottom: "5px",
          color: "#111827",
          fontSize: "10.5px",
          fontWeight: 800,
          letterSpacing: "0.14em",
          lineHeight: 1.2,
          textTransform: "uppercase",
          borderBottom: `2px solid ${accent}`,
        }}
      >
        {children}
      </h2>

      <div
        aria-hidden="true"
        style={{
          width: "100%",
          height: "1px",
          marginTop: "4px",
          backgroundColor: "#E5E7EB",
        }}
      />
    </div>
  );
}

// ============================================================
// BULLET LIST
// ============================================================

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
  if (!items.length) return null;

  return (
    <ul
      style={{
        margin: "7px 0 0",
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
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
              borderRadius: "999px",
              backgroundColor: textColor,
              flexShrink: 0,
            }}
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ============================================================
// DATE RANGE
// ============================================================

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
      }}
    >
      {startDate}
      {startDate && end ? " — " : ""}
      {end}
    </span>
  );
}

// ============================================================
// TEMPLATE THREE
// ============================================================

export function TemplateThree({ id = "resume-page", resume }: TemplateThreeProps) {
  const theme = RESUME_THEMES[resume.themeId] ?? RESUME_THEMES[DEFAULT_RESUME_DESIGN.themeId];

  const font =
    RESUME_FONT_FAMILIES[resume.fontFamilyId] ??
    RESUME_FONT_FAMILIES[DEFAULT_RESUME_DESIGN.fontFamilyId];

  const typography = getTypographyScale(
    resume.typographyScale || DEFAULT_RESUME_DESIGN.typographyScale,
  );

  const colors = theme.colors;

  // ============================================================
  // PAGE
  // ============================================================

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

  // ============================================================
  // BODY TEXT
  // ============================================================

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
      data-template="modren"
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
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: "24px",
          paddingBottom: "16px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div>
          <div
            style={{
              marginBottom: "5px",
              color: colors.accent,
              fontSize: typography.small,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Professional Resume
          </div>

          <h1
            style={{
              width: "fit-content",
              margin: 0,
              paddingBottom: "6px",
              color: colors.text,
              fontSize: typography.name,
              fontWeight: 850,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              borderBottom: `3px double ${colors.accent}`,
            }}
          >
            {resume.personal.firstName || "Your"} {resume.personal.lastName || "Name"}
          </h1>

          {resume.personal.jobTitle && (
            <p
              style={{
                margin: "7px 0 0",
                color: colors.textMuted,
                fontSize: typography.jobTitle,
                fontWeight: 700,
                letterSpacing: "0.02em",
                lineHeight: 1.35,
              }}
            >
              {resume.personal.jobTitle}
            </p>
          )}
        </div>

        {resume.personal.photo && (
          <div
            style={{
              width: "78px",
              height: "78px",
              position: "relative",
              overflow: "hidden",
              flexShrink: 0,
              border: `2px solid ${colors.accent}`,
              backgroundColor: colors.surface,
            }}
          >
            <Image
              src={resume.personal.photo}
              alt={`${resume.personal.firstName} ${resume.personal.lastName}`}
              fill
              sizes="78px"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </header>

      {/* ============================================================
          CONTACT
          ============================================================ */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "5px 14px",
          padding: "9px 0 10px",
          borderBottom: `1px solid ${colors.border}`,
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
          .map((item, index) => (
            <span
              key={`${item}-${index}`}
              style={{
                color: colors.textMuted,
                fontSize: typography.small,
                lineHeight: 1.4,
                overflowWrap: "anywhere",
              }}
            >
              {item}
            </span>
          ))}
      </div>

      {/* ============================================================
          MAIN
          ============================================================ */}

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: typography.sectionGap,
          marginTop: "18px",
        }}
      >
        {/* ==========================================================
            PROFILE
            ========================================================== */}

        {resume.summary.trim() && (
          <section>
            <SectionTitle accent={colors.accent}>Profile</SectionTitle>

            <p style={bodyTextStyle}>{resume.summary}</p>
          </section>
        )}

        {/* ==========================================================
            EXPERIENCE
            ========================================================== */}

        {resume.experience.length > 0 && (
          <section>
            <SectionTitle accent={colors.accent}>Experience</SectionTitle>

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
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "16px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 800,
                          lineHeight: 1.35,
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
                    <p
                      style={{
                        ...bodyTextStyle,
                        marginTop: "5px",
                      }}
                    >
                      {experience.description}
                    </p>
                  )}

                  <BulletList
                    items={experience.achievements ?? []}
                    textColor={colors.textMuted}
                    fontSize={typography.body}
                    lineHeight={typography.lineHeight}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==========================================================
            EDUCATION
            ========================================================== */}

        {resume.education.length > 0 && (
          <section>
            <SectionTitle accent={colors.accent}>Education</SectionTitle>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: typography.itemGap,
              }}
            >
              {resume.education.map((education) => (
                <div key={education.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 800,
                          lineHeight: 1.35,
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
                    </div>

                    <DateRange
                      startDate={education.startDate}
                      endDate={education.endDate}
                      current={education.current}
                      color={colors.textSubtle}
                      fontSize={typography.small}
                    />
                  </div>

                  {(education.grade || education.description) && (
                    <p
                      style={{
                        ...bodyTextStyle,
                        marginTop: "5px",
                      }}
                    >
                      {[education.grade, education.description].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==========================================================
            SKILLS
            ========================================================== */}

        {resume.skills.length > 0 && (
          <section>
            <SectionTitle accent={colors.accent}>Skills</SectionTitle>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
              }}
            >
              {resume.skills.map((skill) => (
                <div
                  key={skill.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 8px",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "4px",
                    backgroundColor: colors.surface,
                  }}
                >
                  <span
                    style={{
                      color: colors.text,
                      fontSize: typography.small,
                      fontWeight: 700,
                    }}
                  >
                    {skill.name}
                  </span>

                  {skill.category && (
                    <span
                      style={{
                        color: colors.textSubtle,
                        fontSize: "7px",
                      }}
                    >
                      {skill.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==========================================================
            PROJECTS
            ========================================================== */}

        {resume.projects.length > 0 && (
          <section>
            <SectionTitle accent={colors.accent}>Projects</SectionTitle>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "10px",
              }}
            >
              {resume.projects.map((project) => {
                const technologies = project.technologies ?? [];
                const achievements = project.achievements ?? [];

                return (
                  <div
                    key={project.id}
                    style={{
                      padding: "10px",
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.surface,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: typography.body,
                        fontWeight: 800,
                        lineHeight: 1.35,
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

                    <p
                      style={{
                        ...bodyTextStyle,
                        marginTop: "5px",
                      }}
                    >
                      {project.description}
                    </p>

                    {technologies.length > 0 && (
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: colors.textSubtle,
                          fontSize: typography.small,
                          lineHeight: 1.4,
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
                        lineHeight={1.45}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ==========================================================
            CERTIFICATIONS + AWARDS
            ========================================================== */}

        {(resume.certifications.length > 0 || resume.awards.length > 0) && (
          <section>
            <SectionTitle accent={colors.accent}>Certifications & Awards</SectionTitle>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "16px",
              }}
            >
              {resume.certifications.length > 0 && (
                <div>
                  {resume.certifications.map((certification) => (
                    <div
                      key={certification.id}
                      style={{
                        marginBottom: "8px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 700,
                          lineHeight: 1.35,
                        }}
                      >
                        {certification.name}
                      </h3>

                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.textMuted,
                          fontSize: typography.small,
                        }}
                      >
                        {certification.issuer}
                        {certification.issueDate ? ` · ${certification.issueDate}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {resume.awards.length > 0 && (
                <div>
                  {resume.awards.map((award) => (
                    <div
                      key={award.id}
                      style={{
                        marginBottom: "8px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 700,
                          lineHeight: 1.35,
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
              )}
            </div>
          </section>
        )}

        {/* ==========================================================
            LANGUAGES
            ========================================================== */}

        {resume.languages.length > 0 && (
          <section>
            <SectionTitle accent={colors.accent}>Languages</SectionTitle>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px 18px",
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
          </section>
        )}

        {/* ==========================================================
            PUBLICATIONS
            ========================================================== */}

        {resume.publications.length > 0 && (
          <section>
            <SectionTitle accent={colors.accent}>Publications</SectionTitle>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {resume.publications.map((publication) => (
                <div key={publication.id}>
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: typography.body,
                      fontWeight: 700,
                    }}
                  >
                    {publication.title}
                  </h3>

                  <p
                    style={{
                      margin: "2px 0 0",
                      color: colors.textMuted,
                      fontSize: typography.small,
                    }}
                  >
                    {publication.publisher} · {publication.date}
                  </p>

                  {publication.description && (
                    <p
                      style={{
                        ...bodyTextStyle,
                        marginTop: "4px",
                      }}
                    >
                      {publication.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==========================================================
            VOLUNTEER
            ========================================================== */}

        {resume.volunteer.length > 0 && (
          <section>
            <SectionTitle accent={colors.accent}>Volunteer Experience</SectionTitle>

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
                      gap: "16px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 700,
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
                    <p
                      style={{
                        ...bodyTextStyle,
                        marginTop: "5px",
                      }}
                    >
                      {volunteer.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==========================================================
            REFERENCES
            ========================================================== */}

        {resume.references.length > 0 && (
          <section>
            <SectionTitle accent={colors.accent}>References</SectionTitle>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              {resume.references.map((reference) => (
                <div key={reference.id}>
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: typography.body,
                      fontWeight: 700,
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
                        margin: "3px 0 0",
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

        {/* ==========================================================
            INTERESTS
            ========================================================== */}

        {resume.interests.length > 0 && (
          <section>
            <SectionTitle accent={colors.accent}>Interests</SectionTitle>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px 14px",
              }}
            >
              {resume.interests.map((interest) => (
                <span
                  key={interest}
                  style={{
                    color: colors.textMuted,
                    fontSize: typography.small,
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ==========================================================
            CUSTOM SECTIONS
            ========================================================== */}

        {resume.customSections.length > 0 &&
          resume.customSections.map((section) => (
            <section key={section.id}>
              <SectionTitle accent={colors.accent}>{section.title}</SectionTitle>

              {section.description && (
                <p
                  style={{
                    ...bodyTextStyle,
                    marginBottom: "8px",
                  }}
                >
                  {section.description}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {section.items.map((item) => (
                  <div key={item.id}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 700,
                        }}
                      >
                        {item.title}
                      </h3>

                      {item.date && (
                        <span
                          style={{
                            color: colors.textSubtle,
                            fontSize: typography.small,
                          }}
                        >
                          {item.date}
                        </span>
                      )}
                    </div>

                    {item.subtitle && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.accent,
                          fontSize: typography.small,
                          fontWeight: 700,
                        }}
                      >
                        {item.subtitle}
                      </p>
                    )}

                    {item.description && (
                      <p
                        style={{
                          ...bodyTextStyle,
                          marginTop: "4px",
                        }}
                      >
                        {item.description}
                      </p>
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

export default TemplateThree;
