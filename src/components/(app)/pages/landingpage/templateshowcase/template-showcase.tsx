// "use client";

// import { motion } from "framer-motion";
// import {
//   ArrowRight,
//   Award,
//   BriefcaseBusiness,
//   Check,
//   GraduationCap,
//   Languages,
//   LayoutTemplate,
//   Mail,
//   MapPin,
//   Phone,
//   Sparkles,
//   Star,
//   UserRound,
// } from "lucide-react";
// import { useMemo, useState } from "react";

// import { Button } from "@/components/ui/button";
// import { demoResumes, type ResumeData } from "@/data/resume";

// // =========================================================
// // Types
// // =========================================================

// type TemplateId =
//   | "aurora"
//   | "nova"
//   | "horizon"
//   | "eclipse"
//   | "lumen"
//   | "vertex"
//   | "atlas"
//   | "pulse";

// type ExtendedResumeData = ResumeData & {
//   projects?: Array<{
//     id?: string;
//     name?: string;
//     title?: string;
//     description?: string;
//     url?: string;
//     link?: string;
//     technologies?: string[];
//     techStack?: string[];
//     startDate?: string;
//     endDate?: string;
//   }>;

//   certifications?: Array<{
//     id?: string;
//     name?: string;
//     title?: string;
//     issuer?: string;
//     organization?: string;
//     date?: string;
//     issueDate?: string;
//     credentialId?: string;
//     url?: string;
//     link?: string;
//   }>;

//   languages?: Array<{
//     id?: string;
//     name?: string;
//     language?: string;
//     level?: string;
//     proficiency?: string;
//   }>;

//   awards?: Array<{
//     id?: string;
//     title?: string;
//     name?: string;
//     issuer?: string;
//     organization?: string;
//     date?: string;
//     description?: string;
//   }>;

//   interests?:
//     | Array<{
//         id?: string;
//         name?: string;
//       }>
//     | string[];

//   volunteer?: Array<{
//     id?: string;
//     organization?: string;
//     role?: string;
//     position?: string;
//     startDate?: string;
//     endDate?: string;
//     current?: boolean;
//     description?: string;
//     achievements?: string[];
//   }>;

//   references?: Array<{
//     id?: string;
//     name?: string;
//     position?: string;
//     company?: string;
//     email?: string;
//     phone?: string;
//   }>;
// };

// // =========================================================
// // Template Definitions
// // =========================================================

// const templates: Array<{
//   id: TemplateId;
//   name: string;
//   description: string;
//   badge: string;
//   resumeIndex: number;
// }> = [
//   {
//     id: "aurora",
//     name: "Aurora",
//     description:
//       "Elegant modern layout with strong hierarchy and a clean ATS-friendly structure.",
//     badge: "Most Popular",
//     resumeIndex: 0,
//   },
//   {
//     id: "nova",
//     name: "Nova",
//     description:
//       "Clean professional design with a refined structure for corporate and healthcare roles.",
//     badge: "Corporate",
//     resumeIndex: 1,
//   },
//   {
//     id: "horizon",
//     name: "Horizon",
//     description:
//       "Balanced two-column layout that presents skills and professional experience together.",
//     badge: "Balanced",
//     resumeIndex: 3,
//   },
//   {
//     id: "eclipse",
//     name: "Eclipse",
//     description:
//       "Confident executive layout designed for leadership, management, and technical careers.",
//     badge: "Leadership",
//     resumeIndex: 2,
//   },
//   {
//     id: "lumen",
//     name: "Lumen",
//     description:
//       "Ultra-minimal typography-first design with generous spacing and maximum readability.",
//     badge: "Minimal",
//     resumeIndex: 4,
//   },
//   {
//     id: "vertex",
//     name: "Vertex",
//     description:
//       "Modern sidebar composition with a compact information architecture for creative roles.",
//     badge: "Creative",
//     resumeIndex: 3,
//   },
//   {
//     id: "atlas",
//     name: "Atlas",
//     description:
//       "Traditional professional structure focused on clarity, consistency, and readability.",
//     badge: "Classic",
//     resumeIndex: 0,
//   },
//   {
//     id: "pulse",
//     name: "Pulse",
//     description:
//       "Contemporary visual layout with stronger section separation and a modern personality.",
//     badge: "Modern",
//     resumeIndex: 4,
//   },
// ];

// // =========================================================
// // Helpers
// // =========================================================

// function cx(...classes: Array<string | false | null | undefined>) {
//   return classes.filter(Boolean).join(" ");
// }

// function formatYear(value?: string | null) {
//   if (!value) return "";

//   const match = value.match(/\d{4}/);
//   return match?.[0] ?? value;
// }

// function formatDateRange(
//   startDate?: string,
//   endDate?: string,
//   current?: boolean,
// ) {
//   const start = formatYear(startDate);
//   const end = current ? "Present" : formatYear(endDate);

