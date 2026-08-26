"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import type { ResumeData } from "@/data/resume";
import { DEFAULT_RESUME_DESIGN, RESUME_THEMES } from "@/data/resume-design";

interface TemplateOneProps {
  resume: ResumeData;
  id?: string;
}

/*
 * TEMPLATE ONE — RESUME BUILDER / PDF SAFE
 *
 * Goals:
 * - Never render an empty section.
 * - Missing/partial resume data must never break the template.
 * - Sections can be skipped in any combination.
 * - Long content wraps instead of clipping.
 * - Cards/items avoid breaking internally when possible.
 * - A4 sizing is stable for browser preview and PDF printing.
 * - The document is allowed to grow to multiple pages naturally.
 * - No fixed-height content containers.
 * - Sidebar and main content remain independent so one long section
 *   cannot create an artificial blank/overlapping layout.
 */

const TYPOGRAPHY = {
  name: "27pt",
  jobTitle: "9.5pt",
  section: "10pt",
  sectionSmall: "8.2pt",
  body: "9.3pt",
  bodySmall: "8.7pt",
  metadata: "8.1pt",
  tiny: "7.6pt",

  bodyLineHeight: 1.48,
  compactLineHeight: 1.34,

  sectionGap: "15px",
  itemGap: "11px",
} as const;

const FONT_FAMILY = '"Aptos", "Segoe UI", Arial, Helvetica, sans-serif';

function safeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function cleanText(value?: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanUrl(value?: unknown): string {
  const trimmed = cleanText(value);

  if (!trimmed) return "";

  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function displayUrl(value?: unknown): string {
  const trimmed = cleanText(value);

  if (!trimmed) return "";

  return trimmed
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

function resolveThemeId(themeId?: unknown): string {
  const id = cleanText(themeId);

  if (id && RESUME_THEMES[id]) {
    return id;
  }

  const defaultId = cleanText(DEFAULT_RESUME_DESIGN.themeId);

  if (defaultId && RESUME_THEMES[defaultId]) {
    return defaultId;
  }

  return RESUME_THEMES.slate ? "slate" : Object.keys(RESUME_THEMES)[0] || "slate";
}

function getAccentForeground(accent: string): string {
  const value = cleanText(accent);

  if (!value) return "#FFFFFF";

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
  return foreground === "#FFFFFF" ? "rgba(255,255,255,0.76)" : "rgba(17,24,39,0.72)";
}

function getAccentSoftText(foreground: string): string {
  return foreground === "#FFFFFF" ? "rgba(255,255,255,0.58)" : "rgba(17,24,39,0.56)";
}

function getAccentBorder(foreground: string): string {
  return foreground === "#FFFFFF" ? "rgba(255,255,255,0.23)" : "rgba(17,24,39,0.18)";
}

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
    <div className="resume-section-heading">
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
          color: light ? "#FFFFFF" : "#111827",
        }}
      >
        {children}
      </h2>
    </div>
  );
}

