import {
  DefaultColorType,
  HeisslufType,
  SpeakingName,
  ThemeType,
} from "../../data.ts";
import traverse from "traverse";
import {
  getPalette,
  getTraverseKey,
  isDimensionProperty,
  nonRemProperties,
  prefix,
} from "../index.ts";

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

export const getNonColorCssProperties = (
  theme: ThemeType,
  asString?: boolean,
) => {
  const resolvedProperties: any = {};
  traverse(theme).forEach(function (value) {
    if (isDimensionProperty(this)) {
      const key = `--${prefix}-${getTraverseKey(this.path)}`;

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
  return `:root{
      ${colorsPalette}
      ${colorsSpeakingNames}
      }
      
[data-color-scheme="light"] {
	color-scheme: light;
}

[data-color-scheme="dark"] {
	color-scheme: dark;
}
      `;
};

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
    result[`--${prefix}-${name}-origin-light-default`] = color.originLight;
    result[`--${prefix}-${name}-origin-light-hovered`] =
      color.originLightHovered;
    result[`--${prefix}-${name}-origin-light-pressed`] =
      color.originLightPressed;
    result[`--${prefix}-${name}-on-origin-light-default`] = color.onOriginLight;
    result[`--${prefix}-${name}-on-origin-light-hovered`] =
      color.onOriginLightHovered;
    result[`--${prefix}-${name}-on-origin-light-pressed`] =
      color.onOriginLightPressed;

    result[`--${prefix}-${name}-origin-dark-default`] = color.originDark;
    result[`--${prefix}-${name}-origin-dark-hovered`] = color.originDarkHovered;
    result[`--${prefix}-${name}-origin-dark-pressed`] = color.originDarkPressed;
    result[`--${prefix}-${name}-on-origin-dark-default`] = color.onOriginDark;
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
