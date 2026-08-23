"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import type { ResumeData } from "@/data/resume";

import { DEFAULT_RESUME_DESIGN, RESUME_FONT_FAMILIES, RESUME_THEMES } from "@/data/resume-design";

interface TemplateFourProps {
  resume: ResumeData;
  id?: string;
}

function getTypographyScale(scale: string) {
  switch (scale) {
    case "compact":
      return {
        name: "27px",
        jobTitle: "11px",
        body: "9.5px",
        small: "8px",
        section: "10px",
        lineHeight: 1.45,
        sectionGap: "14px",
        itemGap: "9px",
      };

    case "comfortable":
      return {
        name: "33px",
        jobTitle: "13px",
        body: "10.5px",
        small: "8.5px",
        section: "11px",
        lineHeight: 1.58,
        sectionGap: "20px",
        itemGap: "13px",
      };

    case "standard":
    default:
      return {
        name: "30px",
        jobTitle: "12px",
        body: "10px",
        small: "8px",
        section: "10.5px",
        lineHeight: 1.5,
        sectionGap: "17px",
        itemGap: "11px",
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
        marginBottom: "9px",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "5px",
          height: "18px",
          backgroundColor: accent,
          borderRadius: "2px",
          flexShrink: 0,
        }}
      />

      <h2
        style={{
          margin: 0,
          color: "#111827",
          fontSize: "10.5px",
          fontWeight: 800,
          letterSpacing: "0.13em",
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
          backgroundColor: "#E5E7EB",
        }}
      />
    </div>
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
        fontWeight: 700,
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      {startDate}
      {startDate && end ? " — " : ""}
      {end}
    </span>
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
  if (!items.length) return null;

  return (
    <ul
      style={{
        margin: "6px 0 0",
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
            gap: "6px",
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
            }}
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ContactItem({
  value,
  accent,
  fontSize,
}: {
  value?: string;
  accent: string;
  fontSize: string;
}) {
  if (!value) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        color: "#4B5563",
        fontSize,
        lineHeight: 1.4,
        overflowWrap: "anywhere",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          backgroundColor: accent,
          flexShrink: 0,
        }}
      />

      {value}
    </span>
  );
}