function RailHeading({ children, foreground }: { children: ReactNode; foreground: string }) {
  const muted = getAccentMutedText(foreground);

  return (
    <div className="resume-rail-heading">
      <h2 style={{ color: muted }}>{children}</h2>
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

function BulletList({
  items,
  textColor,
  fontSize = TYPOGRAPHY.body,
  lineHeight = TYPOGRAPHY.bodyLineHeight,
}: {
  items: unknown;
  textColor: string;
  fontSize?: string;
  lineHeight?: number;
}) {
  const valid = safeArray(Array.isArray(items) ? items : [])
    .map(cleanText)
    .filter(Boolean);

  if (!valid.length) return null;

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
            wordBreak: "break-word",
            minWidth: 0,
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
          <span style={{ minWidth: 0 }}>{item}</span>
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
  startDate?: unknown;
  endDate?: unknown;
  current?: unknown;
  color: string;
}) {
  const start = cleanText(startDate);
  const end = current ? "Present" : cleanText(endDate);

  if (!start && !end) return null;

  return (
    <span
      style={{
        display: "inline-block",
        maxWidth: "100%",
        color,
        fontSize: TYPOGRAPHY.metadata,
        fontWeight: 600,
        lineHeight: 1.3,
        whiteSpace: "normal",
        overflowWrap: "anywhere",
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

function LinkText({
  href,
  children,
  color,
  fontSize = TYPOGRAPHY.bodySmall,
  fontWeight = 500,
}: {
  href?: unknown;
  children: ReactNode;
  color: string;
  fontSize?: string;
  fontWeight?: number;
}) {
  const url = cleanUrl(href);

  if (!url) return null;

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
        minWidth: 0,
      }}
    >
      {children}
    </a>
  );
}

function ContactItem({
  label,
  value,
  href,
  foreground,
}: {
  label: string;
  value?: unknown;
  href?: unknown;
  foreground: string;
}) {
  const text = cleanText(value);

  if (!text) return null;

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

      {cleanText(href) ? (
        <LinkText href={href} color={primary} fontSize={TYPOGRAPHY.bodySmall} fontWeight={450}>
          {text}
        </LinkText>
      ) : (
        <span
          style={{
            color: primary,
            fontSize: TYPOGRAPHY.bodySmall,
            fontWeight: 450,
            lineHeight: 1.4,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
}

function hasValue(value: unknown): boolean {
  return Boolean(cleanText(value));
}

export function TemplateSeven({ resume, id = "resume-page" }: TemplateOneProps) {
  /*
   * Treat the incoming object defensively. This matters when the resume
   * builder temporarily sends partially-created data while a user is
   * switching sections, importing a resume, or skipping optional fields.
   */
  const data = (resume ?? {}) as ResumeData;

  const resolvedThemeId = resolveThemeId(data.themeId);
  const theme = RESUME_THEMES[resolvedThemeId] ?? RESUME_THEMES.slate ?? RESUME_THEMES.blue;

  const colors = theme.colors;

  const sidebarBackground = colors.accent;
  const sidebarForeground = getAccentForeground(colors.accent);
  const sidebarPrimary = getAccentMutedText(sidebarForeground);
  const sidebarSecondary = getAccentSoftText(sidebarForeground);
  const sidebarBorder = getAccentBorder(sidebarForeground);

  const experience = safeArray(data.experience);
  const education = safeArray(data.education);
  const skills = safeArray(data.skills);
  const projects = safeArray(data.projects);
  const certifications = safeArray(data.certifications);
  const awards = safeArray(data.awards);
  const languages = safeArray(data.languages);
  const publications = safeArray(data.publications);
  const volunteer = safeArray(data.volunteer);
  const references = safeArray(data.references);
  const interests = safeArray(data.interests);
  const customSections = safeArray(data.customSections);

  const summary = cleanText(data.summary);

  const personal = data.personal ?? ({} as ResumeData["personal"]);

  const firstName = cleanText(personal?.firstName);
  const lastName = cleanText(personal?.lastName);
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Your Name";

  const jobTitle = cleanText(personal?.jobTitle);
  const photo = cleanText(personal?.photo);

  const contactItems = [
    {
      label: "Email",
      value: personal?.email,
      href: hasValue(personal?.email) ? `mailto:${cleanText(personal?.email)}` : "",
    },
    {
      label: "Phone",
      value: personal?.phone,
      href: hasValue(personal?.phone) ? `tel:${cleanText(personal?.phone)}` : "",
    },
    {
      label: "Location",
      value: personal?.location,
      href: "",
    },
    {
      label: "Website",
      value: displayUrl(personal?.website),
      href: personal?.website,
    },
    {
      label: "LinkedIn",
      value: displayUrl(personal?.linkedin),
      href: personal?.linkedin,
    },
    {
      label: "GitHub",
      value: displayUrl(personal?.github),
      href: personal?.github,
    },
    {
      label: "Portfolio",
      value: displayUrl(personal?.portfolio),
      href: personal?.portfolio,
    },
  ].filter((item) => hasValue(item.value));

  const projectTechnologies = (project: (typeof projects)[number]): string[] => {
    return safeArray(project?.technologies).map(cleanText).filter(Boolean);
  };

  const pageStyle: CSSProperties = {
    width: "210mm",
    minWidth: "210mm",
    minHeight: "297mm",
    boxSizing: "border-box",

    display: "grid",
    gridTemplateColumns: "58mm minmax(0, 1fr)",

    margin: "0 auto",

    backgroundColor: "#FFFFFF",
    color: colors.text,
    fontFamily: FONT_FAMILY,

    /*
     * IMPORTANT:
     * Do not use height: 297mm or overflow:hidden here.
     * The resume must be allowed to become multiple A4 pages when content
     * is longer than one page.
     */
    overflow: "visible",

    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  };

  const railStyle: CSSProperties = {
    minWidth: 0,
    backgroundColor: sidebarBackground,
    color: sidebarForeground,

    padding: "15mm 8mm 13mm",
    boxSizing: "border-box",

    display: "flex",
    flexDirection: "column",

    printColorAdjust: "exact",
    WebkitPrintColorAdjust: "exact",

    /*
     * Keep long URLs and unusual imported text from forcing the rail wider.
     */
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  };

  const mainStyle: CSSProperties = {
    minWidth: 0,
    padding: "13mm 12mm 12mm 12.5mm",
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",

    /*
     * Never clip generated resume content.
     */
    overflow: "visible",
  };

  const bodyTextStyle: CSSProperties = {
    margin: 0,
    color: colors.textMuted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: 400,
    lineHeight: TYPOGRAPHY.bodyLineHeight,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  };

  const sectionStyle: CSSProperties = {
    marginBottom: TYPOGRAPHY.sectionGap,
    minWidth: 0,
  };

  const itemStyle: CSSProperties = {
    breakInside: "avoid",
    pageBreakInside: "avoid",
    minWidth: 0,
  };

  const hasMainContent =
    Boolean(summary) ||
    experience.length > 0 ||
    education.length > 0 ||
    projects.length > 0 ||
    publications.length > 0 ||
    volunteer.length > 0 ||
    references.length > 0 ||
    customSections.some((section) => {
      const items = safeArray(section?.items);
      return hasValue(section?.title) || hasValue(section?.description) || items.length > 0;
    });

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
      {/* ============================================================
          LEFT IDENTITY / SUPPORTING INFORMATION RAIL
          ============================================================ */}
      <aside style={railStyle}>
        <div style={{ minWidth: 0 }}>
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
                style={{ objectFit: "cover" }}
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

          <h1
            style={{
              margin: 0,
              color: sidebarForeground,
              fontSize: TYPOGRAPHY.name,
              fontWeight: 650,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {firstName ? (
              <span style={{ display: "block", fontWeight: 400 }}>{firstName}</span>
            ) : null}

            {lastName ? (
              <span
                style={{
                  display: "block",
                  marginTop: firstName ? "2px" : 0,
                  fontWeight: 650,
                }}
              >
                {lastName}
              </span>
            ) : null}

            {!firstName && !lastName ? (
              <span style={{ display: "block", fontWeight: 500 }}>Your Name</span>
            ) : null}
          </h1>

          {jobTitle && (
            <p
              style={{
                margin: "9px 0 0",
                color: sidebarPrimary,
                fontSize: TYPOGRAPHY.jobTitle,
                fontWeight: 450,
                lineHeight: 1.4,
                letterSpacing: "0.025em",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {jobTitle}
            </p>
          )}
        </div>

        {/* Contact */}
        {contactItems.length > 0 && (
          <section
            style={{
              marginTop: "18px",
              marginBottom: "19px",
              paddingTop: "18px",
              borderTop: `1px solid ${sidebarBorder}`,
              minWidth: 0,
            }}
          >
            <RailHeading foreground={sidebarForeground}>Contact</RailHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
                minWidth: 0,
              }}
            >
              {contactItems.map((item) => (
                <ContactItem
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  href={item.href}
                  foreground={sidebarForeground}
                />
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: "19px", minWidth: 0 }}>
            <RailHeading foreground={sidebarForeground}>Skills</RailHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "7px",
                minWidth: 0,
              }}
            >
              {skills.map((skill, index) => {
                const name = cleanText(skill?.name);
                if (!name) return null;

                return (
                  <div
                    key={skill?.id || `${name}-${index}`}
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
                        fontWeight: 450,
                        lineHeight: 1.35,
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                        minWidth: 0,
                      }}
                    >
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section style={{ marginBottom: "19px", minWidth: 0 }}>
            <RailHeading foreground={sidebarForeground}>Languages</RailHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                minWidth: 0,
              }}
            >
              {languages.map((language, index) => {
                const name = cleanText(language?.name);
                const proficiency = cleanText(language?.proficiency);

                if (!name && !proficiency) return null;

                return (
                  <div
                    key={language?.id || `${name}-${index}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      minWidth: 0,
                      breakInside: "avoid",
                      pageBreakInside: "avoid",
                    }}
                  >
                    {name && (
                      <span
                        style={{
                          color: sidebarPrimary,
                          fontSize: TYPOGRAPHY.bodySmall,
                          fontWeight: 550,
                          lineHeight: 1.3,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {name}
                      </span>
                    )}

                    {proficiency && (
                      <span
                        style={{
                          color: sidebarSecondary,
                          fontSize: TYPOGRAPHY.tiny,
                          fontWeight: 400,
                          lineHeight: 1.3,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {proficiency}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Interests */}
        {interests.filter((item) => hasValue(item)).length > 0 && (
          <section style={{ marginBottom: "19px", minWidth: 0 }}>
            <RailHeading foreground={sidebarForeground}>Interests</RailHeading>

            <p
              style={{
                margin: 0,
                color: sidebarSecondary,
                fontSize: TYPOGRAPHY.bodySmall,
                fontWeight: 400,
                lineHeight: 1.55,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {interests.map(cleanText).filter(Boolean).join(" · ")}
            </p>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section style={{ marginBottom: "19px", minWidth: 0 }}>
            <RailHeading foreground={sidebarForeground}>Certifications</RailHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
                minWidth: 0,
              }}
            >
              {certifications.map((certification, index) => {
                const name = cleanText(certification?.name);
                const issuer = cleanText(certification?.issuer);
                const issueDate = cleanText(certification?.issueDate);

                if (!name && !issuer && !issueDate) return null;

                return (
                  <div key={certification?.id || `${name}-${issuer}-${index}`} style={itemStyle}>
                    {name && (
                      <div
                        style={{
                          color: sidebarPrimary,
                          fontSize: TYPOGRAPHY.bodySmall,
                          fontWeight: 550,
                          lineHeight: 1.35,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {name}
                      </div>
                    )}

                    {(issuer || issueDate) && (
                      <div
                        style={{
                          marginTop: "2px",
                          color: sidebarSecondary,
                          fontSize: TYPOGRAPHY.tiny,
                          fontWeight: 400,
                          lineHeight: 1.35,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {issuer}
                        {issuer && issueDate ? " · " : ""}
                        {issueDate}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <section style={{ minWidth: 0 }}>
            <RailHeading foreground={sidebarForeground}>Awards</RailHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
                minWidth: 0,
              }}
            >
              {awards.map((award, index) => {
                const title = cleanText(award?.title);
                const issuer = cleanText(award?.issuer);
                const date = cleanText(award?.date);

                if (!title && !issuer && !date) return null;

                return (
                  <div key={award?.id || `${title}-${index}`} style={itemStyle}>
                    {title && (
                      <div
                        style={{
                          color: sidebarPrimary,
                          fontSize: TYPOGRAPHY.bodySmall,
                          fontWeight: 550,
                          lineHeight: 1.35,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {title}
                      </div>
                    )}

                    {(issuer || date) && (
                      <div
                        style={{
                          marginTop: "2px",
                          color: sidebarSecondary,
                          fontSize: TYPOGRAPHY.tiny,
                          fontWeight: 400,
                          lineHeight: 1.35,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {issuer}
                        {issuer && date ? " · " : ""}
                        {date}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </aside>

      {/* ============================================================
          MAIN CONTENT
          ============================================================ */}
      <main style={mainStyle}>
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

        {/* Profile */}
        {summary && (
          <section style={sectionStyle}>
            <SectionHeading accent={colors.accent}>Profile</SectionHeading>
            <p style={bodyTextStyle}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={sectionStyle}>
            <SectionHeading accent={colors.accent}>Experience</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: TYPOGRAPHY.itemGap,
                minWidth: 0,
              }}
            >
              {experience.map((item, index) => {
                const position = cleanText(item?.position);
                const company = cleanText(item?.company);
                const location = cleanText(item?.location);
                const description = cleanText(item?.description);
                const achievements = safeArray(item?.achievements);

                if (
                  !position &&
                  !company &&
                  !location &&
                  !description &&
                  achievements.length === 0 &&
                  !hasValue(item?.startDate) &&
                  !hasValue(item?.endDate)
                ) {
                  return null;
                }

                return (
                  <article
                    key={item?.id || `experience-${index}`}
                    style={{
                      position: "relative",
                      paddingLeft: "13px",
                      borderLeft: `1px solid ${colors.border}`,
                      ...itemStyle,
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
                        gap: "10px",
                        minWidth: 0,
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        {position && (
                          <h3
                            style={{
                              margin: 0,
                              color: colors.text,
                              fontSize: TYPOGRAPHY.body,
                              fontWeight: 750,
                              lineHeight: 1.3,
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                            }}
                          >
                            {position}
                          </h3>
                        )}

                        {company && (
                          <p
                            style={{
                              margin: "2px 0 0",
                              color: colors.accent,
                              fontSize: TYPOGRAPHY.bodySmall,
                              fontWeight: 650,
                              lineHeight: 1.35,
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                            }}
                          >
                            {company}
                            {location ? ` · ${location}` : ""}
                          </p>
                        )}
                      </div>

                      <DateRange
                        startDate={item?.startDate}
                        endDate={item?.endDate}
                        current={item?.current}
                        color={colors.textSubtle}
                      />
                    </div>

                    {description && (
                      <p
                        style={{
                          ...bodyTextStyle,
                          marginTop: "5px",
                        }}
                      >
                        {description}
                      </p>
                    )}

                    <BulletList items={achievements} textColor={colors.textMuted} />
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={sectionStyle}>
            <SectionHeading accent={colors.accent}>Education</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  education.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                gap: "10px 15px",
                minWidth: 0,
              }}
            >
              {education.map((item, index) => {
                const degree = cleanText(item?.degree);
                const field = cleanText(item?.fieldOfStudy);
                const institution = cleanText(item?.institution);
                const location = cleanText(item?.location);
                const grade = cleanText(item?.grade);
                const description = cleanText(item?.description);

                if (
                  !degree &&
                  !field &&
                  !institution &&
                  !location &&
                  !grade &&
                  !description &&
                  !hasValue(item?.startDate) &&
                  !hasValue(item?.endDate)
                ) {
                  return null;
                }

                return (
                  <article
                    key={item?.id || `education-${index}`}
                    style={{
                      padding: "9px 10px",
                      border: `1px solid ${colors.border}`,
                      borderTop: `2px solid ${colors.accent}`,
                      backgroundColor: colors.background,
                      ...itemStyle,
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        minWidth: 0,
                      }}
                    >
                      {(degree || field) && (
                        <h3
                          style={{
                            margin: 0,
                            color: colors.text,
                            fontSize: TYPOGRAPHY.body,
                            fontWeight: 750,
                            lineHeight: 1.3,
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                          }}
                        >
                          {degree}
                          {field ? ` — ${field}` : ""}
                        </h3>
                      )}

                      {institution && (
                        <p
                          style={{
                            margin: 0,
                            color: colors.accent,
                            fontSize: TYPOGRAPHY.bodySmall,
                            fontWeight: 650,
                            lineHeight: 1.35,
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                          }}
                        >
                          {institution}
                          {location ? ` · ${location}` : ""}
                        </p>
                      )}

                      <DateRange
                        startDate={item?.startDate}
                        endDate={item?.endDate}
                        current={item?.current}
                        color={colors.textSubtle}
                      />

                      {(grade || description) && (
                        <p
                          style={{
                            margin: "3px 0 0",
                            color: colors.textMuted,
                            fontSize: TYPOGRAPHY.bodySmall,
                            lineHeight: 1.45,
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                          }}
                        >
                          {[grade, description].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={sectionStyle}>
            <SectionHeading accent={colors.accent}>Selected Projects</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  projects.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                gap: "10px 15px",
                minWidth: 0,
              }}
            >
              {projects.map((project, index) => {
                const technologies = projectTechnologies(project);
                const name = cleanText(project?.name);
                const role = cleanText(project?.role);
                const description = cleanText(project?.description);
                const url = cleanText(project?.url);
                const github = cleanText(project?.github);
                const achievements = safeArray(project?.achievements);

                if (
                  !name &&
                  !role &&
                  !description &&
                  !url &&
                  !github &&
                  technologies.length === 0 &&
                  achievements.length === 0
                ) {
                  return null;
                }

                return (
                  <article
                    key={project?.id || `project-${index}`}
                    style={{
                      padding: "9px 10px 10px",
                      border: `1px solid ${colors.border}`,
                      borderLeft: `3px solid ${colors.accent}`,
                      ...itemStyle,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "9px",
                        minWidth: 0,
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        {name && (
                          <h3
                            style={{
                              margin: 0,
                              color: colors.text,
                              fontSize: TYPOGRAPHY.body,
                              fontWeight: 750,
                              lineHeight: 1.3,
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                            }}
                          >
                            {name}
                          </h3>
                        )}

                        {role && (
                          <p
                            style={{
                              margin: "2px 0 0",
                              color: colors.accent,
                              fontSize: TYPOGRAPHY.bodySmall,
                              fontWeight: 650,
                              lineHeight: 1.3,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {role}
                          </p>
                        )}
                      </div>

                      <DateRange
                        startDate={project?.startDate}
                        endDate={project?.endDate}
                        color={colors.textSubtle}
                      />
                    </div>

                    {description && (
                      <p
                        style={{
                          ...bodyTextStyle,
                          marginTop: "5px",
                        }}
                      >
                        {description}
                      </p>
                    )}

                    {technologies.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                          marginTop: "7px",
                          minWidth: 0,
                        }}
                      >
                        {technologies.map((technology, technologyIndex) => (
                          <span
                            key={`${technology}-${technologyIndex}`}
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
                              wordBreak: "break-word",
                            }}
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}

                    <BulletList
                      items={achievements}
                      textColor={colors.textMuted}
                      fontSize={TYPOGRAPHY.bodySmall}
                      lineHeight={1.4}
                    />

                    {(url || github) && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "5px 12px",
                          marginTop: "7px",
                          minWidth: 0,
                        }}
                      >
                        {url && (
                          <LinkText href={url} color={colors.accent} fontSize={TYPOGRAPHY.tiny}>
                            {displayUrl(url)}
                          </LinkText>
                        )}

                        {github && (
                          <LinkText href={github} color={colors.accent} fontSize={TYPOGRAPHY.tiny}>
                            {displayUrl(github)}
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

        {/* Publications */}
        {publications.length > 0 && (
          <section style={sectionStyle}>
            <SectionHeading accent={colors.accent}>Publications</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
                minWidth: 0,
              }}
            >
              {publications.map((publication, index) => {
                const title = cleanText(publication?.title);
                const publisher = cleanText(publication?.publisher);
                const date = cleanText(publication?.date);
                const description = cleanText(publication?.description);
                const url = cleanText(publication?.url);

                if (!title && !publisher && !date && !description && !url) {
                  return null;
                }

                return (
                  <article
                    key={publication?.id || `publication-${index}`}
                    style={{
                      paddingBottom: "9px",
                      borderBottom: `1px solid ${colors.border}`,
                      ...itemStyle,
                    }}
                  >
                    {title && (
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: TYPOGRAPHY.body,
                          fontWeight: 750,
                          lineHeight: 1.3,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {title}
                      </h3>
                    )}

                    {(publisher || date) && (
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
                        {publisher}
                        {publisher && date ? " · " : ""}
                        {date}
                      </p>
                    )}

                    {description && (
                      <p
                        style={{
                          ...bodyTextStyle,
                          marginTop: "4px",
                        }}
                      >
                        {description}
                      </p>
                    )}

                    {url && (
                      <div style={{ marginTop: "5px" }}>
                        <LinkText href={url} color={colors.accent} fontSize={TYPOGRAPHY.tiny}>
                          {displayUrl(url)}
                        </LinkText>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Volunteer */}
        {volunteer.length > 0 && (
          <section style={sectionStyle}>
            <SectionHeading accent={colors.accent}>Volunteer Experience</SectionHeading>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: TYPOGRAPHY.itemGap,
                minWidth: 0,
              }}
            >
              {volunteer.map((item, index) => {
                const role = cleanText(item?.role);
                const organization = cleanText(item?.organization);
                const description = cleanText(item?.description);

                if (!role && !organization && !description) {
                  return null;
                }

                return (
                  <article
                    key={item?.id || `volunteer-${index}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) minmax(0, auto)",
                      gap: "10px",
                      paddingBottom: "10px",
                      borderBottom: `1px solid ${colors.border}`,
                      ...itemStyle,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      {role && (
                        <h3
                          style={{
                            margin: 0,
                            color: colors.text,
                            fontSize: TYPOGRAPHY.body,
                            fontWeight: 750,
                            lineHeight: 1.3,
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                          }}
                        >
                          {role}
                        </h3>
                      )}

                      {organization && (
                        <p
                          style={{
                            margin: "2px 0 0",
                            color: colors.accent,
                            fontSize: TYPOGRAPHY.bodySmall,
                            fontWeight: 650,
                            lineHeight: 1.35,
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                          }}
                        >
                          {organization}
                        </p>
                      )}

                      {description && (
                        <p
                          style={{
                            ...bodyTextStyle,
                            marginTop: "4px",
                          }}
                        >
                          {description}
                        </p>
                      )}
                    </div>

                    <DateRange
                      startDate={item?.startDate}
                      endDate={item?.endDate}
                      current={item?.current}
                      color={colors.textSubtle}
                    />
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* References */}
        {references.length > 0 && (
          <section style={sectionStyle}>
            <SectionHeading accent={colors.accent}>References</SectionHeading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  references.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                gap: "10px 15px",
                minWidth: 0,
              }}
            >
              {references.map((reference, index) => {
                const name = cleanText(reference?.name);
                const position = cleanText(reference?.position);
                const company = cleanText(reference?.company);
                const email = cleanText(reference?.email);
                const phone = cleanText(reference?.phone);

                if (!name && !position && !company && !email && !phone) {
                  return null;
                }

                return (
                  <article
                    key={reference?.id || `reference-${index}`}
                    style={{
                      padding: "9px 10px",
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      ...itemStyle,
                    }}
                  >
                    {name && (
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                          fontSize: TYPOGRAPHY.bodySmall,
                          fontWeight: 750,
                          lineHeight: 1.3,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {name}
                      </h3>
                    )}

                    {(position || company) && (
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
                        {position}
                        {position && company ? " · " : ""}
                        {company}
                      </p>
                    )}

                    {(email || phone) && (
                      <p
                        style={{
                          margin: "3px 0 0",
                          color: colors.textSubtle,
                          fontSize: TYPOGRAPHY.tiny,
                          fontWeight: 400,
                          lineHeight: 1.4,
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {[email, phone].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Custom sections */}
        {customSections.map((section, sectionIndex) => {
          const items = safeArray(section?.items);
          const title = cleanText(section?.title);
          const description = cleanText(section?.description);

          const validItems = items.filter((item) => {
            return (
              hasValue(item?.title) ||
              hasValue(item?.subtitle) ||
              hasValue(item?.description) ||
              hasValue(item?.date)
            );
          });

          if (!title && !description && validItems.length === 0) {
            return null;
          }

          return (
            <section key={section?.id || `custom-section-${sectionIndex}`} style={sectionStyle}>
              {title && <SectionHeading accent={colors.accent}>{title}</SectionHeading>}

              {description && (
                <p
                  style={{
                    ...bodyTextStyle,
                    marginBottom: validItems.length > 0 ? "8px" : 0,
                  }}
                >
                  {description}
                </p>
              )}

              {validItems.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    minWidth: 0,
                  }}
                >
                  {validItems.map((item, itemIndex) => {
                    const itemTitle = cleanText(item?.title);
                    const subtitle = cleanText(item?.subtitle);
                    const itemDescription = cleanText(item?.description);
                    const date = cleanText(item?.date);

                    return (
                      <article
                        key={item?.id || `custom-item-${sectionIndex}-${itemIndex}`}
                        style={{
                          padding: "8px 10px",
                          borderLeft: `2px solid ${colors.accent}`,
                          backgroundColor: colors.background,
                          ...itemStyle,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "10px",
                            minWidth: 0,
                          }}
                        >
                          {itemTitle && (
                            <h3
                              style={{
                                margin: 0,
                                color: colors.text,
                                fontSize: TYPOGRAPHY.body,
                                fontWeight: 750,
                                lineHeight: 1.3,
                                overflowWrap: "anywhere",
                                wordBreak: "break-word",
                                minWidth: 0,
                              }}
                            >
                              {itemTitle}
                            </h3>
                          )}

                          {date && (
                            <span
                              style={{
                                color: colors.textSubtle,
                                fontSize: TYPOGRAPHY.metadata,
                                fontWeight: 400,
                                lineHeight: 1.3,
                                whiteSpace: "normal",
                                textAlign: "right",
                                overflowWrap: "anywhere",
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
                              margin: "2px 0 0",
                              color: colors.accent,
                              fontSize: TYPOGRAPHY.bodySmall,
                              fontWeight: 650,
                              lineHeight: 1.35,
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                            }}
                          >
                            {subtitle}
                          </p>
                        )}

                        {itemDescription && (
                          <p
                            style={{
                              ...bodyTextStyle,
                              marginTop: "4px",
                            }}
                          >
                            {itemDescription}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}

        {/* Empty-state fallback */}
        {!hasMainContent && (
          <section>
            <SectionHeading accent={colors.accent}>Professional Profile</SectionHeading>

            <p style={bodyTextStyle}>
              Add your professional summary, experience, education, projects, or other resume
              sections to build your profile.
            </p>
          </section>
        )}
      </main>

      {/* ============================================================
          PRINT / PDF SAFETY
          ============================================================ */}
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

        .resume-page,
        .resume-page *,
        .resume-page *::before,
        .resume-page *::after {
          box-sizing: border-box;
        }

        .resume-page {
          width: 210mm;
          min-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;

          /*
           * Never clip resume content. A long resume must be allowed
           * to continue onto another printed A4 page.
           */
          overflow: visible;

          page-break-after: auto;
          break-after: auto;

          /*
           * Prevent accidental horizontal overflow caused by very long
           * words, URLs, emails, or imported strings.
           */
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .resume-page main,
        .resume-page aside,
        .resume-page section,
        .resume-page article,
        .resume-page div {
          min-width: 0;
          max-width: 100%;
        }

        .resume-section-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          min-width: 0;
        }

        .resume-section-heading h2 {
          margin: 0;
          font-size: ${TYPOGRAPHY.section};
          font-weight: 750;
          line-height: 1.2;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          overflow-wrap: anywhere;
        }

        .resume-rail-heading {
          margin-bottom: 8px;
        }

        .resume-rail-heading h2 {
          margin: 0;
          font-size: ${TYPOGRAPHY.sectionSmall};
          font-weight: 650;
          letter-spacing: 0.14em;
          line-height: 1.25;
          text-transform: uppercase;
          overflow-wrap: anywhere;
        }

        /*
         * These are deliberately NOT global "break-inside: avoid" rules.
         * Applying avoid to an entire large section can create giant blank
         * areas in PDFs. Only individual resume items receive the rule.
         */
        .resume-page img {
          max-width: 100%;
        }

        @media screen {
          .resume-page {
            box-shadow: 0 10px 35px rgba(15, 23, 42, 0.08);
          }
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

          /*
           * Keep small headings with the content immediately following
           * them instead of leaving a heading stranded at the bottom.
           */
          .resume-section-heading {
            break-after: avoid;
            page-break-after: avoid;
          }

          a {
            color: inherit;
          }
        }
      `}</style>
    </article>
  );
}

export default TemplateSeven;
