import chroma from "chroma-js";
import { BASE_PATH } from "../constants.ts";

export const getThemeImage = (image: string): string => {
  if (image.startsWith("data:image")) {
    return image;
  }

  return `${BASE_PATH}/assets/images/${image || "peace-in-a-box.svg"}`;
};

export const isValidColor = (color: string): boolean => chroma.valid(color);

export const getLuminance = (color: string): number =>
  chroma.valid(color) ? chroma.hex(color).luminance() : -1;

export const getContrast = (color: string, bgColor: string): number =>
  chroma.valid(color) && chroma.valid(bgColor)
    ? chroma.contrast(color, bgColor)
    : -1;

export const isOriginColor = (name: string): boolean =>
  !["neutral", "informational", "successful", "warning", "critical"].includes(
    name,
  );

export const kebabCase = (
  input: string,
  firstLower?: boolean,
  separator?: string,
): string => {
  try {
    return input
      .replace(/-/g, " ")
      .split(" ")
      .map(
        (split, index) =>
          (firstLower && index === 0 ? split[0] : split[0].toUpperCase()) +
          split.substring(1, split.length),
      )
      .join(separator || "");
  } catch (error) {
    console.error(error);
  }
  return "ERROR";
};
