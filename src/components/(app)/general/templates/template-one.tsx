"use client";

import Image from "next/image";

import type { CSSProperties, ReactNode } from "react";

import type { ResumeData } from "@/data/resume";

import { DEFAULT_RESUME_DESIGN, RESUME_THEMES } from "@/data/resume-design";

interface TemplateOneProps {
  resume: ResumeData;
  id?: string;
}

/* ============================================================
   TEMPLATE ONE
   ============================================================

   DESIGN:
   - Premium asymmetric editorial grid
   - Theme-colored identity rail
   - Main content editorial column
   - Hardcoded premium editorial typography
   - A4 / PDF optimized
   - Theme accent remains dynamic
   - No font-family settings from resume design
   - No typography-scale settings from resume design
   - Gracefully handles missing sections
   ============================================================ */

const TYPOGRAPHY = {
  name: "27pt",
  jobTitle: "9.5pt",
  section: "10pt",
  sectionSmall: "8.2pt",
  body: "9.5pt",
  bodySmall: "8.8pt",
  metadata: "8.2pt",
  tiny: "7.7pt",

  bodyLineHeight: 1.5,
  compactLineHeight: 1.35,

  sectionGap: "17px",
  itemGap: "12px",
} as const;

/* ============================================================
   ATATIVE EDITORIAL FONT
   ============================================================ */

const FONT_FAMILY = '"Aptos", "Segoe UI", Arial, Helvetica, sans-serif';

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
   ACCENT CONTRAST
   ============================================================

   Sidebar uses the selected theme accent as its background.

   This helper makes the sidebar automatically choose a readable
   foreground color for both dark and light accent themes.
   ============================================================ */

function getAccentForeground(accent: string): string {
  const value = cleanText(accent);

  if (!value) {
    return "#FFFFFF";
  }

  const hex = value.replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return "#FFFFFF";
  }

  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);

  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.66 ? "#111827" : "#FFFFFF";
}

function getAccentMutedText(foreground: string): string {
  return foreground === "#FFFFFF" ? "rgba(255,255,255,0.74)" : "rgba(17,24,39,0.68)";
}

function getAccentSoftText(foreground: string): string {
  return foreground === "#FFFFFF" ? "rgba(255,255,255,0.55)" : "rgba(17,24,39,0.54)";
}

function getAccentBorder(foreground: string): string {
  return foreground === "#FFFFFF" ? "rgba(255,255,255,0.22)" : "rgba(17,24,39,0.18)";
}

/* ============================================================
   SECTION HEADING
   ============================================================ */

function SectionHeading({
  children,
  accent,
  light = false,
}: {
  children: ReactNode;
  accent: string;
  light?: boolean;
}) {
  return (
    <div
      style={{
        marginBottom: "9px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: "18px",
            height: "3px",
            flexShrink: 0,
            backgroundColor: accent,
            borderRadius: "999px",
          }}
        />

        <h2
          style={{
            margin: 0,
            color: light ? "#FFFFFF" : "#111827",
            fontSize: TYPOGRAPHY.section,
            fontWeight: 750,
            lineHeight: 1.2,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
          }}
        >
          {children}
        </h2>
      </div>
    </div>
  );
}

/* ============================================================
   SIDEBAR HEADING
   ============================================================ */

