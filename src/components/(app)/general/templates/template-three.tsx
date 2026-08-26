"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import type { ResumeData } from "@/data/resume";
import { DEFAULT_RESUME_DESIGN, RESUME_THEMES } from "@/data/resume-design";

interface TemplateThreeProps {
  resume: ResumeData;
  id?: string;
}

/* ============================================================
   TEMPLATE THREE
   ============================================================

   DESIGN LANGUAGE
   ------------------------------------------------------------
   Premium editorial / executive resume.

   - A4 / PDF optimized
   - Dynamic theme accent
   - Hardcoded typography
   - No resume font-family setting
   - No typography-scale setting
   - No fixed accent/sidebar color
   - Distinct masthead + editorial grid
   - Lightweight typography
   - Controlled density
   - Print-safe section/item behavior
   ============================================================ */

/* ============================================================
   TYPOGRAPHY
   ============================================================ */

const TYPOGRAPHY = {
  name: "29pt",
  jobTitle: "10pt",

  section: "9.4pt",
  sectionLarge: "10pt",

  body: "9.15pt",
  bodySmall: "8.45pt",
  metadata: "7.9pt",
  tiny: "7.45pt",

  heroLineHeight: 0.98,
  bodyLineHeight: 1.48,
  compactLineHeight: 1.32,

  sectionGap: "16px",
  itemGap: "12px",
} as const;

/*
 * Premium system/editorial stack.
 * Deliberately independent from ResumeData typography settings.
 */
const FONT_FAMILY = '"Aptos", "Inter", "Segoe UI", Helvetica, Arial, sans-serif';

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
   SECTION HEADING
   ============================================================ */