//   if (start && end) return `${start} – ${end}`;
//   if (start) return start;
//   if (end) return end;

//   return "";
// }

// function getFullName(resume: ResumeData) {
//   return `${resume.personal.firstName ?? ""} ${
//     resume.personal.lastName ?? ""
//   }`.trim();
// }

// function getExtendedResume(resume: ResumeData) {
//   return resume as ExtendedResumeData;
// }

// function SectionLabel({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div
//       className={cx(
//         "mb-1 text-[6.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground",
//         className,
//       )}
//     >
//       {children}
//     </div>
//   );
// }

// function TinyDivider() {
//   return <div className="my-2 h-px bg-border" />;
// }

// function ContactLine({
//   resume,
//   vertical = false,
// }: {
//   resume: ResumeData;
//   vertical?: boolean;
// }) {
//   const { personal } = resume;

//   const items = [
//     personal.email
//       ? {
//           key: "email",
//           icon: Mail,
//           value: personal.email,
//         }
//       : null,
//     personal.phone
//       ? {
//           key: "phone",
//           icon: Phone,
//           value: personal.phone,
//         }
//       : null,
//     personal.location
//       ? {
//           key: "location",
//           icon: MapPin,
//           value: personal.location,
//         }
//       : null,
//   ].filter(Boolean) as Array<{
//     key: string;
//     icon: React.ElementType;
//     value: string;
//   }>;

//   if (!items.length) return null;

//   return (
//     <div
//       className={cx(
//         "text-muted-foreground",
//         vertical ? "space-y-1" : "flex flex-wrap items-center gap-x-2 gap-y-1",
//       )}
//     >
//       {items.map(({ key, icon: Icon, value }) => (
//         <div key={key} className="flex min-w-0 items-center gap-1 text-[6px]">
//           {/* <Icon className="h-2.5 w-2.5 shrink-0" /> */}
//           <span className="truncate">{value}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// // =========================================================
// // Shared Full Data Sections
// // =========================================================

// function ExperienceList({
//   resume,
//   compact = false,
// }: {
//   resume: ResumeData;
//   compact?: boolean;
// }) {
//   if (!resume.experience?.length) return null;

//   return (
//     <div className={cx("space-y-2", compact && "space-y-1.5")}>
//       {resume.experience.map((exp, index) => {
//         const dateRange = formatDateRange(
//           exp.startDate,
//           exp.endDate,
//           exp.current,
//         );

//         return (
//           <div key={exp.id ?? `${exp.company}-${exp.position}-${index}`}>
//             <div className="flex items-start justify-between gap-2">
//               <div className="min-w-0">
//                 <p className="text-[7.5px] font-semibold leading-tight">
//                   {exp.position}
//                 </p>

//                 <p className="mt-0.5 text-[6.5px] text-muted-foreground">
//                   {exp.company}
//                   {exp.location ? ` · ${exp.location}` : ""}
//                 </p>
//               </div>

//               {dateRange && (
//                 <span className="shrink-0 text-[5.8px] text-muted-foreground">
//                   {dateRange}
//                 </span>
//               )}
//             </div>

//             {exp.achievements?.length > 0 && (
//               <ul className="mt-1 space-y-0.5">
//                 {exp.achievements.map((achievement, achievementIndex) => (
//                   <li
//                     key={`${exp.id ?? index}-achievement-${achievementIndex}`}
//                     className="text-[6px] leading-snug text-muted-foreground"
//                   >
//                     • {achievement}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function EducationList({
//   resume,
//   compact = false,
// }: {
//   resume: ResumeData;
//   compact?: boolean;
// }) {
//   if (!resume.education?.length) return null;

//   return (
//     <div className={cx("space-y-2", compact && "space-y-1.5")}>
//       {resume.education.map((edu, index) => {
//         const dateRange = formatDateRange(
//           edu.startDate,
//           edu.endDate,
//           edu.current,
//         );

//         return (
//           <div key={edu.id ?? `${edu.institution}-${index}`}>
//             <div className="flex items-start justify-between gap-2">
//               <div className="min-w-0">
//                 <p className="text-[7.5px] font-semibold leading-tight">
//                   {edu.degree}
//                   {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
//                 </p>

//                 <p className="mt-0.5 text-[6.5px] text-muted-foreground">
//                   {edu.institution}
//                 </p>

//                 {edu.grade && (
//                   <p className="mt-0.5 text-[6px] text-muted-foreground">
//                     Grade: {edu.grade}
//                   </p>
//                 )}
//               </div>

//               {dateRange && (
//                 <span className="shrink-0 text-[5.8px] text-muted-foreground">
//                   {dateRange}
//                 </span>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function SkillsList({
//   resume,
//   pills = true,
// }: {
//   resume: ResumeData;
//   pills?: boolean;
// }) {
//   if (!resume.skills?.length) return null;

