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
