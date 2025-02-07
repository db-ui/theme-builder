import {
  DefaultColorType,
  HeisslufType,
  SpeakingName,
  ThemeType,
} from "../data.ts";
import traverse from "traverse";
import { getHeissluftColors } from "../generate-colors.ts";

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

export const getTypedCssPropertyAsString = (
  properties: any,
  type: string,
): string => {
  let resultString = "";

  for (const [key, value] of Object.entries(properties)) {
    resultString += `@property ${key} { syntax: "<${type}>"; initial-value: ${value}; inherits: true; }\n`;
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
  colorsSpeakingNames: string,
): string => {
  return `${colorsPalette}
      ${colorsSpeakingNames}
      
[data-color-scheme="light"] {
	color-scheme: light;
}

[data-color-scheme="dark"] {
	color-scheme: dark;
}
      `;
};

export const getPalette = (
  allColors: Record<string, DefaultColorType>,
  luminanceSteps: number[],
): Record<string, HeisslufType[]> =>
  Object.entries(allColors)
    .map((value) => {
      const name = value[0];
      const color = value[1];
      const hslColors: HeisslufType[] = getHeissluftColors(
        name,
        color.origin,
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

export const getPaletteOutput = (
  allColors: Record<string, DefaultColorType>,
  luminanceSteps: number[],
): any => {
  const palette: Record<string, HeisslufType[]> = getPalette(
    allColors,
    luminanceSteps,
  );
  const result: any = {};

  Object.entries(allColors).forEach(([unformattedName, color]) => {
    const name = unformattedName.toLowerCase();

    const hslType: HeisslufType[] = palette[unformattedName];
    hslType.forEach((hsl) => {
      result[`--${prefix}-${name}-${hsl.index ?? hsl.name}`] = hsl.hex;
    });

    result[`--${prefix}-${name}-origin`] = color.origin;
    result[`--${prefix}-${name}-origin-light-default`] = color.originLightDefault;
    result[`--${prefix}-${name}-origin-light-hovered`] =
      color.originLightHovered;
    result[`--${prefix}-${name}-origin-light-pressed`] =
      color.originLightPressed;
    result[`--${prefix}-${name}-on-origin-light-default`] = color.onOriginLightDefault;
    result[`--${prefix}-${name}-on-origin-light-hovered`] =
      color.onOriginLightHovered;
    result[`--${prefix}-${name}-on-origin-light-pressed`] =
      color.onOriginLightPressed;

    result[`--${prefix}-${name}-origin-dark-default`] = color.originDarkDefault;
    result[`--${prefix}-${name}-origin-dark-hovered`] = color.originDarkHovered;
    result[`--${prefix}-${name}-origin-dark-pressed`] = color.originDarkPressed;
    result[`--${prefix}-${name}-on-origin-dark-default`] = color.onOriginDarkDefault;
    result[`--${prefix}-${name}-on-origin-dark-hovered`] =
      color.onOriginDarkHovered;
    result[`--${prefix}-${name}-on-origin-dark-pressed`] =
      color.onOriginDarkPressed;
  });

  return result;
};

export const getSpeakingNames = (
  speakingNames: SpeakingName[],
  allColors: Record<string, DefaultColorType>,
): any => {
  const result: any = {};
  Object.entries(allColors).forEach(([unformattedName]) => {
    const name = unformattedName.toLowerCase();
    result[`--${prefix}-${name}-origin-default`] =
      `light-dark(var(--${prefix}-${name}-origin-light-default),var(--${prefix}-${name}-origin-dark-default))`;
    result[`--${prefix}-${name}-origin-hovered`] =
      `light-dark(var(--${prefix}-${name}-origin-light-hovered),var(--${prefix}-${name}-origin-dark-hovered))`;
    result[`--${prefix}-${name}-origin-pressed`] =
      `light-dark(var(--${prefix}-${name}-origin-light-pressed),var(--${prefix}-${name}-origin-dark-pressed))`;
    result[`--${prefix}-${name}-on-origin-default`] =
      `light-dark(var(--${prefix}-${name}-on-origin-light-default),var(--${prefix}-${name}-on-origin-dark-default))`;
    result[`--${prefix}-${name}-on-origin-hovered`] =
      `light-dark(var(--${prefix}-${name}-on-origin-light-hovered),var(--${prefix}-${name}-on-origin-dark-hovered))`;
    result[`--${prefix}-${name}-on-origin-pressed`] =
      `light-dark(var(--${prefix}-${name}-on-origin-light-pressed),var(--${prefix}-${name}-on-origin-dark-pressed))`;

    speakingNames.forEach((speakingName) => {
      if (
        speakingName.transparencyDark !== undefined ||
        speakingName.transparencyLight !== undefined
      ) {
        result[`--${prefix}-${name}-${speakingName.name}`] =
          `light-dark(color-mix(in srgb, transparent ${
            speakingName.transparencyLight
          }%, var(--${prefix}-${name}-${
            speakingName.light
          })),color-mix(in srgb, transparent ${
            speakingName.transparencyDark
          }%, var(--${prefix}-${name}-${speakingName.dark})))`;
      } else {
        result[`--${prefix}-${name}-${speakingName.name}`] =
          `light-dark(var(--${prefix}-${name}-${
            speakingName.light
          }),var(--${prefix}-${name}-${speakingName.dark}))`;
      }
    });
  });
  return result;
};
