import chroma from "chroma-js";
import { ColorType, DefaultColorMappingType } from "./data.ts";
import { generateColors } from "./generate-colors.ts";

export const getLuminance = (color: string) => chroma.hex(color).luminance();

export const getWCA2Variant = (contrast?: number) => {
  if (!contrast) return "adaptive";
  return contrast > 4.5 ? "successful" : contrast >= 3 ? "warning" : "critical";
};
export const getAPCAVariant = (contrast?: number) => {
  if (!contrast) return "adaptive";
  return contrast > 75 ? "successful" : contrast >= 45 ? "warning" : "critical";
};

export const getContrastSuggestion = (
  backgroundColor: string,
  foregroundColor: string,
  threshold: 3 | 4.5 | 7.5 = 4.5,
  brighten?: boolean,
  greater?: boolean,
) => {
  if (backgroundColor && foregroundColor) {
    let suggestion = foregroundColor;
    let currentStep = 0.01;
    while (
      (greater
        ? chroma.contrast(suggestion, backgroundColor) > threshold
        : chroma.contrast(suggestion, backgroundColor) <= threshold) &&
      currentStep <= 1
    ) {
      suggestion = brighten
        ? chroma(suggestion).brighten(currentStep).hex()
        : chroma(suggestion).darken(currentStep).hex();
      currentStep += 0.01;
    }

    return suggestion === foregroundColor ? undefined : suggestion;
  }

  return undefined;
};

export const getNeutral1 = (color: string): string =>
  chroma(color).mix("#000", 0.08).hex();

const fillTheme = (theme: any, colors: ColorType[], dark: boolean) => {
  colors.forEach((color: ColorType) => {
    const prefix = `${dark ? "dark" : "light"}-${color.name
      ?.replace("bgNeutral0", "bg-neutral-0")
      .replace("bgNeutral1", "bg-neutral-1")}`;
    delete color.name;

    Object.keys(color).forEach((key) => {
      theme[`${prefix}-${key}`] = (color as any)[key];
    });
  });
};
export const downloadTheme = (colorMapping: DefaultColorMappingType) => {
  const theme: any = {};
  fillTheme(theme, generateColors(colorMapping), false);
  fillTheme(theme, generateColors(colorMapping, true), true);

  const element = document.createElement("a");
  const file = new Blob([JSON.stringify(theme)], {
    type: "text/plain",
  });
  element.href = URL.createObjectURL(file);
  element.download = `theme-${new Date().toDateString()}.json`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
