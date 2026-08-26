"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import type { ResumeData } from "@/data/resume";
import { DEFAULT_RESUME_DESIGN, RESUME_THEMES } from "@/data/resume-design";

interface TemplateTwoProps {
  resume: ResumeData;
  id?: string;
}

/* ============================================================
   TEMPLATE TWO
   PREMIUM ASYMMETRIC GRID
   ============================================================

   DESIGN PRINCIPLES
   ------------------------------------------------------------
   - Completely independent from Template Six.
   - Static font family.
   - Static font sizes.
   - No fontFamilyId.
   - No typographyScale.
   - Only resume.themeId is dynamic.
   - 12-column editorial grid.
   - Sections are optional.
   - Empty sections disappear naturally.
   - Designed for arbitrary resume combinations.
   - A4 / PDF optimized.
   ============================================================ */

/* ============================================================
   TYPOGRAPHY — STATIC
   ============================================================ */

const TYPOGRAPHY = {
  name: "27pt",
  jobTitle: "10pt",

  section: "8.5pt",

  heading: "10.2pt",
  body: "9.35pt",
  small: "8.45pt",
  tiny: "7.9pt",

  bodyLineHeight: 1.48,
  compactLineHeight: 1.34,

  sectionGap: "18px",
  itemGap: "13px",
} as const;

/* ============================================================
   FONT FAMILY — STATIC
   ============================================================ */

