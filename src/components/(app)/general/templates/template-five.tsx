"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import type { ResumeData } from "@/data/resume";
import { DEFAULT_RESUME_DESIGN, RESUME_THEMES } from "@/data/resume-design";

interface TemplateFiveProps {
  resume: ResumeData;
  id?: string;
}

/**
 * ============================================================
 * TEMPLATE FIVE — CELESTE
 * Elegant / Refined A4 Resume
 *
 * Typography is intentionally hardcoded.
 * Theme colors remain dynamic.
 * ============================================================
 */

const FONT_FAMILY = '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';

const FONT_SIZE = {
  name: "31px",
  jobTitle: "12px",
  body: "10px",
  small: "8px",
  section: "10.5px",
};

const LINE_HEIGHT = 1.52;

const SECTION_GAP = "17px";
const ITEM_GAP = "11px";

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
          width: "20px",
          height: "3px",
          backgroundColor: accent,
          flexShrink: 0,
        }}
      />

      <h2
        style={{
          margin: 0,
          color: "#111827",
          fontSize: FONT_SIZE.section,
          fontWeight: 800,
          letterSpacing: "0.14em",
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

function BulletList({
  items,
  textColor,
  fontSize = FONT_SIZE.body,
  lineHeight = LINE_HEIGHT,
}: {
  items: string[];
  textColor: string;
  fontSize?: string;
  lineHeight?: number;
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
}: {
  startDate?: string;
  endDate?: string;
  current?: boolean;
  color: string;
}) {
  if (!startDate && !endDate) return null;

  const end = current ? "Present" : endDate;

  return (
    <span
      style={{
        color,
        fontSize: FONT_SIZE.small,
        fontWeight: 600,
        whiteSpace: "nowrap",
        lineHeight: 1.35,
      }}
    >
      {startDate}
      {startDate && end ? " — " : ""}
      {end}
    </span>
  );
}

function ContactItem({ value, accent }: { value?: string; accent: string }) {
  if (!value) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        color: "#4B5563",
        fontSize: FONT_SIZE.small,
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

export function TemplateFive({ resume, id = "resume-page" }: TemplateFiveProps) {
  /**
   * Theme remains dynamic.
   *
   * Font family and typography are intentionally NOT dynamic.
   */
  const theme = RESUME_THEMES[resume.themeId] ?? RESUME_THEMES[DEFAULT_RESUME_DESIGN.themeId];

  const colors = theme.colors;

  const pageStyle: CSSProperties = {
    width: "210mm",
    minWidth: "210mm",
    minHeight: "297mm",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    fontFamily: FONT_FAMILY,
    padding: "13mm 14mm 12mm",
    margin: "0 auto",
    overflow: "visible",
    color: colors.text,
  };

  const bodyTextStyle: CSSProperties = {
    margin: 0,
    color: colors.textMuted,
    fontSize: FONT_SIZE.body,
    lineHeight: LINE_HEIGHT,
  };

  return (
    <article
      id={id}
      className="resume-page"
      style={pageStyle}
      data-template="elegant"
      data-template-id="template-five"
      data-theme={resume.themeId}
    >
      {/* ============================================================
          TOP HEADER
          ============================================================ */}

      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "24px",
          paddingBottom: "13px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              marginBottom: "6px",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "24px",
                height: "3px",
                backgroundColor: colors.accent,
              }}
            />

            <span
              style={{
                color: colors.textSubtle,
                fontSize: FONT_SIZE.small,
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
              fontSize: FONT_SIZE.name,
              fontWeight: 850,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {resume.personal.firstName || "Your"} {resume.personal.lastName || "Name"}
          </h1>

          {resume.personal.jobTitle && (
            <p
              style={{
                margin: "7px 0 0",
                color: colors.accent,
                fontSize: FONT_SIZE.jobTitle,
                fontWeight: 750,
                letterSpacing: "0.025em",
                lineHeight: 1.3,
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
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
              borderRadius: "6px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
            }}
          >
            <Image
              src={resume.personal.photo}
              alt={`${resume.personal.firstName || "Your"} ${resume.personal.lastName || "Name"}`}
              fill
              sizes="70px"
              style={{
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
        <ContactItem value={resume.personal.email} accent={colors.accent} />

        <ContactItem value={resume.personal.phone} accent={colors.accent} />

        <ContactItem value={resume.personal.location} accent={colors.accent} />

        <ContactItem value={resume.personal.website} accent={colors.accent} />

        <ContactItem value={resume.personal.linkedin} accent={colors.accent} />

        <ContactItem value={resume.personal.github} accent={colors.accent} />
      </div>

      {/* ============================================================
          MAIN CONTENT
          ============================================================ */}

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          gap: SECTION_GAP,
          marginTop: "17px",
        }}
      >
        {/* ==========================================================
            PROFILE
            ========================================================== */}

        {resume.summary.trim() && (
          <section>
            <SectionHeading accent={colors.accent}>Profile</SectionHeading>

            <p style={bodyTextStyle}>{resume.summary}</p>
          </section>
        )}

        {/* ==========================================================
            EXPERIENCE
            ========================================================== */}

        {resume.experience.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Experience</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ITEM_GAP,
              }}
            >
              {resume.experience.map((experience) => (
                <div
                  key={experience.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "14px 1fr",
                    gap: "9px",
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
                        width: "7px",
                        height: "7px",
                        marginTop: "4px",
                        borderRadius: "50%",
                        backgroundColor: colors.accent,
                        position: "relative",
                        zIndex: 1,
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        bottom: "-14px",
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
                            fontSize: FONT_SIZE.body,
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
                            fontSize: FONT_SIZE.small,
                            fontWeight: 750,
                            lineHeight: 1.35,
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
                      items={experience.achievements || []}
                      textColor={colors.textMuted}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==========================================================
            EDUCATION + SKILLS
            ========================================================== */}

        {(resume.education.length > 0 || resume.skills.length > 0) && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            {/* EDUCATION */}

            {resume.education.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Education</SectionHeading>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "9px",
                  }}
                >
                  {resume.education.map((education) => (
                    <div key={education.id}>
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
                              fontSize: FONT_SIZE.body,
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
                              fontSize: FONT_SIZE.small,
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
                        />
                      </div>

                      {(education.grade || education.description) && (
                        <p
                          style={{
                            ...bodyTextStyle,
                            marginTop: "4px",
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

            {/* SKILLS */}

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
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "5px 7px",
                        border: `1px solid ${colors.border}`,
                        borderRadius: "4px",
                        backgroundColor: colors.surface,
                        color: colors.text,
                        fontSize: FONT_SIZE.small,
                        fontWeight: 700,
                        lineHeight: 1.2,
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

        {/* ==========================================================
            PROJECTS
            ========================================================== */}

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
                      padding: "9px 10px",
                      borderLeft: `3px solid ${colors.accent}`,
                      backgroundColor: colors.surface,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: FONT_SIZE.body,
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
                          fontSize: FONT_SIZE.small,
                          fontWeight: 700,
                        }}
                      >
                        {project.role}
                      </p>
                    )}

                    <p
                      style={{
                        ...bodyTextStyle,
                        marginTop: "4px",
                      }}
                    >
                      {project.description}
                    </p>

                    {technologies.length > 0 && (
                      <p
                        style={{
                          margin: "5px 0 0",
                          color: colors.textSubtle,
                          fontSize: FONT_SIZE.small,
                          fontWeight: 600,
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
                        fontSize={FONT_SIZE.small}
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
            <SectionHeading accent={colors.accent}>Certifications & Awards</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              {resume.certifications.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                  }}
                >
                  {resume.certifications.map((certification) => (
                    <div key={certification.id}>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: FONT_SIZE.body,
                          fontWeight: 750,
                          lineHeight: 1.35,
                        }}
                      >
                        {certification.name}
                      </h3>

                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.textMuted,
                          fontSize: FONT_SIZE.small,
                          lineHeight: 1.4,
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "7px",
                  }}
                >
                  {resume.awards.map((award) => (
                    <div key={award.id}>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: FONT_SIZE.body,
                          fontWeight: 750,
                          lineHeight: 1.35,
                        }}
                      >
                        {award.title}
                      </h3>

                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.textMuted,
                          fontSize: FONT_SIZE.small,
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
            LANGUAGES + INTERESTS
            ========================================================== */}

        {(resume.languages.length > 0 || resume.interests.length > 0) && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            {/* LANGUAGES */}

            {resume.languages.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Languages</SectionHeading>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px 16px",
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
                          fontSize: FONT_SIZE.body,
                          fontWeight: 700,
                        }}
                      >
                        {language.name}
                      </span>

                      <span
                        style={{
                          color: colors.textSubtle,
                          fontSize: FONT_SIZE.small,
                        }}
                      >
                        {language.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INTERESTS */}

            {resume.interests.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Interests</SectionHeading>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px 12px",
                  }}
                >
                  {resume.interests.map((interest) => (
                    <span
                      key={interest}
                      style={{
                        color: colors.textMuted,
                        fontSize: FONT_SIZE.small,
                        lineHeight: 1.4,
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

        {/* ==========================================================
            PUBLICATIONS
            ========================================================== */}

        {resume.publications.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Publications</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "7px",
              }}
            >
              {resume.publications.map((publication) => (
                <div key={publication.id}>
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: FONT_SIZE.body,
                      fontWeight: 750,
                    }}
                  >
                    {publication.title}
                  </h3>

                  <p
                    style={{
                      margin: "2px 0 0",
                      color: colors.textMuted,
                      fontSize: FONT_SIZE.small,
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
          </section>
        )}

        {/* ==========================================================
            VOLUNTEER EXPERIENCE
            ========================================================== */}

        {resume.volunteer.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Volunteer Experience</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ITEM_GAP,
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
                          fontSize: FONT_SIZE.body,
                          fontWeight: 750,
                        }}
                      >
                        {volunteer.role}
                      </h3>

                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.accent,
                          fontSize: FONT_SIZE.small,
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
                    />
                  </div>

                  {volunteer.description && (
                    <p
                      style={{
                        ...bodyTextStyle,
                        marginTop: "4px",
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
            <SectionHeading accent={colors.accent}>References</SectionHeading>

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
                      fontSize: FONT_SIZE.body,
                      fontWeight: 750,
                    }}
                  >
                    {reference.name}
                  </h3>

                  <p
                    style={{
                      margin: "2px 0 0",
                      color: colors.accent,
                      fontSize: FONT_SIZE.small,
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
                        fontSize: FONT_SIZE.small,
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
            CUSTOM SECTIONS
            ========================================================== */}

        {resume.customSections.length > 0 &&
          resume.customSections.map((section) => (
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
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: FONT_SIZE.body,
                          fontWeight: 750,
                        }}
                      >
                        {item.title}
                      </h3>

                      {item.date && (
                        <span
                          style={{
                            color: colors.textSubtle,
                            fontSize: FONT_SIZE.small,
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
                          fontSize: FONT_SIZE.small,
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
    </article>
  );
}

export default TemplateFive;
