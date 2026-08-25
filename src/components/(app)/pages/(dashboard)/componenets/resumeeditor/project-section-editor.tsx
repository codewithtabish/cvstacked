// "use client";

// import {
//   Calendar,
//   Check,
//   ChevronDown,
//   ChevronUp,
//   Code2,
//   GripVertical,
//   Lightbulb,
//   Link2,
//   Pencil,
//   Plus,
//   Trash2,
//   X,
// } from "lucide-react";
// import type { ChangeEvent } from "react";
// import { useState } from "react";
// import { z } from "zod";

// import type { ResumeData } from "@/types/resume";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// /* ============================================================
//    TYPES
// ============================================================ */

// type ResumeProject = ResumeData["projects"][number];

// /* ============================================================
//    VALIDATION
//    Mandatory: name, description
//    Optional: role, link, technologies, startDate, endDate
// ============================================================ */

// export const projectItemSchema = z
//   .object({
//     id: z.string().min(1),

//     name: z
//       .string()
//       .trim()
//       .min(1, "Project name is required.")
//       .max(150, "Project name must be 150 characters or less."),

//     role: z
//       .string()
//       .trim()
//       .max(120, "Role must be 120 characters or less.")
//       .optional()
//       .or(z.literal("")),

//     link: z
//       .string()
//       .trim()
//       .max(300, "Link must be 300 characters or less.")
//       .optional()
//       .or(z.literal(""))
//       .refine(
//         (value) => !value || /^https?:\/\/.+/i.test(value),
//         "Link must start with http:// or https://",
//       ),

//     technologies: z
//       .string()
//       .trim()
//       .max(200, "Technologies must be 200 characters or less.")
//       .optional()
//       .or(z.literal("")),

//     startDate: z
//       .string()
//       .trim()
//       .max(40, "Start date must be 40 characters or less.")
//       .optional()
//       .or(z.literal("")),

//     endDate: z
//       .string()
//       .trim()
//       .max(40, "End date must be 40 characters or less.")
//       .optional()
//       .or(z.literal("")),

//     current: z.boolean().optional(),

//     description: z
//       .string()
//       .trim()
//       .min(1, "Description is required.")
//       .max(1000, "Description must be 1000 characters or less."),
//   })
//   .superRefine((project, ctx) => {
//     const startDate = project.startDate?.trim() ?? "";
//     const endDate = project.endDate?.trim() ?? "";
//     const isCurrent = Boolean(project.current);

//     if (isCurrent && endDate) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["endDate"],
//         message: "Remove the end date because this project is ongoing.",
//       });
//     }

//     if (startDate && endDate && endDate < startDate) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["endDate"],
//         message: "End date cannot be earlier than the start date.",
//       });
//     }
//   });

// export const projectsSchema = z.array(projectItemSchema);

// export type ProjectsValidationErrors = {
//   projects?: string;
//   items?: Record<
//     string,
//     {
//       name?: string;
//       role?: string;
//       link?: string;
//       technologies?: string;
//       startDate?: string;
//       endDate?: string;
//       description?: string;
//     }
//   >;
// };

// export function validateProjects(projects: ResumeData["projects"]): ProjectsValidationErrors {
//   const result = projectsSchema.safeParse(projects);

//   if (result.success) {
//     return {};
//   }

//   const errors: ProjectsValidationErrors = {
//     items: {},
//   };

//   for (const issue of result.error.issues) {
//     const [index, field] = issue.path;

//     if (typeof index !== "number") {
//       errors.projects ??= issue.message;
//       continue;
//     }

//     const item = projects[index];
//     if (!item) continue;

//     if (field === undefined) {
//       errors.projects ??= issue.message;
//       continue;
//     }

//     const fieldName = String(field);

//     if (
//       fieldName === "name" ||
//       fieldName === "role" ||
//       fieldName === "link" ||
//       fieldName === "technologies" ||
//       fieldName === "startDate" ||
//       fieldName === "endDate" ||
//       fieldName === "description"
//     ) {
//       errors.items![item.id] ??= {};
//       const itemErrors = errors.items![item.id]!;

