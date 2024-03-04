import {
  BrandAlternativeColor,
  ThemeType,
  HeisslufType,
  SpeakingName,
} from "./data.ts";
import traverse from "traverse";
import { Hsluv } from "hsluv";
import { getHeissluftColors } from "./generate-colors.ts";
import { getLuminance } from "./index.ts";

export const prefix = "db";

export const getCssPropertyAsString = (properties: any): string => {
  let resultString = "";

  for (const [key, value] of Object.entries(properties)) {
    resultString += `${key}: ${value};\n`;
  }

  return resultString;
};

const nonRemProperties = ["opacity", "elevation", "transition"];

const isFontFamily = (path: string[]): boolean =>
  (path[0] === "font" && path[1] === "family") || path[0] !== "font";

export const getNonColorCssProperties = (
  theme: ThemeType,
  asString?: boolean
) => {
  const resolvedProperties: any = {};
  traverse(theme).forEach(function (value) {
    if (
      this.isLeaf &&
      this.path.length > 0 &&
      this.path[0] !== "colors" &&
      isFontFamily(this.path) &&
      !this.path.includes("_scale")
    ) {
      const key = `--${prefix}-${this.path
        .map((path) => path.toLowerCase())
        .map((path) => {
          if (path === "lineheight") {
            return "line-height";
          } else if (path === "fontsize") {
            return "font-size";
          }
          return path;
        })
        .join("-")}`;

      resolvedProperties[key] =
        !nonRemProperties.includes(this.path[0]) &&
        (typeof value === "string" || value instanceof String)
          ? `${value}rem`
          : value;

      if (this.path.at(-1) === "fontSize") {
        const lineHeightPath = [...this.path];
        lineHeightPath[lineHeightPath.length - 1] = "lineHeight";
        const fontSizeAsNumber = Number(value);
        const lineHeightAsNumber = Number(traverse(theme).get(lineHeightPath));

        const remainingIconPath = this.path
          .filter((path) => path !== "typography" && path !== "fontSize")
          .join("-");
        const fontSizing = fontSizeAsNumber * lineHeightAsNumber;
        resolvedProperties[
          `--${prefix}-base-icon-weight-${remainingIconPath}`
        ] = fontSizing * 16;
        resolvedProperties[
          `--${prefix}-base-icon-font-size-${remainingIconPath}`
        ] = `${fontSizing}rem`;
      }
    }
  });

  if (asString) {
    return getCssPropertyAsString(resolvedProperties);
  }

  return resolvedProperties;
};

export const getCssThemeProperties = (theme: ThemeType): string => {
  const customTheme = getNonColorCssProperties(theme, true);

  return `:root{
    ${customTheme}
  }
  `;
};

export const getPalette = (
  allColors: object,
  luminanceSteps: number[]
): Record<string, HeisslufType[]> =>
  Object.entries(allColors)
    .map((value) => {
      const name = value[0];
      const color = value[1];
      const hslColors: HeisslufType[] = getHeissluftColors(
        name,
        color,
        luminanceSteps
      );

      return {
        [name]: hslColors,
      };
    })
    .reduce(
      (previousValue, currentValue) => ({ ...previousValue, ...currentValue }),
      {}
    );

export const getPaletteOutput = (
  allColors: Record<string, string>,
  luminanceSteps: number[],
  altBrand: BrandAlternativeColor,
): any => {
  const palette: Record<string, HeisslufType[]> = getPalette(
    allColors,
    luminanceSteps
  );
  const neutralHslColors = palette["neutral"];
  const result: any = {};
  Object.entries(palette).forEach((color) => {
    const name = color[0];
    const hslType: HeisslufType[] = color[1];
    hslType.forEach((hsl) => {
      result[`--${prefix}-${name}-${hsl.index ?? hsl.name}`] = hsl.hex;
    });

    if (name === "brand") {
      const lightBrandColor = altBrand.dark ? allColors["brand"] : altBrand.hex;
      const darkBrandColor = !altBrand.dark ? allColors["brand"] : altBrand.hex;
      const lightBrand = getExtraBrandColors(
        lightBrandColor,
        true,
        luminanceSteps,
        neutralHslColors,
      );
      const darkBrand = getExtraBrandColors(
        darkBrandColor,
        false,
        luminanceSteps,
        neutralHslColors,
      );
      result[`--${prefix}-brand-on-light`] = lightBrand.brandOnColor;
      result[`--${prefix}-brand-origin-light`] = lightBrand.color;
      result[`--${prefix}-brand-hover-light`] = lightBrand.hoverColor;
      result[`--${prefix}-brand-pressed-light`] = lightBrand.pressedColor;
      result[`--${prefix}-brand-on-dark`] = darkBrand.brandOnColor;
      result[`--${prefix}-brand-origin-dark`] = darkBrand.color;
      result[`--${prefix}-brand-hover-dark`] = darkBrand.hoverColor;
      result[`--${prefix}-brand-pressed-dark`] = darkBrand.pressedColor;
    }
  });

  return result;
};