const FONT_FAMILY = '"Aptos", "Helvetica Neue", Helvetica, Arial, sans-serif';

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

  if (!trimmed) {
    return "";
  }

  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function displayUrl(value?: string | null): string {
  const trimmed = cleanText(value);

  if (!trimmed) {
    return "";
  }

  return trimmed
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

/* ============================================================
   THEME
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

function SectionTitle({
  children,
  accent,
  number,
}: {
  children: ReactNode;
  accent: string;
  number?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "9px",
      }}
    >
      {number && (
        <span
          style={{
            color: accent,
            fontSize: "7.5pt",
            fontWeight: 800,
            letterSpacing: "0.05em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {number}
        </span>
      )}

      <h2
        style={{
          margin: 0,
          color: "#111827",
          fontSize: TYPOGRAPHY.section,
          fontWeight: 800,
          letterSpacing: "0.17em",
          lineHeight: 1.2,
          textTransform: "uppercase",
        }}
      >
        {children}
      </h2>

      <span
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

/* ============================================================
   BULLETS
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
              width: "4px",
              height: "4px",
              marginTop: "6px",
              borderRadius: "1px",
              backgroundColor: textColor,
              opacity: 0.7,
              flexShrink: 0,
            }}
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   DATE
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
        fontWeight: 700,
        whiteSpace: "nowrap",
        lineHeight: 1.3,
        flexShrink: 0,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {start}
      {start && end ? " — " : ""}
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
        lineHeight: 1.35,
        textDecoration: "none",
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </a>
  );
}

/* ============================================================
   TAG
   ============================================================ */

function Tag({
  children,
  background,
  border,
  color,
}: {
  children: ReactNode;
  background: string;
  border: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: "18px",
        padding: "2px 6px",
        boxSizing: "border-box",
        border: `1px solid ${border}`,
        borderRadius: "2px",
        backgroundColor: background,
        color,
        fontSize: TYPOGRAPHY.tiny,
        fontWeight: 700,
        lineHeight: 1.25,
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </span>
  );
}

/* ============================================================
   TEMPLATE TWO
   ============================================================ */

export function TemplateTwo({ resume, id = "resume-page" }: TemplateTwoProps) {
  /* ==========================================================
     THEME ONLY
     ========================================================== */

  const resolvedThemeId = resolveThemeId(resume.themeId);

  const theme = RESUME_THEMES[resolvedThemeId] ?? RESUME_THEMES.slate ?? RESUME_THEMES.blue;

  const colors = theme.colors;

  /* ==========================================================
     STATIC TYPOGRAPHY
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

  /* ==========================================================
     PERSONAL
     ========================================================== */

  const firstName = cleanText(resume.personal.firstName) || "Your";

  const lastName = cleanText(resume.personal.lastName) || "Name";

  const fullName = `${firstName} ${lastName}`.trim();

  const jobTitle = cleanText(resume.personal.jobTitle);

  const hasPhoto = Boolean(cleanText(resume.personal.photo));

  /* ==========================================================
     CONTACT DATA
     ========================================================== */

  const contactItems = [
    cleanText(resume.personal.email)
      ? {
          label: "Email",
          value: resume.personal.email!,
          href: `mailto:${resume.personal.email}`,
        }
      : null,

    cleanText(resume.personal.phone)
      ? {
          label: "Phone",
          value: resume.personal.phone!,
          href: `tel:${resume.personal.phone}`,
        }
      : null,

    cleanText(resume.personal.location)
      ? {
          label: "Location",
          value: resume.personal.location!,
        }
      : null,

    cleanText(resume.personal.website)
      ? {
          label: "Web",
          value: displayUrl(resume.personal.website),
          href: resume.personal.website!,
        }
      : null,

    cleanText(resume.personal.linkedin)
      ? {
          label: "LinkedIn",
          value: displayUrl(resume.personal.linkedin),
          href: resume.personal.linkedin!,
        }
      : null,

    cleanText(resume.personal.github)
      ? {
          label: "GitHub",
          value: displayUrl(resume.personal.github),
          href: resume.personal.github!,
        }
      : null,

    cleanText(resume.personal.portfolio)
      ? {
          label: "Portfolio",
          value: displayUrl(resume.personal.portfolio),
          href: resume.personal.portfolio!,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    value: string;
    href?: string;
  }[];

  /* ==========================================================
     PAGE
     ========================================================== */

  const pageStyle: CSSProperties = {
    width: "210mm",
    minWidth: "210mm",
    minHeight: "297mm",
    boxSizing: "border-box",
    margin: "0 auto",
    backgroundColor: "#FFFFFF",
    color: colors.text,
    fontFamily,
    overflow: "visible",
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  };

  /* ==========================================================
     HEADER
     ========================================================== */

  const headerStyle: CSSProperties = {
    position: "relative",
    boxSizing: "border-box",
    padding: "12mm 13mm 10mm",
    backgroundColor: "#FFFFFF",
    borderBottom: `1px solid ${colors.border}`,
  };

  /* ==========================================================
     BODY GRID
     ========================================================== */

  const bodyGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.72fr) minmax(0, 0.9fr)",
    gap: "19px",
    padding: "10mm 13mm 12mm",
    boxSizing: "border-box",
    alignItems: "start",
  };

  const bodyTextStyle: CSSProperties = {
    margin: 0,
    color: colors.textMuted,
    fontSize: TYPOGRAPHY.body,
    lineHeight: TYPOGRAPHY.bodyLineHeight,
    overflowWrap: "anywhere",
  };

  /* ==========================================================
     RETURN
     ========================================================== */

  return (
    <article
      id={id}
      className="resume-page"
      data-template="premium-asymmetric-grid"
      data-template-id="template-two"
      data-theme={resolvedThemeId}
      data-font="aptos"
      data-typography-scale="static"
      style={pageStyle}
    >
      {/* ======================================================
          HEADER
          ====================================================== */}

      <header style={headerStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: hasPhoto ? "minmax(0, 1fr) 64px" : "minmax(0, 1fr)",
            gap: "18px",
            alignItems: "center",
          }}
        >
          {/* IDENTITY */}

          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "7px",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "27px",
                  height: "3px",
                  backgroundColor: colors.accent,
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  color: colors.accent,
                  fontSize: "7.5pt",
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                Professional Profile
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                color: colors.text,
                fontSize: TYPOGRAPHY.name,
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 0.98,
                overflowWrap: "anywhere",
              }}
            >
              {firstName}{" "}
              <span
                style={{
                  fontWeight: 400,
                }}
              >
                {lastName}
              </span>
            </h1>

            {jobTitle && (
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.accent,
                  fontSize: TYPOGRAPHY.jobTitle,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  lineHeight: 1.3,
                  textTransform: "uppercase",
                  overflowWrap: "anywhere",
                }}
              >
                {jobTitle}
              </p>
            )}
          </div>

          {/* PHOTO */}

          {hasPhoto && (
            <div
              style={{
                position: "relative",
                width: "64px",
                height: "76px",
                justifySelf: "end",
                overflow: "hidden",
                borderRadius: "2px",
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Image
                src={resume.personal.photo}
                alt={fullName}
                fill
                sizes="64px"
                unoptimized
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>

        {/* CONTACT STRIP */}

        {contactItems.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "8px 15px",
              marginTop: "13px",
              paddingTop: "9px",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            {contactItems.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                style={{
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    color: colors.textSubtle,
                    fontSize: "7pt",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    lineHeight: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </div>

                <div
                  style={{
                    marginTop: "2px",
                    minWidth: 0,
                  }}
                >
                  {item.href ? (
                    <LinkText
                      href={item.href}
                      color={colors.text}
                      fontSize={TYPOGRAPHY.tiny}
                      fontWeight={600}
                    >
                      {item.value}
                    </LinkText>
                  ) : (
                    <span
                      style={{
                        color: colors.text,
                        fontSize: TYPOGRAPHY.tiny,
                        fontWeight: 600,
                        lineHeight: 1.35,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* ======================================================
          MAIN GRID
          ====================================================== */}

      <div style={bodyGridStyle}>
        {/* ====================================================
            LEFT / PRIMARY COLUMN
            ==================================================== */}

        <main
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: TYPOGRAPHY.sectionGap,
          }}
        >
          {/* ==================================================
              PROFILE
              ================================================== */}

          {summary && (
            <section
              style={{
                breakInside: "avoid",
              }}
            >
              <SectionTitle accent={colors.accent} number="01">
                Profile
              </SectionTitle>

              <p style={bodyTextStyle}>{summary}</p>
            </section>
          )}

          {/* ==================================================
              EXPERIENCE
              ================================================== */}

          {experience.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent} number="02">
                Experience
              </SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: TYPOGRAPHY.itemGap,
                }}
              >
                {experience.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      position: "relative",
                      breakInside: "avoid",
                      display: "grid",
                      gridTemplateColumns: "20px minmax(0, 1fr)",
                      gap: "9px",
                    }}
                  >
                    {/* TIMELINE */}

                    <div
                      aria-hidden="true"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          width: "7px",
                          height: "7px",
                          marginTop: "4px",
                          borderRadius: "50%",
                          backgroundColor: colors.accent,
                          boxShadow: `0 0 0 3px ${colors.background}`,
                          flexShrink: 0,
                        }}
                      />

                      {index < experience.length - 1 && (
                        <span
                          style={{
                            width: "1px",
                            flex: 1,
                            minHeight: "18px",
                            marginTop: "5px",
                            backgroundColor: colors.border,
                          }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "12px",
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
                              fontSize: TYPOGRAPHY.heading,
                              fontWeight: 800,
                              lineHeight: 1.25,
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
                                fontWeight: 700,
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

                      <BulletList
                        items={safeArray(item.achievements)}
                        textColor={colors.textMuted}
                      />
                    </div>
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
              <SectionTitle accent={colors.accent} number="03">
                Projects
              </SectionTitle>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "10px",
                }}
              >
                {projects.map((project) => {
                  const technologies = safeArray(project.technologies)
                    .map(cleanText)
                    .filter(Boolean);

                  return (
                    <div
                      key={project.id}
                      style={{
                        minWidth: 0,
                        breakInside: "avoid",
                        padding: "10px",
                        boxSizing: "border-box",
                        border: `1px solid ${colors.border}`,
                        borderTop: `3px solid ${colors.accent}`,
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "8px",
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
                              fontWeight: 800,
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
                                fontSize: TYPOGRAPHY.tiny,
                                fontWeight: 700,
                                lineHeight: 1.3,
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
                            fontSize: TYPOGRAPHY.small,
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
                            gap: "4px",
                            marginTop: "6px",
                          }}
                        >
                          {technologies.map((technology) => (
                            <Tag
                              key={technology}
                              background={colors.background}
                              border={colors.border}
                              color={colors.textMuted}
                            >
                              {technology}
                            </Tag>
                          ))}
                        </div>
                      )}

                      {safeArray(project.achievements).length > 0 && (
                        <BulletList
                          items={safeArray(project.achievements)}
                          textColor={colors.textMuted}
                          fontSize={TYPOGRAPHY.tiny}
                          lineHeight={1.4}
                        />
                      )}

                      {(cleanText(project.url) || cleanText(project.github)) && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px 10px",
                            marginTop: "6px",
                          }}
                        >
                          {cleanText(project.url) && (
                            <LinkText
                              href={project.url}
                              color={colors.accent}
                              fontSize={TYPOGRAPHY.tiny}
                            >
                              {displayUrl(project.url)}
                            </LinkText>
                          )}

                          {cleanText(project.github) && (
                            <LinkText
                              href={project.github}
                              color={colors.accent}
                              fontSize={TYPOGRAPHY.tiny}
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
              EDUCATION
              ================================================== */}

          {education.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent} number="04">
                Education
              </SectionTitle>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "10px",
                }}
              >
                {education.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      minWidth: 0,
                      breakInside: "avoid",
                      padding: "9px 10px",
                      backgroundColor: colors.background,
                      borderLeft: `3px solid ${colors.accent}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "8px",
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
                            fontWeight: 800,
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
                            fontWeight: 700,
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
                          fontSize: TYPOGRAPHY.small,
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
              PUBLICATIONS
              ================================================== */}

          {publications.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent} number="05">
                Publications
              </SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                }}
              >
                {publications.map((publication) => (
                  <div
                    key={publication.id}
                    style={{
                      breakInside: "avoid",
                      display: "grid",
                      gridTemplateColumns: "5px minmax(0, 1fr)",
                      gap: "8px",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "5px",
                        height: "5px",
                        marginTop: "4px",
                        borderRadius: "50%",
                        backgroundColor: colors.accent,
                      }}
                    />

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
                          lineHeight: 1.3,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {publication.title}
                      </h3>

                      {(cleanText(publication.publisher) || cleanText(publication.date)) && (
                        <p
                          style={{
                            margin: "2px 0 0",
                            color: colors.accent,
                            fontSize: TYPOGRAPHY.small,
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}
                        >
                          {publication.publisher}

                          {publication.publisher && publication.date ? " · " : ""}

                          {publication.date}
                        </p>
                      )}

                      {cleanText(publication.description) && (
                        <p
                          style={{
                            ...bodyTextStyle,
                            marginTop: "4px",
                          }}
                        >
                          {publication.description}
                        </p>
                      )}

                      {cleanText(publication.url) && (
                        <div
                          style={{
                            marginTop: "4px",
                          }}
                        >
                          <LinkText
                            href={publication.url}
                            color={colors.accent}
                            fontSize={TYPOGRAPHY.tiny}
                          >
                            {displayUrl(publication.url)}
                          </LinkText>
                        </div>
                      )}
                    </div>
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
              <SectionTitle accent={colors.accent} number="06">
                Volunteer Experience
              </SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {volunteer.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      breakInside: "avoid",
                      padding: "8px 10px",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "12px",
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
                            fontWeight: 800,
                            lineHeight: 1.3,
                          }}
                        >
                          {item.role}
                        </h3>

                        <p
                          style={{
                            margin: "2px 0 0",
                            color: colors.accent,
                            fontSize: TYPOGRAPHY.small,
                            fontWeight: 700,
                            lineHeight: 1.35,
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
        </main>

        {/* ====================================================
            RIGHT / SUPPORTING COLUMN
            ==================================================== */}

        <aside
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: TYPOGRAPHY.sectionGap,
          }}
        >
          {/* ==================================================
              SKILLS
              ================================================== */}

          {skills.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Skills</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                }}
              >
                {skills.map((skill) => (
                  <Tag
                    key={skill.id}
                    background={colors.background}
                    border={colors.border}
                    color={colors.text}
                  >
                    {skill.name}
                  </Tag>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              LANGUAGES
              ================================================== */}

          {languages.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Languages</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                {languages.map((language) => (
                  <div
                    key={language.id}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: "8px",
                      paddingBottom: "5px",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <span
                      style={{
                        color: colors.text,
                        fontSize: TYPOGRAPHY.small,
                        fontWeight: 700,
                        lineHeight: 1.3,
                      }}
                    >
                      {language.name}
                    </span>

                    {cleanText(language.proficiency) && (
                      <span
                        style={{
                          color: colors.textSubtle,
                          fontSize: TYPOGRAPHY.tiny,
                          lineHeight: 1.3,
                          textAlign: "right",
                        }}
                      >
                        {language.proficiency}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              INTERESTS
              ================================================== */}

          {interests.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Interests</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                }}
              >
                {interests
                  .map(cleanText)
                  .filter(Boolean)
                  .map((interest) => (
                    <Tag
                      key={interest}
                      background="#FFFFFF"
                      border={colors.border}
                      color={colors.textMuted}
                    >
                      {interest}
                    </Tag>
                  ))}
              </div>
            </section>
          )}

          {/* ==================================================
              CERTIFICATIONS
              ================================================== */}

          {certifications.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Certifications</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                }}
              >
                {certifications.map((certification) => (
                  <div
                    key={certification.id}
                    style={{
                      breakInside: "avoid",
                      paddingBottom: "8px",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: TYPOGRAPHY.small,
                        fontWeight: 800,
                        lineHeight: 1.35,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {certification.name}
                    </h3>

                    {(cleanText(certification.issuer) || cleanText(certification.issueDate)) && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.textMuted,
                          fontSize: TYPOGRAPHY.tiny,
                          lineHeight: 1.35,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {certification.issuer}

                        {certification.issuer && certification.issueDate ? " · " : ""}

                        {certification.issueDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================================================
              AWARDS
              ================================================== */}

          {awards.length > 0 && (
            <section>
              <SectionTitle accent={colors.accent}>Awards</SectionTitle>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                }}
              >
                {awards.map((award) => (
                  <div
                    key={award.id}
                    style={{
                      breakInside: "avoid",
                      paddingLeft: "9px",
                      borderLeft: `2px solid ${colors.accent}`,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: TYPOGRAPHY.small,
                        fontWeight: 800,
                        lineHeight: 1.35,
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
                          fontSize: TYPOGRAPHY.tiny,
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
                          fontSize: TYPOGRAPHY.tiny,
                        }}
                      >
                        {award.description}
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
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {references.map((reference) => (
                  <div
                    key={reference.id}
                    style={{
                      breakInside: "avoid",
                      minWidth: 0,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: TYPOGRAPHY.small,
                        fontWeight: 800,
                        lineHeight: 1.3,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {reference.name}
                    </h3>

                    {(cleanText(reference.position) || cleanText(reference.company)) && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.accent,
                          fontSize: TYPOGRAPHY.tiny,
                          fontWeight: 700,
                          lineHeight: 1.35,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {reference.position}

                        {reference.position && reference.company ? " · " : ""}

                        {reference.company}
                      </p>
                    )}

                    {(cleanText(reference.email) || cleanText(reference.phone)) && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.textSubtle,
                          fontSize: TYPOGRAPHY.tiny,
                          lineHeight: 1.35,
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
      </div>

      {/* ======================================================
          CUSTOM SECTIONS

          Custom sections are deliberately outside the fixed
          two-column body grid.

          This means a user can add arbitrary custom content
          without breaking the primary layout.
          ====================================================== */}

      {customSections.length > 0 && (
        <div
          style={{
            padding: "0 13mm 12mm",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "11px 16px",
            }}
          >
            {customSections.map((section) => {
              const sectionItems = safeArray(section.items);

              if (
                !cleanText(section.title) &&
                !cleanText(section.description) &&
                sectionItems.length === 0
              ) {
                return null;
              }

              return (
                <section
                  key={section.id}
                  style={{
                    minWidth: 0,
                    breakInside: "avoid",
                  }}
                >
                  {cleanText(section.title) && (
                    <SectionTitle accent={colors.accent}>{section.title}</SectionTitle>
                  )}

                  {cleanText(section.description) && (
                    <p
                      style={{
                        ...bodyTextStyle,
                        marginBottom: sectionItems.length > 0 ? "7px" : 0,
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
                            minWidth: 0,
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
                                  fontSize: TYPOGRAPHY.tiny,
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
                                fontWeight: 700,
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
          </div>
        </div>
      )}

      {/* ======================================================
          PRINT
          ====================================================== */}

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
            overflow: visible !important;
          }

          .resume-page * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </article>
  );
}

export default TemplateTwo;