//       if (fieldName === "name") itemErrors.name ??= issue.message;
//       if (fieldName === "role") itemErrors.role ??= issue.message;
//       if (fieldName === "link") itemErrors.link ??= issue.message;
//       if (fieldName === "technologies") itemErrors.technologies ??= issue.message;
//       if (fieldName === "startDate") itemErrors.startDate ??= issue.message;
//       if (fieldName === "endDate") itemErrors.endDate ??= issue.message;
//       if (fieldName === "description") itemErrors.description ??= issue.message;
//     }
//   }

//   if (errors.items && Object.keys(errors.items).length === 0) {
//     delete errors.items;
//   }

//   return errors;
// }

// export function isProjectsValid(projects: ResumeData["projects"]): boolean {
//   return Object.keys(validateProjects(projects)).length === 0;
// }

// /* ============================================================
//    EMPTY ITEM
//    Every new entry starts with fully empty fields — no demo data.
// ============================================================ */

// const createEmptyProject = (): ResumeProject => ({
//   id: crypto.randomUUID(),
//   name: "",
//   role: "",
//   link: "",
//   technologies: "",
//   startDate: "",
//   endDate: "",
//   current: false,
//   description: "",
// });

// /* ============================================================
//    PROPS
// ============================================================ */

// interface ProjectsSectionEditorProps {
//   resume: ResumeData;
//   onUpdate: (projects: ResumeData["projects"]) => void;
//   onNext?: () => void;
//   onBack?: () => void;
// }

// /* ============================================================
//    COMPONENT
// ============================================================ */

// export default function ProjectsSectionEditor({
//   resume,
//   onUpdate,
//   onNext,
//   onBack,
// }: ProjectsSectionEditorProps) {
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);
//   const [errors, setErrors] = useState<ProjectsValidationErrors>({});

//   const projects = resume.projects ?? [];

//   const runValidation = (next: ResumeData["projects"]) => {
//     const nextErrors = validateProjects(next);
//     setErrors(nextErrors);
//     return Object.keys(nextErrors).length === 0;
//   };

//   const updateProject = (id: string, updates: Partial<ResumeProject>) => {
//     const next = projects.map((item) =>
//       item.id === id
//         ? {
//             ...item,
//             ...updates,
//           }
//         : item,
//     );

//     onUpdate(next);

//     if (hasAttemptedValidation) {
//       runValidation(next);
//     }
//   };

//   const addProject = () => {
//     const newProject = createEmptyProject();
//     const next = [...projects, newProject];
//     onUpdate(next);
//     setEditingId(newProject.id);

//     if (hasAttemptedValidation) {
//       runValidation(next);
//     }
//   };

//   const removeProject = (id: string) => {
//     const next = projects.filter((item) => item.id !== id);
//     onUpdate(next);

//     if (editingId === id) {
//       setEditingId(null);
//     }

//     if (hasAttemptedValidation) {
//       runValidation(next);
//     }
//   };

//   const moveProject = (index: number, direction: "up" | "down") => {
//     const newIndex = direction === "up" ? index - 1 : index + 1;

//     if (newIndex < 0 || newIndex >= projects.length) {
//       return;
//     }

//     const updated = [...projects];
//     const current = updated[index];
//     const target = updated[newIndex];

//     if (!current || !target) {
//       return;
//     }

//     updated[index] = target;
//     updated[newIndex] = current;

//     onUpdate(updated);
//   };

//   const handleNext = () => {
//     setHasAttemptedValidation(true);
//     const valid = runValidation(projects);

//     if (!valid) {
//       return;
//     }

//     setEditingId(null);
//     onNext?.();
//   };

//   return (
//     <div className="w-full space-y-6">
//       {/* HEADER */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//         <div>
//           <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/40">
//             <Lightbulb className="h-5 w-5 text-muted-foreground" />
//           </div>

//           <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Projects</h2>

//           <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
//             Add personal, academic, or professional projects worth highlighting.
//           </p>
//         </div>

//         <Button type="button" onClick={addProject} className="shrink-0 gap-2">
//           <Plus className="h-4 w-4" />
//           Add Project
//         </Button>
//       </div>

