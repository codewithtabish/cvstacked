"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { ResumeData } from "@/data/resume";
import { DEFAULT_RESUME_DESIGN, RESUME_FONT_FAMILIES, RESUME_THEMES } from "@/data/resume-design";

interface TemplateTwentyProps {
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

function SectionHeading({ children, light = false }: { children: ReactNode; light?: boolean }) {
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
          width: "3px",
          height: "12px",
          borderRadius: "1px",
          backgroundColor: light ? "rgba(255,255,255,0.9)" : "#111827",
          flexShrink: 0,
        }}
      />
      <h2
        style={{
          margin: 0,
          color: light ? "#ffffff" : "#111827",
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
              borderRadius: "50%",
              backgroundColor: textColor,
              flexShrink: 0,
              opacity: 0.7,
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

export function TemplateTwenty({ resume, id = "resume-page" }: TemplateTwentyProps) {
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
    padding: "0",
    margin: "0 auto",
    overflow: "visible",
    color: colors.text,
    display: "grid",
    gridTemplateColumns: "68mm 1fr",
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
      data-template="modren"
      data-template-id="modren"
      data-theme={resume.themeId}
      data-font={resume.fontFamilyId}
      data-typography-scale={resume.typographyScale}
    >
      {/* ============================================================
          LEFT SIDEBAR — Primary color background + white text
          ============================================================ */}
      <aside
        style={{
          backgroundColor: colors.accent,
          color: "#ffffff",
          padding: "14mm 10mm 12mm 11mm",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          boxSizing: "border-box",
        }}
      >
        {/* Photo */}
        {resume.personal.photo && (
          <div
            style={{
              width: "100%",
              maxWidth: "105px",
              aspectRatio: "1 / 1",
              position: "relative",
              overflow: "hidden",
              borderRadius: "6px",
              border: "2px solid rgba(255,255,255,0.35)",
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Image
              src={resume.personal.photo}
              alt={`${resume.personal.firstName || "Your"} ${resume.personal.lastName || "Name"}`}
              fill
              sizes="105px"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* Name + Title */}
        <div>
          <h1
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: typography.name,
              fontWeight: 850,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {resume.personal.firstName || "Your"}
            <br />
            {resume.personal.lastName || "Name"}
          </h1>

          {resume.personal.jobTitle && (
            <p
              style={{
                margin: "6px 0 0",
                color: "rgba(255,255,255,0.9)",
                fontSize: typography.jobTitle,
                fontWeight: 650,
                letterSpacing: "0.02em",
                lineHeight: 1.3,
              }}
            >
              {resume.personal.jobTitle}
            </p>
          )}
        </div>

        {/* Contact */}
        {(resume.personal.email ||
          resume.personal.phone ||
          resume.personal.location ||
          resume.personal.website ||
          resume.personal.linkedin ||
          resume.personal.github) && (
          <div>
            <SectionHeading light>Contact</SectionHeading>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
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
                      color: "rgba(255,255,255,0.88)",
                      fontSize: typography.small,
                      lineHeight: 1.4,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {value}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div>
            <SectionHeading light>Skills</SectionHeading>
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
                    padding: "4px 8px",
                    borderRadius: "3px",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#ffffff",
                    fontSize: typography.small,
                    fontWeight: 650,
                    lineHeight: 1.2,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {resume.languages.length > 0 && (
          <div>
            <SectionHeading light>Languages</SectionHeading>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              {resume.languages.map((language) => (
                <div
                  key={language.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: typography.body,
                      fontWeight: 700,
                    }}
                  >
                    {language.name}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.75)",
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

        {/* Interests */}
        {resume.interests.length > 0 && (
          <div>
            <SectionHeading light>Interests</SectionHeading>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px 10px",
              }}
            >
              {resume.interests.map((interest) => (
                <span
                  key={interest}
                  style={{
                    color: "rgba(255,255,255,0.85)",
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
      </aside>

      {/* ============================================================
          RIGHT MAIN CONTENT
          ============================================================ */}
      <main
        style={{
          padding: "14mm 13mm 12mm 14mm",
          display: "flex",
          flexDirection: "column",
          gap: typography.sectionGap,
          minWidth: 0,
        }}
      >
        {/* PROFILE */}
        {resume.summary?.trim() && (
          <section>
            <SectionHeading>Profile</SectionHeading>
            <p style={bodyTextStyle}>{resume.summary}</p>
          </section>
        )}

        {/* EXPERIENCE */}
        {resume.experience.length > 0 && (
          <section>
            <SectionHeading>Experience</SectionHeading>

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
            <SectionHeading>Education</SectionHeading>

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
                    <p style={{ ...bodyTextStyle, marginTop: "3px" }}>
                      {[education.grade, education.description].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {resume.projects.length > 0 && (
          <section>
            <SectionHeading>Selected Projects</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
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
                      borderRadius: "5px",
                      backgroundColor: colors.surface || "#F8FAFC",
                      borderLeft: `3px solid ${colors.accent}`,
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

        {/* CERTIFICATIONS + AWARDS */}
        {(resume.certifications.length > 0 || resume.awards.length > 0) && (
          <section>
            <SectionHeading>Certifications & Awards</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              {resume.certifications.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
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
                          margin: "1px 0 0",
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
                </div>
              )}

              {resume.awards.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
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
                          margin: "1px 0 0",
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

        {/* PUBLICATIONS */}
        {resume.publications.length > 0 && (
          <section>
            <SectionHeading>Publications</SectionHeading>

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
            <SectionHeading>Volunteer Experience</SectionHeading>

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

        {/* REFERENCES */}
        {resume.references.length > 0 && (
          <section>
            <SectionHeading>References</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
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
              <SectionHeading>{section.title}</SectionHeading>

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

export default TemplateTwenty;
