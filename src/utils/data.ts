export type DefaultColorMappingType = {
  bgBase: string;
  bgBaseStrong: string;
  onBgBase: string;
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
