import type { ResumeSkill } from "@/data/resume";

/** Format date range for display */
export function formatDateRange(
  startDate: string,
  endDate?: string,
  current?: boolean,
): string {
  const format = (d: string) => {
    if (/^\d{4}$/.test(d)) return d;
    if (/^\d{4}-\d{2}$/.test(d)) {
      const [y, m] = d.split("-");
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${months[parseInt(m, 10) - 1]} ${y}`;
    }
    return d;
  };
  const start = format(startDate);
  if (current) return `${start} — Present`;
  if (endDate) return `${start} — ${format(endDate)}`;
  return start;
}

/** Group skills by category */
export function groupSkillsByCategory(
  skills: ResumeSkill[],
): Record<string, ResumeSkill[]> {
  return skills.reduce(
    (acc, skill) => {
      const cat = skill.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {} as Record<string, ResumeSkill[]>,
  );
}

/** Capitalize proficiency for display */
export function formatProficiency(proficiency: string): string {
  return proficiency.charAt(0).toUpperCase() + proficiency.slice(1);
}

/** Check if a section has content */
export function hasContent(arr: unknown[] | string | undefined): boolean {
  if (!arr) return false;
  if (typeof arr === "string") return arr.trim().length > 0;
  return Array.isArray(arr) && arr.length > 0;
}
