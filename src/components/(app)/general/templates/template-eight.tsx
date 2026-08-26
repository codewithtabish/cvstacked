"use client";

import Image from "next/image";

import type { CSSProperties, ReactNode } from "react";

import { ResumeData } from "@/data/resume";

import { DEFAULT_RESUME_DESIGN, RESUME_THEMES } from "@/data/resume-design";

interface TemplateEightProps {
  resume: ResumeData;
  id?: string;
}

/* ================================================================
   TEMPLATE EIGHT — HARD-CODED PDF TYPOGRAPHY
   ================================================================

   Font family:
   - Hard-coded to Arial / Helvetica / sans-serif
   - No font-family configuration from resume data

   Typography is intentionally kept readable for A4 PDF output.
   ================================================================ */

const FONT_FAMILY = "Arial, Helvetica, sans-serif";

const TYPOGRAPHY = {
  name: "30px",
  jobTitle: "12px",
  body: "10px",
  small: "8.5px",
  section: "11px",
  sidebar: "8.5px",
  sidebarSmall: "8px",
  lineHeight: 1.5,
  sectionGap: "20px",
  itemGap: "14px",
};

/* ================================================================
   SHARED HELPERS
   ================================================================ */

function SectionHeading({
  index,
  children,
  accent,
  text,
}: {
  index?: string;
  children: ReactNode;
  accent: string;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        marginBottom: "10px",
      }}
    >
      {index && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "18px",
            height: "18px",
            flexShrink: 0,
            borderRadius: "3px",
            backgroundColor: accent,
            color: "#ffffff",
            fontSize: "8px",
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {index}
        </span>
      )}

      <h2
        style={{
          margin: 0,
          color: text,
          fontSize: TYPOGRAPHY.section,
          fontWeight: 800,
          letterSpacing: "0.1em",
          lineHeight: 1.2,
          textTransform: "uppercase",
        }}
      >
        {children}
      </h2>

      <div
        aria-hidden="true"
        style={{
          height: "1px",
          flex: 1,
          backgroundColor: "#E5E7EB",
        }}
      />
    </div>
  );
}

function SideHeading({
  children,
  accent,
  text,
}: {
  children: ReactNode;
  accent: string;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        marginBottom: "9px",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "1px",
          backgroundColor: accent,
          flexShrink: 0,
        }}
      />

      <h2
        style={{
          margin: 0,
          color: text,
          fontSize: "9px",
          fontWeight: 800,
          letterSpacing: "0.15em",
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
  markerColor,
  fontSize,
  lineHeight,
}: {
  items: string[];
  textColor: string;
  markerColor: string;
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
          key={`bullet-${index}`}
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
              width: "3px",
              height: "3px",
              marginTop: "6px",
              borderRadius: "1px",
              backgroundColor: markerColor,
              flexShrink: 0,
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
        fontWeight: 650,
        whiteSpace: "nowrap",
        lineHeight: 1.35,
      }}
    >
      {startDate}
      {startDate && end ? " – " : ""}
      {end}
    </span>
  );
}

function SideContactItem({ value, textColor }: { value?: string; textColor: string }) {
  if (!value) return null;

  return (
    <p
      style={{
        margin: 0,
        color: textColor,
        fontSize: "8px",
        lineHeight: 1.55,
        overflowWrap: "anywhere",
      }}
    >
      {value}
    </p>
  );
}

const LEVEL_WIDTH: Record<string, string> = {
  beginner: "35%",
  intermediate: "60%",
  advanced: "82%",
  expert: "100%",
};

