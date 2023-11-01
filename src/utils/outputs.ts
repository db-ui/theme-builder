import { ColorType, DefaultThemeType } from "./data.ts";
import traverse from "traverse";

const requiredCssProps = [
  "on-enabled",
  "origin-enabled",
  "origin-hover",
  "origin-pressed",
  "text-enabled",
  "text-hover",
  "text-pressed",
  "on-bg-enabled",
  "on-bg-hover",
  "on-bg-pressed",
  "on-bg-weak-enabled",
  "bg-enabled",
  "bg-strong-enabled",
  "element-enabled",
  "border-enabled",
  "border-weak-enabled",
];

export const prefix = "db";

const getCssPropertyAsString = (properties: any): string => {
  let resultString = "";

  for (const [key, value] of Object.entries(properties)) {
    resultString += `${key}: ${value};\n`;
  }

  return resultString;
};

export const getColorCssProperties = (
  colors: ColorType[],
  asString?: boolean,
): any => {
  const result: any = {};

  colors.forEach((color: any) => {
    requiredCssProps.forEach((prop: string) => {
      const name = color.name;
      if (color[prop]) {
        result[`--${prefix}-${name}-${prop}`] = color[prop];
      }
    });
  });

  if (asString) {
    return getCssPropertyAsString(result);
  }

  return result;
};

export const getRemCssProperties = (
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
        typeof value === "string" || value instanceof String
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

export const getCssPropertiesOutput = (
  theme: DefaultThemeType,
  lightColors: ColorType[],
  darkColors: ColorType[],
): string => {
  const lightProps = getColorCssProperties(lightColors, true);
  const darkProps = getColorCssProperties(darkColors, true);
  const customTheme = getRemCssProperties(theme, true);

  return `:root{
    /* COLORS */ 
    ${lightProps}
    @media (prefers-color-scheme: dark) {
      ${darkProps}
    }
    
    /* REST */ 
    ${customTheme}
  }
  `;
};
export const getDarkThemeOutput = (darkColors: ColorType[]): string => {
  const darkProps = getColorCssProperties(darkColors, true);

  return `.${prefix}-theme-dark, [data-theme="dark"]{
      ${darkProps}
  }
  `;
};
