// import { DEFAULT_RESUME_DESIGN, RESUME_THEMES } from "@/data/resume-design";

// /**
//  * Returns all available resume theme IDs.
//  */
// export function getResumeThemeIds(): string[] {
//   return Object.keys(RESUME_THEMES);
// }

// /**
//  * Returns a random resume theme ID.
//  *
//  * Falls back to the default theme if no themes are available.
//  */
// export function getRandomResumeThemeId(): string {
//   const themeIds = getResumeThemeIds();

//   if (themeIds.length === 0) {
//     return DEFAULT_RESUME_DESIGN.themeId;
//   }

//   const randomIndex = Math.floor(Math.random() * themeIds.length);

//   return themeIds[randomIndex] ?? DEFAULT_RESUME_DESIGN.themeId;
// }

// /**
//  * Returns a random resume theme.
//  *
//  * Falls back to the default theme if no themes are available.
//  */
// export function getRandomResumeTheme() {
//   const themeId = getRandomResumeThemeId();

//   return RESUME_THEMES[themeId] ?? RESUME_THEMES[DEFAULT_RESUME_DESIGN.themeId];
// }

// /**
//  * Checks whether a resume theme ID is valid.
//  */
// export function isValidResumeThemeId(themeId: string | null | undefined): boolean {
//   return Boolean(themeId && RESUME_THEMES[themeId]);
// }

// /**
//  * Resolves a resume theme ID.
//  *
//  * If a valid theme ID is provided, it is returned.
//  * Otherwise, a random theme ID is returned.
//  */
// export function resolveResumeThemeId(themeId?: string | null): string {
//   if (themeId && isValidResumeThemeId(themeId)) {
//     return themeId;
//   }

//   return getRandomResumeThemeId();
// }
