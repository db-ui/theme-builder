import chroma from "chroma-js";
import { ColorType, DefaultColorMappingType } from "./data.ts";
import { generateColors } from "./generate-colors.ts";
import { getCssPropertiesOutput } from "./outputs.ts";
import * as JSZip from "jszip";

export const getLuminance = (color: string) => chroma.hex(color).luminance();

export const getWCA2Variant = (contrast?: number) => {
  if (!contrast) return "adaptive";
  return contrast >= 4.5 ? "successful" : "critical";
};
export const getAPCAVariant = (contrast?: number) => {
  if (!contrast) return "adaptive";
  return contrast >= 75 ? "successful" : "critical";
};
export const getContrast = (fgColor: string, bgColor: string): number => {
  try {
    return chroma.contrast(fgColor, bgColor);
  } catch (e) {
    console.error(e);
  }

  return 0;
};

export const getContrastSuggestion = (
  backgroundColor: string,
  foregroundColor: string,
  threshold: 3 | 4.5 | 7.5 = 4.5,
  brighten?: boolean,
  greater?: boolean,
): undefined | string => {
  if (backgroundColor && foregroundColor) {
    let suggestion = foregroundColor;
    let currentStep = 0.01;
    while (
      (greater
        ? getContrast(suggestion, backgroundColor) > threshold
        : getContrast(suggestion, backgroundColor) <= threshold) &&
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

const fillTheme = (theme: any, colors: ColorType[], dark: boolean) => {
  colors.forEach((color: ColorType) => {
    const prefix = `${color.name
      ?.replace("bgNeutral", "bg-neutral")
      .replace("bgNeutralStrong", "bg-neutral-strong")}`;

    Object.keys(color)
      .filter((key) => key !== "name")
      .forEach((key) => {
        theme[dark ? "dark" : "light"][`${prefix}-${key}`] = (color as any)[
          key
        ];
      });
  });
};

const download = (fileName: string, file: Blob) => {
  const element = document.createElement("a");
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
export const downloadTheme = async (colorMapping: DefaultColorMappingType) => {
  const theme: any = {
    light: {},
    dark: {},
  };
  const lightColors = generateColors(colorMapping);
  const darkColors = generateColors(colorMapping, true);
  fillTheme(theme, lightColors, false);
  fillTheme(theme, darkColors, true);

  const fileName = `theme-${new Date().toDateString()}`;
  const themeJsonString = JSON.stringify(theme);
  const cssProperties = getCssPropertiesOutput(lightColors, darkColors);

  const zip = new JSZip();
  zip.file(`${fileName}.json`, themeJsonString);
  zip.file(`${fileName}-props.css`, cssProperties);
  const zipFile = await zip.generateAsync({ type: "blob" });
  download(`${fileName}.zip`, zipFile);
};
