"use client";

import Image from "next/image";

import type { CSSProperties, ReactNode } from "react";

import type { ResumeData } from "@/data/resume";

import { DEFAULT_RESUME_DESIGN, RESUME_THEMES } from "@/data/resume-design";

interface TemplateSixProps {
  resume: ResumeData;
  id?: string;
}

/* ============================================================
   TYPOGRAPHY — TEMPLATE SIX
   ============================================================
   IMPORTANT:
   - Font family is STATIC.
   - Font sizes are STATIC.
   - Typography does NOT depend on resume design settings.
   - ONLY resume.themeId is dynamic.
   - Sizes are intentionally comfortable for A4 printing.
   ============================================================ */

const TYPOGRAPHY = {
  /* Main identity */
  name: "30pt",
  jobTitle: "11pt",

  /* Section hierarchy */
  section: "10.5pt",

  /* Main content */
  body: "10pt",

  /* Secondary information */
  small: "9.5pt",

  /* Small metadata */
  tiny: "9pt",

  /* Line heights */
  bodyLineHeight: 1.5,
  compactLineHeight: 1.4,

  /* Spacing */
  sectionGap: "16px",
  itemGap: "11px",
} as const;

/* ============================================================
   FONT FAMILY — STATIC
   ============================================================ */

const FONT_FAMILY =
  '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, "Times New Roman", serif';

/* ============================================================
   HELPERS
   ============================================================ */

function safeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanUrl(value?: string | null): string {
  const trimmed = cleanText(value);

  if (!trimmed) return "";

  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function displayUrl(value?: string | null): string {
  const trimmed = cleanText(value);

  if (!trimmed) return "";

  return trimmed
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

/* ============================================================
   THEME RESOLVER
   ============================================================ */

function resolveThemeId(themeId?: string | null): string {
  const id = typeof themeId === "string" ? themeId.trim() : "";

  if (id && RESUME_THEMES[id]) {
    return id;
  }

  const defaultId = DEFAULT_RESUME_DESIGN.themeId;

  if (defaultId && RESUME_THEMES[defaultId]) {
    return defaultId;
  }

  return "slate";
}

/* ============================================================
   SECTION TITLE
   ============================================================ */

function SectionTitle({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <div
      style={{
        marginBottom: "9px",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#0F172A",
          fontSize: TYPOGRAPHY.section,
          fontWeight: 700,
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
          marginTop: "5px",
          height: "2px",
          width: "100%",
          background: `linear-gradient(to right, ${accent} 0 38px, #E5E7EB 38px 100%)`,
        }}
      />
    </div>
  );
}

/* ============================================================
   BULLET LIST
   ============================================================ */

function BulletList({
  items,
  textColor,
  fontSize = TYPOGRAPHY.body,
  lineHeight = TYPOGRAPHY.bodyLineHeight,
}: {
  items: string[];
  textColor: string;
  fontSize?: string;
  lineHeight?: number;
}) {
  const valid = items.map(cleanText).filter(Boolean);

  if (!valid.length) {
    return null;
  }

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
      {valid.map((item, index) => (
        <li
          key={`${item}-${index}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "7px",
            color: textColor,
            fontSize,
            lineHeight,
            overflowWrap: "anywhere",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "3px",
              height: "3px",
              marginTop: "7px",
              borderRadius: "999px",
              backgroundColor: textColor,
              flexShrink: 0,
              opacity: 0.75,
            }}
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   DATE RANGE
   ============================================================ */

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
  const start = cleanText(startDate);
  const end = current ? "Present" : cleanText(endDate);

  if (!start && !end) {
    return null;
  }

  return (
    <span
      style={{
        color,
        fontSize: TYPOGRAPHY.small,
        fontWeight: 600,
        whiteSpace: "nowrap",
        lineHeight: 1.35,
        flexShrink: 0,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {start}
      {start && end ? " – " : ""}
      {end}
    </span>
  );
}

/* ============================================================
   LINK
   ============================================================ */

function LinkText({
  href,
  children,
  color,
  fontSize = TYPOGRAPHY.small,
  fontWeight = 600,
}: {
  href?: string;
  children: ReactNode;
  color: string;
  fontSize?: string;
  fontWeight?: number;
}) {
  const url = cleanUrl(href);

  if (!url) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      style={{
        color,
        fontSize,
        fontWeight,
        lineHeight: 1.4,
        textDecoration: "none",
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </a>
  );
}

/* ============================================================
   TEMPLATE SIX
   Typographic Editorial — Premium A4
   ============================================================ */

export function TemplateSix({ resume, id = "resume-page" }: TemplateSixProps) {
  /* ==========================================================
     THEME ONLY
     ========================================================== */

  const resolvedThemeId = resolveThemeId(resume.themeId);

  const theme = RESUME_THEMES[resolvedThemeId] ?? RESUME_THEMES.slate ?? RESUME_THEMES.blue;

  const colors = theme.colors;

  /* ==========================================================
     STATIC FONT
     ========================================================== */

  const fontFamily = FONT_FAMILY;

  /* ==========================================================
     DATA
     ========================================================== */

  const experience = safeArray(resume.experience);
  const education = safeArray(resume.education);
  const skills = safeArray(resume.skills);
  const projects = safeArray(resume.projects);
  const certifications = safeArray(resume.certifications);
  const awards = safeArray(resume.awards);
  const languages = safeArray(resume.languages);
  const publications = safeArray(resume.publications);
  const volunteer = safeArray(resume.volunteer);
  const references = safeArray(resume.references);
  const interests = safeArray(resume.interests);
  const customSections = safeArray(resume.customSections);

  const summary = cleanText(resume.summary);

  const projectTechnologies = (project: (typeof projects)[number]): string[] => {
    return safeArray(project.technologies)
      .map((technology) => cleanText(technology))
      .filter(Boolean);
  };

  /* ==========================================================
     PERSONAL
     ========================================================== */

  const firstName = cleanText(resume.personal.firstName) || "Your";
  const lastName = cleanText(resume.personal.lastName) || "Name";

  const fullName = `${firstName} ${lastName}`.trim();

  const hasPhoto = Boolean(cleanText(resume.personal.photo));

  /* ==========================================================
     CONTACT
     ========================================================== */

  const contactParts: {
    key: string;
    href?: string;
    text: string;
  }[] = [];

  if (cleanText(resume.personal.email)) {
    contactParts.push({
      key: "email",
      href: `mailto:${resume.personal.email}`,
      text: resume.personal.email!,
    });
  }

  if (cleanText(resume.personal.phone)) {
    contactParts.push({
      key: "phone",
      href: `tel:${resume.personal.phone}`,
      text: resume.personal.phone!,
    });
  }

  if (cleanText(resume.personal.location)) {
    contactParts.push({
      key: "location",
      text: resume.personal.location!,
    });
  }

  if (cleanText(resume.personal.website)) {
    contactParts.push({
      key: "website",
      href: resume.personal.website!,
      text: displayUrl(resume.personal.website),
    });
  }

  if (cleanText(resume.personal.linkedin)) {
    contactParts.push({
      key: "linkedin",
      href: resume.personal.linkedin!,
      text: displayUrl(resume.personal.linkedin),
    });
  }

  if (cleanText(resume.personal.github)) {
    contactParts.push({
      key: "github",
      href: resume.personal.github!,
      text: displayUrl(resume.personal.github),
    });
  }

  if (cleanText(resume.personal.portfolio)) {
    contactParts.push({
      key: "portfolio",
      href: resume.personal.portfolio!,
      text: displayUrl(resume.personal.portfolio),
    });
  }

  /* ==========================================================
     A4 PAGE
     ========================================================== */

  const pageStyle: CSSProperties = {
    width: "210mm",
    minWidth: "210mm",
    minHeight: "297mm",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    backgroundColor: "#FFFFFF",
    color: colors.text,
    fontFamily,
    overflow: "visible",
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  };

  const bodyTextStyle: CSSProperties = {
    margin: 0,
    color: colors.textMuted,
    fontSize: TYPOGRAPHY.body,
    lineHeight: TYPOGRAPHY.bodyLineHeight,
    overflowWrap: "anywhere",
  };

  return (
    <article
      id={id}
      className="resume-page"
      data-template="typographic-editorial"
      data-template-id="template-six"
      data-theme={resolvedThemeId}
      data-font="palatino"
      data-typography-scale="static"
      style={pageStyle}
    >
      {/* ======================================================
          HEADER
          ====================================================== */}

      <header
        style={{
          backgroundColor: colors.accent,
          color: "#FFFFFF",
          padding: "15mm 15mm 13mm",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "18px",
          }}
        >
          <div
            style={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <h1
              style={{
                margin: 0,
                color: "#FFFFFF",
                fontSize: TYPOGRAPHY.name,
                fontWeight: 400,
                letterSpacing: "-0.025em",
                lineHeight: 1.02,
                overflowWrap: "anywhere",
              }}
            >
              <span style={{ fontWeight: 300 }}>{firstName}</span>

              <br />

              <span style={{ fontWeight: 700 }}>{lastName}</span>
            </h1>

            {cleanText(resume.personal.jobTitle) && (
              <p
                style={{
                  margin: "9px 0 0",
                  color: "rgba(255,255,255,0.94)",
                  fontSize: TYPOGRAPHY.jobTitle,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  lineHeight: 1.35,
                  textTransform: "uppercase",
                  overflowWrap: "anywhere",
                }}
              >
                {resume.personal.jobTitle}
              </p>
            )}
          </div>

          {hasPhoto && (
            <div
              style={{
                position: "relative",
                width: "72px",
                height: "72px",
                flexShrink: 0,
                overflow: "hidden",
                borderRadius: "3px",
                border: "1px solid rgba(255,255,255,0.45)",
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Image
                src={resume.personal.photo}
                alt={fullName}
                fill
                sizes="72px"
                unoptimized
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>

        {contactParts.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "3px 0",
              marginTop: "13px",
              paddingTop: "11px",
              borderTop: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            {contactParts.map((part, index) => (
              <span
                key={part.key}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  color: "rgba(255,255,255,0.92)",
                  fontSize: TYPOGRAPHY.small,
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {part.href ? (
                  <LinkText
                    href={part.href}
                    color="rgba(255,255,255,0.92)"
                    fontSize={TYPOGRAPHY.small}
                    fontWeight={500}
                  >
                    {part.text}
                  </LinkText>
                ) : (
                  part.text
                )}

                {index < contactParts.length - 1 && (
                  <span
                    aria-hidden="true"
                    style={{
                      margin: "0 8px",
                      width: "3px",
                      height: "3px",
                      borderRadius: "999px",
                      backgroundColor: "rgba(255,255,255,0.75)",
                      opacity: 0.9,
                    }}
                  />
                )}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ======================================================
          BODY
          ====================================================== */}

      <div
        style={{
          flex: 1,
          padding: "15px 15mm 13mm",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            gap: TYPOGRAPHY.sectionGap,
            minWidth: 0,
            flex: 1,
          }}
        >
          {/* ==================================================
              PROFILE
              ================================================== */}

          {summary && (
            <section>
              <SectionTitle accent={colors.accent}>Profile</SectionTitle>

              <p style={bodyTextStyle}>{summary}</p>
            </section>
          )}

          {/* ==================================================
              EXPERIENCE
              ================================================== */}

          {experience.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Experience</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: TYPOGRAPHY.itemGap,
                }}
              >
                {experience.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      breakInside: "avoid",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            color: colors.text,
                            fontSize: TYPOGRAPHY.body,
                            fontWeight: 700,
                            lineHeight: 1.3,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {item.position}
                        </h3>

                        {cleanText(item.company) && (
                          <p
                            style={{
                              margin: "2px 0 0",
                              color: colors.accent,
                              fontSize: TYPOGRAPHY.small,
                              fontWeight: 600,
                              lineHeight: 1.35,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {item.company}
                            {item.location ? ` · ${item.location}` : ""}
                          </p>
                        )}
                      </div>

                      <DateRange
                        startDate={item.startDate}
                        endDate={item.endDate}
                        current={item.current}
                        color={colors.textSubtle}
                      />
                    </div>

                    {cleanText(item.description) && (
                      <p
                        style={{
                          ...bodyTextStyle,
                          marginTop: "5px",
                        }}
                      >
                        {item.description}
                      </p>
                    )}

                    <BulletList items={safeArray(item.achievements)} textColor={colors.textMuted} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              EDUCATION
              ================================================== */}

          {education.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Education</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: TYPOGRAPHY.itemGap,
                }}
              >
                {education.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      breakInside: "avoid",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            color: colors.text,
                            fontSize: TYPOGRAPHY.body,
                            fontWeight: 700,
                            lineHeight: 1.3,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {item.degree}
                          {item.fieldOfStudy ? ` — ${item.fieldOfStudy}` : ""}
                        </h3>

                        <p
                          style={{
                            margin: "2px 0 0",
                            color: colors.accent,
                            fontSize: TYPOGRAPHY.small,
                            fontWeight: 600,
                            lineHeight: 1.35,
                            overflowWrap: "anywhere",
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
                      />
                    </div>

                    {(cleanText(item.grade) || cleanText(item.description)) && (
                      <p
                        style={{
                          ...bodyTextStyle,
                          marginTop: "5px",
                        }}
                      >
                        {[item.grade, item.description].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              PROJECTS
              ================================================== */}

          {projects.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Projects</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {projects.map((project) => {
                  const technologies = projectTechnologies(project);

                  return (
                    <div
                      key={project.id}
                      style={{
                        breakInside: "avoid",
                      }}
                    >
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
                            flex: 1,
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              color: colors.text,
                              fontSize: TYPOGRAPHY.body,
                              fontWeight: 700,
                              lineHeight: 1.3,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {project.name}
                          </h3>

                          {cleanText(project.role) && (
                            <p
                              style={{
                                margin: "2px 0 0",
                                color: colors.accent,
                                fontSize: TYPOGRAPHY.small,
                                fontWeight: 600,
                                lineHeight: 1.35,
                              }}
                            >
                              {project.role}
                            </p>
                          )}
                        </div>

                        <DateRange
                          startDate={project.startDate}
                          endDate={project.endDate}
                          color={colors.textSubtle}
                        />
                      </div>

                      {cleanText(project.description) && (
                        <p
                          style={{
                            ...bodyTextStyle,
                            marginTop: "5px",
                          }}
                        >
                          {project.description}
                        </p>
                      )}

                      {technologies.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px 6px",
                            marginTop: "6px",
                          }}
                        >
                          {technologies.map((tech) => (
                            <span
                              key={tech}
                              style={{
                                padding: "3px 7px",
                                borderRadius: "1px",
                                backgroundColor: colors.background,
                                border: `1px solid ${colors.border}`,
                                color: colors.textMuted,
                                fontSize: TYPOGRAPHY.tiny,
                                fontWeight: 600,
                                lineHeight: 1.3,
                                letterSpacing: "0.01em",
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {safeArray(project.achievements).length > 0 && (
                        <BulletList
                          items={safeArray(project.achievements)}
                          textColor={colors.textMuted}
                          fontSize={TYPOGRAPHY.small}
                          lineHeight={1.4}
                        />
                      )}

                      {(cleanText(project.url) || cleanText(project.github)) && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "6px 12px",
                            marginTop: "6px",
                          }}
                        >
                          {cleanText(project.url) && (
                            <LinkText
                              href={project.url}
                              color={colors.accent}
                              fontSize={TYPOGRAPHY.small}
                            >
                              {displayUrl(project.url)}
                            </LinkText>
                          )}

                          {cleanText(project.github) && (
                            <LinkText
                              href={project.github}
                              color={colors.accent}
                              fontSize={TYPOGRAPHY.small}
                            >
                              {displayUrl(project.github)}
                            </LinkText>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ==================================================
              SKILLS + LANGUAGES + INTERESTS
              ================================================== */}

          {(skills.length > 0 || languages.length > 0 || interests.length > 0) && (
            <section>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    skills.length > 0 && (languages.length > 0 || interests.length > 0)
                      ? "minmax(0, 1.45fr) minmax(0, 1fr)"
                      : "minmax(0, 1fr)",
                  gap: "16px 22px",
                }}
              >
                {skills.length > 0 && (
                  <div>
                    <SectionTitle accent={colors.accent}>Skills</SectionTitle>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px 6px",
                      }}
                    >
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          style={{
                            padding: "3px 8px",
                            borderRadius: "1px",
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                            fontSize: TYPOGRAPHY.small,
                            fontWeight: 600,
                            lineHeight: 1.3,
                          }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "13px",
                  }}
                >
                  {languages.length > 0 && (
                    <div>
                      <SectionTitle accent={colors.accent}>Languages</SectionTitle>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        {languages.map((lang) => (
                          <div
                            key={lang.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                color: colors.text,
                                fontSize: TYPOGRAPHY.small,
                                fontWeight: 600,
                              }}
                            >
                              {lang.name}
                            </span>

                            {cleanText(lang.proficiency) && (
                              <span
                                style={{
                                  color: colors.textSubtle,
                                  fontSize: TYPOGRAPHY.tiny,
                                }}
                              >
                                {lang.proficiency}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {interests.length > 0 && (
                    <div>
                      <SectionTitle accent={colors.accent}>Interests</SectionTitle>

                      <p
                        style={{
                          margin: 0,
                          color: colors.textMuted,
                          fontSize: TYPOGRAPHY.small,
                          lineHeight: 1.5,
                        }}
                      >
                        {interests.filter(Boolean).join("  ·  ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ==================================================
              CERTIFICATIONS + AWARDS
              ================================================== */}

          {(certifications.length > 0 || awards.length > 0) && (
            <section>
              <SectionTitle accent={colors.accent}>Certifications & Awards</SectionTitle>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    certifications.length > 0 && awards.length > 0
                      ? "repeat(2, minmax(0, 1fr))"
                      : "minmax(0, 1fr)",
                  gap: "12px 18px",
                }}
              >
                {certifications.length > 0 && (
                  <div>
                    {certifications.map((cert) => (
                      <div
                        key={cert.id}
                        style={{
                          marginBottom: "8px",
                          breakInside: "avoid",
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            color: colors.text,
                            fontSize: TYPOGRAPHY.body,
                            fontWeight: 700,
                            lineHeight: 1.3,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {cert.name}
                        </h3>

                        {(cleanText(cert.issuer) || cleanText(cert.issueDate)) && (
                          <p
                            style={{
                              margin: "2px 0 0",
                              color: colors.textMuted,
                              fontSize: TYPOGRAPHY.small,
                              lineHeight: 1.35,
                            }}
                          >
                            {cert.issuer}
                            {cert.issuer && cert.issueDate ? " · " : ""}
                            {cert.issueDate}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {awards.length > 0 && (
                  <div>
                    {awards.map((award) => (
                      <div
                        key={award.id}
                        style={{
                          marginBottom: "8px",
                          breakInside: "avoid",
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            color: colors.text,
                            fontSize: TYPOGRAPHY.body,
                            fontWeight: 700,
                            lineHeight: 1.3,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {award.title}
                        </h3>

                        {(cleanText(award.issuer) || cleanText(award.date)) && (
                          <p
                            style={{
                              margin: "2px 0 0",
                              color: colors.textMuted,
                              fontSize: TYPOGRAPHY.small,
                              lineHeight: 1.35,
                            }}
                          >
                            {award.issuer}
                            {award.issuer && award.date ? " · " : ""}
                            {award.date}
                          </p>
                        )}

                        {cleanText(award.description) && (
                          <p
                            style={{
                              ...bodyTextStyle,
                              marginTop: "4px",
                            }}
                          >
                            {award.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ==================================================
              PUBLICATIONS
              ================================================== */}

          {publications.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Publications</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                }}
              >
                {publications.map((pub) => (
                  <div
                    key={pub.id}
                    style={{
                      breakInside: "avoid",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: TYPOGRAPHY.body,
                        fontWeight: 700,
                        lineHeight: 1.3,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {pub.title}
                    </h3>

                    {(cleanText(pub.publisher) || cleanText(pub.date)) && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.textMuted,
                          fontSize: TYPOGRAPHY.small,
                          lineHeight: 1.35,
                        }}
                      >
                        {pub.publisher}
                        {pub.publisher && pub.date ? " · " : ""}
                        {pub.date}
                      </p>
                    )}

                    {cleanText(pub.description) && (
                      <p
                        style={{
                          ...bodyTextStyle,
                          marginTop: "4px",
                        }}
                      >
                        {pub.description}
                      </p>
                    )}

                    {cleanText(pub.url) && (
                      <div
                        style={{
                          marginTop: "5px",
                        }}
                      >
                        <LinkText href={pub.url} color={colors.accent} fontSize={TYPOGRAPHY.small}>
                          {displayUrl(pub.url)}
                        </LinkText>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              VOLUNTEER
              ================================================== */}

          {volunteer.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Volunteer Experience</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: TYPOGRAPHY.itemGap,
                }}
              >
                {volunteer.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      breakInside: "avoid",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            color: colors.text,
                            fontSize: TYPOGRAPHY.body,
                            fontWeight: 700,
                            lineHeight: 1.3,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {item.role}
                        </h3>

                        <p
                          style={{
                            margin: "2px 0 0",
                            color: colors.accent,
                            fontSize: TYPOGRAPHY.small,
                            fontWeight: 600,
                            lineHeight: 1.35,
                            overflowWrap: "anywhere",
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
                      />
                    </div>

                    {cleanText(item.description) && (
                      <p
                        style={{
                          ...bodyTextStyle,
                          marginTop: "5px",
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

          {/* ==================================================
              REFERENCES
              ================================================== */}

          {references.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>References</SectionTitle>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    references.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                  gap: "11px 18px",
                }}
              >
                {references.map((ref) => (
                  <div
                    key={ref.id}
                    style={{
                      breakInside: "avoid",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: TYPOGRAPHY.small,
                        fontWeight: 700,
                        lineHeight: 1.3,
                      }}
                    >
                      {ref.name}
                    </h3>

                    {(cleanText(ref.position) || cleanText(ref.company)) && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.textMuted,
                          fontSize: TYPOGRAPHY.small,
                          lineHeight: 1.35,
                        }}
                      >
                        {ref.position}
                        {ref.position && ref.company ? " · " : ""}
                        {ref.company}
                      </p>
                    )}

                    {(cleanText(ref.email) || cleanText(ref.phone)) && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.textSubtle,
                          fontSize: TYPOGRAPHY.tiny,
                          lineHeight: 1.4,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {[ref.email, ref.phone].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              CUSTOM SECTIONS
              ================================================== */}

          {customSections.length > 0 &&
            customSections.map((section) => {
              const sectionItems = safeArray(section.items);

              if (
                !cleanText(section.title) &&
                !cleanText(section.description) &&
                sectionItems.length === 0
              ) {
                return null;
              }

              return (
                <section key={section.id}>
                  {cleanText(section.title) && (
                    <SectionTitle accent={colors.accent}>{section.title}</SectionTitle>
                  )}

                  {cleanText(section.description) && (
                    <p
                      style={{
                        ...bodyTextStyle,
                        marginBottom: sectionItems.length > 0 ? "8px" : 0,
                      }}
                    >
                      {section.description}
                    </p>
                  )}

                  {sectionItems.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {sectionItems.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            breakInside: "avoid",
                          }}
                        >
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
                                fontSize: TYPOGRAPHY.body,
                                fontWeight: 700,
                                lineHeight: 1.3,
                                overflowWrap: "anywhere",
                              }}
                            >
                              {item.title}
                            </h3>

                            {cleanText(item.date) && (
                              <span
                                style={{
                                  color: colors.textSubtle,
                                  fontSize: TYPOGRAPHY.small,
                                  whiteSpace: "nowrap",
                                  flexShrink: 0,
                                }}
                              >
                                {item.date}
                              </span>
                            )}
                          </div>

                          {cleanText(item.subtitle) && (
                            <p
                              style={{
                                margin: "2px 0 0",
                                color: colors.accent,
                                fontSize: TYPOGRAPHY.small,
                                fontWeight: 600,
                                lineHeight: 1.35,
                                overflowWrap: "anywhere",
                              }}
                            >
                              {item.subtitle}
                            </p>
                          )}

                          {cleanText(item.description) && (
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
                  )}
                </section>
              );
            })}
        </main>
      </div>

      {/* ========================================================
          PRINT
          ======================================================== */}

      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          .resume-page {
            width: 210mm !important;
            min-width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </article>
  );
}

export default TemplateSix;
