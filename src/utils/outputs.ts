import { DefaultThemeType, HeisslufType, SpeakingName } from "./data.ts";
import traverse from "traverse";
import { Hsluv } from "hsluv";
import { black, getHeissluftColors, white } from "./generate-colors.ts";
import { getLuminance } from "./index.ts";

export const prefix = "db";

export const getCssPropertyAsString = (properties: any): string => {
  let resultString = "";

  for (const [key, value] of Object.entries(properties)) {
    resultString += `${key}: ${value};\n`;
  }

  return resultString;
};

const nonRemProperties = ["opacity", "elevation"];

export const getNonColorCssProperties = (
  theme: DefaultThemeType,
  asString?: boolean,
) => {
  const resolvedProperties: any = {};
  traverse(theme).forEach(function (value) {
    if (this.isLeaf && this.path.length > 0 && this.path[0] !== "colors") {
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

      if (this.path.includes("body") && this.path.at(-1) === "fontSize") {
        const lineHeightPath = [...this.path];
        lineHeightPath[lineHeightPath.length - 1] = "lineHeight";
        const fontSizeAsNumber = Number(value);
        const lineHeightAsNumber = Number(traverse(theme).get(lineHeightPath));

        const remainingIconPath = this.path
          .filter(
            (path) =>
              path !== "typography" && path !== "body" && path !== "fontSize",
          )
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

export const getCssThemeProperties = (theme: DefaultThemeType): string => {
  const customTheme = getNonColorCssProperties(theme, true);

  return `:root{
    ${customTheme}
  }
  `;
};

export const getPaletteOutput = (palette: object): any => {
  const result: any = {};
  Object.entries(palette).forEach((color) => {
    const name = color[0];
    const hslType: HeisslufType[] = color[1];
    hslType.forEach((hsl) => {
      result[`--${prefix}-${name}-${hsl.index ?? hsl.name}`] = hsl.hex;
    });
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
 */
const getExtraBrandColors = (
  color: string,
  darkMode: boolean,
  luminanceSteps: number[],
) => {
  const result: any = {};
  const hslColors: HeisslufType[] = getHeissluftColors(color, luminanceSteps);
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

  let foundColors = hslColors.filter((hsl) => bestCompareFn(hsl.luminance));
  foundColors = darkMode ? foundColors : foundColors.reverse();
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

  result[`--${prefix}-brand-on-enabled`] = brandOnColor;
  result[`--${prefix}-brand-origin-enabled`] = color;
  result[`--${prefix}-brand-origin-hover`] = hoverColor;
  result[`--${prefix}-brand-origin-pressed`] = pressedColor;

  return result;
};

export const getSpeakingNames = (
  speakingNames: SpeakingName[],
  allColors: object,
  darkMode: boolean,
  luminanceSteps: number[],
): any => {
  let result: any = {};
  Object.entries(allColors).forEach((value) => {
    const name = value[0];
    const color = value[1];

    if (name === "brand") {
      result = {
        ...result,
        ...getExtraBrandColors(color, darkMode, luminanceSteps),
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
export const getSpeakingNamesForJSON = (
  speakingNames: SpeakingName[],
  allColors: object,
  darkMode: boolean,
  luminanceSteps: number[],
): any => {
  let result: any = {};
  Object.entries(allColors).forEach((value) => {
    const name = value[0];
    const color = value[1];

    if (name === "brand") {
      result = {
        ...result,
        ...getExtraBrandColors(color, darkMode, luminanceSteps),
      };
    }

    speakingNames.forEach((speakingName) => {
      if (
        speakingName.transparencyDark !== undefined ||
        speakingName.transparencyLight !== undefined
      ) {
        if (speakingName.name.includes("enabled") || speakingName.name.includes("hover") || speakingName.name.includes("pressed")) {  
          const stateIndex = speakingName.name.lastIndexOf("-");
          const nameWithoutState = speakingName.name.slice(0, stateIndex); 
          const state = speakingName.name.slice(stateIndex + 1);
          const stateNumbered = (state === 'enabled') ? '01' : (state === 'hover') ? '02' : '03';
          result[`${name}/${nameWithoutState}/${stateNumbered}-${state}`] =
            `transparency ${
              darkMode
                ? speakingName.transparencyDark
                : speakingName.transparencyLight
            }%, var(--${prefix}-${name}-${
              darkMode ? speakingName.dark : speakingName.light
            }))`;
        } else {
          result[`${name}/${speakingName.name}`] =
          `transparency ${
            darkMode
              ? speakingName.transparencyDark
              : speakingName.transparencyLight
          }%, var(--${prefix}-${name}-${
            darkMode ? speakingName.dark : speakingName.light
          }))`;
        }
      } else {
        if (speakingName.name.includes("on-bg")) { 
          const nameWithoutOnPrefix = speakingName.name.replace("on-", ""); 
          if (speakingName.name.includes("enabled") || speakingName.name.includes("hover") || speakingName.name.includes("pressed")) {          
            const stateIndex = nameWithoutOnPrefix.lastIndexOf("-");          
            const nameWithoutState = nameWithoutOnPrefix.slice(0, stateIndex); 
            const state = speakingName.name.slice(stateIndex + 1).replace(/^ak-/, "");
            const stateNumbered = (state === 'enabled') ? '01' : (state === 'hover') ? '02' : '03';
            result
            [`On/${name}/${nameWithoutState}/${stateNumbered}-${state}`] =
              `transparency 0%, var(--${prefix}-${name}-${
                darkMode ? speakingName.dark : speakingName.light
              })`;
          } else {
            result[`On/${name}/${nameWithoutOnPrefix}`] =
            `transparency 0%, var(--${prefix}-${name}-${
              darkMode ? speakingName.dark : speakingName.light
            })`;
          }
        } else {
          if (speakingName.name.includes("enabled") || speakingName.name.includes("hover") || speakingName.name.includes("pressed")) {          
            const stateIndex = speakingName.name.lastIndexOf("-");
            const nameWithoutState = speakingName.name.slice(0, stateIndex); 
            const state = speakingName.name.slice(stateIndex + 1);
            const stateNumbered = (state === 'enabled') ? '01' : (state === 'hover') ? '02' : '03';
            result[`${name}/${nameWithoutState}/${stateNumbered}-${state}`] =
              `transparency 0%, var(--${prefix}-${name}-${
                darkMode ? speakingName.dark : speakingName.light
              })`;
            } else {
              result[`${name}/${speakingName.name}`] =
              `transparency 0%, var(--${prefix}-${name}-${
                darkMode ? speakingName.dark : speakingName.light
              })`;
            }
        }
      }
    }); 
  });  
  return result;
};