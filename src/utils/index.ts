import chroma from "chroma-js";
import {
  CustomColorMappingType,
  DefaultColorMappingType,
  DefaultThemeType,
  HeisslufType,
} from "./data.ts";
import {
  black,
  generateColors,
  getHeissluftColors,
  white,
} from "./generate-colors.ts";
import {
  getCssPropertiesOutput,
  getDarkThemeOutput,
  getPaletteOutput,
  getSpeakingNames,
} from "./outputs.ts";
import JSZip from "jszip";
import { Hsluv } from "hsluv";

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
/**
 * if we are in light mode and the brand color has more than 20 luminance we can darken the states
 * this would be the best case, otherwise we go to a fallback
 * dark-mode is the same but inverted
 * @param color brand color
 * @param darkMode
 * @param hslColors
 */
const setExtraBrandColors = (
  color: string,
  darkMode: boolean,
  hslColors: HeisslufType[],
) => {
  const defaultHsl = {
    hex: color,
    hue: 0,
    luminance: 0,
    saturation: 0,
  };
  const hsluv = new Hsluv();
  hsluv.hex = color;
  hsluv.hexToHsluv();
  const brandLuminance = hsluv.hsluv_l;
  const brandOnColor = getLuminance(color) < 0.4 ? white : black;
  let hoverColor: string | undefined;
  let pressedColor: string | undefined;

  const bestCompareFn = darkMode
    ? (luminance: number) => luminance > brandLuminance
    : (luminance: number) => luminance < brandLuminance;
  const fallbackCompareFn = darkMode
    ? (luminance: number) => luminance < brandLuminance
    : (luminance: number) => luminance > brandLuminance;

  const foundColors = hslColors
    .filter((hsl) => bestCompareFn(hsl.luminance))
    .reverse();
  if (foundColors.length > 2) {
    hoverColor = foundColors[0].hex;
    pressedColor = foundColors[1].hex;
  }

  if (!hoverColor || !pressedColor) {
    const foundColors = hslColors.filter((hsl) =>
      fallbackCompareFn(hsl.luminance),
    );
    if (foundColors.length > 2) {
      hoverColor = foundColors[0].hex;
      pressedColor = foundColors[1].hex;
    }
  }

  hslColors.push({
    ...defaultHsl,
    name: "on-enabled",
    hex: brandOnColor,
  });
  hslColors.push({
    ...defaultHsl,
    name: "origin-enabled",
    hex: color,
  });

  hslColors.push({
    ...defaultHsl,
    name: "origin-hover",
    hex: hoverColor ?? color,
  });
  hslColors.push({
    ...defaultHsl,
    name: "origin-pressed",
    hex: pressedColor ?? color,
  });
};

const getPalette = (allColors: object, darkMode: boolean): any =>
  Object.entries(allColors)
    .map((value) => {
      const name = value[0];
      const color = value[1];
      const hslColors: HeisslufType[] = getHeissluftColors(color, darkMode);

      if (name === "brand") {
        setExtraBrandColors(color, darkMode, hslColors);
      }

      if (name === "base" && darkMode) {
        // we overwrite pure black with 11 color
        hslColors[12].hex = hslColors[11].hex;
      }

      return {
        [name]: hslColors,
      };
    })
    .reduce(
      (previousValue, currentValue) => ({ ...previousValue, ...currentValue }),
      {},
    );

export const downloadTheme = async (
  defaultTheme: DefaultThemeType,
  colorMapping: DefaultColorMappingType,
  customColorMapping?: CustomColorMappingType,
) => {
  const theme: DefaultThemeType = { ...defaultTheme, colors: colorMapping };

  const lightColors = generateColors(colorMapping, false, customColorMapping);
  const darkColors = generateColors(colorMapping, true, customColorMapping);

  const allColors = { ...colorMapping, ...customColorMapping };
  const lightPalette = getPalette(allColors, false);
  const darkPalette = getPalette(allColors, true);

  const fileName = `default-theme`;
  const themeJsonString = JSON.stringify(theme);
  const themeColorsJsonString = JSON.stringify({
    light: lightColors,
    dark: darkColors,
  });
  const cssProperties = getCssPropertiesOutput(
    defaultTheme,
    lightColors,
    darkColors,
  );

  const darkThemeOutput = getDarkThemeOutput(darkColors);

  const zip = new JSZip();
  zip.file(`${fileName}-colors.json`, themeColorsJsonString);
  zip.file(`${fileName}.json`, themeJsonString);
  zip.file(`${fileName}.css`, cssProperties);
  zip.file(`${fileName}-dark-theme.css`, darkThemeOutput);
  zip.file(`${fileName}-light-palette.css`, getPaletteOutput(lightPalette));
  zip.file(`${fileName}-dark-palette.css`, getPaletteOutput(darkPalette));
  zip.file(`${fileName}-speaking-names.css`, getSpeakingNames(allColors));
  const zipFile = await zip.generateAsync({ type: "blob" });
  download(`${fileName}.zip`, zipFile);
};