//   return (
//     <div className={cx("flex flex-wrap gap-1", !pills && "block space-y-0.5")}>
//       {resume.skills.map((skill, index) => (
//         <span
//           key={skill.id ?? `${skill.name}-${index}`}
//           className={cx(
//             pills
//               ? "rounded bg-muted px-1.5 py-0.5 text-[5.8px] font-medium text-foreground"
//               : "block text-[6px] text-muted-foreground",
//           )}
//         >
//           {!pills && "• "}
//           {skill.name}
//         </span>
//       ))}
//     </div>
//   );
// }

// function ProjectsList({ resume }: { resume: ResumeData }) {
//   const extended = getExtendedResume(resume);

//   if (!extended.projects?.length) return null;

//   return (
//     <div className="space-y-2">
//       {extended.projects.map((project, index) => {
//         const name = project.name;
//         const technologies = project.technologies;

//         return (
//           <div key={project.id ?? `${name}-${index}`}>
//             {name && <p className="text-[7.5px] font-semibold">{name}</p>}

//             {project.description && (
//               <p className="mt-0.5 text-[6px] leading-snug text-muted-foreground">
//                 {project.description}
//               </p>
//             )}

//             {technologies!.length > 0 && (
//               <p className="mt-0.5 text-[5.8px] text-muted-foreground">
//                 {technologies!.join(" · ")}
//               </p>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function CertificationsList({ resume }: { resume: ResumeData }) {
//   const extended = getExtendedResume(resume);

//   if (!extended.certifications?.length) return null;

//   return (
//     <div className="space-y-1.5">
//       {extended.certifications.map((cert, index) => {
//         const name = cert.name ;
//         // const date = cert.date;

//         return (
//           <div key={cert.id ?? `${name}-${index}`}>
//             <p className="text-[7px] font-semibold">{name}</p>

//             {cert.credentialId && (
//               <p className="text-[5.8px] text-muted-foreground">
//                 Credential: {cert.credentialId}
//               </p>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function LanguagesList({ resume }: { resume: ResumeData }) {
//   const extended = getExtendedResume(resume);

//   if (!extended.languages?.length) return null;

//   return (
//     <div className="space-y-1">
//       {extended.languages.map((language, index) => {
//         const name = language.name ;
//         // const level = language.level ?? language.proficiency;

//         return (
//           <div
//             key={language.id ?? `${name}-${index}`}
//             className="flex items-center justify-between gap-2"
//           >
//             <span className="text-[6.5px]">{name}</span>
//             {level && (
//               <span className="text-[5.8px] text-muted-foreground">
//                 {level}
//               </span>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function AwardsList({ resume }: { resume: ResumeData }) {
//   const extended = getExtendedResume(resume);

//   if (!extended.awards?.length) return null;

//   return (
//     <div className="space-y-1.5">
//       {extended.awards.map((award, index) => {
//         const name = award.title ?? award.name;
//         const issuer = award.issuer ?? award.organization;

//         return (
//           <div key={award.id ?? `${name}-${index}`}>
//             <p className="text-[7px] font-semibold">{name}</p>

//             {(issuer || award.date) && (
//               <p className="text-[6px] text-muted-foreground">
//                 {issuer}
//                 {issuer && award.date ? " · " : ""}
//                 {award.date}
//               </p>
//             )}

//             {award.description && (
//               <p className="mt-0.5 text-[5.8px] leading-snug text-muted-foreground">
//                 {award.description}
//               </p>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function VolunteerList({ resume }: { resume: ResumeData }) {
//   const extended = getExtendedResume(resume);

//   if (!extended.volunteer?.length) return null;

//   return (
//     <div className="space-y-1.5">
//       {extended.volunteer.map((item, index) => {
//         const role = item.role ?? item.position;
//         const dateRange = formatDateRange(
//           item.startDate,
//           item.endDate,
//           item.current,
//         );

//         return (
//           <div key={item.id ?? `${item.organization}-${index}`}>
//             <div className="flex items-start justify-between gap-2">
//               <div>
//                 <p className="text-[7px] font-semibold">{role}</p>
//                 <p className="text-[6px] text-muted-foreground">
//                   {item.organization}
//                 </p>
//               </div>

//               {dateRange && (
//                 <span className="shrink-0 text-[5.5px] text-muted-foreground">
//                   {dateRange}
//                 </span>
//               )}
//             </div>

//             {item.description && (
//               <p className="mt-0.5 text-[5.8px] leading-snug text-muted-foreground">
//                 {item.description}
//               </p>
//             )}

//             {item.achievements?.length ? (
//               <ul className="mt-0.5 space-y-0.5">
//                 {item.achievements.map(
//                   (achievement: any, achievementIndex: any) => (
//                     <li
//                       key={`${index}-${achievementIndex}`}
//                       className="text-[5.8px] text-muted-foreground"
//                     >
//                       • {achievement}
//                     </li>
//                   ),
//                 )}
//               </ul>
//             ) : null}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function InterestsList({ resume }: { resume: ResumeData }) {
//   const extended = getExtendedResume(resume);

