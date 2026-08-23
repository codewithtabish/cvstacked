"use client";

import Image from "next/image";

import type { CSSProperties, ReactNode } from "react";

import { ResumeData } from "@/data/resume";

import { DEFAULT_RESUME_DESIGN, RESUME_FONT_FAMILIES, RESUME_THEMES } from "@/data/resume-design";

// ============================================================
// TYPES
// ============================================================

interface TemplateTwoProps {
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
        name: "30px",
        jobTitle: "11px",
        body: "9.5px",
        small: "7.8px",
        section: "10px",
        lineHeight: 1.45,
        sectionGap: "15px",
        itemGap: "10px",
      };

    case "comfortable":
      return {
        name: "36px",
        jobTitle: "13px",
        body: "10.5px",
        small: "8.5px",
        section: "11px",
        lineHeight: 1.6,
        sectionGap: "21px",
        itemGap: "13px",
      };

    case "standard":
    default:
      return {
        name: "33px",
        jobTitle: "12px",
        body: "10px",
        small: "8px",
        section: "10.5px",
        lineHeight: 1.52,
        sectionGap: "18px",
        itemGap: "11px",
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
          maxWidth: "100%",
          margin: 0,
          paddingBottom: "4px",
          color: "#111827",
          fontSize: "10.5px",
          fontWeight: 800,
          letterSpacing: "0.16em",
          lineHeight: 1.2,
          textTransform: "uppercase",
          borderBottom: `2px solid ${accent}`,
          position: "relative",
        }}
      >
        {children}
      </h2>

      <div
        aria-hidden="true"
        style={{
          width: "100%",
          height: "1px",
          marginTop: "3px",
          backgroundColor: "#E5E7EB",
        }}
      />
    </div>
  );
}

// ============================================================
// DOUBLE UNDERLINE
// ============================================================

function DoubleUnderline({ accent, width = "100%" }: { accent: string; width?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        marginTop: "8px",
      }}
    >
      <div
        style={{
          height: "2px",
          width: "100%",
          backgroundColor: accent,
        }}
      />

      <div
        style={{
          height: "1px",
          width: "100%",
          backgroundColor: "#D1D5DB",
        }}
      />
    </div>
  );
}

// ============================================================
// BODY TEXT
// ============================================================

function BodyText({
  children,
  color,
  fontSize,
  lineHeight,
  style,
}: {
  children: ReactNode;
  color: string;
  fontSize: string;
  lineHeight: number;
  style?: CSSProperties;
}) {
  return (
    <p
      style={{
        margin: 0,
        color,
        fontSize,
        lineHeight,
        ...style,
      }}
    >
      {children}
    </p>
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
        display: "inline-block",
        color,
        fontSize,
        fontWeight: 700,
        lineHeight: 1.4,
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
// BULLET LIST
// ============================================================

function BulletList({
  items,
  textColor,
  accent,
  fontSize,
  lineHeight,
}: {
  items: string[];
  textColor: string;
  accent: string;
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
              width: "5px",
              height: "5px",
              marginTop: "5px",
              flexShrink: 0,
              borderRadius: "1px",
              backgroundColor: accent,
              transform: "rotate(45deg)",
            }}
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ============================================================
// META ITEM
// ============================================================

function MetaItem({
  children,
  accent,
  color,
  fontSize,
}: {
  children: ReactNode;
  accent: string;
  color: string;
  fontSize: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        color,
        fontSize,
        lineHeight: 1.4,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "4px",
          height: "4px",
          flexShrink: 0,
          borderRadius: "999px",
          backgroundColor: accent,
        }}
      />

      <span
        style={{
          overflowWrap: "anywhere",
        }}
      >
        {children}
      </span>
    </span>
  );
}

// ============================================================
// EXPERIENCE ITEM
// ============================================================

