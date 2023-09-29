import chroma from "chroma-js";
import { DefaultColorMappingType, DefaultThemeType } from "./data.ts";
import { generateColors } from "./generate-colors.ts";
import { getCssPropertiesOutput, getDarkThemeOutput } from "./outputs.ts";
import JSZip from "jszip";

export const isValidColor = (color: string): boolean => chroma.valid(color);

export const getLuminance = (color: string): number =>
  chroma.hex(color).luminance();

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
  if (
    backgroundColor &&
    foregroundColor &&
    isValidColor(foregroundColor) &&
    isValidColor(backgroundColor)
  ) {
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

export const getElementColor = (
  backgroundColor: string,
  foregroundColor: string,
): undefined | string => {
  if (
    backgroundColor &&
    foregroundColor &&
    isValidColor(foregroundColor) &&
    isValidColor(backgroundColor)
  ) {
    const initialHsl = chroma(foregroundColor).hsl();
    const reverse = initialHsl[2] > 0.5;
    let currentLuminance = reverse ? 0.01 : 0.5;
    let suggestion = chroma
      .hsl(initialHsl[0], initialHsl[1], currentLuminance)
      .hex();
    while (
      getContrast(suggestion, backgroundColor) <= 3 &&
      currentLuminance > 0
    ) {
      suggestion = chroma
        .hsl(initialHsl[0], initialHsl[1], currentLuminance)
        .hex();
      if (reverse) {
        currentLuminance += 0.01;
      } else {
        currentLuminance -= 0.01;
      }
    }

    return getContrast(suggestion, backgroundColor) <= 3
      ? undefined
      : suggestion;
  }

  return undefined;
};

const download = (fileName: string, file: Blob) => {
  const element = document.createElement("a");
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadTheme = async (
  defaultTheme: DefaultThemeType,
  colorMapping: DefaultColorMappingType,
) => {
  const theme: DefaultThemeType = { ...defaultTheme, colors: colorMapping };

  const lightColors = generateColors(colorMapping, false, true);
  const darkColors = generateColors(colorMapping, true, true);

  console.log(lightColors);
  console.log(darkColors);

  const fileName = `default-theme`;
  const themeJsonString = JSON.stringify(theme);
  const cssProperties = getCssPropertiesOutput(
    defaultTheme,
    lightColors,
    darkColors,
  );

  const darkThemeOutput = getDarkThemeOutput(darkColors);

  const zip = new JSZip();
  zip.file(`${fileName}.json`, themeJsonString);
  zip.file(`${fileName}.css`, cssProperties);
  zip.file(`${fileName}-dark-theme.css`, darkThemeOutput);
  const zipFile = await zip.generateAsync({ type: "blob" });
  download(`${fileName}.zip`, zipFile);
};
