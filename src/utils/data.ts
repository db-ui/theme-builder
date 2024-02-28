export type DefaultColorMappingType = {
  neutral: string;
  brand: string;
  informational: string;
  successful: string;
  warning: string;
  critical: string;
  [key: string]: string;
};

export type ThemeTypographyType = {
  lineHeight: number;
  fontSize: string;
};

export type ThemeSizing = {
  _scale?: number;
  "2xl"?: string | ThemeTypographyType;
  "2xs"?: string | ThemeTypographyType;
  "3xl"?: string | ThemeTypographyType;
  "3xs"?: string | ThemeTypographyType;
  lg?: string | ThemeTypographyType;
  md?: string | ThemeTypographyType;
  sm?: string | ThemeTypographyType;
  xl?: string | ThemeTypographyType;
  xs?: string | ThemeTypographyType;
};

export type ThemeTypography = {
  headline: ThemeSizing;
  body: ThemeSizing;
};

export type ThemeDevices = {
  desktop: ThemeSizing | ThemeTypography;
  tablet: ThemeSizing | ThemeTypography;
  mobile: ThemeSizing | ThemeTypography;
};

export type ThemeTonalities = {
  regular: ThemeDevices | ThemeSizing;
  functional: ThemeDevices | ThemeSizing;
  expressive: ThemeDevices | ThemeSizing;
};

export type ThemeBorder = {
  radius: ThemeSizing;
  height: ThemeSizing;
};

export type SizingFixedType = {
  fixed: {
    mobile: {
      header: string;
    };
  };
};

export type TransitionType = {
  duration: {
    "x-slow": string;
    slow: string;
    medium: string;
    fast: string;
    "x-fast": string;
  };
  timing: Record<string, string>;
  straight: Record<string, string>;
};

export type FontType = {
  name: string;
  localName: string;
  localShortName: string;
  family: string;
  weight: number;
  woff2: string;
};
export type FontsType = {
  family: {
    sans: string;
    head: string;
  };
  sans: Record<string, FontType>;
  head: Record<string, FontType>;
};

export type BrandAlternativeColor = {
  hex: string;
  dark: boolean;
  custom?: boolean;
};

export type BrandingType = {
  name: string;
  image: {
    light: string;
    dark: string;
  };
  alternativeColor: BrandAlternativeColor;
};

export type DefaultThemeType = {
  branding: BrandingType;
  spacing: {
    responsive: ThemeTonalities;
    fixed: ThemeTonalities;
  };
  sizing: ThemeTonalities & SizingFixedType;
  typography: ThemeTonalities;
  opacity: ThemeSizing;
  elevation: ThemeSizing;
  border: ThemeBorder;
  colors: DefaultColorMappingType;
  customColors?: Record<string, string>;
  transition: TransitionType;
  font: FontsType;
};

export const defaultLuminances: number[] = [
  2, 4, 6, 10, 20, 30, 40, 50, 60, 70, 80, 90, 94, 96, 98,
];

export type HeisslufType = {
  name?: string;
  index?: number;
  hex: string;
  hue: number;
  saturation: number;
  luminance: number;
};

export type SpeakingName = {
  name: string;
  light: number;
  dark: number;
  transparencyLight?: number;
  transparencyDark?: number;
};

export const speakingNamesDefaultMapping: SpeakingName[] = [
  { name: "bg-lvl-1-enabled", dark: 3, light: 14 },
  { name: "bg-lvl-1-hover", dark: 4, light: 13 },
  { name: "bg-lvl-1-pressed", dark: 5, light: 12 },
  { name: "bg-lvl-2-enabled", dark: 2, light: 13 },
  { name: "bg-lvl-2-hover", dark: 3, light: 12 },
  { name: "bg-lvl-2-pressed", dark: 4, light: 11 },
  { name: "bg-lvl-3-enabled", dark: 1, light: 12 },
  { name: "bg-lvl-3-hover", dark: 2, light: 11 },
  { name: "bg-lvl-3-pressed", dark: 3, light: 10 },
  {
    name: "bg-transparent-full-enabled",
    dark: 9,
    transparencyDark: 100,
    light: 6,
    transparencyLight: 100,
  },
  {
    name: "bg-transparent-semi-enabled",
    dark: 9,
    transparencyDark: 84,
    light: 6,
    transparencyLight: 92,
  },
  {
    name: "bg-transparent-hover",
    dark: 9,
    transparencyDark: 76,
    light: 6,
    transparencyLight: 84,
  },
  {
    name: "bg-transparent-pressed",
    dark: 9,
    transparencyDark: 68,
    light: 6,
    transparencyLight: 76,
  },
  { name: "on-bg-enabled", dark: 12, light: 3 },
  { name: "on-bg-hover", dark: 11, light: 4 },
  { name: "on-bg-pressed", dark: 10, light: 5 },
  { name: "on-bg-weak-enabled", dark: 10, light: 5 },
  { name: "on-bg-weak-hover", dark: 9, light: 6 },
  { name: "on-bg-weak-pressed", dark: 8, light: 7 },
  { name: "on-contrast-enabled", dark: 3, light: 14 },
  { name: "on-contrast-hover", dark: 4, light: 13 },
  { name: "on-contrast-pressed", dark: 5, light: 12 },
  { name: "contrast-high-enabled", dark: 9, light: 6 },
  { name: "contrast-high-hover", dark: 8, light: 5 },
  { name: "contrast-high-pressed", dark: 7, light: 4 },
  { name: "contrast-low-enabled", dark: 8, light: 7 },
  { name: "contrast-low-hover", dark: 7, light: 6 },
  { name: "contrast-low-pressed", dark: 6, light: 5 },
  { name: "border", dark: 6, light: 10 },
];
