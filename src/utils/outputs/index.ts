import { DefaultColorType, HeisslufType } from "../data.ts";
import { getHeissluftColors } from "../generate-colors.ts";

export const prefix = "db";

export const nonRemProperties = ["opacity", "elevation", "transition", "font"];

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

export const isFontFamily = (path: string[]): boolean =>
  (path[0] === "font" && path[1] === "family") || path[0] !== "font";

export const isDimensionProperty = (context: any) =>
  context.isLeaf &&
  context.path.length > 0 &&
  context.path[0] !== "colors" &&
  context.path[0] !== "additionalColors" &&
  context.path[0] !== "customColors" &&
  context.path[0] !== "branding" &&
  isFontFamily(context.path) &&
  !context.path.includes("_scale");


export const getTraverseKey = (path: string[], separator: string = "-") =>
  `${path
    .map((p) => p.toLowerCase())
    .map((p) => {
      return p === "lineheight"
        ? "line-height"
        : p === "fontsize"
          ? "font-size"
          : p;
    })
    .join(separator)}`;

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