//   if (!extended.interests?.length) return null;

//   return (
//     <div className="flex flex-wrap gap-1">
//       {extended.interests.map((interest, index) => {
//         const name = typeof interest === "string" ? interest : "";

//         return (
//           <span
//             key={typeof interest === "string" ? `${interest}-${index}` : ""}
//             className="rounded bg-muted px-1.5 py-0.5 text-[5.8px] text-foreground"
//           >
//             {name}
//           </span>
//         );
//       })}
//     </div>
//   );
// }

// function ReferencesList({ resume }: { resume: ResumeData }) {
//   const extended = getExtendedResume(resume);

//   if (!extended.references?.length) return null;

//   return (
//     <div className="space-y-1.5">
//       {extended.references.map((reference, index) => (
//         <div key={reference.id ?? `${reference.name}-${index}`}>
//           <p className="text-[7px] font-semibold">{reference.name}</p>

//           {(reference.position || reference.company) && (
//             <p className="text-[6px] text-muted-foreground">
//               {reference.position}
//               {reference.position && reference.company ? " · " : ""}
//               {reference.company}
//             </p>
//           )}

//           {reference.email && (
//             <p className="text-[5.8px] text-muted-foreground">
//               {reference.email}
//             </p>
//           )}

//           {reference.phone && (
//             <p className="text-[5.8px] text-muted-foreground">
//               {reference.phone}
//             </p>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// // =========================================================
// // Optional Sections Renderer
// // =========================================================

// function AdditionalSections({
//   resume,
//   variant = "normal",
// }: {
//   resume: ResumeData;
//   variant?: "normal" | "compact";
// }) {
//   const extended = getExtendedResume(resume);

//   const compact = variant === "compact";

//   return (
//     <div className={cx("space-y-2.5", compact && "space-y-2")}>
//       {extended.projects?.length ? (
//         <div>
//           <SectionLabel>Projects</SectionLabel>
//           <ProjectsList resume={resume} />
//         </div>
//       ) : null}

//       {extended.certifications?.length ? (
//         <div>
//           <SectionLabel>Certifications</SectionLabel>
//           <CertificationsList resume={resume} />
//         </div>
//       ) : null}

//       {extended.languages?.length ? (
//         <div>
//           <SectionLabel>Languages</SectionLabel>
//           <LanguagesList resume={resume} />
//         </div>
//       ) : null}

//       {extended.awards?.length ? (
//         <div>
//           <SectionLabel>Awards</SectionLabel>
//           <AwardsList resume={resume} />
//         </div>
//       ) : null}

//       {extended.volunteer?.length ? (
//         <div>
//           <SectionLabel>Volunteer Experience</SectionLabel>
//           <VolunteerList resume={resume} />
//         </div>
//       ) : null}

//       {extended.interests?.length ? (
//         <div>
//           <SectionLabel>Interests</SectionLabel>
//           <InterestsList resume={resume} />
//         </div>
//       ) : null}

//       {extended.references?.length ? (
//         <div>
//           <SectionLabel>References</SectionLabel>
//           <ReferencesList resume={resume} />
//         </div>
//       ) : null}
//     </div>
//   );
// }

// // =========================================================
// // Mini Resume Preview
// // =========================================================

// function MiniPreview({
//   resume,
//   templateId,
// }: {
//   resume: ResumeData;
//   templateId: TemplateId;
// }) {
//   const fullName = getFullName(resume);
//   const { personal, summary } = resume;

//   const scrollClass =
//     "h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

//   // =======================================================
//   // AURORA
//   // =======================================================

//   if (templateId === "aurora") {
//     return (
//       <div className="relative h-full overflow-hidden rounded-md bg-background text-foreground ring-1 ring-border">
//         <div className="absolute left-0 top-0 h-full w-[3px] bg-primary" />

//         <div className={`${scrollClass} p-3`}>
//           <div className="mb-2.5 flex items-start justify-between gap-2">
//             <div className="min-w-0">
//               <div className="mb-0.5 flex items-center gap-1">
//                 <Sparkles className="h-2.5 w-2.5 text-primary" />

//                 <span className="text-[6.5px] font-bold uppercase tracking-wider text-primary">
//                   Professional Resume
//                 </span>
//               </div>

//               <h3 className="text-[12px] font-semibold leading-tight tracking-tight">
//                 {fullName}
//               </h3>

//               <p className="mt-0.5 text-[8px] text-muted-foreground">
//                 {personal.jobTitle}
//               </p>
//             </div>

//             {personal.photo && (
//               <img
//                 src={personal.photo}
//                 alt=""
//                 className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border"
//               />
//             )}
//           </div>

//           <div className="mb-2.5">
//             <ContactLine resume={resume} />
//           </div>