function ExperienceItem({
  experience,
  colors,
  typography,
}: {
  experience: ResumeData["experience"][number];
  colors: ReturnType<typeof getResumeColors>;
  typography: ReturnType<typeof getTypographyScale>;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "112px minmax(0, 1fr)",
        gap: "16px",
      }}
    >
      {/* DATE */}
      <div
        style={{
          paddingTop: "2px",
          color: colors.textSubtle,
          fontSize: typography.small,
          lineHeight: 1.45,
        }}
      >
        <DateRange
          startDate={experience.startDate}
          endDate={experience.endDate}
          current={experience.current}
          color={colors.textSubtle}
          fontSize={typography.small}
        />
      </div>

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          paddingLeft: "15px",
          borderLeft: `1px solid ${colors.border}`,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-4px",
            top: "4px",
            width: "7px",
            height: "7px",
            borderRadius: "999px",
            backgroundColor: colors.accent,
            boxShadow: `0 0 0 3px ${colors.background}`,
          }}
        />

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
            margin: "3px 0 0",
            color: colors.accent,
            fontSize: typography.small,
            fontWeight: 800,
            lineHeight: 1.4,
          }}
        >
          {experience.company}
          {experience.location ? ` · ${experience.location}` : ""}
        </p>

        {experience.description && (
          <BodyText
            color={colors.textMuted}
            fontSize={typography.body}
            lineHeight={typography.lineHeight}
            style={{
              marginTop: "5px",
            }}
          >
            {experience.description}
          </BodyText>
        )}

        <BulletList
          items={experience.achievements}
          textColor={colors.textMuted}
          accent={colors.accent}
          fontSize={typography.body}
          lineHeight={typography.lineHeight}
        />
      </div>
    </div>
  );
}

// ============================================================
// COLORS
// ============================================================

function getResumeColors(resume: ResumeData) {
  const theme = RESUME_THEMES[resume.themeId] ?? RESUME_THEMES[DEFAULT_RESUME_DESIGN.themeId];

  return theme.colors;
}

// ============================================================
// TEMPLATE TWO
// ============================================================

