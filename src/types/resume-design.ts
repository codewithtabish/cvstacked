export type ResumeTheme = {
  id: string;
  name: string;
  colors: {
    accent: string;
    accentDark: string;
    accentLight: string;

    text: string;
    textMuted: string;
    textSubtle: string;

    background: string;
    surface: string;
    border: string;

    onAccent: string;
    onAccentMuted: string;
  };
};

export type ResumeFontFamily = {
  id: string;
  name: string;
  family: string;
};

export type ResumeTypography = {
  id: string;
  name: string;
  nameSize: number;
  titleSize: number;
  sectionHeadingSize: number;
  subsectionHeadingSize: number;
  bodySize: number;
  metadataSize: number;
  lineHeight: number;
};