//           {summary && (
//             <div className="mb-2.5">
//               <SectionLabel>Profile</SectionLabel>

//               <p className="text-[7px] leading-relaxed text-muted-foreground">
//                 {summary}
//               </p>
//             </div>
//           )}

//           {resume.experience?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Experience</SectionLabel>
//               <ExperienceList resume={resume} />
//             </div>
//           ) : null}

//           {resume.education?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Education</SectionLabel>
//               <EducationList resume={resume} />
//             </div>
//           ) : null}

//           {resume.skills?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Skills</SectionLabel>
//               <SkillsList resume={resume} />
//             </div>
//           ) : null}

//           <AdditionalSections resume={resume} />
//         </div>
//       </div>
//     );
//   }

//   // =======================================================
//   // NOVA
//   // =======================================================

//   if (templateId === "nova") {
//     return (
//       <div className="relative h-full overflow-hidden rounded-md bg-background text-foreground ring-1 ring-border">
//         <div className="h-1.5 w-full bg-primary" />

//         <div className={`${scrollClass} p-3`}>
//           <div className="mb-2.5 text-center">
//             <h3 className="text-[12px] font-semibold tracking-tight">
//               {fullName}
//             </h3>

//             <p className="text-[8px] font-medium text-primary">
//               {personal.jobTitle}
//             </p>

//             <div className="mt-1 flex justify-center">
//               <ContactLine resume={resume} />
//             </div>
//           </div>

//           <TinyDivider />

//           {summary && (
//             <div className="mb-2.5">
//               <SectionLabel>Profile</SectionLabel>
//               <p className="text-[7px] leading-relaxed text-muted-foreground">
//                 {summary}
//               </p>
//             </div>
//           )}

//           {resume.experience?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Professional Experience</SectionLabel>
//               <ExperienceList resume={resume} compact />
//             </div>
//           ) : null}

//           {resume.education?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Education</SectionLabel>
//               <EducationList resume={resume} compact />
//             </div>
//           ) : null}

//           {resume.skills?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Core Skills</SectionLabel>
//               <SkillsList resume={resume} />
//             </div>
//           ) : null}

//           <AdditionalSections resume={resume} variant="compact" />
//         </div>
//       </div>
//     );
//   }

//   // =======================================================
//   // HORIZON
//   // =======================================================

//   if (templateId === "horizon") {
//     return (
//       <div className="relative flex h-full overflow-hidden rounded-md bg-background text-foreground ring-1 ring-border">
//         <aside className="flex w-[31%] shrink-0 flex-col overflow-hidden bg-primary p-2.5 text-primary-foreground">
//           {personal.photo && (
//             <img
//               src={personal.photo}
//               alt=""
//               className="mb-1.5 h-10 w-10 rounded-full object-cover ring-2 ring-primary-foreground/30"
//             />
//           )}

//           <p className="text-[8px] font-semibold leading-tight">
//             {personal.firstName}
//           </p>

//           <p className="text-[8px] font-semibold leading-tight">
//             {personal.lastName}
//           </p>

//           <p className="mt-1 text-[6.5px] opacity-90">{personal.jobTitle}</p>

//           <div className="mt-2">
//             <ContactLine resume={resume} vertical />
//           </div>

//           {resume.skills?.length ? (
//             <div className="mt-2.5">
//               <p className="mb-1 text-[6px] font-bold uppercase tracking-wider opacity-80">
//                 Skills
//               </p>

//               <div className="space-y-0.5">
//                 {resume.skills.map((skill, index) => (
//                   <p
//                     key={skill.id ?? `${skill.name}-${index}`}
//                     className="truncate text-[5.8px] opacity-90"
//                   >
//                     {skill.name}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           ) : null}

//           {getExtendedResume(resume).languages?.length ? (
//             <div className="mt-2.5">
//               <p className="mb-1 text-[6px] font-bold uppercase tracking-wider opacity-80">
//                 Languages
//               </p>

//               <LanguagesList resume={resume} />
//             </div>
//           ) : null}
//         </aside>

//         <div className={`${scrollClass} flex-1 p-2.5`}>
//           {summary && (
//             <div className="mb-2.5">
//               <SectionLabel>Profile</SectionLabel>
//               <p className="text-[6.5px] leading-relaxed text-muted-foreground">
//                 {summary}
//               </p>
//             </div>
//           )}

//           {resume.experience?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Experience</SectionLabel>
//               <ExperienceList resume={resume} compact />
//             </div>
//           ) : null}

//           {resume.education?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Education</SectionLabel>
//               <EducationList resume={resume} compact />
//             </div>
//           ) : null}

//           <AdditionalSections resume={resume} variant="compact" />
//         </div>
//       </div>
//     );
//   }

//   // =======================================================
//   // ECLIPSE
//   // =======================================================