//       {/* EMPTY STATE */}
//       {projects.length === 0 && (
//         <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground shadow-sm">
//             <Lightbulb className="h-6 w-6" />
//           </div>

//           <h3 className="text-base font-semibold">No projects added yet</h3>

//           <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
//             Add a project you built, contributed to, or led.
//           </p>

//           <Button type="button" variant="outline" onClick={addProject} className="mt-6 gap-2">
//             <Plus className="h-4 w-4" />
//             Add your first project
//           </Button>
//         </div>
//       )}

//       {/* PROJECT LIST */}
//       {projects.length > 0 && (
//         <div className="space-y-4">
//           {projects.map((item, index) => {
//             const isEditing = editingId === item.id;
//             const itemErrors = errors.items?.[item.id] ?? {};
//             const isNewAndEmpty = !item.name?.trim();

//             return (
//               <div
//                 key={item.id}
//                 className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm"
//               >
//                 {/* CARD HEADER */}
//                 <div className="flex items-center gap-3 border-b border-border px-5 py-4">
//                   <div className="flex items-center text-muted-foreground">
//                     <GripVertical className="h-4 w-4" />
//                   </div>

//                   <div className="flex min-w-0 flex-1 items-center gap-3">
//                     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
//                       <Lightbulb className="h-4 w-4" />
//                     </div>

//                     <div className="min-w-0">
//                       {isEditing && isNewAndEmpty ? (
//                         <p className="truncate text-sm font-semibold">New Project</p>
//                       ) : (
//                         <>
//                           <p className="truncate text-sm font-semibold">
//                             {item.name?.trim() || "Untitled project"}
//                           </p>
//                           <p className="truncate text-xs text-muted-foreground">
//                             {item.role?.trim() || "Role not specified"}
//                           </p>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* REORDER */}
//                   <div className="hidden items-center gap-0.5 sm:flex">
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 text-muted-foreground"
//                       onClick={() => moveProject(index, "up")}
//                       disabled={index === 0}
//                       aria-label="Move project up"
//                     >
//                       <ChevronUp className="h-4 w-4" />
//                     </Button>

//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 text-muted-foreground"
//                       onClick={() => moveProject(index, "down")}
//                       disabled={index === projects.length - 1}
//                       aria-label="Move project down"
//                     >
//                       <ChevronDown className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   {/* EDIT */}
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-muted-foreground"
//                     onClick={() => setEditingId(isEditing ? null : item.id)}
//                     aria-label={isEditing ? "Close project editor" : "Edit project"}
//                   >
//                     {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
//                   </Button>

//                   {/* DELETE */}
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
//                     onClick={() => removeProject(item.id)}
//                     aria-label="Delete project"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>

//                 {/* PREVIEW — only non-empty fields */}
//                 {!isEditing && (
//                   <div className="px-5 py-5">
//                     <div className="grid gap-5 sm:grid-cols-2">
//                       {item.name?.trim() && <PreviewField label="Project Name" value={item.name} />}

//                       {item.role?.trim() && <PreviewField label="Role" value={item.role} />}

//                       {item.link?.trim() && (
//                         <div>
//                           <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                             Link
//                           </p>
//                           <a
//                             href={item.link}
//                             target="_blank"
//                             rel="noreferrer"
//                             className="mt-1 flex items-center gap-1.5 truncate text-sm text-primary underline-offset-2 hover:underline"
//                           >
//                             <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
//                             {item.link}
//                           </a>
//                         </div>
//                       )}

//                       {item.technologies?.trim() && (
//                         <div>
//                           <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                             Technologies
//                           </p>
//                           <p className="mt-1 flex items-center gap-1.5 text-sm">
//                             <Code2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
//                             {item.technologies}
//                           </p>
//                         </div>
//                       )}

//                       {(item.startDate?.trim() || item.endDate?.trim() || item.current) && (
//                         <div>
//                           <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                             Dates
//                           </p>
//                           <p className="mt-1 flex items-center gap-1.5 text-sm">
//                             <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
//                             {item.startDate?.trim() || "—"}
//                             <span className="text-muted-foreground">—</span>
//                             {item.current ? "Present" : item.endDate?.trim() || "—"}
//                           </p>
//                         </div>
//                       )}

