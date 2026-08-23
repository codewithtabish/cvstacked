import type { ResumeFontFamily, ResumeTheme } from "@/types/resume-design";

// ============================================================
// RESUME THEMES
// ============================================================

// ============================================================
// RESUME THEMES
// ============================================================

export const RESUME_THEMES: Record<string, ResumeTheme> = {
  blue: {
    id: "blue",
    name: "Blue",
    colors: {
      accent: "#2563EB",
      accentDark: "#1D4ED8",
      accentLight: "#DBEAFE",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      border: "#D1D5DB",
      onAccent: "#FFFFFF",
      onAccentMuted: "#E5E7EB",
    },
  },

  navy: {
    id: "navy",
    name: "Navy",
    colors: {
      accent: "#1E3A8A",
      accentDark: "#172554",
      accentLight: "#DBEAFE",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      border: "#D1D5DB",
      onAccent: "#FFFFFF",
      onAccentMuted: "#E5E7EB",
    },
  },

  sky: {
    id: "sky",
    name: "Sky",
    colors: {
      accent: "#0284C7",
      accentDark: "#0369A1",
      accentLight: "#E0F2FE",
      text: "#111827",
      textMuted: "#475569",
      textSubtle: "#64748B",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      border: "#CBD5E1",
      onAccent: "#FFFFFF",
      onAccentMuted: "#E0F2FE",
    },
  },

  cyan: {
    id: "cyan",
    name: "Cyan",
    colors: {
      accent: "#0891B2",
      accentDark: "#0E7490",
      accentLight: "#CFFAFE",
      text: "#111827",
      textMuted: "#475569",
      textSubtle: "#64748B",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      border: "#CBD5E1",
      onAccent: "#FFFFFF",
      onAccentMuted: "#CFFAFE",
    },
  },

  green: {
    id: "green",
    name: "Green",
    colors: {
      accent: "#16A34A",
      accentDark: "#15803D",
      accentLight: "#DCFCE7",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      border: "#D1D5DB",
      onAccent: "#FFFFFF",
      onAccentMuted: "#DCFCE7",
    },
  },

  emerald: {
    id: "emerald",
    name: "Emerald",
    colors: {
      accent: "#059669",
      accentDark: "#047857",
      accentLight: "#D1FAE5",
      text: "#111827",
      textMuted: "#475569",
      textSubtle: "#64748B",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      border: "#CBD5E1",
      onAccent: "#FFFFFF",
      onAccentMuted: "#D1FAE5",
    },
  },

  teal: {
    id: "teal",
    name: "Teal",
    colors: {
      accent: "#0F766E",
      accentDark: "#115E59",
      accentLight: "#CCFBF1",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      border: "#D1D5DB",
      onAccent: "#FFFFFF",
      onAccentMuted: "#CCFBF1",
    },
  },

  lime: {
    id: "lime",
    name: "Lime",
    colors: {
      accent: "#65A30D",
      accentDark: "#4D7C0F",
      accentLight: "#ECFCCB",
      text: "#1A2E05",
      textMuted: "#4D5D3A",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#F7FEE7",
      border: "#D9F99D",
      onAccent: "#FFFFFF",
      onAccentMuted: "#ECFCCB",
    },
  },

  purple: {
    id: "purple",
    name: "Purple",
    colors: {
      accent: "#7C3AED",
      accentDark: "#6D28D9",
      accentLight: "#EDE9FE",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      border: "#D1D5DB",
      onAccent: "#FFFFFF",
      onAccentMuted: "#EDE9FE",
    },
  },

  violet: {
    id: "violet",
    name: "Violet",
    colors: {
      accent: "#6D28D9",
      accentDark: "#5B21B6",
      accentLight: "#EDE9FE",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#FAF5FF",
      border: "#DDD6FE",
      onAccent: "#FFFFFF",
      onAccentMuted: "#EDE9FE",
    },
  },

  indigo: {
    id: "indigo",
    name: "Indigo",
    colors: {
      accent: "#4F46E5",
      accentDark: "#4338CA",
      accentLight: "#E0E7FF",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      border: "#D1D5DB",
      onAccent: "#FFFFFF",
      onAccentMuted: "#E0E7FF",
    },
  },

  pink: {
    id: "pink",
    name: "Pink",
    colors: {
      accent: "#DB2777",
      accentDark: "#BE185D",
      accentLight: "#FCE7F3",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#FDF2F8",
      border: "#FBCFE8",
      onAccent: "#FFFFFF",
      onAccentMuted: "#FCE7F3",
    },
  },

  rose: {
    id: "rose",
    name: "Rose",
    colors: {
      accent: "#E11D48",
      accentDark: "#BE123C",
      accentLight: "#FFE4E6",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#FFF1F2",
      border: "#FECDD3",
      onAccent: "#FFFFFF",
      onAccentMuted: "#FFE4E6",
    },
  },

  burgundy: {
    id: "burgundy",
    name: "Burgundy",
    colors: {
      accent: "#9F1239",
      accentDark: "#881337",
      accentLight: "#FFE4E6",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#FFF7F8",
      border: "#E5C2C8",
      onAccent: "#FFFFFF",
      onAccentMuted: "#FFE4E6",
    },
  },

  red: {
    id: "red",
    name: "Red",
    colors: {
      accent: "#DC2626",
      accentDark: "#B91C1C",
      accentLight: "#FEE2E2",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#FEF2F2",
      border: "#FECACA",
      onAccent: "#FFFFFF",
      onAccentMuted: "#FEE2E2",
    },
  },

  orange: {
    id: "orange",
    name: "Orange",
    colors: {
      accent: "#EA580C",
      accentDark: "#C2410C",
      accentLight: "#FFEDD5",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#FFF7ED",
      border: "#FED7AA",
      onAccent: "#FFFFFF",
      onAccentMuted: "#FFEDD5",
    },
  },

  amber: {
    id: "amber",
    name: "Amber",
    colors: {
      accent: "#D97706",
      accentDark: "#B45309",
      accentLight: "#FEF3C7",
      text: "#1C1917",
      textMuted: "#57534E",
      textSubtle: "#78716C",
      background: "#FFFFFF",
      surface: "#FFFBEB",
      border: "#FDE68A",
      onAccent: "#FFFFFF",
      onAccentMuted: "#FEF3C7",
    },
  },

  gold: {
    id: "gold",
    name: "Gold",
    colors: {
      accent: "#A16207",
      accentDark: "#854D0E",
      accentLight: "#FEF9C3",
      text: "#1C1917",
      textMuted: "#57534E",
      textSubtle: "#78716C",
      background: "#FFFFFF",
      surface: "#FEFCE8",
      border: "#FDE68A",
      onAccent: "#FFFFFF",
      onAccentMuted: "#FEF9C3",
    },
  },

  slate: {
    id: "slate",
    name: "Slate",
    colors: {
      accent: "#475569",
      accentDark: "#334155",
      accentLight: "#E2E8F0",
      text: "#0F172A",
      textMuted: "#475569",
      textSubtle: "#64748B",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      border: "#CBD5E1",
      onAccent: "#FFFFFF",
      onAccentMuted: "#E2E8F0",
    },
  },

  charcoal: {
    id: "charcoal",
    name: "Charcoal",
    colors: {
      accent: "#374151",
      accentDark: "#1F2937",
      accentLight: "#E5E7EB",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#F9FAFB",
      border: "#D1D5DB",
      onAccent: "#FFFFFF",
      onAccentMuted: "#E5E7EB",
    },
  },

  black: {
    id: "black",
    name: "Black",
    colors: {
      accent: "#111827",
      accentDark: "#030712",
      accentLight: "#F3F4F6",
      text: "#111827",
      textMuted: "#4B5563",
      textSubtle: "#6B7280",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      border: "#D1D5DB",
      onAccent: "#FFFFFF",
      onAccentMuted: "#E5E7EB",
    },
  },
};