//   if (templateId === "eclipse") {
//     return (
//       <div className="relative h-full overflow-hidden rounded-md bg-background text-foreground ring-1 ring-border">
//         <div className="border-b border-border bg-muted px-3 py-2.5">
//           <div className="flex items-start justify-between gap-2">
//             <div>
//               <h3 className="text-[11px] font-semibold tracking-tight">
//                 {fullName}
//               </h3>

//               <p className="text-[7.5px] font-medium text-primary">
//                 {personal.jobTitle}
//               </p>
//             </div>

//             {personal.photo && (
//               <img
//                 src={personal.photo}
//                 alt=""
//                 className="h-8 w-8 rounded object-cover"
//               />
//             )}
//           </div>

//           <div className="mt-1">
//             <ContactLine resume={resume} />
//           </div>
//         </div>

//         <div className={`${scrollClass} p-3`}>
//           {summary && (
//             <div className="mb-2.5">
//               <SectionLabel>Executive Profile</SectionLabel>
//               <p className="text-[7px] leading-relaxed text-muted-foreground">
//                 {summary}
//               </p>
//             </div>
//           )}

//           {resume.experience?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Professional Experience</SectionLabel>
//               <ExperienceList resume={resume} />
//             </div>
//           ) : null}

//           {resume.education?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Education</SectionLabel>
//               <EducationList resume={resume} />
//             </div>
//           ) : null}

//           {resume.skills?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Core Competencies</SectionLabel>
//               <SkillsList resume={resume} />
//             </div>
//           ) : null}

//           <AdditionalSections resume={resume} />
//         </div>
//       </div>
//     );
//   }

//   // =======================================================
//   // LUMEN
//   // =======================================================

//   if (templateId === "lumen") {
//     return (
//       <div className="relative h-full overflow-hidden rounded-md bg-background text-foreground ring-1 ring-border">
//         <div className={`${scrollClass} p-3.5`}>
//           <div className="flex items-start justify-between gap-2">
//             <div>
//               <h3 className="text-[13px] font-semibold leading-tight tracking-tight">
//                 {personal.firstName}
//                 <br />
//                 {personal.lastName}
//               </h3>

//               <p className="mt-0.5 text-[8px] text-muted-foreground">
//                 {personal.jobTitle}
//               </p>
//             </div>

//             {personal.photo && (
//               <img
//                 src={personal.photo}
//                 alt=""
//                 className="h-8 w-8 rounded-full object-cover"
//               />
//             )}
//           </div>

//           <div className="mt-2">
//             <ContactLine resume={resume} vertical />
//           </div>

//           <TinyDivider />

//           {summary && (
//             <div className="mb-3">
//               <SectionLabel>About</SectionLabel>
//               <p className="text-[7px] leading-relaxed text-muted-foreground">
//                 {summary}
//               </p>
//             </div>
//           )}

//           {resume.experience?.length ? (
//             <div className="mb-3">
//               <SectionLabel>Experience</SectionLabel>
//               <ExperienceList resume={resume} compact />
//             </div>
//           ) : null}

//           {resume.education?.length ? (
//             <div className="mb-3">
//               <SectionLabel>Education</SectionLabel>
//               <EducationList resume={resume} compact />
//             </div>
//           ) : null}

//           {resume.skills?.length ? (
//             <div className="mb-3">
//               <SectionLabel>Skills</SectionLabel>
//               <SkillsList resume={resume} pills={false} />
//             </div>
//           ) : null}

//           <AdditionalSections resume={resume} variant="compact" />
//         </div>
//       </div>
//     );
//   }

//   // =======================================================
//   // VERTEX
//   // =======================================================

//   if (templateId === "vertex") {
//     return (
//       <div className="relative flex h-full overflow-hidden rounded-md bg-background text-foreground ring-1 ring-border">
//         <aside className="flex w-[30%] shrink-0 flex-col overflow-hidden border-r border-border bg-muted/60 p-2">
//           {personal.photo && (
//             <img
//               src={personal.photo}
//               alt=""
//               className="mb-1.5 h-9 w-9 rounded-full object-cover ring-1 ring-border"
//             />
//           )}

//           <p className="text-[7.5px] font-semibold leading-tight">{fullName}</p>

//           <div className="mt-2">
//             <ContactLine resume={resume} vertical />
//           </div>

//           {resume.skills?.length ? (
//             <div className="mt-2.5">
//               <p className="mb-1 text-[6px] font-bold uppercase tracking-wider text-primary">
//                 Skills
//               </p>

//               <SkillsList resume={resume} pills={false} />
//             </div>
//           ) : null}

//           {getExtendedResume(resume).languages?.length ? (
//             <div className="mt-2.5">
//               <p className="mb-1 text-[6px] font-bold uppercase tracking-wider text-primary">
//                 Languages
//               </p>

//               <LanguagesList resume={resume} />
//             </div>
//           ) : null}
//         </aside>

