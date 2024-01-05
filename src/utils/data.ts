export type DefaultColorMappingType = {
  base: string;
  neutral: string;
  brand: string;
  onBrand: string;
  informational: string;
  successful: string;
  warning: string;
  critical: string;
  [key: string]: string;
};

export type CustomColorMappingType = {
  [key: string]: string;
};

export type ColorType = {
  "bg-enabled"?: string;
  "bg-hover"?: string;
  "bg-pressed"?: string;
  "bg-strong-enabled"?: string;
  "bg-strong-hover"?: string;
  "bg-strong-pressed"?: string;
  "bg-transparent-full-enabled"?: string;
  "bg-transparent-full-hover"?: string;
  "bg-transparent-full-pressed"?: string;
  "bg-transparent-semi-enabled"?: string;
  "bg-transparent-semi-hover"?: string;
  "bg-transparent-semi-pressed"?: string;
  "border-enabled"?: string;
  "border-hover"?: string;
  "border-pressed"?: string;
  "border-weak-enabled"?: string;
  "border-weak-hover"?: string;
  "border-weak-pressed"?: string;
  "element-enabled"?: string;
  "element-hover"?: string;
  "element-pressed"?: string;
  name?: string;
  "on-bg-enabled"?: string;
  "on-bg-hover"?: string;
  "on-bg-pressed"?: string;
  "on-bg-weak-enabled"?: string;
  "on-bg-weak-hover"?: string;
  "on-bg-weak-pressed"?: string;
  "on-enabled"?: string;
  "on-hover"?: string;
  "on-pressed"?: string;
  "origin-enabled"?: string;
  "origin-hover"?: string;
  "origin-pressed"?: string;
  "text-enabled"?: string;
  "text-hover"?: string;
  "text-pressed"?: string;
};

export const ALL_VARIABLES = [
  "origin-enabled",
  "origin-hover",
  "origin-pressed",
  "text-enabled",
  "text-hover",
  "text-pressed",
  "element-enabled",
  "element-hover",
  "element-pressed",
  "border-enabled",
  "border-hover",
  "border-pressed",
  "border-weak-enabled",
  "border-weak-hover",
  "border-weak-pressed",
  "on-enabled",
  "on-hover",
  "on-pressed",
  "on-bg-enabled",
  "on-bg-hover",
  "on-bg-pressed",
  "on-bg-weak-enabled",
  "on-bg-weak-hover",
  "on-bg-weak-pressed",
  "bg-enabled",
  "bg-hover",
  "bg-pressed",
  "bg-strong-enabled",
  "bg-strong-hover",
  "bg-strong-pressed",
  "bg-transparent-full-enabled",
  "bg-transparent-full-hover",
  "bg-transparent-full-pressed",
  "bg-transparent-semi-enabled",
  "bg-transparent-semi-hover",
  "bg-transparent-semi-pressed",
];

export type ThemeTypographyType = {
  lineHeight: number;
  fontSize: string;
};

export type ThemeSizing = {
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

export type DefaultThemeType = {
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
};

export const defaultMinContrast = 1.28;

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
  transparency?: number;
};

export const speakingNamesDefaultMapping: SpeakingName[] = [
  { name: "bg", dark: 2, light: 12 },
  { name: "bg-hover", dark: 3, light: 11 },
  { name: "bg-pressed", dark: 4, light: 10 },
  { name: "bg-weak", dark: 1, light: 11 },
  { name: "bg-weak-hover", dark: 2, light: 10 },
  { name: "bg-weak-pressed", dark: 3, light: 9 },
  { name: "bg-strong", dark: 0, light: 10 },
  { name: "bg-strong-hover", dark: 1, light: 9 },
  { name: "bg-strong-pressed", dark: 2, light: 8 },
  { name: "bg-transparent-full", dark: 8, light: 4, transparency: 100 },
  { name: "bg-transparent-semi", dark: 8, light: 4, transparency: 92 },
  { name: "bg-transparent-hover", dark: 8, light: 4, transparency: 84 },
  { name: "bg-transparent-pressed", dark: 8, light: 4, transparency: 76 },
  { name: "on-bg", dark: 11, light: 1 },
  { name: "on-bg-hover", dark: 10, light: 2 },
  { name: "on-bg-pressed", dark: 9, light: 3 },
  { name: "on-bg-weak", dark: 9, light: 3 },
  { name: "on-bg-weak-hover", dark: 8, light: 4 },
  { name: "on-bg-weak-pressed", dark: 7, light: 5 },
  { name: "contrast-high", dark: 8, light: 4 },
  { name: "contrast-high-hover", dark: 7, light: 3 },
  { name: "contrast-high-pressed", dark: 6, light: 2 },
  { name: "contrast-low", dark: 7, light: 5 },
  { name: "contrast-low-hover", dark: 6, light: 4 },
  { name: "contrast-low-pressed", dark: 5, light: 3 },
  { name: "border", dark: 4, light: 7 },
];