// ============================================================
// RESUME FONT FAMILIES
// ============================================================

export const RESUME_FONT_FAMILIES: Record<string, ResumeFontFamily> = {
  inter: {
    id: "inter",
    name: "Inter",
    family: "Inter",
  },

  sourceSans3: {
    id: "source-sans-3",
    name: "Source Sans 3",
    family: "Source Sans 3",
  },

  roboto: {
    id: "roboto",
    name: "Roboto",
    family: "Roboto",
  },

  lato: {
    id: "lato",
    name: "Lato",
    family: "Lato",
  },

  openSans: {
    id: "open-sans",
    name: "Open Sans",
    family: "Open Sans",
  },

  nunitoSans: {
    id: "nunito-sans",
    name: "Nunito Sans",
    family: "Nunito Sans",
  },

  workSans: {
    id: "work-sans",
    name: "Work Sans",
    family: "Work Sans",
  },

  dmSans: {
    id: "dm-sans",
    name: "DM Sans",
    family: "DM Sans",
  },

  manrope: {
    id: "manrope",
    name: "Manrope",
    family: "Manrope",
  },

  ibmPlexSans: {
    id: "ibm-plex-sans",
    name: "IBM Plex Sans",
    family: "IBM Plex Sans",
  },

  ibmPlexMono: {
    id: "ibm-plex-mono",
    name: "IBM Plex Mono",
    family: "IBM Plex Mono",
  },

  montserrat: {
    id: "montserrat",
    name: "Montserrat",
    family: "Montserrat",
  },

  poppins: {
    id: "poppins",
    name: "Poppins",
    family: "Poppins",
  },

  raleway: {
    id: "raleway",
    name: "Raleway",
    family: "Raleway",
  },

  cabin: {
    id: "cabin",
    name: "Cabin",
    family: "Cabin",
  },

  barlow: {
    id: "barlow",
    name: "Barlow",
    family: "Barlow",
  },

  geist: {
    id: "geist",
    name: "Geist",
    family: "Geist",
  },

  merriweather: {
    id: "merriweather",
    name: "Merriweather",
    family: "Merriweather",
  },

  libreBaskerville: {
    id: "libre-baskerville",
    name: "Libre Baskerville",
    family: "Libre Baskerville",
  },

  playfairDisplay: {
    id: "playfair-display",
    name: "Playfair Display",
    family: "Playfair Display",
  },

  georgia: {
    id: "georgia",
    name: "Georgia",
    family: "Georgia",
  },

  garamond: {
    id: "garamond",
    name: "Garamond",
    family: "Garamond",
  },
};

// ============================================================
// DEFAULT RESUME DESIGN
// ============================================================

export const DEFAULT_RESUME_DESIGN = {
  themeId: "blue",
  fontFamilyId: "inter",
  typographyScale: "standard",
} as const;
