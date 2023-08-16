import { ColorType } from "./data.ts";

const requiredCssProps = [
  "enabled",
  "hover",
  "pressed",
  "on-bg-enabled",
  "on-bg-weak-enabled",
  "bg-enabled",
  "element-enabled",
  "border-enabled",
  "border-weak-enabled",
];

const prefix = "db";
export const getCssProperties = (
  colors: ColorType[],
  asString?: boolean,
): any => {
  let result: any = {};

  colors.forEach((color: any) => {
    requiredCssProps.forEach((prop: string) => {
      // TODO: Use brand in future
      const name = color.name === "brand" ? "primary" : color.name;
      result[`--${prefix}-${name}-${prop}`] = color[prop];
      if (name === "neutral") {
        result[`--${prefix}-${name}-on-bg-hover`] = color["on-bg-hover"];
        result[`--${prefix}-${name}-on-bg-pressed`] = color["on-bg-pressed"];
      }
    });
  });

  if (asString) {
    const resultString = "";
    Object.keys(result).forEach((key) => {
      result += `${key}: ${result[key]};\n`;
    });

    return resultString;
  }

  return result;
};
export const getCssPropertiesOutput = (
  lightColors: ColorType[],
  darkColors: ColorType[],
): string => {
  const lightProps = getCssProperties(lightColors, true);
  const darkProps = getCssProperties(darkColors, true);

  return `:root{
    ${lightProps}
    @media (prefers-color-scheme: dark) {
      ${darkProps}
    }
  }
  `;
};