function RailHeading({
  children,
  foreground,
  accent,
}: {
  children: ReactNode;
  foreground: string;
  accent: string;
}) {
  const muted = getAccentMutedText(foreground);

  return (
    <div
      style={{
        marginBottom: "8px",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: muted,
          fontSize: TYPOGRAPHY.sectionSmall,
          fontWeight: 650,
          letterSpacing: "0.14em",
          lineHeight: 1.25,
          textTransform: "uppercase",
        }}
      >
        {children}
      </h2>

      <div
        aria-hidden="true"
        style={{
          width: "22px",
          height: "2px",
          marginTop: "5px",
          backgroundColor:
            foreground === "#FFFFFF" ? "rgba(255,255,255,0.9)" : "rgba(17,24,39,0.72)",
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
            fontWeight: 400,
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
              backgroundColor: textColor,
              opacity: 0.65,
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
        display: "inline-block",
        color,
        fontSize: TYPOGRAPHY.metadata,
        fontWeight: 600,
        lineHeight: 1.3,
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
   CONTACT ITEM
   ============================================================ */

function ContactItem({
  label,
  value,
  href,
  foreground,
}: {
  label: string;
  value: string;
  href?: string;
  foreground: string;
}) {
  const primary = getAccentMutedText(foreground);
  const secondary = getAccentSoftText(foreground);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        minWidth: 0,
      }}
    >
      <span
        style={{
          color: secondary,
          fontSize: TYPOGRAPHY.tiny,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>

      {href ? (
        <LinkText href={href} color={primary} fontSize={TYPOGRAPHY.bodySmall} fontWeight={450}>
          {value}
        </LinkText>
      ) : (
        <span
          style={{
            color: primary,
            fontSize: TYPOGRAPHY.bodySmall,
            fontWeight: 450,
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
   TEMPLATE ONE
   ============================================================ */

export function TemplateOne({ resume, id = "resume-page" }: TemplateOneProps) {
  /* ==========================================================
     THEME
     ========================================================== */

  const resolvedThemeId = resolveThemeId(resume.themeId);

  const theme = RESUME_THEMES[resolvedThemeId] ?? RESUME_THEMES.slate ?? RESUME_THEMES.blue;

  const colors = theme.colors;

  /*
   * IMPORTANT:
   * Sidebar is now driven entirely by the selected theme accent.
   */
  const sidebarBackground = colors.accent;
  const sidebarForeground = getAccentForeground(colors.accent);
  const sidebarPrimary = getAccentMutedText(sidebarForeground);
  const sidebarSecondary = getAccentSoftText(sidebarForeground);
  const sidebarBorder = getAccentBorder(sidebarForeground);

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
     A4
     ========================================================== */

  const pageStyle: CSSProperties = {
    width: "210mm",
    minWidth: "210mm",
    minHeight: "297mm",
    boxSizing: "border-box",

    display: "grid",

    /*
     * Editorial asymmetric layout.
     */
    gridTemplateColumns: "58mm minmax(0, 1fr)",

    margin: "0 auto",

    backgroundColor: "#FFFFFF",
    color: colors.text,

    fontFamily,

    overflow: "visible",

    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  };

  /* ==========================================================
     THEME-ACCENT SIDEBAR
     ========================================================== */

  const railStyle: CSSProperties = {
    minWidth: 0,

    /*
     * THEME ACCENT — NO HARDCODED DARK COLOR.
     */
    backgroundColor: sidebarBackground,

    color: sidebarForeground,

    padding: "15mm 8mm 13mm",

    boxSizing: "border-box",

    display: "flex",
    flexDirection: "column",

    /*
     * Keeps the accent rail visually continuous in PDF.
     */
    printColorAdjust: "exact",
    WebkitPrintColorAdjust: "exact",
  };

  /* ==========================================================
     MAIN CONTENT
     ========================================================== */

  const mainStyle: CSSProperties = {
    minWidth: 0,

    padding: "13mm 12mm 12mm 12.5mm",

    boxSizing: "border-box",

    backgroundColor: "#FFFFFF",
  };

  const bodyTextStyle: CSSProperties = {
    margin: 0,
    color: colors.textMuted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: 400,
    lineHeight: TYPOGRAPHY.bodyLineHeight,
    overflowWrap: "anywhere",
  };

  return (
    <article
      id={id}
      className="resume-page"
      data-template="asymmetric-grid"
      data-template-id="template-one"
      data-theme={resolvedThemeId}
      data-font="aptos"
      data-typography-scale="static"
      style={pageStyle}
    >
      {/* ======================================================
          LEFT THEME IDENTITY RAIL
          ====================================================== */}

      <aside style={railStyle}>
        {/* Identity */}

        <div>
          {photo ? (
            <div
              style={{
                width: "68px",
                height: "68px",
                position: "relative",
                overflow: "hidden",
                borderRadius: "7px",
                marginBottom: "14px",

                border: `2px solid ${sidebarForeground}`,

                backgroundColor:
                  sidebarForeground === "#FFFFFF"
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(17,24,39,0.08)",
              }}
            >
              <Image
                src={photo}
                alt={fullName}
                fill
                sizes="68px"
                unoptimized
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          ) : (
            <div
              aria-hidden="true"
              style={{
                width: "34px",
                height: "3px",
                marginBottom: "17px",

                backgroundColor: sidebarForeground,

                opacity: 0.9,
              }}
            />
          )}

          {/* ==================================================
              SMALLER, LIGHTER NAME
              ================================================== */}

          <h1
            style={{
              margin: 0,

              color: sidebarForeground,

              fontSize: TYPOGRAPHY.name,

              /*
               * Much less heavy than the previous 800.
               */
              fontWeight: 650,

              letterSpacing: "-0.04em",

              lineHeight: 1.02,

              overflowWrap: "anywhere",
            }}
          >
            <span
              style={{
                display: "block",
                fontWeight: 400,
              }}
            >
              {firstName}
            </span>

            <span
              style={{
                display: "block",
                marginTop: "2px",
                fontWeight: 650,
              }}
            >
              {lastName}
            </span>
          </h1>

          {jobTitle && (
            <p
              style={{
                margin: "9px 0 0",

                color: sidebarPrimary,

                fontSize: TYPOGRAPHY.jobTitle,

                /*
                 * Not bold.
                 */
                fontWeight: 450,

                lineHeight: 1.4,

                letterSpacing: "0.025em",

                overflowWrap: "anywhere",
              }}
            >
              {jobTitle}
            </p>
          )}
        </div>

        {/* Accent divider */}

        <div
          aria-hidden="true"
          style={{
            width: "100%",
            height: "1px",
            margin: "18px 0",

            backgroundColor: sidebarBorder,
          }}
        />

        {/* ====================================================
            CONTACT
            ==================================================== */}

        {(cleanText(resume.personal.email) ||
          cleanText(resume.personal.phone) ||
          cleanText(resume.personal.location) ||
          cleanText(resume.personal.website) ||
          cleanText(resume.personal.linkedin) ||
          cleanText(resume.personal.github) ||
          cleanText(resume.personal.portfolio)) && (
          <section
            style={{
              marginBottom: "19px",
            }}
          >
            <RailHeading accent={sidebarForeground} foreground={sidebarForeground}>
              Contact
            </RailHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
              }}
            >
              {cleanText(resume.personal.email) && (
                <ContactItem
                  label="Email"
                  value={resume.personal.email}
                  href={`mailto:${resume.personal.email}`}
                  foreground={sidebarForeground}
                />
              )}

              {cleanText(resume.personal.phone) && (
                <ContactItem
                  label="Phone"
                  value={resume.personal.phone}
                  href={`tel:${resume.personal.phone}`}
                  foreground={sidebarForeground}
                />
              )}

              {cleanText(resume.personal.location) && (
                <ContactItem
                  label="Location"
                  value={resume.personal.location}
                  foreground={sidebarForeground}
                />
              )}

              {cleanText(resume.personal.website) && (
                <ContactItem
                  label="Website"
                  value={displayUrl(resume.personal.website)}
                  href={resume.personal.website}
                  foreground={sidebarForeground}
                />
              )}

              {cleanText(resume.personal.linkedin) && (
                <ContactItem
                  label="LinkedIn"
                  value={displayUrl(resume.personal.linkedin)}
                  href={resume.personal.linkedin}
                  foreground={sidebarForeground}
                />
              )}

              {cleanText(resume.personal.github) && (
                <ContactItem
                  label="GitHub"
                  value={displayUrl(resume.personal.github)}
                  href={resume.personal.github}
                  foreground={sidebarForeground}
                />
              )}

              {cleanText(resume.personal.portfolio) && (
                <ContactItem
                  label="Portfolio"
                  value={displayUrl(resume.personal.portfolio)}
                  href={resume.personal.portfolio}
                  foreground={sidebarForeground}
                />
              )}
            </div>
          </section>
        )}

        {/* ====================================================
            SKILLS
            ==================================================== */}

        {skills.length > 0 && (
          <section
            style={{
              marginBottom: "19px",
            }}
          >
            <RailHeading accent={sidebarForeground} foreground={sidebarForeground}>
              Skills
            </RailHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "7px",
              }}
            >
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "7px",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "4px",
                      height: "4px",
                      marginTop: "5px",
                      flexShrink: 0,
                      borderRadius: "50%",

                      backgroundColor: sidebarForeground,

                      opacity: 0.75,
                    }}
                  />

                  <span
                    style={{
                      color: sidebarPrimary,
                      fontSize: TYPOGRAPHY.bodySmall,

                      /*
                       * Light instead of bold.
                       */
                      fontWeight: 450,

                      lineHeight: 1.35,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ====================================================
            LANGUAGES
            ==================================================== */}

        {languages.length > 0 && (
          <section
            style={{
              marginBottom: "19px",
            }}
          >
            <RailHeading accent={sidebarForeground} foreground={sidebarForeground}>
              Languages
            </RailHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {languages.map((language) => (
                <div
                  key={language.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <span
                    style={{
                      color: sidebarPrimary,
                      fontSize: TYPOGRAPHY.bodySmall,

                      fontWeight: 550,

                      lineHeight: 1.3,
                    }}
                  >
                    {language.name}
                  </span>

                  {cleanText(language.proficiency) && (
                    <span
                      style={{
                        color: sidebarSecondary,
                        fontSize: TYPOGRAPHY.tiny,
                        fontWeight: 400,
                        lineHeight: 1.3,
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

        {/* ====================================================
            INTERESTS
            ==================================================== */}

        {interests.length > 0 && (
          <section
            style={{
              marginBottom: "19px",
            }}
          >
            <RailHeading accent={sidebarForeground} foreground={sidebarForeground}>
              Interests
            </RailHeading>

            <p
              style={{
                margin: 0,

                color: sidebarSecondary,

                fontSize: TYPOGRAPHY.bodySmall,

                fontWeight: 400,

                lineHeight: 1.55,
              }}
            >
              {interests
                .map((interest) => cleanText(interest))
                .filter(Boolean)
                .join(" · ")}
            </p>
          </section>
        )}

        {/* ====================================================
            CERTIFICATIONS
            ==================================================== */}

        {certifications.length > 0 && (
          <section
            style={{
              marginBottom: "19px",
            }}
          >
            <RailHeading accent={sidebarForeground} foreground={sidebarForeground}>
              Certifications
            </RailHeading>

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
                  }}
                >
                  <div
                    style={{
                      color: sidebarPrimary,

                      fontSize: TYPOGRAPHY.bodySmall,

                      fontWeight: 550,

                      lineHeight: 1.35,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {certification.name}
                  </div>

                  {(cleanText(certification.issuer) || cleanText(certification.issueDate)) && (
                    <div
                      style={{
                        marginTop: "2px",

                        color: sidebarSecondary,

                        fontSize: TYPOGRAPHY.tiny,

                        fontWeight: 400,

                        lineHeight: 1.35,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {certification.issuer}

                      {certification.issuer && certification.issueDate ? " · " : ""}

                      {certification.issueDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ====================================================
            AWARDS
            ==================================================== */}

        {awards.length > 0 && (
          <section>
            <RailHeading accent={sidebarForeground} foreground={sidebarForeground}>
              Awards
            </RailHeading>

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
                  }}
                >
                  <div
                    style={{
                      color: sidebarPrimary,

                      fontSize: TYPOGRAPHY.bodySmall,

                      fontWeight: 550,

                      lineHeight: 1.35,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {award.title}
                  </div>

                  {(cleanText(award.issuer) || cleanText(award.date)) && (
                    <div
                      style={{
                        marginTop: "2px",

                        color: sidebarSecondary,

                        fontSize: TYPOGRAPHY.tiny,

                        fontWeight: 400,

                        lineHeight: 1.35,

                        overflowWrap: "anywhere",
                      }}
                    >
                      {award.issuer}

                      {award.issuer && award.date ? " · " : ""}

                      {award.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* ======================================================
          RIGHT MAIN CONTENT
          ====================================================== */}

      <main style={mainStyle}>
        {/* Top accent bar */}

        <div
          aria-hidden="true"
          style={{
            width: "100%",
            height: "4px",
            marginBottom: "19px",

            background: `linear-gradient(
              to right,
              ${colors.accent} 0 72px,
              ${colors.border} 72px 100%
            )`,
          }}
        />

        {/* ====================================================
            PROFILE
            ==================================================== */}

        {summary && (
          <section
            style={{
              marginBottom: TYPOGRAPHY.sectionGap,
            }}
          >
            <SectionHeading accent={colors.accent}>Profile</SectionHeading>

            <p style={bodyTextStyle}>{summary}</p>
          </section>
        )}

        {/* ====================================================
            EXPERIENCE
            ==================================================== */}

        {experience.length > 0 && (
          <section
            style={{
              marginBottom: TYPOGRAPHY.sectionGap,
            }}
          >
            <SectionHeading accent={colors.accent}>Experience</SectionHeading>

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
                    paddingLeft: "13px",

                    borderLeft: `1px solid ${colors.border}`,

                    breakInside: "avoid",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-4px",
                      top: "3px",
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",

                      backgroundColor: colors.accent,

                      boxShadow: "0 0 0 3px #FFFFFF",
                    }}
                  />

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
                          fontWeight: 750,
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
                            fontWeight: 650,
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
                    fontSize={TYPOGRAPHY.body}
                    lineHeight={TYPOGRAPHY.bodyLineHeight}
                  />
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ====================================================
            EDUCATION
            ==================================================== */}

        {education.length > 0 && (
          <section
            style={{
              marginBottom: TYPOGRAPHY.sectionGap,
            }}
          >
            <SectionHeading accent={colors.accent}>Education</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  education.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                gap: "11px 17px",
              }}
            >
              {education.map((item) => (
                <article
                  key={item.id}
                  style={{
                    padding: "10px 11px",

                    border: `1px solid ${colors.border}`,
                    borderTop: `2px solid ${colors.accent}`,

                    backgroundColor: colors.background,

                    breakInside: "avoid",

                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: TYPOGRAPHY.body,
                        fontWeight: 750,
                        lineHeight: 1.3,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {item.degree}

                      {cleanText(item.fieldOfStudy) ? ` — ${item.fieldOfStudy}` : ""}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color: colors.accent,
                        fontSize: TYPOGRAPHY.bodySmall,
                        fontWeight: 650,
                        lineHeight: 1.35,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {item.institution}

                      {cleanText(item.location) ? ` · ${item.location}` : ""}
                    </p>

                    <DateRange
                      startDate={item.startDate}
                      endDate={item.endDate}
                      current={item.current}
                      color={colors.textSubtle}
                    />

                    {(cleanText(item.grade) || cleanText(item.description)) && (
                      <p
                        style={{
                          margin: "3px 0 0",
                          color: colors.textMuted,
                          fontSize: TYPOGRAPHY.bodySmall,
                          lineHeight: 1.45,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {[item.grade, item.description].map(cleanText).filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ====================================================
            PROJECTS
            ==================================================== */}

        {projects.length > 0 && (
          <section
            style={{
              marginBottom: TYPOGRAPHY.sectionGap,
            }}
          >
            <SectionHeading accent={colors.accent}>Selected Projects</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  projects.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                gap: "11px 17px",
              }}
            >
              {projects.map((project) => {
                const technologies = projectTechnologies(project);

                return (
                  <article
                    key={project.id}
                    style={{
                      padding: "10px 11px 11px",

                      border: `1px solid ${colors.border}`,
                      borderLeft: `3px solid ${colors.accent}`,

                      breakInside: "avoid",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "9px",
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
                            fontWeight: 750,
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
                              fontWeight: 650,
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
                              padding: "3px 6px",
                              borderRadius: "3px",

                              backgroundColor: colors.background,

                              border: `1px solid ${colors.border}`,

                              color: colors.textMuted,

                              fontSize: TYPOGRAPHY.tiny,

                              fontWeight: 600,

                              lineHeight: 1.25,

                              overflowWrap: "anywhere",
                            }}
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}

                    {safeArray(project.achievements).length > 0 && (
                      <BulletList
                        items={safeArray(project.achievements)}
                        textColor={colors.textMuted}
                        fontSize={TYPOGRAPHY.bodySmall}
                        lineHeight={1.4}
                      />
                    )}

                    {(cleanText(project.url) || cleanText(project.github)) && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "5px 12px",
                          marginTop: "7px",
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
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ====================================================
            PUBLICATIONS
            ==================================================== */}

        {publications.length > 0 && (
          <section
            style={{
              marginBottom: TYPOGRAPHY.sectionGap,
            }}
          >
            <SectionHeading accent={colors.accent}>Publications</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {publications.map((publication) => (
                <article
                  key={publication.id}
                  style={{
                    paddingBottom: "9px",
                    borderBottom: `1px solid ${colors.border}`,
                    breakInside: "avoid",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: TYPOGRAPHY.body,
                      fontWeight: 750,
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
                        fontWeight: 650,
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
                        marginTop: "5px",
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
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ====================================================
            VOLUNTEER
            ==================================================== */}

        {volunteer.length > 0 && (
          <section
            style={{
              marginBottom: TYPOGRAPHY.sectionGap,
            }}
          >
            <SectionHeading accent={colors.accent}>Volunteer Experience</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: TYPOGRAPHY.itemGap,
              }}
            >
              {volunteer.map((item) => (
                <article
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto",
                    gap: "10px",
                    paddingBottom: "10px",
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
                        fontWeight: 750,
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
                        fontWeight: 650,
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

        {/* ====================================================
            REFERENCES
            ==================================================== */}

        {references.length > 0 && (
          <section
            style={{
              marginBottom: TYPOGRAPHY.sectionGap,
            }}
          >
            <SectionHeading accent={colors.accent}>References</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  references.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                gap: "10px 17px",
              }}
            >
              {references.map((reference) => (
                <article
                  key={reference.id}
                  style={{
                    padding: "9px 10px",
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
                      fontWeight: 750,
                      lineHeight: 1.3,
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
                        fontWeight: 400,
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
                        fontWeight: 400,
                        lineHeight: 1.4,
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

        {/* ====================================================
            CUSTOM SECTIONS
            ==================================================== */}

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
                  <SectionHeading accent={colors.accent}>{section.title}</SectionHeading>
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
                      gap: "9px",
                    }}
                  >
                    {items.map((item) => (
                      <article
                        key={item.id}
                        style={{
                          padding: "8px 10px",

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
                            gap: "10px",
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              color: colors.text,
                              fontSize: TYPOGRAPHY.body,
                              fontWeight: 750,
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
                                fontWeight: 400,
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
                              fontWeight: 650,
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

        {/* ====================================================
            EMPTY MAIN CONTENT FALLBACK
            ==================================================== */}

        {!summary &&
          experience.length === 0 &&
          education.length === 0 &&
          projects.length === 0 &&
          publications.length === 0 &&
          volunteer.length === 0 &&
          references.length === 0 &&
          customSections.length === 0 && (
            <section>
              <SectionHeading accent={colors.accent}>Professional Profile</SectionHeading>

              <p style={bodyTextStyle}>
                Add your professional summary, experience, education, projects, or other resume
                sections to build your profile.
              </p>
            </section>
          )}
      </main>

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

        .resume-page *,
        .resume-page *::before,
        .resume-page *::after {
          box-sizing: border-box;
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

            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          a {
            color: inherit;
          }
        }
      `}</style>
    </article>
  );
}

export default TemplateOne;