function EditorialHeading({
  children,
  accent,
  muted = false,
}: {
  children: ReactNode;
  accent: string;
  muted?: boolean;
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
      <span
        aria-hidden="true"
        style={{
          width: "15px",
          height: "1.5px",
          flexShrink: 0,
          backgroundColor: accent,
        }}
      />

      <h2
        style={{
          margin: 0,
          color: muted ? "rgba(255,255,255,0.92)" : "#111827",
          fontSize: TYPOGRAPHY.section,
          fontWeight: 700,
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

/* ============================================================
   MINI LABEL
   ============================================================ */

function MiniLabel({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      style={{
        display: "block",
        marginBottom: "3px",
        color,
        fontSize: TYPOGRAPHY.tiny,
        fontWeight: 700,
        letterSpacing: "0.08em",
        lineHeight: 1.2,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
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
        display: "inline-block",
        color,
        fontSize: TYPOGRAPHY.metadata,
        fontWeight: 500,
        lineHeight: 1.25,
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
        flexShrink: 0,
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
  fontSize = TYPOGRAPHY.bodySmall,
  fontWeight = 500,
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
   BULLETS
   ============================================================ */

function BulletList({
  items,
  textColor,
  accent,
  fontSize = TYPOGRAPHY.body,
  lineHeight = TYPOGRAPHY.bodyLineHeight,
}: {
  items: string[];
  textColor: string;
  accent: string;
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
        gap: "4px",
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
              borderRadius: "50%",
              backgroundColor: accent,
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
   CONTACT
   ============================================================ */

function ContactLine({
  label,
  value,
  href,
  colors,
}: {
  label: string;
  value: string;
  href?: string;
  colors: {
    accent: string;
  };
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "47px minmax(0, 1fr)",
        gap: "7px",
        alignItems: "baseline",
      }}
    >
      <span
        style={{
          color: colors.accent,
          fontSize: TYPOGRAPHY.tiny,
          fontWeight: 700,
          letterSpacing: "0.06em",
          lineHeight: 1.25,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>

      {href ? (
        <LinkText href={href} color="#374151" fontSize={TYPOGRAPHY.bodySmall} fontWeight={500}>
          {value}
        </LinkText>
      ) : (
        <span
          style={{
            color: "#374151",
            fontSize: TYPOGRAPHY.bodySmall,
            fontWeight: 500,
            lineHeight: 1.4,
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

/* ============================================================
   SMALL INFORMATION CARD
   ============================================================ */

function InfoCard({
  title,
  subtitle,
  date,
  accent,
  background,
}: {
  title: string;
  subtitle?: string;
  date?: ReactNode;
  accent: string;
  background: string;
}) {
  return (
    <article
      style={{
        position: "relative",
        padding: "8px 9px 9px 11px",
        border: "1px solid rgba(17,24,39,0.09)",
        borderLeft: `2px solid ${accent}`,
        backgroundColor: background,
        breakInside: "avoid",
      }}
    >
      <h3
        style={{
          margin: 0,
          color: "#1F2937",
          fontSize: TYPOGRAPHY.bodySmall,
          fontWeight: 700,
          lineHeight: 1.3,
          overflowWrap: "anywhere",
        }}
      >
        {title}
      </h3>

      {subtitle && (
        <p
          style={{
            margin: "2px 0 0",
            color: "#6B7280",
            fontSize: TYPOGRAPHY.tiny,
            fontWeight: 500,
            lineHeight: 1.35,
            overflowWrap: "anywhere",
          }}
        >
          {subtitle}
        </p>
      )}

      {date && (
        <div
          style={{
            marginTop: "3px",
          }}
        >
          {date}
        </div>
      )}
    </article>
  );
}

/* ============================================================
   TEMPLATE THREE
   ============================================================ */

export function TemplateThree({ resume, id = "resume-page" }: TemplateThreeProps) {
  /* ==========================================================
     THEME
     ========================================================== */

  const resolvedThemeId = resolveThemeId(resume.themeId);

  const theme = RESUME_THEMES[resolvedThemeId] ?? RESUME_THEMES.slate ?? RESUME_THEMES.blue;

  const colors = theme.colors;

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
  const photo = cleanText(resume.personal.photo);

  /* ==========================================================
     PROJECT TECHNOLOGIES
     ========================================================== */

  const projectTechnologies = (project: (typeof projects)[number]): string[] => {
    return safeArray(project.technologies)
      .map((technology) => cleanText(technology))
      .filter(Boolean);
  };

  /* ==========================================================
     COMMON STYLES
     ========================================================== */

  const bodyTextStyle: CSSProperties = {
    margin: 0,
    color: colors.textMuted,
    fontSize: TYPOGRAPHY.body,
    lineHeight: TYPOGRAPHY.bodyLineHeight,
    overflowWrap: "anywhere",
  };

  const subtleTextStyle: CSSProperties = {
    color: colors.textSubtle,
    fontSize: TYPOGRAPHY.bodySmall,
    lineHeight: 1.4,
    overflowWrap: "anywhere",
  };

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
    fontFamily: FONT_FAMILY,
    overflow: "visible",
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  };

  /* ==========================================================
     MASTHEAD
     ========================================================== */

  const mastheadStyle: CSSProperties = {
    position: "relative",
    padding: "12.5mm 13mm 10mm",
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: "#FFFFFF",
    boxSizing: "border-box",
  };

  /* ==========================================================
     BODY GRID
     ========================================================== */

  const contentStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "54mm minmax(0, 1fr)",
    flex: 1,
    minHeight: 0,
  };

  const supportingColumnStyle: CSSProperties = {
    minWidth: 0,
    padding: "10.5mm 7.5mm 11mm 13mm",
    borderRight: `1px solid ${colors.border}`,
    boxSizing: "border-box",
    backgroundColor: colors.background,
  };

  const narrativeColumnStyle: CSSProperties = {
    minWidth: 0,
    padding: "10.5mm 13mm 11mm 10mm",
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",
  };

  /* ==========================================================
     RETURN
     ========================================================== */

  return (
    <article
      id={id}
      className="resume-page"
      data-template="editorial-executive"
      data-template-id="template-three"
      data-theme={resolvedThemeId}
      data-font="aptos"
      data-typography-scale="static"
      style={pageStyle}
    >
      {/* ======================================================
          MASTHEAD
          ====================================================== */}

      <header style={mastheadStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: photo ? "minmax(0, 1fr) 64px" : "minmax(0, 1fr)",
            gap: "18px",
            alignItems: "center",
          }}
        >
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
                marginBottom: "9px",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "28px",
                  height: "2px",
                  backgroundColor: colors.accent,
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  color: colors.accent,
                  fontSize: TYPOGRAPHY.tiny,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
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
                fontSize: TYPOGRAPHY.name,
                fontWeight: 650,
                letterSpacing: "-0.045em",
                lineHeight: TYPOGRAPHY.heroLineHeight,
                overflowWrap: "anywhere",
              }}
            >
              <span
                style={{
                  fontWeight: 400,
                }}
              >
                {firstName}
              </span>{" "}
              <span
                style={{
                  fontWeight: 700,
                }}
              >
                {lastName}
              </span>
            </h1>

            {jobTitle && (
              <p
                style={{
                  margin: "7px 0 0",
                  color: colors.textMuted,
                  fontSize: TYPOGRAPHY.jobTitle,
                  fontWeight: 500,
                  lineHeight: 1.35,
                  letterSpacing: "0.025em",
                  overflowWrap: "anywhere",
                }}
              >
                {jobTitle}
              </p>
            )}
          </div>

          {photo && (
            <div
              style={{
                width: "64px",
                height: "64px",
                position: "relative",
                overflow: "hidden",
                borderRadius: "50%",
                border: `2px solid ${colors.accent}`,
                backgroundColor: colors.background,
                justifySelf: "end",
              }}
            >
              <Image
                src={photo}
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

        {/* Accent footer line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "13mm",
            bottom: "-1px",
            width: "46px",
            height: "2px",
            backgroundColor: colors.accent,
          }}
        />
      </header>

      {/* ======================================================
          TWO-COLUMN CONTENT
          ====================================================== */}

      <div style={contentStyle}>
        {/* ====================================================
            SUPPORTING COLUMN
            ==================================================== */}

        <aside style={supportingColumnStyle}>
          {/* CONTACT */}
          {(cleanText(resume.personal.email) ||
            cleanText(resume.personal.phone) ||
            cleanText(resume.personal.location) ||
            cleanText(resume.personal.website) ||
            cleanText(resume.personal.linkedin) ||
            cleanText(resume.personal.github) ||
            cleanText(resume.personal.portfolio)) && (
            <section
              style={{
                marginBottom: "18px",
              }}
            >
              <EditorialHeading accent={colors.accent}>Contact</EditorialHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7px",
                }}
              >
                {cleanText(resume.personal.email) && (
                  <ContactLine
                    label="Email"
                    value={resume.personal.email}
                    href={`mailto:${resume.personal.email}`}
                    colors={colors}
                  />
                )}

                {cleanText(resume.personal.phone) && (
                  <ContactLine
                    label="Phone"
                    value={resume.personal.phone}
                    href={`tel:${resume.personal.phone}`}
                    colors={colors}
                  />
                )}

                {cleanText(resume.personal.location) && (
                  <ContactLine label="Base" value={resume.personal.location} colors={colors} />
                )}

                {cleanText(resume.personal.website) && (
                  <ContactLine
                    label="Web"
                    value={displayUrl(resume.personal.website)}
                    href={resume.personal.website}
                    colors={colors}
                  />
                )}

                {cleanText(resume.personal.linkedin) && (
                  <ContactLine
                    label="LinkedIn"
                    value={displayUrl(resume.personal.linkedin)}
                    href={resume.personal.linkedin}
                    colors={colors}
                  />
                )}

                {cleanText(resume.personal.github) && (
                  <ContactLine
                    label="GitHub"
                    value={displayUrl(resume.personal.github)}
                    href={resume.personal.github}
                    colors={colors}
                  />
                )}

                {cleanText(resume.personal.portfolio) && (
                  <ContactLine
                    label="Portfolio"
                    value={displayUrl(resume.personal.portfolio)}
                    href={resume.personal.portfolio}
                    colors={colors}
                  />
                )}
              </div>
            </section>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <section
              style={{
                marginBottom: "18px",
              }}
            >
              <EditorialHeading accent={colors.accent}>Expertise</EditorialHeading>

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
                      padding: "4px 6px",
                      border: `1px solid ${colors.border}`,
                      backgroundColor: "#FFFFFF",
                      color: colors.text,
                      fontSize: TYPOGRAPHY.tiny,
                      fontWeight: 500,
                      lineHeight: 1.25,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <section
              style={{
                marginBottom: "18px",
              }}
            >
              <EditorialHeading accent={colors.accent}>Languages</EditorialHeading>

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
                      gap: "7px",
                    }}
                  >
                    <span
                      style={{
                        color: colors.text,
                        fontSize: TYPOGRAPHY.bodySmall,
                        fontWeight: 600,
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
                          fontWeight: 500,
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

          {/* INTERESTS */}
          {interests.length > 0 && (
            <section
              style={{
                marginBottom: "18px",
              }}
            >
              <EditorialHeading accent={colors.accent}>Interests</EditorialHeading>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px 7px",
                }}
              >
                {interests
                  .map((interest) => cleanText(interest))
                  .filter(Boolean)
                  .map((interest) => (
                    <span
                      key={interest}
                      style={{
                        color: colors.textMuted,
                        fontSize: TYPOGRAPHY.bodySmall,
                        fontWeight: 500,
                        lineHeight: 1.35,
                      }}
                    >
                      {interest}
                    </span>
                  ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <section
              style={{
                marginBottom: "18px",
              }}
            >
              <EditorialHeading accent={colors.accent}>Certifications</EditorialHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                }}
              >
                {certifications.map((certification) => (
                  <article
                    key={certification.id}
                    style={{
                      breakInside: "avoid",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: TYPOGRAPHY.bodySmall,
                        fontWeight: 650,
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
                          color: colors.textSubtle,
                          fontSize: TYPOGRAPHY.tiny,
                          fontWeight: 500,
                          lineHeight: 1.35,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {certification.issuer}
                        {certification.issuer && certification.issueDate ? " · " : ""}
                        {certification.issueDate}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* AWARDS */}
          {awards.length > 0 && (
            <section
              style={{
                marginBottom: "18px",
              }}
            >
              <EditorialHeading accent={colors.accent}>Awards</EditorialHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                }}
              >
                {awards.map((award) => (
                  <article
                    key={award.id}
                    style={{
                      breakInside: "avoid",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: TYPOGRAPHY.bodySmall,
                        fontWeight: 650,
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
                          color: colors.textSubtle,
                          fontSize: TYPOGRAPHY.tiny,
                          fontWeight: 500,
                          lineHeight: 1.35,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {award.issuer}
                        {award.issuer && award.date ? " · " : ""}
                        {award.date}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* ====================================================
            MAIN NARRATIVE COLUMN
            ==================================================== */}

        <main style={narrativeColumnStyle}>
          {/* PROFILE */}
          {summary && (
            <section
              style={{
                marginBottom: TYPOGRAPHY.sectionGap,
              }}
            >
              <EditorialHeading accent={colors.accent}>Profile</EditorialHeading>

              <p style={bodyTextStyle}>{summary}</p>
            </section>
          )}

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <section
              style={{
                marginBottom: TYPOGRAPHY.sectionGap,
              }}
            >
              <EditorialHeading accent={colors.accent}>Experience</EditorialHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: TYPOGRAPHY.itemGap,
                }}
              >
                {experience.map((item) => (
                  <article
                    key={item.id}
                    style={{
                      position: "relative",
                      paddingLeft: "12px",
                      borderLeft: `1px solid ${colors.border}`,
                      breakInside: "avoid",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: "-3px",
                        top: "4px",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor: colors.accent,
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "10px",
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
                              fontSize: TYPOGRAPHY.bodySmall,
                              fontWeight: 600,
                              lineHeight: 1.35,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {item.company}
                            {cleanText(item.location) ? ` · ${item.location}` : ""}
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
                      accent={colors.accent}
                      fontSize={TYPOGRAPHY.body}
                      lineHeight={TYPOGRAPHY.bodyLineHeight}
                    />
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <section
              style={{
                marginBottom: TYPOGRAPHY.sectionGap,
              }}
            >
              <EditorialHeading accent={colors.accent}>Education</EditorialHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                }}
              >
                {education.map((item) => (
                  <InfoCard
                    key={item.id}
                    title={`${item.degree}${
                      cleanText(item.fieldOfStudy) ? ` — ${item.fieldOfStudy}` : ""
                    }`}
                    subtitle={`${item.institution}${
                      cleanText(item.location) ? ` · ${item.location}` : ""
                    }`}
                    date={
                      <DateRange
                        startDate={item.startDate}
                        endDate={item.endDate}
                        current={item.current}
                        color={colors.textSubtle}
                      />
                    }
                    accent={colors.accent}
                    background={colors.background}
                  />
                ))}
              </div>

              {education.some((item) => cleanText(item.grade) || cleanText(item.description)) && (
                <div
                  style={{
                    marginTop: "7px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  {education.map((item) => {
                    const details = [item.grade, item.description]
                      .map(cleanText)
                      .filter(Boolean)
                      .join(" · ");

                    if (!details) {
                      return null;
                    }

                    return (
                      <p
                        key={`${item.id}-details`}
                        style={{
                          margin: 0,
                          ...subtleTextStyle,
                        }}
                      >
                        {details}
                      </p>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* PROJECTS */}
          {projects.length > 0 && (
            <section
              style={{
                marginBottom: TYPOGRAPHY.sectionGap,
              }}
            >
              <EditorialHeading accent={colors.accent}>Selected Work</EditorialHeading>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    projects.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                  gap: "10px",
                }}
              >
                {projects.map((project) => {
                  const technologies = projectTechnologies(project);

                  return (
                    <article
                      key={project.id}
                      style={{
                        padding: "9px 10px",
                        borderTop: `2px solid ${colors.accent}`,
                        borderLeft: `1px solid ${colors.border}`,
                        borderRight: `1px solid ${colors.border}`,
                        borderBottom: `1px solid ${colors.border}`,
                        breakInside: "avoid",
                        minWidth: 0,
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
                                fontSize: TYPOGRAPHY.bodySmall,
                                fontWeight: 600,
                                lineHeight: 1.3,
                                overflowWrap: "anywhere",
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
                            gap: "4px",
                            marginTop: "7px",
                          }}
                        >
                          {technologies.map((technology) => (
                            <span
                              key={technology}
                              style={{
                                padding: "2px 5px",
                                border: `1px solid ${colors.border}`,
                                color: colors.textMuted,
                                fontSize: TYPOGRAPHY.tiny,
                                fontWeight: 500,
                                lineHeight: 1.25,
                              }}
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      )}

                      <BulletList
                        items={safeArray(project.achievements)}
                        textColor={colors.textMuted}
                        accent={colors.accent}
                        fontSize={TYPOGRAPHY.bodySmall}
                        lineHeight={1.4}
                      />

                      {(cleanText(project.url) || cleanText(project.github)) && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px 10px",
                            marginTop: "7px",
                          }}
                        >
                          {cleanText(project.url) && (
                            <LinkText
                              href={project.url}
                              color={colors.accent}
                              fontSize={TYPOGRAPHY.tiny}
                              fontWeight={600}
                            >
                              {displayUrl(project.url)}
                            </LinkText>
                          )}

                          {cleanText(project.github) && (
                            <LinkText
                              href={project.github}
                              color={colors.accent}
                              fontSize={TYPOGRAPHY.tiny}
                              fontWeight={600}
                            >
                              {displayUrl(project.github)}
                            </LinkText>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* PUBLICATIONS */}
          {publications.length > 0 && (
            <section
              style={{
                marginBottom: TYPOGRAPHY.sectionGap,
              }}
            >
              <EditorialHeading accent={colors.accent}>Publications</EditorialHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                }}
              >
                {publications.map((publication) => (
                  <article
                    key={publication.id}
                    style={{
                      paddingBottom: "8px",
                      borderBottom: `1px solid ${colors.border}`,
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
                      {publication.title}
                    </h3>

                    {(cleanText(publication.publisher) || cleanText(publication.date)) && (
                      <p
                        style={{
                          margin: "2px 0 0",
                          color: colors.accent,
                          fontSize: TYPOGRAPHY.bodySmall,
                          fontWeight: 600,
                          lineHeight: 1.35,
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
                          fontWeight={600}
                        >
                          {displayUrl(publication.url)}
                        </LinkText>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* VOLUNTEER */}
          {volunteer.length > 0 && (
            <section
              style={{
                marginBottom: TYPOGRAPHY.sectionGap,
              }}
            >
              <EditorialHeading accent={colors.accent}>Volunteer</EditorialHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {volunteer.map((item) => (
                  <article
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) auto",
                      gap: "10px",
                      paddingBottom: "9px",
                      borderBottom: `1px solid ${colors.border}`,
                      breakInside: "avoid",
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
                          fontSize: TYPOGRAPHY.bodySmall,
                          fontWeight: 600,
                          lineHeight: 1.35,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {item.organization}
                      </p>

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

                    <DateRange
                      startDate={item.startDate}
                      endDate={item.endDate}
                      current={item.current}
                      color={colors.textSubtle}
                    />
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* REFERENCES */}
          {references.length > 0 && (
            <section
              style={{
                marginBottom: TYPOGRAPHY.sectionGap,
              }}
            >
              <EditorialHeading accent={colors.accent}>References</EditorialHeading>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    references.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                  gap: "9px",
                }}
              >
                {references.map((reference) => (
                  <article
                    key={reference.id}
                    style={{
                      padding: "8px 9px",
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      breakInside: "avoid",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: TYPOGRAPHY.bodySmall,
                        fontWeight: 700,
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
                          color: colors.textMuted,
                          fontSize: TYPOGRAPHY.bodySmall,
                          fontWeight: 500,
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
                          margin: "3px 0 0",
                          color: colors.textSubtle,
                          fontSize: TYPOGRAPHY.tiny,
                          lineHeight: 1.35,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {[reference.email, reference.phone]
                          .map(cleanText)
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* CUSTOM SECTIONS */}
          {customSections.length > 0 &&
            customSections.map((section) => {
              const items = safeArray(section.items);
              const hasTitle = Boolean(cleanText(section.title));
              const hasDescription = Boolean(cleanText(section.description));

              if (!hasTitle && !hasDescription && items.length === 0) {
                return null;
              }

              return (
                <section
                  key={section.id}
                  style={{
                    marginBottom: TYPOGRAPHY.sectionGap,
                  }}
                >
                  {hasTitle && (
                    <EditorialHeading accent={colors.accent}>{section.title}</EditorialHeading>
                  )}

                  {hasDescription && (
                    <p
                      style={{
                        ...bodyTextStyle,
                        marginBottom: items.length > 0 ? "8px" : 0,
                      }}
                    >
                      {section.description}
                    </p>
                  )}

                  {items.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {items.map((item) => (
                        <article
                          key={item.id}
                          style={{
                            padding: "8px 9px 8px 10px",
                            borderLeft: `2px solid ${colors.accent}`,
                            backgroundColor: colors.background,
                            breakInside: "avoid",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              justifyContent: "space-between",
                              gap: "9px",
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
                                  fontSize: TYPOGRAPHY.metadata,
                                  fontWeight: 500,
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
                                fontSize: TYPOGRAPHY.bodySmall,
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
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}

          {/* EMPTY FALLBACK */}
          {!summary &&
            experience.length === 0 &&
            education.length === 0 &&
            projects.length === 0 &&
            publications.length === 0 &&
            volunteer.length === 0 &&
            references.length === 0 &&
            customSections.length === 0 && (
              <section>
                <EditorialHeading accent={colors.accent}>Professional Profile</EditorialHeading>

                <p style={bodyTextStyle}>
                  Add your professional summary, experience, education, projects, or other resume
                  sections to build your profile.
                </p>
              </section>
            )}
        </main>
      </div>

      {/* ======================================================
          PRINT STYLES
          ====================================================== */}

      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        .resume-page {
          page-break-after: auto;
          break-after: auto;
        }

        .resume-page,
        .resume-page *,
        .resume-page *::before,
        .resume-page *::after {
          box-sizing: border-box;
        }

        .resume-page section,
        .resume-page article {
          orphans: 3;
          widows: 3;
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
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          .resume-page a {
            color: inherit;
            text-decoration: none;
          }

          .resume-page section,
          .resume-page article {
            break-inside: avoid;
          }
        }
      `}</style>
    </article>
  );
}

export default TemplateThree;