/**
 * if we are in light mode and the brand color has more than 20 luminance we can darken the states
 * this would be the best case, otherwise we go to a fallback
 * dark-mode is the same but inverted
 * @param color brand color
 * @param darkMode
 * @param luminanceSteps
 * @param neutralHslColors
 */
export const getExtraBrandColors = (
  color: string,
  darkMode: boolean,
  luminanceSteps: number[],
  neutralHslColors: HeisslufType[],
): {
  color: string;
  brandOnColor: string;
  hoverColor: string;
  pressedColor: string;
} => {
  const hslColors: HeisslufType[] = getHeissluftColors(
    "",
    color,
    luminanceSteps,
  );
  const hsluv = new Hsluv();
  hsluv.hex = color;
  hsluv.hexToHsluv();
  const brandLuminance = hsluv.hsluv_l;
  const brandOnColor =
    (getLuminance(color) < 0.4 ? neutralHslColors.at(-1) : neutralHslColors[0])
      ?.hex || "hotpink";
  let hoverColor: string | undefined;
  let pressedColor: string | undefined;

  const bestCompareFn = darkMode
    ? (luminance: number) => luminance > brandLuminance
    : (luminance: number) => luminance < brandLuminance;
  const fallbackCompareFn = darkMode
    ? (luminance: number) => luminance < brandLuminance
    : (luminance: number) => luminance > brandLuminance;

  let foundColors = hslColors.filter((hsl) => bestCompareFn(hsl.luminance));
  foundColors = darkMode ? foundColors : foundColors.reverse();
  if (foundColors.length > 2) {
    hoverColor = foundColors[0].hex;
    pressedColor = foundColors[1].hex;
  }

  if (!hoverColor || !pressedColor) {
    foundColors = hslColors.filter((hsl) => fallbackCompareFn(hsl.luminance));
    foundColors = darkMode ? foundColors.reverse() : foundColors;
    if (foundColors.length > 2) {
      hoverColor = foundColors[0].hex;
      pressedColor = foundColors[1].hex;
    } else {
      hoverColor = "hotpink";
      pressedColor = "hotpink";
    }
  }

  return { color, brandOnColor, hoverColor, pressedColor };
};

export const getSpeakingNames = (
  speakingNames: SpeakingName[],
  allColors: Record<string, string>,
  darkMode: boolean
): any => {
  let result: any = {};
  Object.entries(allColors).forEach((value) => {
    const name = value[0];

    if (name === "brand") {
      const colorScheme = darkMode ? "dark" : "light";
      result = {
        ...result,
        "--db-brand-on-enabled": `var(--db-brand-on-${colorScheme})`,
        "--db-brand-origin-enabled": `var(--db-brand-origin-${colorScheme})`,
        "--db-brand-origin-hover": `var(--db-brand-hover-${colorScheme})`,
        "--db-brand-origin-pressed": `var(--db-brand-pressed-${colorScheme})`,
      };
    }

    speakingNames.forEach((speakingName) => {
      if (
        speakingName.transparencyDark !== undefined ||
        speakingName.transparencyLight !== undefined
      ) {
        result[`--${prefix}-${name}-${speakingName.name}`] =
          `color-mix(in srgb, transparent ${
            darkMode
              ? speakingName.transparencyDark
              : speakingName.transparencyLight
          }%, var(--${prefix}-${name}-${
            darkMode ? speakingName.dark : speakingName.light
          }))`;
      } else {
        result[`--${prefix}-${name}-${speakingName.name}`] =
          `var(--${prefix}-${name}-${
            darkMode ? speakingName.dark : speakingName.light
          })`;
      }
    });
  });
  return result;
};