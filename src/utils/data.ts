export type DefaultColorType = {
  origin: string;
  originBgDark?: string;
  originBgLight?: string;
  originLight?: string;
  originLightAlternative?: string;
  originLightAccessible?: boolean;
  originLightHovered?: string;
  originLightPressed?: string;
  onOriginLight?: string;
  onOriginLightAlternative?: string;
  onOriginLightAccessible?: boolean;
  onOriginLightHovered?: string;
  onOriginLightPressed?: string;
  originDark?: string;
  originDarkAlternative?: string;
  originDarkAccessible?: boolean;
  originDarkHovered?: string;
  originDarkPressed?: string;
  onOriginDark?: string;
  onOriginDarkAlternative?: string;
  onOriginDarkAccessible?: boolean;
  onOriginDarkHovered?: string;
  onOriginDarkPressed?: string;
};

export type DefaultColorMappingType = {
  neutral: DefaultColorType;
  brand: DefaultColorType;
  informational: DefaultColorType;
  successful: DefaultColorType;
  warning: DefaultColorType;
  critical: DefaultColorType;
};

export type AdditionalColorMappingType = {
  yellow: DefaultColorType;
  orange: DefaultColorType;
  red: DefaultColorType;
  pink: DefaultColorType;
  violet: DefaultColorType;
  blue: DefaultColorType;
  cyan: DefaultColorType;
  turquoise: DefaultColorType;
  green: DefaultColorType;
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

export type BrandingType = {
  name: string;
  image: {
    light: string;
    dark: string;
  };
};

export type ThemeType = {
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
  additionalColors: AdditionalColorMappingType;
  customColors?: Record<string, DefaultColorType>;
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
  { name: "bg-basic-level-1-default", dark: 3, light: 14 },
  { name: "bg-basic-level-1-hovered", dark: 4, light: 13 },
  { name: "bg-basic-level-1-pressed", dark: 5, light: 12 },
  { name: "bg-basic-level-2-default", dark: 2, light: 13 },
  { name: "bg-basic-level-2-hovered", dark: 3, light: 12 },
  { name: "bg-basic-level-2-pressed", dark: 4, light: 11 },
  { name: "bg-basic-level-3-default", dark: 1, light: 12 },
  { name: "bg-basic-level-3-hovered", dark: 2, light: 11 },
  { name: "bg-basic-level-3-pressed", dark: 3, light: 10 },
  {
    name: "bg-basic-transparent-full-default",
    dark: 9,
    transparencyDark: 100,
    light: 6,
    transparencyLight: 100,
  },
  {
    name: "bg-basic-transparent-semi-default",
    dark: 9,
    transparencyDark: 84,
    light: 6,
    transparencyLight: 92,
  },
  {
    name: "bg-basic-transparent-hovered",
    dark: 9,
    transparencyDark: 76,
    light: 6,
    transparencyLight: 84,
  },
  {
    name: "bg-basic-transparent-pressed",
    dark: 9,
    transparencyDark: 68,
    light: 6,
    transparencyLight: 76,
  },
  { name: "on-bg-basic-emphasis-100-default", dark: 12, light: 3 },
  { name: "on-bg-basic-emphasis-100-hovered", dark: 11, light: 4 },
  { name: "on-bg-basic-emphasis-100-pressed", dark: 10, light: 5 },
  { name: "on-bg-basic-emphasis-90-default", dark: 10, light: 5 },
  { name: "on-bg-basic-emphasis-90-hovered", dark: 9, light: 6 },
  { name: "on-bg-basic-emphasis-90-pressed", dark: 8, light: 7 },
  { name: "on-bg-basic-emphasis-80-default", dark: 9, light: 6 },
  { name: "on-bg-basic-emphasis-80-hovered", dark: 8, light: 5 },
  { name: "on-bg-basic-emphasis-80-pressed", dark: 7, light: 4 },
  { name: "on-bg-basic-emphasis-70-default", dark: 8, light: 7 },
  { name: "on-bg-basic-emphasis-70-hovered", dark: 7, light: 6 },
  { name: "on-bg-basic-emphasis-70-pressed", dark: 6, light: 5 },
  { name: "on-bg-basic-emphasis-60-default", dark: 6, light: 10 },
  { name: "on-bg-basic-emphasis-60-hovered", dark: 5, light: 9 },
  { name: "on-bg-basic-emphasis-60-pressed", dark: 4, light: 8 },
  { name: "on-bg-basic-emphasis-50-default", dark: 5, light: 9 },
  { name: "on-bg-basic-emphasis-50-hovered", dark: 4, light: 8 },
  { name: "on-bg-basic-emphasis-50-pressed", dark: 3, light: 7 },
  { name: "bg-inverted-contrast-max-default", dark: 12, light: 3 },
  { name: "bg-inverted-contrast-max-hovered", dark: 11, light: 4 },
  { name: "bg-inverted-contrast-max-pressed", dark: 10, light: 5 },
  { name: "bg-inverted-contrast-high-default", dark: 9, light: 6 },
  { name: "bg-inverted-bg-inverted-contrast-high-hovered", dark: 8, light: 5 },
  { name: "bg-inverted-bg-inverted-contrast-high-pressed", dark: 7, light: 4 },
  { name: "bg-inverted-contrast-low-default", dark: 8, light: 7 },
  { name: "bg-inverted-bg-inverted-contrast-low-hovered", dark: 7, light: 6 },
  { name: "bg-inverted-bg-inverted-contrast-low-pressed", dark: 6, light: 5 },
  { name: "on-bg-inverted-default", dark: 3, light: 14 },
  { name: "on-bg-inverted-hovered", dark: 4, light: 13 },
  { name: "on-bg-inverted-pressed", dark: 5, light: 12 },
];
