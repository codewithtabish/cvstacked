"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import type { ResumeData } from "@/data/resume";
import { DEFAULT_RESUME_DESIGN, RESUME_THEMES } from "@/data/resume-design";

interface TemplateFourProps {
  resume: ResumeData;
  id?: string;
}

/* ============================================================
   TEMPLATE FOUR
   ============================================================

   PREMIUM EDITORIAL FRAME

   - Distinct from Templates 1, 2 and 3
   - Dynamic theme accent
   - Hardcoded premium typography
   - A4 / PDF optimized
   - Every section optional
   - No empty layout gaps
   - No font-family settings from resume design
   - No typography-scale settings from resume design
   - Print safe
   ============================================================ */

/* ============================================================
   TYPOGRAPHY
   ============================================================ */

const TYPOGRAPHY = {
  name: "27pt",
  jobTitle: "10pt",

  section: "9.4pt",
  sectionSmall: "7.8pt",

  body: "9.15pt",
  bodySmall: "8.45pt",

  metadata: "7.7pt",
  tiny: "7.15pt",

  bodyLineHeight: 1.48,
  compactLineHeight: 1.34,

  sectionGap: "17px",
  itemGap: "12px",
} as const;

/* ============================================================
   FONT
   ============================================================ */

const FONT_FAMILY = '"Aptos", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

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
   SECTION HEADING
   ============================================================ */

function SectionHeading({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        marginBottom: "10px",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "4px",
          height: "18px",
          flexShrink: 0,
          backgroundColor: accent,
        }}
      />

      <h2
        style={{
          margin: 0,
          color: "#18202A",
          fontSize: TYPOGRAPHY.section,
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </h2>
    </div>
  );
}

/* ============================================================
   RAIL HEADING
   ============================================================ */

function RailHeading({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        marginBottom: "8px",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "13px",
          height: "1px",
          flexShrink: 0,
          backgroundColor: accent,
        }}
      />

      <span
        style={{
          color: "rgba(255,255,255,0.70)",
          fontSize: TYPOGRAPHY.sectionSmall,
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
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
        fontSize: TYPOGRAPHY.metadata,
        fontWeight: 500,
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
        wordBreak: "break-word",
      }}
    >
      {children}
    </a>
  );
}

/* ============================================================
   BULLET LIST
   ============================================================ */