//                       {item.description?.trim() && (
//                         <div className="sm:col-span-2">
//                           <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                             Description
//                           </p>
//                           <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
//                             {item.description}
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Inline item errors (after validation) */}
//                     {hasAttemptedValidation && Object.keys(itemErrors).length > 0 && (
//                       <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
//                         <p className="text-xs font-medium text-destructive">
//                           Please complete the required fields for this project.
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* EDITOR */}
//                 {isEditing && (
//                   <div className="space-y-6 px-5 py-6">
//                     {/* NAME — required */}
//                     <div className="space-y-2">
//                       <Label htmlFor={`name-${item.id}`}>
//                         Project Name <span className="text-destructive">*</span>
//                       </Label>
//                       <Input
//                         id={`name-${item.id}`}
//                         value={item.name}
//                         placeholder="e.g. Personal Portfolio Website"
//                         required
//                         onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                           updateProject(item.id, { name: event.target.value })
//                         }
//                         aria-required="true"
//                         aria-invalid={Boolean(itemErrors.name)}
//                       />
//                       {itemErrors.name && (
//                         <p className="text-xs font-medium text-destructive" role="alert">
//                           {itemErrors.name}
//                         </p>
//                       )}
//                     </div>

//                     {/* ROLE + LINK (both optional) */}
//                     <div className="grid gap-5 md:grid-cols-2">
//                       <div className="space-y-2">
//                         <Label htmlFor={`role-${item.id}`}>Role</Label>
//                         <Input
//                           id={`role-${item.id}`}
//                           value={item.role ?? ""}
//                           placeholder="e.g. Lead Developer"
//                           onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                             updateProject(item.id, { role: event.target.value })
//                           }
//                           aria-invalid={Boolean(itemErrors.role)}
//                         />
//                         {itemErrors.role && (
//                           <p className="text-xs font-medium text-destructive" role="alert">
//                             {itemErrors.role}
//                           </p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor={`link-${item.id}`}>Project Link</Label>
//                         <div className="relative">
//                           <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                           <Input
//                             id={`link-${item.id}`}
//                             value={item.link ?? ""}
//                             placeholder="https://github.com/username/project"
//                             className="pl-9"
//                             onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                               updateProject(item.id, { link: event.target.value })
//                             }
//                             aria-invalid={Boolean(itemErrors.link)}
//                           />
//                         </div>
//                         {itemErrors.link && (
//                           <p className="text-xs font-medium text-destructive" role="alert">
//                             {itemErrors.link}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* TECHNOLOGIES — optional */}
//                     <div className="space-y-2">
//                       <Label htmlFor={`tech-${item.id}`}>Technologies</Label>
//                       <div className="relative">
//                         <Code2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                         <Input
//                           id={`tech-${item.id}`}
//                           value={item.technologies ?? ""}
//                           placeholder="e.g. React, Node.js, PostgreSQL"
//                           className="pl-9"
//                           onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                             updateProject(item.id, { technologies: event.target.value })
//                           }
//                           aria-invalid={Boolean(itemErrors.technologies)}
//                         />
//                       </div>
//                       {itemErrors.technologies && (
//                         <p className="text-xs font-medium text-destructive" role="alert">
//                           {itemErrors.technologies}
//                         </p>
//                       )}
//                     </div>

//                     {/* DATES — both optional */}
//                     <div className="space-y-3">
//                       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                         <Label>Project Period</Label>

//                         <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
//                           <input
//                             type="checkbox"
//                             checked={Boolean(item.current)}
//                             onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                               updateProject(item.id, {
//                                 current: event.target.checked,
//                                 endDate: event.target.checked ? "" : item.endDate,
//                               })
//                             }
//                             className="h-4 w-4 rounded border-border"
//                           />
//                           This is an ongoing project
//                         </label>
//                       </div>