function SkillBar({
  name,
  level,
  accent,
  track,
  text,
}: {
  name: string;
  level?: string;
  accent: string;
  track: string;
  text: string;
}) {
  const width = level ? (LEVEL_WIDTH[level] ?? "70%") : null;

  return (
    <div>
      <p
        style={{
          margin: "0 0 4px",
          color: text,
          fontSize: "8.5px",
          fontWeight: 650,
          lineHeight: 1.3,
        }}
      >
        {name}
      </p>

      {width && (
        <div
          style={{
            width: "100%",
            height: "3px",
            borderRadius: "2px",
            backgroundColor: track,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width,
              height: "100%",
              backgroundColor: accent,
              borderRadius: "2px",
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ================================================================
   TEMPLATE EIGHT
   ================================================================ */

export function TemplateEight({ resume, id = "resume-page" }: TemplateEightProps) {
  const theme = RESUME_THEMES[resume.themeId] ?? RESUME_THEMES[DEFAULT_RESUME_DESIGN.themeId];

  const colors = theme.colors;

  const pageStyle: CSSProperties = {
    width: "210mm",
    minWidth: "210mm",
    minHeight: "297mm",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    fontFamily: FONT_FAMILY,
    overflow: "visible",
    color: colors.text,
  };

  const bodyTextStyle: CSSProperties = {
    margin: 0,
    color: colors.textMuted,
    fontSize: TYPOGRAPHY.body,
    lineHeight: TYPOGRAPHY.lineHeight,
  };

  const fullName = `${resume.personal.firstName || "Your"} ${resume.personal.lastName || "Name"}`;

  const contactEntries: Array<[string, string | undefined]> = [
    ["email", resume.personal.email],
    ["phone", resume.personal.phone],
    ["location", resume.personal.location],
    ["website", resume.personal.website],
    ["linkedin", resume.personal.linkedin],
    ["github", resume.personal.github],
    ["portfolio", resume.personal.portfolio],
  ];

  const contactValues = contactEntries.filter((entry): entry is [string, string] =>
    Boolean(entry[1]),
  );

  return (
    <article
      id={id}
      className="resume-page"
      style={pageStyle}
      data-template="classic"
      data-template-id="classic"
      data-theme={resume.themeId}
      data-typography-scale={resume.typographyScale}
    >
      {/* ============================================================
          MASTHEAD
          ============================================================ */}

      <header
        style={{
          display: "grid",
          gridTemplateColumns: resume.personal.photo ? "auto 1fr" : "1fr",
          gap: "18px",
          alignItems: "center",
          padding: "13mm 14mm 16px",
          borderBottom: `3px solid ${colors.accent}`,
        }}
      >
        {resume.personal.photo && (
          <div
            style={{
              width: "78px",
              height: "78px",
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
              borderRadius: "6px",
              border: `2px solid ${colors.accent}`,
            }}
          >
            <Image
              src={resume.personal.photo}
              alt={fullName}
              fill
              sizes="78px"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <div
          style={{
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "6px",
              padding: "3px 8px",
              borderRadius: "3px",
              backgroundColor: colors.accent,
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontSize: "7.5px",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                lineHeight: 1.4,
              }}
            >
              Resume
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              color: colors.text,
              fontSize: TYPOGRAPHY.name,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textTransform: "uppercase",
            }}
          >
            {fullName}
          </h1>

          {resume.personal.jobTitle && (
            <p
              style={{
                margin: "7px 0 0",
                color: colors.textMuted,
                fontSize: TYPOGRAPHY.jobTitle,
                fontWeight: 650,
                letterSpacing: "0.02em",
                lineHeight: 1.3,
              }}
            >
              {resume.personal.jobTitle}
            </p>
          )}
        </div>
      </header>

      {/* ============================================================
          BODY — SIDEBAR + MAIN
          ============================================================ */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "62mm 1fr",
        }}
      >
        {/* ==========================================================
            SIDEBAR
            ========================================================== */}

        <aside
          style={{
            backgroundColor: colors.surface,
            borderRight: `1px solid ${colors.border}`,
            padding: "17px 12px 22px 14mm",
            display: "flex",
            flexDirection: "column",
            gap: TYPOGRAPHY.sectionGap,
          }}
        >
          {/* Contact */}

          {contactValues.length > 0 && (
            <div>
              <SideHeading accent={colors.accent} text={colors.text}>
                Contact
              </SideHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                {contactValues.map(([field, value]) => (
                  <SideContactItem key={field} value={value} textColor={colors.textMuted} />
                ))}
              </div>
            </div>
          )}

          {/* Skills */}

          {resume.skills.length > 0 && (
            <div>
              <SideHeading accent={colors.accent} text={colors.text}>
                Skills
              </SideHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                }}
              >
                {resume.skills.map((skill) => (
                  <SkillBar
                    key={skill.id}
                    name={skill.name}
                    level={skill.level}
                    accent={colors.accent}
                    track={colors.border}
                    text={colors.text}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Education */}

          {resume.education.length > 0 && (
            <div>
              <SideHeading accent={colors.accent} text={colors.text}>
                Education
              </SideHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {resume.education.map((education) => (
                  <div key={education.id}>
                    <p
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: "8.5px",
                        fontWeight: 750,
                        lineHeight: 1.4,
                      }}
                    >
                      {education.degree}
                      {education.fieldOfStudy ? ` — ${education.fieldOfStudy}` : ""}
                    </p>

                    <p
                      style={{
                        margin: "2px 0 0",
                        color: colors.accent,
                        fontSize: "8px",
                        fontWeight: 700,
                        lineHeight: 1.4,
                      }}
                    >
                      {education.institution}
                    </p>

                    <DateRange
                      startDate={education.startDate}
                      endDate={education.endDate}
                      current={education.current}
                      color={colors.textSubtle}
                      fontSize="7.5px"
                    />

                    {(education.grade || education.description) && (
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: colors.textMuted,
                          fontSize: "7.5px",
                          lineHeight: 1.5,
                        }}
                      >
                        {[education.grade, education.description].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}

          {resume.certifications.length > 0 && (
            <div>
              <SideHeading accent={colors.accent} text={colors.text}>
                Certifications
              </SideHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {resume.certifications.map((certification) => (
                  <div key={certification.id}>
                    <p
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: "8.5px",
                        fontWeight: 700,
                        lineHeight: 1.4,
                      }}
                    >
                      {certification.name}
                    </p>

                    <p
                      style={{
                        margin: "2px 0 0",
                        color: colors.textMuted,
                        fontSize: "7.5px",
                        lineHeight: 1.4,
                      }}
                    >
                      {certification.issuer}
                      {certification.issueDate ? ` · ${certification.issueDate}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}

          {resume.languages.length > 0 && (
            <div>
              <SideHeading accent={colors.accent} text={colors.text}>
                Languages
              </SideHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {resume.languages.map((language) => (
                  <div
                    key={language.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: colors.text,
                        fontSize: "8.5px",
                        fontWeight: 650,
                      }}
                    >
                      {language.name}
                    </span>

                    <span
                      style={{
                        color: colors.textSubtle,
                        fontSize: "7.5px",
                        textTransform: "capitalize",
                      }}
                    >
                      {language.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}

          {resume.interests.length > 0 && (
            <div>
              <SideHeading accent={colors.accent} text={colors.text}>
                Interests
              </SideHeading>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                }}
              >
                {resume.interests.map((interest, index) => (
                  <span
                    key={`${interest}-${index}`}
                    style={{
                      padding: "3px 7px",
                      borderRadius: "3px",
                      border: `1px solid ${colors.border}`,
                      color: colors.textMuted,
                      fontSize: "7.5px",
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* ==========================================================
            MAIN COLUMN
            ========================================================== */}

        <main
          style={{
            padding: "17px 14mm 22px 17px",
            display: "flex",
            flexDirection: "column",
            gap: TYPOGRAPHY.sectionGap,
          }}
        >
          {/* Profile */}

          {resume.summary.trim() && (
            <section>
              <SectionHeading index="01" accent={colors.accent} text={colors.text}>
                Profile
              </SectionHeading>

              <p style={bodyTextStyle}>{resume.summary}</p>
            </section>
          )}

          {/* Experience */}

          {resume.experience.length > 0 && (
            <section>
              <SectionHeading index="02" accent={colors.accent} text={colors.text}>
                Experience
              </SectionHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: TYPOGRAPHY.itemGap,
                }}
              >
                {resume.experience.map((experience) => (
                  <div
                    key={experience.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "13px 1fr",
                      gap: "10px",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          marginTop: "5px",
                          borderRadius: "1px",
                          backgroundColor: colors.accent,
                          position: "relative",
                          zIndex: 1,
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          top: "11px",
                          bottom: "-15px",
                          width: "1px",
                          backgroundColor: colors.accentLight,
                        }}
                      />
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "14px",
                        }}
                      >
                        <div
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              color: colors.text,
                              fontSize: TYPOGRAPHY.body,
                              fontWeight: 800,
                              lineHeight: 1.35,
                            }}
                          >
                            {experience.position}
                          </h3>

                          <p
                            style={{
                              margin: "3px 0 0",
                              color: colors.accent,
                              fontSize: TYPOGRAPHY.small,
                              fontWeight: 700,
                              lineHeight: 1.35,
                            }}
                          >
                            {experience.company}
                            {experience.location ? ` · ${experience.location}` : ""}
                            {experience.employmentType ? ` · ${experience.employmentType}` : ""}
                          </p>
                        </div>

                        <DateRange
                          startDate={experience.startDate}
                          endDate={experience.endDate}
                          current={experience.current}
                          color={colors.textSubtle}
                          fontSize={TYPOGRAPHY.small}
                        />
                      </div>

                      {experience.description && (
                        <p
                          style={{
                            ...bodyTextStyle,
                            marginTop: "6px",
                          }}
                        >
                          {experience.description}
                        </p>
                      )}

                      <BulletList
                        items={experience.achievements || []}
                        textColor={colors.textMuted}
                        markerColor={colors.accent}
                        fontSize={TYPOGRAPHY.body}
                        lineHeight={TYPOGRAPHY.lineHeight}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}

          {resume.projects.length > 0 && (
            <section>
              <SectionHeading index="03" accent={colors.accent} text={colors.text}>
                Projects
              </SectionHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "11px",
                }}
              >
                {resume.projects.map((project) => (
                  <div
                    key={project.id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "5px",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
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
                          fontSize: TYPOGRAPHY.body,
                          fontWeight: 800,
                          lineHeight: 1.35,
                        }}
                      >
                        {project.name}
                      </h3>

                      <DateRange
                        startDate={project.startDate}
                        endDate={project.endDate}
                        color={colors.textSubtle}
                        fontSize={TYPOGRAPHY.small}
                      />
                    </div>

                    {project.role && (
                      <p
                        style={{
                          margin: "3px 0 0",
                          color: colors.accent,
                          fontSize: TYPOGRAPHY.small,
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

                    {(project.technologies?.length ?? 0) > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "5px",
                          marginTop: "7px",
                        }}
                      >
                        {project.technologies!.map((tech, techIndex) => (
                          <span
                            key={`${project.id}-tech-${techIndex}`}
                            style={{
                              padding: "3px 7px",
                              borderRadius: "3px",
                              backgroundColor: colors.surface,
                              color: colors.textSubtle,
                              fontSize: "7.5px",
                              fontWeight: 650,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <BulletList
                      items={project.achievements || []}
                      textColor={colors.textMuted}
                      markerColor={colors.accent}
                      fontSize={TYPOGRAPHY.small}
                      lineHeight={1.5}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Awards + Publications */}

          {(resume.awards.length > 0 || resume.publications.length > 0) && (
            <section
              style={{
                display: "grid",
                gridTemplateColumns:
                  resume.awards.length > 0 && resume.publications.length > 0 ? "1fr 1fr" : "1fr",
                gap: "20px",
              }}
            >
              {/* Awards */}

              {resume.awards.length > 0 && (
                <div>
                  <SectionHeading index="04" accent={colors.accent} text={colors.text}>
                    Awards
                  </SectionHeading>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {resume.awards.map((award) => (
                      <div key={award.id}>
                        <h3
                          style={{
                            margin: 0,
                            color: colors.text,
                            fontSize: TYPOGRAPHY.body,
                            fontWeight: 750,
                            lineHeight: 1.35,
                          }}
                        >
                          {award.title}
                        </h3>

                        <p
                          style={{
                            margin: "3px 0 0",
                            color: colors.textMuted,
                            fontSize: TYPOGRAPHY.small,
                          }}
                        >
                          {award.issuer} · {award.date}
                        </p>

                        {award.description && (
                          <p
                            style={{
                              ...bodyTextStyle,
                              marginTop: "3px",
                            }}
                          >
                            {award.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Publications */}

              {resume.publications.length > 0 && (
                <div>
                  <SectionHeading index="05" accent={colors.accent} text={colors.text}>
                    Publications
                  </SectionHeading>

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
                            fontSize: TYPOGRAPHY.body,
                            fontWeight: 750,
                            lineHeight: 1.35,
                          }}
                        >
                          {publication.title}
                        </h3>

                        <p
                          style={{
                            margin: "3px 0 0",
                            color: colors.textMuted,
                            fontSize: TYPOGRAPHY.small,
                          }}
                        >
                          {publication.publisher} · {publication.date}
                        </p>

                        {publication.description && (
                          <p
                            style={{
                              ...bodyTextStyle,
                              marginTop: "3px",
                            }}
                          >
                            {publication.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Volunteer */}

          {resume.volunteer.length > 0 && (
            <section>
              <SectionHeading index="06" accent={colors.accent} text={colors.text}>
                Volunteer Experience
              </SectionHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: TYPOGRAPHY.itemGap,
                }}
              >
                {resume.volunteer.map((volunteer) => (
                  <div key={volunteer.id}>
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
                            fontSize: TYPOGRAPHY.body,
                            fontWeight: 750,
                            lineHeight: 1.35,
                          }}
                        >
                          {volunteer.role}
                        </h3>

                        <p
                          style={{
                            margin: "3px 0 0",
                            color: colors.accent,
                            fontSize: TYPOGRAPHY.small,
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
                        fontSize={TYPOGRAPHY.small}
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

          {/* References */}

          {resume.references.length > 0 && (
            <section>
              <SectionHeading index="07" accent={colors.accent} text={colors.text}>
                References
              </SectionHeading>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "14px",
                }}
              >
                {resume.references.map((reference) => (
                  <div key={reference.id}>
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: TYPOGRAPHY.body,
                        fontWeight: 750,
                        lineHeight: 1.35,
                      }}
                    >
                      {reference.name}
                    </h3>

                    <p
                      style={{
                        margin: "3px 0 0",
                        color: colors.accent,
                        fontSize: TYPOGRAPHY.small,
                        fontWeight: 700,
                      }}
                    >
                      {reference.position}
                      {reference.company ? ` · ${reference.company}` : ""}
                    </p>

                    {(reference.email || reference.phone) && (
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: colors.textMuted,
                          fontSize: TYPOGRAPHY.small,
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

          {/* Custom Sections */}

          {resume.customSections.length > 0 &&
            resume.customSections.map((section, sIndex) => (
              <section key={section.id}>
                <SectionHeading
                  index={String(8 + sIndex).padStart(2, "0")}
                  accent={colors.accent}
                  text={colors.text}
                >
                  {section.title}
                </SectionHeading>

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
                            fontSize: TYPOGRAPHY.body,
                            fontWeight: 750,
                            lineHeight: 1.35,
                          }}
                        >
                          {item.title}
                        </h3>

                        {item.date && (
                          <span
                            style={{
                              color: colors.textSubtle,
                              fontSize: TYPOGRAPHY.small,
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
                            margin: "3px 0 0",
                            color: colors.accent,
                            fontSize: TYPOGRAPHY.small,
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
      </div>
    </article>
  );
}

export default TemplateEight;