export function TemplateFour({ resume, id }: TemplateFourProps) {
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

  const projects = resume.projects ?? [];
  const certifications = resume.certifications ?? [];
  const awards = resume.awards ?? [];
  const languages = resume.languages ?? [];
  const publications = resume.publications ?? [];
  const volunteer = resume.volunteer ?? [];
  const references = resume.references ?? [];
  const customSections = resume.customSections ?? [];
  const interests = resume.interests ?? [];
  const experience = resume.experience ?? [];
  const education = resume.education ?? [];
  const skills = resume.skills ?? [];

  return (
    <article
      id={id}
      className="resume-page"
      data-template="classic"
      data-template-id="template-four"
      data-theme={resume.themeId}
      data-font={resume.fontFamilyId}
      data-typography-scale={resume.typographyScale}
      style={pageStyle}
    >
      {/* ============================================================
          HEADER
          ============================================================ */}

      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "end",
          gap: "22px",
          paddingBottom: "13px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "7px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "3px",
                backgroundColor: colors.accent,
                borderRadius: "2px",
              }}
            />

            <span
              style={{
                color: colors.accent,
                fontSize: typography.small,
                fontWeight: 800,
                letterSpacing: "0.18em",
                lineHeight: 1.2,
                textTransform: "uppercase",
              }}
            >
              Curriculum Vitae
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              color: colors.text,
              fontSize: typography.name,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 1,
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
                fontWeight: 600,
                letterSpacing: "0.015em",
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
              width: "70px",
              height: "70px",
              overflow: "hidden",
              flexShrink: 0,
              borderRadius: "50%",
              border: `3px solid ${colors.accentLight}`,
              backgroundColor: colors.surface,
            }}
          >
            <Image
              src={resume.personal.photo}
              alt={`${resume.personal.firstName || ""} ${resume.personal.lastName || ""}`.trim()}
              width={70}
              height={70}
              unoptimized
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </header>

      {/* ============================================================
          CONTACT BAR
          ============================================================ */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "5px 15px",
          padding: "8px 0 0",
        }}
      >
        <ContactItem
          value={resume.personal.email}
          accent={colors.accent}
          fontSize={typography.small}
        />

        <ContactItem
          value={resume.personal.phone}
          accent={colors.accent}
          fontSize={typography.small}
        />

        <ContactItem
          value={resume.personal.location}
          accent={colors.accent}
          fontSize={typography.small}
        />

        <ContactItem
          value={resume.personal.website}
          accent={colors.accent}
          fontSize={typography.small}
        />

        <ContactItem
          value={resume.personal.linkedin}
          accent={colors.accent}
          fontSize={typography.small}
        />

        <ContactItem
          value={resume.personal.github}
          accent={colors.accent}
          fontSize={typography.small}
        />
      </div>

      {/* ============================================================
          MAIN
          ============================================================ */}

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: typography.sectionGap,
          marginTop: "17px",
        }}
      >
        {/* ============================================================
            PROFILE
            ============================================================ */}

        {resume.summary.trim() && (
          <section>
            <SectionHeading accent={colors.accent}>Profile</SectionHeading>

            <p style={bodyTextStyle}>{resume.summary}</p>
          </section>
        )}

        {/* ============================================================
            EXPERIENCE
            ============================================================ */}

        {experience.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Experience</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: typography.itemGap,
              }}
            >
              {experience.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "18px 1fr",
                    gap: "9px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        width: "8px",
                        height: "8px",
                        marginTop: "4px",
                        borderRadius: "50%",
                        backgroundColor: colors.accent,
                        boxShadow: `0 0 0 3px ${colors.accentLight}`,
                      }}
                    />

                    <div
                      aria-hidden="true"
                      style={{
                        width: "1px",
                        flex: 1,
                        marginTop: "5px",
                        backgroundColor: colors.border,
                      }}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "14px",
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
                          {item.position}
                        </h3>

                        <p
                          style={{
                            margin: "2px 0 0",
                            color: colors.accent,
                            fontSize: typography.small,
                            fontWeight: 700,
                            lineHeight: 1.35,
                          }}
                        >
                          {item.company}
                          {item.location ? ` · ${item.location}` : ""}
                        </p>
                      </div>

                      <DateRange
                        startDate={item.startDate}
                        endDate={item.endDate}
                        current={item.current}
                        color={colors.textSubtle}
                        fontSize={typography.small}
                      />
                    </div>

                    {item.description && (
                      <p
                        style={{
                          ...bodyTextStyle,
                          marginTop: "5px",
                        }}
                      >
                        {item.description}
                      </p>
                    )}

                    <BulletList
                      items={item.achievements ?? []}
                      textColor={colors.textMuted}
                      fontSize={typography.body}
                      lineHeight={typography.lineHeight}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================
            EDUCATION + SKILLS
            ============================================================ */}

        {(education.length > 0 || skills.length > 0) && (
          <section>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.35fr 1fr",
                gap: "20px",
              }}
            >
              {education.length > 0 && (
                <div>
                  <SectionHeading accent={colors.accent}>Education</SectionHeading>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: typography.itemGap,
                    }}
                  >
                    {education.map((item) => (
                      <div key={item.id}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "10px",
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
                              {item.degree}
                              {item.fieldOfStudy ? ` — ${item.fieldOfStudy}` : ""}
                            </h3>

                            <p
                              style={{
                                margin: "2px 0 0",
                                color: colors.accent,
                                fontSize: typography.small,
                                fontWeight: 700,
                                lineHeight: 1.35,
                              }}
                            >
                              {item.institution}
                              {item.location ? ` · ${item.location}` : ""}
                            </p>
                          </div>

                          <DateRange
                            startDate={item.startDate}
                            endDate={item.endDate}
                            current={item.current}
                            color={colors.textSubtle}
                            fontSize={typography.small}
                          />
                        </div>

                        {(item.grade || item.description) && (
                          <p
                            style={{
                              ...bodyTextStyle,
                              marginTop: "4px",
                            }}
                          >
                            {[item.grade, item.description].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skills.length > 0 && (
                <div>
                  <SectionHeading accent={colors.accent}>Skills</SectionHeading>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px",
                    }}
                  >
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "5px 8px",
                          border: `1px solid ${colors.border}`,
                          borderRadius: "4px",
                          backgroundColor: colors.surface,
                          color: colors.text,
                          fontSize: typography.small,
                          fontWeight: 700,
                          lineHeight: 1.25,
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============================================================
            PROJECTS
            ============================================================ */}

        {projects.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Projects</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "10px",
              }}
            >
              {projects.map((project) => {
                const technologies = project.technologies ?? [];
                const achievements = project.achievements ?? [];

                return (
                  <div
                    key={project.id}
                    style={{
                      padding: "9px 10px",
                      borderTop: `2px solid ${colors.accent}`,
                      borderRight: `1px solid ${colors.border}`,
                      borderBottom: `1px solid ${colors.border}`,
                      borderLeft: `1px solid ${colors.border}`,
                      borderRadius: "0 0 5px 5px",
                      backgroundColor: "#FFFFFF",
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
                          lineHeight: 1.35,
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
                          margin: "5px 0 0",
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

        {/* ============================================================
            CERTIFICATIONS + AWARDS
            ============================================================ */}

        {(certifications.length > 0 || awards.length > 0) && (
          <section>
            <SectionHeading accent={colors.accent}>Credentials</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {certifications.length > 0 && (
                <div>
                  <div
                    style={{
                      marginBottom: "7px",
                      color: colors.textSubtle,
                      fontSize: typography.small,
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Certifications
                  </div>

                  {certifications.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        marginBottom: "7px",
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
                        {item.name}
                      </h3>

                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.textMuted,
                          fontSize: typography.small,
                          lineHeight: 1.35,
                        }}
                      >
                        {item.issuer}
                        {item.issueDate ? ` · ${item.issueDate}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {awards.length > 0 && (
                <div>
                  <div
                    style={{
                      marginBottom: "7px",
                      color: colors.textSubtle,
                      fontSize: typography.small,
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Awards
                  </div>

                  {awards.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        marginBottom: "7px",
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
                        {item.title}
                      </h3>

                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.textMuted,
                          fontSize: typography.small,
                          lineHeight: 1.35,
                        }}
                      >
                        {item.issuer} · {item.date}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============================================================
            LANGUAGES + INTERESTS
            ============================================================ */}

        {(languages.length > 0 || interests.length > 0) && (
          <section>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {languages.length > 0 && (
                <div>
                  <SectionHeading accent={colors.accent}>Languages</SectionHeading>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px 16px",
                    }}
                  >
                    {languages.map((language) => (
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

              {interests.length > 0 && (
                <div>
                  <SectionHeading accent={colors.accent}>Interests</SectionHeading>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px 13px",
                    }}
                  >
                    {interests.map((interest) => (
                      <span
                        key={interest}
                        style={{
                          color: colors.textMuted,
                          fontSize: typography.small,
                          lineHeight: 1.4,
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============================================================
            PUBLICATIONS
            ============================================================ */}

        {publications.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Publications</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "7px",
              }}
            >
              {publications.map((item) => (
                <div key={item.id}>
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: typography.body,
                      fontWeight: 700,
                      lineHeight: 1.35,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      margin: "2px 0 0",
                      color: colors.textMuted,
                      fontSize: typography.small,
                      lineHeight: 1.35,
                    }}
                  >
                    {item.publisher} · {item.date}
                  </p>

                  {item.description && (
                    <p
                      style={{
                        ...bodyTextStyle,
                        marginTop: "3px",
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================
            VOLUNTEER
            ============================================================ */}

        {volunteer.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Volunteer Experience</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: typography.itemGap,
              }}
            >
              {volunteer.map((item) => (
                <div key={item.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "14px",
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
                        {item.role}
                      </h3>

                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.accent,
                          fontSize: typography.small,
                          fontWeight: 700,
                        }}
                      >
                        {item.organization}
                      </p>
                    </div>

                    <DateRange
                      startDate={item.startDate}
                      endDate={item.endDate}
                      current={item.current}
                      color={colors.textSubtle}
                      fontSize={typography.small}
                    />
                  </div>

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
        )}

        {/* ============================================================
            REFERENCES
            ============================================================ */}

        {references.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>References</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              {references.map((item) => (
                <div key={item.id}>
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: typography.body,
                      fontWeight: 700,
                    }}
                  >
                    {item.name}
                  </h3>

                  <p
                    style={{
                      margin: "2px 0 0",
                      color: colors.accent,
                      fontSize: typography.small,
                      fontWeight: 700,
                    }}
                  >
                    {item.position}
                    {item.company ? ` · ${item.company}` : ""}
                  </p>

                  {(item.email || item.phone) && (
                    <p
                      style={{
                        margin: "3px 0 0",
                        color: colors.textMuted,
                        fontSize: typography.small,
                      }}
                    >
                      {[item.email, item.phone].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================
            CUSTOM SECTIONS
            ============================================================ */}

        {customSections.map((section) => (
          <section key={section.id}>
            <SectionHeading accent={colors.accent}>{section.title}</SectionHeading>

            {section.description && (
              <p
                style={{
                  ...bodyTextStyle,
                  marginBottom: "7px",
                }}
              >
                {section.description}
              </p>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "7px",
              }}
            >
              {section.items.map((item) => (
                <div key={item.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
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
                        marginTop: "3px",
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

      {/* ============================================================
          FOOTER MARK
          ============================================================ */}

      <footer
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          marginTop: "18px",
          paddingTop: "7px",
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: "18px",
            height: "2px",
            backgroundColor: colors.accent,
          }}
        />

        <span
          style={{
            color: colors.textSubtle,
            fontSize: "7px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Professional Resume
        </span>
      </footer>
    </article>
  );
}

export default TemplateFour;