//         <div className={`${scrollClass} flex-1 p-2.5`}>
//           <p className="mb-0.5 text-[7px] font-medium text-primary">
//             {personal.jobTitle}
//           </p>

//           {summary && (
//             <p className="mb-2.5 text-[6.5px] leading-relaxed text-muted-foreground">
//               {summary}
//             </p>
//           )}

//           {resume.experience?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Experience</SectionLabel>
//               <ExperienceList resume={resume} compact />
//             </div>
//           ) : null}

//           {resume.education?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel>Education</SectionLabel>
//               <EducationList resume={resume} compact />
//             </div>
//           ) : null}

//           <AdditionalSections resume={resume} variant="compact" />
//         </div>
//       </div>
//     );
//   }

//   // =======================================================
//   // ATLAS
//   // =======================================================

//   if (templateId === "atlas") {
//     return (
//       <div className="relative h-full overflow-hidden rounded-md bg-background text-foreground ring-1 ring-border">
//         <div className="border-b-2 border-primary px-3 py-2">
//           <div className="flex items-start justify-between gap-2">
//             <div>
//               <h3 className="text-[11px] font-bold tracking-tight">
//                 {fullName}
//               </h3>

//               <p className="text-[8px] text-muted-foreground">
//                 {personal.jobTitle}
//               </p>
//             </div>

//             {personal.photo && (
//               <img
//                 src={personal.photo}
//                 alt=""
//                 className="h-8 w-8 rounded object-cover"
//               />
//             )}
//           </div>

//           <div className="mt-1">
//             <ContactLine resume={resume} />
//           </div>
//         </div>

//         <div className={`${scrollClass} p-3`}>
//           {summary && (
//             <div className="mb-2.5">
//               <SectionLabel className="text-primary">
//                 Professional Summary
//               </SectionLabel>

//               <p className="text-[7px] leading-relaxed text-muted-foreground">
//                 {summary}
//               </p>
//             </div>
//           )}

//           {resume.experience?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel className="text-primary">Experience</SectionLabel>

//               <ExperienceList resume={resume} compact />
//             </div>
//           ) : null}

//           {resume.education?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel className="text-primary">Education</SectionLabel>

//               <EducationList resume={resume} compact />
//             </div>
//           ) : null}

//           {resume.skills?.length ? (
//             <div className="mb-2.5">
//               <SectionLabel className="text-primary">Skills</SectionLabel>

//               <SkillsList resume={resume} />
//             </div>
//           ) : null}

//           <AdditionalSections resume={resume} variant="compact" />
//         </div>
//       </div>
//     );
//   }

//   // =======================================================
//   // PULSE
//   // =======================================================

//   return (
//     <div className="relative flex h-full overflow-hidden rounded-md bg-background text-foreground ring-1 ring-border">
//       <div className="w-2 shrink-0 bg-primary" />

//       <div className={`${scrollClass} flex-1 p-3`}>
//         <div className="mb-2.5 flex items-start justify-between gap-2">
//           <div className="min-w-0">
//             <h3 className="text-[11px] font-semibold tracking-tight">
//               {fullName}
//             </h3>

//             <p className="text-[7.5px] text-primary">{personal.jobTitle}</p>

//             <div className="mt-1">
//               <ContactLine resume={resume} />
//             </div>
//           </div>

//           {personal.photo && (
//             <img
//               src={personal.photo}
//               alt=""
//               className="h-8 w-8 shrink-0 rounded object-cover"
//             />
//           )}
//         </div>

//         {summary && (
//           <p className="mb-2.5 text-[6.5px] leading-relaxed text-muted-foreground">
//             {summary}
//           </p>
//         )}

//         {resume.experience?.length ? (
//           <div className="mb-2.5">
//             <SectionLabel>Experience</SectionLabel>
//             <ExperienceList resume={resume} compact />
//           </div>
//         ) : null}

//         {resume.education?.length ? (
//           <div className="mb-2.5">
//             <SectionLabel>Education</SectionLabel>
//             <EducationList resume={resume} compact />
//           </div>
//         ) : null}

//         {resume.skills?.length ? (
//           <div className="mb-2.5">
//             <SectionLabel>Skills</SectionLabel>
//             <SkillsList resume={resume} />
//           </div>
//         ) : null}

//         <AdditionalSections resume={resume} variant="compact" />
//       </div>
//     </div>
//   );
// }

// // =========================================================
// // Main Showcase
// // =========================================================

// export default function TemplatesShowcase() {
//   const [selected, setSelected] = useState<TemplateId | null>(null);

//   const showcaseTemplates = useMemo(
//     () =>
//       templates.map((template) => ({
//         ...template,
//         resume: demoResumes[template.resumeIndex] ?? demoResumes[0],
//       })),
//     [],
//   );

//   return (
//     <section className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28">
//       {/* Theme-aware background glow */}
//       <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,hsl(var(--primary)/0.06),transparent_65%)]" />