function BulletList({
  items,
  textColor,
  fontSize = TYPOGRAPHY.body,
}: {
  items: string[];
  textColor: string;
  fontSize?: string;
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
            lineHeight: TYPOGRAPHY.bodyLineHeight,
            overflowWrap: "anywhere",
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
              opacity: 0.55,
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
   CONTACT ITEM
   ============================================================ */

function ContactItem({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div
      style={{
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}
    >
      <span
        style={{
          color: "rgba(255,255,255,0.38)",
          fontSize: TYPOGRAPHY.tiny,
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>

      {href ? (
        <LinkText
          href={href}
          color="rgba(255,255,255,0.84)"
          fontSize={TYPOGRAPHY.bodySmall}
          fontWeight={400}
        >
          {value}
        </LinkText>
      ) : (
        <span
          style={{
            color: "rgba(255,255,255,0.84)",
            fontSize: TYPOGRAPHY.bodySmall,
            fontWeight: 400,
            lineHeight: 1.38,
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
   SMALL INFO CARD
   ============================================================ */

function InfoCard({
  title,
  subtitle,
  date,
  accent,
  textColor,
  mutedColor,
}: {
  title: string;
  subtitle?: string;
  date?: string;
  accent: string;
  textColor: string;
  mutedColor: string;
}) {
  return (
    <article
      style={{
        position: "relative",
        minWidth: 0,
        padding: "9px 10px 9px 12px",
        border: `1px solid ${colorsafe(accent, "#D9DEE5")}`,
        borderLeft: `2px solid ${accent}`,
        breakInside: "avoid",
        boxSizing: "border-box",
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
        <h3
          style={{
            minWidth: 0,
            margin: 0,
            color: textColor,
            fontSize: TYPOGRAPHY.bodySmall,
            fontWeight: 650,
            lineHeight: 1.32,
            overflowWrap: "anywhere",
          }}
        >
          {title}
        </h3>

        {date && (
          <span
            style={{
              color: mutedColor,
              fontSize: TYPOGRAPHY.tiny,
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {date}
          </span>
        )}
      </div>

      {subtitle && (
        <p
          style={{
            margin: "3px 0 0",
            color: accent,
            fontSize: TYPOGRAPHY.tiny,
            fontWeight: 600,
            lineHeight: 1.35,
            overflowWrap: "anywhere",
          }}
        >
          {subtitle}
        </p>
      )}
    </article>
  );
}

/* ============================================================
   SAFE BORDER HELPER
   ============================================================ */

function colorsafe(value: string, fallback: string): string {
  return cleanText(value) || fallback;
}

/* ============================================================
   TEMPLATE FOUR
   ============================================================ */

export function TemplateFour({ resume, id = "resume-page" }: TemplateFourProps) {
  /* ==========================================================
     THEME
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
     PAGE
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

  /* ==========================================================
     HEADER
     ========================================================== */

  const headerStyle: CSSProperties = {
    position: "relative",
    minHeight: "58mm",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 48mm",
    backgroundColor: colors.accent,
    color: "#FFFFFF",
    overflow: "hidden",
    boxSizing: "border-box",
  };

  /* ==========================================================
     BODY
     ========================================================== */

  const bodyStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "48mm minmax(0, 1fr)",
    flex: 1,
    minHeight: 0,
  };

  /* ==========================================================
     RAIL
     ========================================================== */

  const railStyle: CSSProperties = {
    minWidth: 0,
    backgroundColor: "#17202A",
    color: "#FFFFFF",
    padding: "10mm 7.5mm 12mm",
    boxSizing: "border-box",
  };

  /* ==========================================================
     MAIN
     ========================================================== */

  const mainStyle: CSSProperties = {
    minWidth: 0,
    padding: "10mm 12mm 12mm",
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",
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
      data-template="editorial-frame"
      data-template-id="template-four"
      data-theme={resolvedThemeId}
      data-font="aptos"
      data-typography-scale="static"
      style={pageStyle}
    >
      {/* ======================================================
          HEADER
          ====================================================== */}

      <header style={headerStyle}>
        {/* Decorative geometry */}

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "30mm",
            top: "-20mm",
            width: "54mm",
            height: "54mm",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.17)",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "9mm",
            bottom: "-25mm",
            width: "45mm",
            height: "45mm",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.11)",
          }}
        />

        {/* Name */}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            minWidth: 0,
            padding: "12mm 9mm 9mm 13mm",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "20px",
                height: "2px",
                backgroundColor: "#FFFFFF",
                opacity: 0.82,
              }}
            />

            <span
              style={{
                color: "rgba(255,255,255,0.67)",
                fontSize: TYPOGRAPHY.tiny,
                fontWeight: 500,
                letterSpacing: "0.17em",
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
              maxWidth: "122mm",
              color: "#FFFFFF",
              fontSize: TYPOGRAPHY.name,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
              overflowWrap: "anywhere",
            }}
          >
            {firstName} {lastName}
          </h1>

          {jobTitle && (
            <p
              style={{
                margin: "8px 0 0",
                maxWidth: "105mm",
                color: "rgba(255,255,255,0.74)",
                fontSize: TYPOGRAPHY.jobTitle,
                fontWeight: 400,
                lineHeight: 1.4,
                letterSpacing: "0.025em",
                overflowWrap: "anywhere",
              }}
            >
              {jobTitle}
            </p>
          )}
        </div>

        {/* Header photo / profile block */}

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8mm",
            borderLeft: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {photo ? (
            <div
              style={{
                position: "relative",
                width: "35mm",
                height: "35mm",
                overflow: "hidden",
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.78)",
                backgroundColor: "rgba(255,255,255,0.10)",
              }}
            >
              <Image
                src={photo}
                alt={fullName}
                fill
                sizes="132px"
                unoptimized
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: "35mm",
                height: "35mm",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.75)",
                fontSize: "18pt",
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              {firstName.charAt(0)}
              {lastName.charAt(0)}
            </div>
          )}
        </div>
      </header>

      {/* ======================================================
          BODY
          ====================================================== */}

      <div style={bodyStyle}>
        {/* ====================================================
            LEFT RAIL
            ==================================================== */}

        <aside style={railStyle}>
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
                marginBottom: "19px",
                breakInside: "avoid",
              }}
            >
              <RailHeading accent={colors.accent}>Contact</RailHeading>

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
                  />
                )}

                {cleanText(resume.personal.phone) && (
                  <ContactItem
                    label="Phone"
                    value={resume.personal.phone}
                    href={`tel:${resume.personal.phone}`}
                  />
                )}

                {cleanText(resume.personal.location) && (
                  <ContactItem label="Location" value={resume.personal.location} />
                )}

                {cleanText(resume.personal.website) && (
                  <ContactItem
                    label="Website"
                    value={displayUrl(resume.personal.website)}
                    href={resume.personal.website}
                  />
                )}

                {cleanText(resume.personal.linkedin) && (
                  <ContactItem
                    label="LinkedIn"
                    value={displayUrl(resume.personal.linkedin)}
                    href={resume.personal.linkedin}
                  />
                )}

                {cleanText(resume.personal.github) && (
                  <ContactItem
                    label="GitHub"
                    value={displayUrl(resume.personal.github)}
                    href={resume.personal.github}
                  />
                )}

                {cleanText(resume.personal.portfolio) && (
                  <ContactItem
                    label="Portfolio"
                    value={displayUrl(resume.personal.portfolio)}
                    href={resume.personal.portfolio}
                  />
                )}
              </div>
            </section>
          )}

          {/* SKILLS */}

          {skills.length > 0 && (
            <section
              style={{
                marginBottom: "19px",
                breakInside: "avoid",
              }}
            >
              <RailHeading accent={colors.accent}>Expertise</RailHeading>

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
                      minWidth: 0,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "3px",
                        height: "3px",
                        marginTop: "5px",
                        flexShrink: 0,
                        borderRadius: "50%",
                        backgroundColor: colors.accent,
                      }}
                    />

                    <span
                      style={{
                        color: "rgba(255,255,255,0.79)",
                        fontSize: TYPOGRAPHY.bodySmall,
                        fontWeight: 400,
                        lineHeight: 1.38,
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

          {/* LANGUAGES */}

          {languages.length > 0 && (
            <section
              style={{
                marginBottom: "19px",
                breakInside: "avoid",
              }}
            >
              <RailHeading accent={colors.accent}>Languages</RailHeading>

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
                        color: "rgba(255,255,255,0.86)",
                        fontSize: TYPOGRAPHY.bodySmall,
                        fontWeight: 500,
                        lineHeight: 1.3,
                      }}
                    >
                      {language.name}
                    </span>

                    {cleanText(language.proficiency) && (
                      <span
                        style={{
                          color: "rgba(255,255,255,0.43)",
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

          {/* INTERESTS */}

          {interests.length > 0 && (
            <section
              style={{
                marginBottom: "19px",
                breakInside: "avoid",
              }}
            >
              <RailHeading accent={colors.accent}>Interests</RailHeading>

              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.59)",
                  fontSize: TYPOGRAPHY.bodySmall,
                  fontWeight: 400,
                  lineHeight: 1.55,
                  overflowWrap: "anywhere",
                }}
              >
                {interests
                  .map((interest) => cleanText(interest))
                  .filter(Boolean)
                  .join("  ·  ")}
              </p>
            </section>
          )}

          {/* CERTIFICATIONS */}

          {certifications.length > 0 && (
            <section
              style={{
                marginBottom: "19px",
                breakInside: "avoid",
              }}
            >
              <RailHeading accent={colors.accent}>Certifications</RailHeading>

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
                    <div
                      style={{
                        color: "rgba(255,255,255,0.82)",
                        fontSize: TYPOGRAPHY.bodySmall,
                        fontWeight: 500,
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
                          color: "rgba(255,255,255,0.40)",
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
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* AWARDS */}

          {awards.length > 0 && (
            <section
              style={{
                marginBottom: "19px",
                breakInside: "avoid",
              }}
            >
              <RailHeading accent={colors.accent}>Awards</RailHeading>

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
                    <div
                      style={{
                        color: "rgba(255,255,255,0.82)",
                        fontSize: TYPOGRAPHY.bodySmall,
                        fontWeight: 500,
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
                          color: "rgba(255,255,255,0.40)",
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
                  </article>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* ====================================================
            MAIN CONTENT
            ==================================================== */}

        <main style={mainStyle}>
          {/* PROFILE */}

          {summary && (
            <section
              style={{
                marginBottom: TYPOGRAPHY.sectionGap,
                breakInside: "avoid",
              }}
            >
              <SectionHeading accent={colors.accent}>Profile</SectionHeading>

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
              <SectionHeading accent={colors.accent}>Experience</SectionHeading>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: TYPOGRAPHY.itemGap,
                }}
              >
                {experience.map((item, index) => (
                  <article
                    key={item.id}
                    style={{
                      position: "relative",
                      minWidth: 0,
                      paddingLeft: "14px",
                      paddingBottom: index < experience.length - 1 ? "3px" : 0,
                      borderLeft: `1px solid ${colors.border}`,
                      breakInside: "avoid",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: "-3.5px",
                        top: "3px",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: colors.accent,
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
                            fontWeight: 650,
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

                    <BulletList items={safeArray(item.achievements)} textColor={colors.textMuted} />
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
              <SectionHeading accent={colors.accent}>Education</SectionHeading>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    education.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                  gap: "10px 12px",
                }}
              >
                {education.map((item) => (
                  <article
                    key={item.id}
                    style={{
                      minWidth: 0,
                      padding: "9px 10px",
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      borderTop: `2px solid ${colors.accent}`,
                      breakInside: "avoid",
                      boxSizing: "border-box",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                        fontSize: TYPOGRAPHY.bodySmall,
                        fontWeight: 650,
                        lineHeight: 1.32,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {item.degree}
                      {cleanText(item.fieldOfStudy) ? ` — ${item.fieldOfStudy}` : ""}
                    </h3>

                    <p
                      style={{
                        margin: "3px 0 0",
                        color: colors.accent,
                        fontSize: TYPOGRAPHY.tiny,
                        fontWeight: 600,
                        lineHeight: 1.35,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {item.institution}
                      {cleanText(item.location) ? ` · ${item.location}` : ""}
                    </p>

                    <div style={{ marginTop: "3px" }}>
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
                          margin: "3px 0 0",
                          color: colors.textMuted,
                          fontSize: TYPOGRAPHY.tiny,
                          lineHeight: 1.4,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {[item.grade, item.description].map(cleanText).filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS */}

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
                  gap: "10px 12px",
                }}
              >
                {projects.map((project) => {
                  const technologies = projectTechnologies(project);

                  return (
                    <article
                      key={project.id}
                      style={{
                        minWidth: 0,
                        padding: "10px 11px",
                        border: `1px solid ${colors.border}`,
                        borderLeft: `3px solid ${colors.accent}`,
                        breakInside: "avoid",
                        boxSizing: "border-box",
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
                              fontSize: TYPOGRAPHY.bodySmall,
                              fontWeight: 650,
                              lineHeight: 1.32,
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
                                backgroundColor: colors.background,
                                color: colors.textMuted,
                                fontSize: TYPOGRAPHY.tiny,
                                fontWeight: 500,
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

          {/* PUBLICATIONS */}

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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <h3
                        style={{
                          minWidth: 0,
                          margin: 0,
                          color: colors.text,
                          fontSize: TYPOGRAPHY.body,
                          fontWeight: 650,
                          lineHeight: 1.32,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {publication.title}
                      </h3>

                      {cleanText(publication.date) && (
                        <span
                          style={{
                            color: colors.textSubtle,
                            fontSize: TYPOGRAPHY.metadata,
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {publication.date}
                        </span>
                      )}
                    </div>

                    {cleanText(publication.publisher) && (
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
                      <div style={{ marginTop: "5px" }}>
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

          {/* VOLUNTEER */}

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
                          fontWeight: 650,
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
              <SectionHeading accent={colors.accent}>References</SectionHeading>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    references.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                  gap: "9px 12px",
                }}
              >
                {references.map((reference) => (
                  <article
                    key={reference.id}
                    style={{
                      minWidth: 0,
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
                        fontWeight: 650,
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
                        gap: "8px",
                      }}
                    >
                      {items.map((item) => (
                        <article
                          key={item.id}
                          style={{
                            minWidth: 0,
                            padding: "8px 10px",
                            backgroundColor: colors.background,
                            borderLeft: `2px solid ${colors.accent}`,
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
                                minWidth: 0,
                                margin: 0,
                                color: colors.text,
                                fontSize: TYPOGRAPHY.body,
                                fontWeight: 650,
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

          {/* ==================================================
              EMPTY FALLBACK
              ================================================== */}

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
      </div>

      {/* ======================================================
          PRINT / PDF
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
          width: 210mm;
          min-width: 210mm;
          min-height: 297mm;
          page-break-after: auto;
          break-after: auto;
        }

        .resume-page,
        .resume-page *,
        .resume-page *::before,
        .resume-page *::after {
          box-sizing: border-box;
        }

        .resume-page h1,
        .resume-page h2,
        .resume-page h3,
        .resume-page p,
        .resume-page ul,
        .resume-page ol {
          max-width: 100%;
        }

        .resume-page article,
        .resume-page section {
          page-break-inside: auto;
        }

        .resume-page article {
          break-inside: avoid;
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

          .resume-page img {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      `}</style>
    </article>
  );
}

export default TemplateFour;