export function TemplateTwo({ id = "resume-page", resume }: TemplateTwoProps) {
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
      data-template-id={id}
      data-theme={resume.themeId}
      data-font={resume.fontFamilyId}
      data-typography-scale={resume.typographyScale}
    >
      {/* ======================================================
          HEADER
          ====================================================== */}

      <header
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: "24px",
          alignItems: "start",
          paddingBottom: "15px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            minWidth: 0,
          }}
        >
          <p
            style={{
              width: "fit-content",
              margin: 0,
              color: colors.accent,
              fontSize: typography.small,
              fontWeight: 800,
              letterSpacing: "0.2em",
              lineHeight: 1.3,
              textTransform: "uppercase",
            }}
          >
            Curriculum Vitae
          </p>

          <h1
            style={{
              maxWidth: "430px",
              margin: "6px 0 0",
              color: colors.text,
              fontSize: typography.name,
              fontWeight: 900,
              letterSpacing: "-0.045em",
              lineHeight: 0.98,
            }}
          >
            {resume.personal.firstName || "Your"} {resume.personal.lastName || "Name"}
          </h1>

          {resume.personal.jobTitle && (
            <div
              style={{
                marginTop: "9px",
              }}
            >
              <p
                style={{
                  width: "fit-content",
                  maxWidth: "380px",
                  margin: 0,
                  color: colors.textMuted,
                  fontSize: typography.jobTitle,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  lineHeight: 1.4,
                }}
              >
                {resume.personal.jobTitle}
              </p>

              <DoubleUnderline accent={colors.accent} width="85px" />
            </div>
          )}
        </div>

        {/* ====================================================
            PHOTO
            ==================================================== */}

        {resume.personal.photo && (
          <div
            style={{
              width: "82px",
              height: "102px",
              flexShrink: 0,
              overflow: "hidden",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
            }}
          >
            <Image
              src={resume.personal.photo}
              alt={`${resume.personal.firstName || "Resume"} ${
                resume.personal.lastName || "Photo"
              }`}
              width={82}
              height={102}
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

      {/* ======================================================
          CONTACT INFORMATION
          ====================================================== */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "6px 16px",
          padding: "9px 0 12px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {resume.personal.email && (
          <MetaItem accent={colors.accent} color={colors.textMuted} fontSize={typography.small}>
            {resume.personal.email}
          </MetaItem>
        )}

        {resume.personal.phone && (
          <MetaItem accent={colors.accent} color={colors.textMuted} fontSize={typography.small}>
            {resume.personal.phone}
          </MetaItem>
        )}

        {resume.personal.location && (
          <MetaItem accent={colors.accent} color={colors.textMuted} fontSize={typography.small}>
            {resume.personal.location}
          </MetaItem>
        )}

        {resume.personal.website && (
          <MetaItem accent={colors.accent} color={colors.textMuted} fontSize={typography.small}>
            {resume.personal.website}
          </MetaItem>
        )}

        {resume.personal.linkedin && (
          <MetaItem accent={colors.accent} color={colors.textMuted} fontSize={typography.small}>
            {resume.personal.linkedin}
          </MetaItem>
        )}

        {resume.personal.github && (
          <MetaItem accent={colors.accent} color={colors.textMuted} fontSize={typography.small}>
            {resume.personal.github}
          </MetaItem>
        )}
      </div>

      {/* ======================================================
          MAIN LAYOUT
          ====================================================== */}

      <main
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 185px",
          gap: "25px",
          marginTop: "18px",
        }}
      >
        {/* ====================================================
            LEFT COLUMN
            ==================================================== */}

        <div
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: typography.sectionGap,
          }}
        >
          {/* ==================================================
              PROFILE
              ================================================== */}

          {resume.summary.trim() && (
            <section>
              <SectionTitle accent={colors.accent}>Profile</SectionTitle>

              <BodyText
                color={colors.textMuted}
                fontSize={typography.body}
                lineHeight={typography.lineHeight}
              >
                {resume.summary}
              </BodyText>
            </section>
          )}

          {/* ==================================================
              EXPERIENCE
              ================================================== */}

          {resume.experience.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Experience</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${typography.itemGap}px`,
                }}
              >
                {resume.experience.map((experience) => (
                  <ExperienceItem
                    key={experience.id}
                    experience={experience}
                    colors={colors}
                    typography={typography}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              PROJECTS
              ================================================== */}

          {resume.projects.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Selected Projects</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {resume.projects.map((project) => (
                  <article
                    key={project.id}
                    style={{
                      padding: "0 0 9px",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
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
                          maxWidth: "320px",
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
                        <span
                          style={{
                            color: colors.accent,
                            fontSize: typography.small,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {project.role}
                        </span>
                      )}
                    </div>

                    <BodyText
                      color={colors.textMuted}
                      fontSize={typography.body}
                      lineHeight={typography.lineHeight}
                      style={{
                        marginTop: "4px",
                      }}
                    >
                      {project.description}
                    </BodyText>

                    {project.technologies && project.technologies.length > 0 && (
                      <p
                        style={{
                          margin: "5px 0 0",
                          color: colors.textSubtle,
                          fontSize: typography.small,
                          fontWeight: 600,
                          lineHeight: 1.4,
                        }}
                      >
                        {project.technologies.join(" · ")}
                      </p>
                    )}

                    {project.achievements && project.achievements.length > 0 && (
                      <BulletList
                        items={project.achievements}
                        textColor={colors.textMuted}
                        accent={colors.accent}
                        fontSize={typography.small}
                        lineHeight={1.45}
                      />
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              EDUCATION
              ================================================== */}

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
                  <div
                    key={education.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) auto",
                      gap: "15px",
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
                          lineHeight: 1.4,
                        }}
                      >
                        {education.institution}
                        {education.location ? ` · ${education.location}` : ""}
                      </p>

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
            </section>
          )}

          {/* ==================================================
              CERTIFICATIONS
              ================================================== */}

          {resume.certifications.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Certifications</SectionTitle>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "10px 18px",
                }}
              >
                {resume.certifications.map((certification) => (
                  <div key={certification.id}>
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
                        lineHeight: 1.4,
                      }}
                    >
                      {certification.issuer}
                      {certification.issueDate ? ` · ${certification.issueDate}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              AWARDS
              ================================================== */}

          {resume.awards.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Awards</SectionTitle>

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
            </section>
          )}
        </div>

        {/* ====================================================
            RIGHT SIDEBAR
            ==================================================== */}

        <aside
          style={{
            minWidth: 0,
            paddingLeft: "17px",
            borderLeft: `1px solid ${colors.border}`,
            display: "flex",
            flexDirection: "column",
            gap: typography.sectionGap,
          }}
        >
          {/* ==================================================
              SKILLS
              ================================================== */}

          {resume.skills.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Skills</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                {resume.skills.map((skill) => (
                  <div
                    key={skill.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                    }}
                  >
                    <span
                      style={{
                        color: colors.text,
                        fontSize: typography.small,
                        fontWeight: 800,
                        lineHeight: 1.4,
                      }}
                    >
                      {skill.name}
                    </span>

                    {skill.category && (
                      <span
                        style={{
                          color: colors.textSubtle,
                          fontSize: "7px",
                          lineHeight: 1.35,
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

          {/* ==================================================
              LANGUAGES
              ================================================== */}

          {resume.languages.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Languages</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                {resume.languages.map((language) => (
                  <div key={language.id}>
                    <p
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: typography.small,
                        fontWeight: 800,
                        lineHeight: 1.4,
                      }}
                    >
                      {language.name}
                    </p>

                    <p
                      style={{
                        margin: "1px 0 0",
                        color: colors.textSubtle,
                        fontSize: "7px",
                        lineHeight: 1.35,
                      }}
                    >
                      {language.proficiency}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              VOLUNTEER
              ================================================== */}

          {resume.volunteer.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Volunteer</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {resume.volunteer.map((volunteer) => (
                  <div key={volunteer.id}>
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: typography.small,
                        fontWeight: 800,
                        lineHeight: 1.4,
                      }}
                    >
                      {volunteer.role}
                    </h3>

                    <p
                      style={{
                        margin: "2px 0 0",
                        color: colors.accent,
                        fontSize: "7.5px",
                        fontWeight: 700,
                        lineHeight: 1.4,
                      }}
                    >
                      {volunteer.organization}
                    </p>

                    <DateRange
                      startDate={volunteer.startDate}
                      endDate={volunteer.endDate}
                      current={volunteer.current}
                      color={colors.textSubtle}
                      fontSize="7px"
                    />

                    {volunteer.description && (
                      <BodyText
                        color={colors.textMuted}
                        fontSize="7.5px"
                        lineHeight={1.45}
                        style={{
                          marginTop: "3px",
                        }}
                      >
                        {volunteer.description}
                      </BodyText>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              INTERESTS
              ================================================== */}

          {resume.interests.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Interests</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px 9px",
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
            </section>
          )}

          {/* ==================================================
              REFERENCES
              ================================================== */}

          {resume.references.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>References</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {resume.references.map((reference) => (
                  <div key={reference.id}>
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: typography.small,
                        fontWeight: 800,
                        lineHeight: 1.4,
                      }}
                    >
                      {reference.name}
                    </h3>

                    <p
                      style={{
                        margin: "2px 0 0",
                        color: colors.accent,
                        fontSize: "7px",
                        fontWeight: 700,
                        lineHeight: 1.4,
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
                          fontSize: "7px",
                          lineHeight: 1.4,
                          overflowWrap: "anywhere",
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
        </aside>
      </main>

      {/* ======================================================
          PUBLICATIONS
          ====================================================== */}

      {resume.publications.length > 0 && (
        <section
          style={{
            marginTop: typography.sectionGap,
          }}
        >
          <SectionTitle accent={colors.accent}>Publications</SectionTitle>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "12px 22px",
            }}
          >
            {resume.publications.map((publication) => (
              <article key={publication.id}>
                <h3
                  style={{
                    maxWidth: "300px",
                    margin: 0,
                    color: colors.text,
                    fontSize: typography.body,
                    fontWeight: 700,
                    lineHeight: 1.35,
                  }}
                >
                  {publication.title}
                </h3>

                <p
                  style={{
                    margin: "2px 0 0",
                    color: colors.accent,
                    fontSize: typography.small,
                    fontWeight: 700,
                  }}
                >
                  {publication.publisher} · {publication.date}
                </p>

                {publication.description && (
                  <BodyText
                    color={colors.textMuted}
                    fontSize={typography.small}
                    lineHeight={1.45}
                    style={{
                      marginTop: "3px",
                    }}
                  >
                    {publication.description}
                  </BodyText>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ======================================================
          CUSTOM SECTIONS
          ====================================================== */}

      {resume.customSections.length > 0 &&
        resume.customSections.map((section) => (
          <section
            key={section.id}
            style={{
              marginTop: typography.sectionGap,
            }}
          >
            <SectionTitle accent={colors.accent}>{section.title}</SectionTitle>

            {section.description && (
              <BodyText
                color={colors.textMuted}
                fontSize={typography.body}
                lineHeight={typography.lineHeight}
                style={{
                  marginBottom: "8px",
                }}
              >
                {section.description}
              </BodyText>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
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
                        maxWidth: "350px",
                        margin: 0,
                        color: colors.text,
                        fontSize: typography.body,
                        fontWeight: 700,
                        lineHeight: 1.35,
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
                    <BodyText
                      color={colors.textMuted}
                      fontSize={typography.body}
                      lineHeight={typography.lineHeight}
                      style={{
                        marginTop: "4px",
                      }}
                    >
                      {item.description}
                    </BodyText>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
    </article>
  );
}

export default TemplateTwo;