//       <div className="pointer-events-none absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-primary/5 blur-[110px]" />

//       <div className="pointer-events-none absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-primary/5 blur-[110px]" />

//       <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
//         {/* =====================================================
//             Header
//         ====================================================== */}

//         <div className="mx-auto max-w-2xl text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 12 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground"
//           >
//             <LayoutTemplate className="h-3.5 w-3.5 text-primary" />8
//             Professional Templates
//           </motion.div>

//           <motion.h2
//             initial={{ opacity: 0, y: 16 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.05 }}
//             className="font-serif text-[2.1rem] leading-[1.15] tracking-tight sm:text-[2.5rem] lg:text-[2.85rem]"
//           >
//             Templates that look{" "}
//             <span className="text-primary">as good as your experience</span>
//           </motion.h2>

//           <motion.p
//             initial={{ opacity: 0, y: 14 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground"
//           >
//             Every template uses your resume data, supports all major resume
//             sections, stays ATS-friendly, and adapts naturally to both light and
//             dark mode.
//           </motion.p>
//         </div>

//         {/* =====================================================
//             Template Grid
//         ====================================================== */}

//         <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
//           {showcaseTemplates.map((template, index) => {
//             const isSelected = selected === template.id;

//             return (
//               <motion.div
//                 key={template.id}
//                 initial={{ opacity: 0, y: 28 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{
//                   once: true,
//                   margin: "-40px",
//                 }}
//                 transition={{
//                   duration: 0.55,
//                   delay: index * 0.06,
//                   ease: [0.22, 1, 0.36, 1],
//                 }}
//               >
//                 <button
//                   type="button"
//                   onClick={() => setSelected(isSelected ? null : template.id)}
//                   className={cx(
//                     "group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-background text-left shadow-sm transition-all duration-300",
//                     isSelected
//                       ? "border-primary ring-2 ring-primary/20 shadow-md"
//                       : "border-border hover:border-primary/30 hover:shadow-md",
//                   )}
//                 >
//                   {/* Preview */}
//                   <div className="relatiaspect-3/4/4] w-full overflow-hidden bg-muted/20 p-3">
//                     <MiniPreviewaspect-3/4
//                       resume={template.resume}
//                       templateId={template.id}
//                     />

//                     {/* Hover CTA */}aspect-3/4
//                     <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
//                       <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground shadow-lg">
//                         {isSelected ? (
//                           <>
//                             <Check className="h-4 w-4" />
//                             Selected
//                           </>
//                         ) : (
//                           <>
//                             Use Template
//                             <ArrowRight className="h-4 w-4" />
//                           </>
//                         )}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Template Information */}
//                   <div className="flex flex-1 flex-col p-4">
//                     <div className="mb-1 flex items-center justify-between gap-2">
//                       <h3 className="text-[15px] font-semibold tracking-tight">
//                         {template.name}
//                       </h3>

//                       <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
//                         {template.badge}
//                       </span>
//                     </div>

//                     <p className="text-[12.5px] leading-relaxed text-muted-foreground">
//                       {template.description}
//                     </p>
//                   </div>
//                 </button>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* =====================================================
//             Feature Indicators
//         ====================================================== */}

//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.2 }}
//           className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground"
//         >
//           <span className="inline-flex items-center gap-1.5">
//             <UserRound className="h-3.5 w-3.5 text-primary" />
//             Personal details
//           </span>

//           <span className="inline-flex items-center gap-1.5">
//             <BriefcaseBusiness className="h-3.5 w-3.5 text-primary" />
//             Full experience
//           </span>

//           <span className="inline-flex items-center gap-1.5">
//             <GraduationCap className="h-3.5 w-3.5 text-primary" />
//             Education
//           </span>

//           <span className="inline-flex items-center gap-1.5">
//             <Star className="h-3.5 w-3.5 text-primary" />
//             Skills
//           </span>

//           <span className="inline-flex items-center gap-1.5">
//             <Award className="h-3.5 w-3.5 text-primary" />
//             Additional sections
//           </span>

//           <span className="inline-flex items-center gap-1.5">
//             <Languages className="h-3.5 w-3.5 text-primary" />
//             Languages
//           </span>
//         </motion.div>

//         {/* =====================================================
//             Bottom CTA
//         ====================================================== */}

//         <motion.div
//           initial={{ opacity: 0, y: 18 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.3 }}
//           className="mt-14 flex flex-col items-center gap-4"
//         >
//           <p className="text-center text-[13.5px] text-muted-foreground">
//             Full resume data · All sections supported · ATS-friendly · Instant
//             PDF
//           </p>

//           <Button
//             size="lg"
//             className="h-12 rounded-full px-7 text-[14.5px] font-medium"
//           >
//             Start with any template
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>
//         </motion.div>
//       </div>
//     </section>
//   );
// }
