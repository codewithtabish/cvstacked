"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { ResumeData } from "@/data/resume";
import { DEFAULT_RESUME_DESIGN, RESUME_FONT_FAMILIES, RESUME_THEMES } from "@/data/resume-design";

interface TemplateFourteenProps {
  resume: ResumeData;
  id?: string;
}

function getTypographyScale(scale: string) {
  switch (scale) {
    case "compact":
      return {
        name: "28px",
        jobTitle: "11px",
        body: "9.5px",
        small: "8px",
        section: "9.5px",
        lineHeight: 1.45,
        sectionGap: "15px",
        itemGap: "9px",
      };
    case "comfortable":
      return {
        name: "34px",
        jobTitle: "13px",
        body: "10.5px",
        small: "8.5px",
        section: "11px",
        lineHeight: 1.6,
        sectionGap: "20px",
        itemGap: "13px",
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
        gap: "10px",
        marginBottom: "11px",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#0F172A",
          fontSize: "10px",
          fontWeight: 750,
          letterSpacing: "0.18em",
          lineHeight: 1.2,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </h2>
      <div
        aria-hidden="true"
        style={{
          flex: 1,
          height: "1px",
          background: `linear-gradient(90deg, ${accent} 0%, ${accent}40 60%, transparent 100%)`,
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
            gap: "8px",
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
              borderRadius: "50%",
              backgroundColor: textColor,
              flexShrink: 0,
              opacity: 0.5,
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
        fontWeight: 500,
        whiteSpace: "nowrap",
        lineHeight: 1.3,
        letterSpacing: "0.01em",
      }}
    >
      {startDate}
      {startDate && end ? " — " : ""}
      {end}
    </span>
  );
}

export function TemplateFourteen({ resume, id = "resume-page" }: TemplateFourteenProps) {
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
    padding: "15mm 16mm 14mm",
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
      data-template="executive"
      data-template-id="executive"
      data-theme={resume.themeId}
      data-font={resume.fontFamilyId}
      data-typography-scale={resume.typographyScale}
    >
      {/* ============================================================
          HEADER — Premium Minimal
          ============================================================ */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "24px",
          marginBottom: "20px",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            style={{
              margin: 0,
              color: colors.text,
              fontSize: typography.name,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            {resume.personal.firstName || "Your"} {resume.personal.lastName || "Name"}
          </h1>

          {resume.personal.jobTitle && (
            <p
              style={{
                margin: "7px 0 0",
                color: colors.accent,
                fontSize: typography.jobTitle,
                fontWeight: 600,
                letterSpacing: "0.04em",
                lineHeight: 1.3,
              }}
            >
              {resume.personal.jobTitle}
            </p>
          )}

          {/* Contact */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 16px",
              marginTop: "12px",
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
                    lineHeight: 1.4,
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
              width: "68px",
              height: "68px",
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
              sizes="68px"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </header>

      {/* Thin accent line */}
      <div
        aria-hidden="true"
        style={{
          height: "1px",
          width: "100%",
          background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.accent}30 50%, transparent 100%)`,
          marginBottom: "18px",
        }}
      />

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
                      alignItems: "baseline",
                      gap: "16px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 700,
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
                          fontWeight: 600,
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
                    <p style={{ ...bodyTextStyle, marginTop: "5px" }}>{experience.description}</p>
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

        {/* EDUCATION + SKILLS */}
        {(resume.education.length > 0 || resume.skills.length > 0) && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "28px",
            }}
          >
            {resume.education.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Education</SectionHeading>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {resume.education.map((education) => (
                    <div key={education.id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          gap: "12px",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <h3
                            style={{
                              margin: 0,
                              color: colors.text,
                              fontSize: typography.body,
                              fontWeight: 700,
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
                              fontWeight: 600,
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
              </div>
            )}

            {resume.skills.length > 0 && (
              <div>
                <SectionHeading accent={colors.accent}>Skills</SectionHeading>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                  {resume.skills.map((skill) => (
                    <span
                      key={skill.id}
                      style={{
                        display: "inline-flex",
                        padding: "4px 9px",
                        borderRadius: "3px",
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                        fontSize: typography.small,
                        fontWeight: 550,
                        lineHeight: 1.25,
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

        {/* PROJECTS */}
        {resume.projects.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>Selected Projects</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {resume.projects.map((project) => {
                const technologies = project.technologies || [];
                const achievements = project.achievements || [];

                return (
                  <div key={project.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: "14px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 700,
                          lineHeight: 1.3,
                        }}
                      >
                        {project.name}
                      </h3>
                    </div>

                    {project.role && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.accent,
                          fontSize: typography.small,
                          fontWeight: 600,
                        }}
                      >
                        {project.role}
                      </p>
                    )}

                    <p style={{ ...bodyTextStyle, marginTop: "4px" }}>{project.description}</p>

                    {technologies.length > 0 && (
                      <p
                        style={{
                          margin: "4px 0 0",
                          color: colors.textSubtle,
                          fontSize: typography.small,
                          fontWeight: 500,
                          lineHeight: 1.4,
                          fontStyle: "italic",
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

        {/* CERTIFICATIONS + AWARDS */}
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
                    gap: "8px",
                  }}
                >
                  {resume.certifications.map((certification) => (
                    <div key={certification.id}>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 650,
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
                    gap: "8px",
                  }}
                >
                  {resume.awards.map((award) => (
                    <div key={award.id}>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 650,
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
              )}
            </div>
          </section>
        )}

        {/* LANGUAGES + INTERESTS */}
        {(resume.languages.length > 0 || resume.interests.length > 0) && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "28px",
            }}
          >
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
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 650,
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
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px 14px",
                  }}
                >
                  {resume.interests.map((interest) => (
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
                      fontWeight: 650,
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
                    <p style={{ ...bodyTextStyle, marginTop: "3px" }}>{publication.description}</p>
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
                      alignItems: "baseline",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 650,
                        }}
                      >
                        {volunteer.role}
                      </h3>
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.accent,
                          fontSize: typography.small,
                          fontWeight: 600,
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
                    <p style={{ ...bodyTextStyle, marginTop: "4px" }}>{volunteer.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REFERENCES */}
        {resume.references.length > 0 && (
          <section>
            <SectionHeading accent={colors.accent}>References</SectionHeading>

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
                      fontSize: typography.body,
                      fontWeight: 650,
                    }}
                  >
                    {reference.name}
                  </h3>
                  <p
                    style={{
                      margin: "2px 0 0",
                      color: colors.accent,
                      fontSize: typography.small,
                      fontWeight: 600,
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

        {/* CUSTOM SECTIONS */}
        {resume.customSections.length > 0 &&
          resume.customSections.map((section) => (
            <section key={section.id}>
              <SectionHeading accent={colors.accent}>{section.title}</SectionHeading>

              {section.description && (
                <p style={{ ...bodyTextStyle, marginBottom: "8px" }}>{section.description}</p>
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
                        gap: "14px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: typography.body,
                          fontWeight: 650,
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
                          fontWeight: 600,
                        }}
                      >
                        {item.subtitle}
                      </p>
                    )}

                    {item.description && (
                      <p style={{ ...bodyTextStyle, marginTop: "3px" }}>{item.description}</p>
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

export default TemplateFourteen;
