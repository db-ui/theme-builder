import {
  AlternativeColor,
  HeisslufType,
  OriginColor,
  SpeakingName,
  ThemeType,
} from "../data.ts";
import traverse from "traverse";
import { Hsluv } from "hsluv";
import { getHeissluftColors } from "../generate-colors.ts";
import { getContrast, isOriginColor } from "../index.ts";

export const prefix = "db";

export const getCssPropertyAsString = (
  properties: any,
  inRoot?: boolean,
): string => {
  let resultString = "";

  for (const [key, value] of Object.entries(properties)) {
    resultString += `${key}: ${value};\n`;
  }

  if (inRoot) {
    return `:root{${resultString}}`;
  }

  return resultString;
};

const nonRemProperties = ["opacity", "elevation", "transition", "font"];

const isFontFamily = (path: string[]): boolean =>
  (path[0] === "font" && path[1] === "family") || path[0] !== "font";

export const getNonColorCssProperties = (
  theme: ThemeType,
  asString?: boolean,
) => {
  const resolvedProperties: any = {};
  traverse(theme).forEach(function (value) {
    if (
      this.isLeaf &&
      this.path.length > 0 &&
      this.path[0] !== "colors" &&
      this.path[0] !== "additionalColors" &&
      this.path[0] !== "customColors" &&
      this.path[0] !== "branding" &&
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

export const getFullColorCss = (
  colorsPalette: string,
  colorsSpeakingNamesLight: string,
  colorsSpeakingNamesDark: string,
): string => {
  return `:root{
      ${colorsPalette}
      ${colorsSpeakingNamesLight}
      @media (prefers-color-scheme: dark) {
      ${colorsSpeakingNamesLight}
      }
      }
      
[data-color-scheme="light"] {
      ${colorsSpeakingNamesDark}
}

[data-color-scheme="dark"] {
      ${colorsSpeakingNamesDark}
}
      `;
};

export const getPalette = (
  allColors: object,
  luminanceSteps: number[],
): Record<string, HeisslufType[]> =>
  Object.entries(allColors)
    .map((value) => {
      const name = value[0];
      const color = value[1];
      const hslColors: HeisslufType[] = getHeissluftColors(
        name,
        color,
        luminanceSteps,
      );

      return {
        [name]: hslColors,
      };
    })
    .reduce(
      (previousValue, currentValue) => ({ ...previousValue, ...currentValue }),
      {},
    );

export const getOriginColorsLightAndDark = (
  allColors: Record<string, string>,
  luminanceSteps: number[],
  alternativeColors: Record<string, AlternativeColor>,
  name: string,
): {
  lightOrigin: OriginColor | undefined;
  darkOrigin: OriginColor | undefined;
} => {
  const altColor = alternativeColors[name];
  if (!altColor) return { lightOrigin: undefined, darkOrigin: undefined };

  const lightColor = altColor.dark ? allColors[name] : altColor.hex;
  const darkColor = !altColor.dark ? allColors[name] : altColor.hex;
  const lightOrigin = getOriginColors(lightColor, false, luminanceSteps);
  const darkOrigin = getOriginColors(darkColor, true, luminanceSteps);

  return { lightOrigin, darkOrigin };
};

export const getPaletteOutput = (
  allColors: Record<string, string>,
  luminanceSteps: number[],
  alternativeColors: Record<string, AlternativeColor>,
): any => {
  const palette: Record<string, HeisslufType[]> = getPalette(
    allColors,
    luminanceSteps,
  );
  const result: any = {};
  Object.entries(palette).forEach((color) => {
    const name = color[0];
    const hslType: HeisslufType[] = color[1];
    hslType.forEach((hsl) => {
      result[`--${prefix}-${name}-${hsl.index ?? hsl.name}`] = hsl.hex;
    });

    if (isOriginColor(name)) {
      const { lightOrigin, darkOrigin } = getOriginColorsLightAndDark(
        allColors,
        luminanceSteps,
        alternativeColors,
        name,
      );
      if (lightOrigin && darkOrigin) {
        result[`--${prefix}-${name}-on-pressed-light`] =
          lightOrigin.onColorPressed;
        result[`--${prefix}-${name}-on-hover-light`] = lightOrigin.onColorHover;
        result[`--${prefix}-${name}-on-light`] = lightOrigin.onColor;
        result[`--${prefix}-${name}-origin-light`] = lightOrigin.color;
        result[`--${prefix}-${name}-hover-light`] = lightOrigin.hoverColor;
        result[`--${prefix}-${name}-pressed-light`] = lightOrigin.pressedColor;
        result[`--${prefix}-${name}-on-pressed-dark`] =
          darkOrigin.onColorPressed;
        result[`--${prefix}-${name}-on-hover-dark`] = darkOrigin.onColorHover;
        result[`--${prefix}-${name}-on-dark`] = darkOrigin.onColor;
        result[`--${prefix}-${name}-origin-dark`] = darkOrigin.color;
        result[`--${prefix}-${name}-hover-dark`] = darkOrigin.hoverColor;
        result[`--${prefix}-${name}-pressed-dark`] = darkOrigin.pressedColor;
      }
    }
  });

  return result;
};

// We use this for hover/pressed to make sure the colors aren't to similar
const originLuminanceMinDifference: number = 5;

/**
 * if we are in light mode and the origin color has more than 20 luminance we can darken the states
 * this would be the best case, otherwise we go to a fallback
 * dark-mode is the same but inverted
 * @param color
 * @param darkMode
 * @param luminanceSteps
 */
export const getOriginColors = (
  color: string,
  darkMode: boolean,
  luminanceSteps: number[],
): OriginColor => {
  const hslColors: HeisslufType[] = getHeissluftColors(
    "",
    color,
    luminanceSteps,
  );
  const hsluv = new Hsluv();
  hsluv.hex = color;
  hsluv.hexToHsluv();
  const originLuminance = hsluv.hsluv_l;

  const isWhiteContrastEnough = getContrast("#fff", color) >= 4.5;
  const onColor = isWhiteContrastEnough ? "#fff" : "#000";
  const onColorHover =
    (isWhiteContrastEnough ? hslColors.at(-2) : hslColors[2])?.hex || "#ff69b4";
  const onColorPressed =
    (isWhiteContrastEnough ? hslColors.at(-3) : hslColors[3])?.hex || "#ff69b4";
  let hoverColor: string | undefined;
  let pressedColor: string | undefined;

  const bestCompareFn = darkMode
    ? (luminance: number) =>
        luminance > originLuminance + originLuminanceMinDifference
    : (luminance: number) =>
        luminance < originLuminance - originLuminanceMinDifference;
  const fallbackCompareFn = darkMode
    ? (luminance: number) =>
        luminance < originLuminance - originLuminanceMinDifference
    : (luminance: number) =>
        luminance > originLuminance + originLuminanceMinDifference;

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
      hoverColor = "#ff69b4";
      pressedColor = "#ff69b4";
    }
  }

  return {
    color,
    onColor,
    onColorHover,
    onColorPressed,
    hoverColor,
    pressedColor,
  };
};

export const getSpeakingNames = (
  speakingNames: SpeakingName[],
  allColors: Record<string, string>,
  darkMode: boolean,
): any => {
  let result: any = {};
  Object.entries(allColors).forEach((value) => {
    const name = value[0];

    if (isOriginColor(name)) {
      const colorScheme = darkMode ? "dark" : "light";
      result = {
        ...result,
        [`--db-${name}-on-enabled`]: `var(--db-${name}-on-${colorScheme})`,
        [`--db-${name}-on-hover`]: `var(--db-${name}-on-hover-${colorScheme})`,
        [`--db-${name}-on-pressed`]: `var(--db-${name}-on-pressed-${colorScheme})`,
        [`--db-${name}-origin-enabled`]: `var(--db-${name}-origin-${colorScheme})`,
        [`--db-${name}-origin-hover`]: `var(--db-${name}-hover-${colorScheme})`,
        [`--db-${name}-origin-pressed`]: `var(--db-${name}-pressed-${colorScheme})`,
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