//                       <div className="grid gap-5 sm:grid-cols-2">
//                         <div className="space-y-2">
//                           <Label htmlFor={`start-${item.id}`}>Start Date</Label>
//                           <div className="relative">
//                             <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                             <Input
//                               id={`start-${item.id}`}
//                               value={item.startDate ?? ""}
//                               placeholder="e.g. 2023 or Jan 2023"
//                               className="pl-9"
//                               onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                                 updateProject(item.id, { startDate: event.target.value })
//                               }
//                               aria-invalid={Boolean(itemErrors.startDate)}
//                             />
//                           </div>
//                           {itemErrors.startDate && (
//                             <p className="text-xs font-medium text-destructive" role="alert">
//                               {itemErrors.startDate}
//                             </p>
//                           )}
//                         </div>

//                         {!item.current && (
//                           <div className="space-y-2">
//                             <Label htmlFor={`end-${item.id}`}>End Date</Label>
//                             <div className="relative">
//                               <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                               <Input
//                                 id={`end-${item.id}`}
//                                 value={item.endDate ?? ""}
//                                 placeholder="e.g. 2024 or Mar 2024"
//                                 className="pl-9"
//                                 onChange={(event: ChangeEvent<HTMLInputElement>) =>
//                                   updateProject(item.id, { endDate: event.target.value })
//                                 }
//                                 aria-invalid={Boolean(itemErrors.endDate)}
//                               />
//                             </div>
//                             {itemErrors.endDate && (
//                               <p className="text-xs font-medium text-destructive" role="alert">
//                                 {itemErrors.endDate}
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* DESCRIPTION — required */}
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between gap-3">
//                         <Label htmlFor={`description-${item.id}`}>
//                           Description <span className="text-destructive">*</span>
//                         </Label>
//                         <span className="text-xs tabular-nums text-muted-foreground">
//                           {(item.description ?? "").length}/1000
//                         </span>
//                       </div>

//                       <Textarea
//                         id={`description-${item.id}`}
//                         value={item.description ?? ""}
//                         onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
//                           updateProject(item.id, { description: event.target.value })
//                         }
//                         placeholder="Describe what the project does, your contribution, and the impact or outcome..."
//                         className="min-h-[120px] resize-y leading-6"
//                         required
//                         aria-required="true"
//                         aria-invalid={Boolean(itemErrors.description)}
//                       />

//                       {itemErrors.description && (
//                         <p className="text-xs font-medium text-destructive" role="alert">
//                           {itemErrors.description}
//                         </p>
//                       )}
//                     </div>

//                     {/* DONE */}
//                     <div className="flex justify-end border-t border-border pt-5">
//                       <Button type="button" onClick={() => setEditingId(null)} className="gap-2">
//                         <Check className="h-4 w-4" />
//                         Done
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           {/* ADD ANOTHER */}
//           <Button
//             type="button"
//             variant="outline"
//             onClick={addProject}
//             className="w-full border-dashed"
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Add another project
//           </Button>
//         </div>
//       )}

//       {/* GENERAL ERROR */}
//       {errors.projects && (
//         <div
//           className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3"
//           role="alert"
//         >
//           <p className="text-xs font-medium text-destructive">{errors.projects}</p>
//         </div>
//       )}

//       {/* VALIDATION MESSAGE */}
//       {hasAttemptedValidation && !isProjectsValid(projects) && (
//         <p className="text-xs font-medium text-destructive" role="alert">
//           Please complete the highlighted project fields before continuing.
//         </p>
//       )}

//       {/* NAVIGATION */}
//       <div className="mt-4 flex items-center justify-between border-t border-border pt-6">
//         <Button type="button" variant="outline" onClick={onBack} className="gap-2">
//           <ChevronUp className="h-4 w-4 -rotate-90" />
//           Back
//         </Button>

//         <Button type="button" onClick={handleNext} className="gap-2">
//           Continue
//           <ChevronDown className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// }

// /* =============================================================
//    PREVIEW FIELD
// ============================================================= */

// function PreviewField({ label, value }: { label: string; value: string }) {
//   return (
//     <div>
//       <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
//       <p className="mt-1 text-sm">{value}</p>
//     </div>
//   );
// }
