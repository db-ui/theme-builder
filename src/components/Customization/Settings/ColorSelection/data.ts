import {
  getHeissluftColors,
  getReverseColorAsHex,
} from "../../../../utils/generate-colors.ts";
import chroma from "chroma-js";
import { DefaultColorMappingType } from "../../../../utils/data.ts";

export const getAlternativeBrand = (
  colors: DefaultColorMappingType,
  luminanceSteps: number[],
  custom: boolean,
  alternativeHex: string,
) => {
  const brand = colors.brand;
  const neutralColors = getHeissluftColors(
    "neutral",
    colors.neutral,
    luminanceSteps,
  );
  const neutralBgDarkest = neutralColors.at(0);
  const neutralBgLightest = neutralColors.at(-1);
  const lowContrastDark =
    chroma.contrast(
      chroma.hex(colors.brand),
      chroma.hex(neutralBgDarkest?.hex || "hotpink"),
    ) < 3;
  const lowContrastLight =
    chroma.contrast(
      chroma.hex(brand),
      chroma.hex(neutralBgLightest?.hex || "hotpink"),
    ) < 3;

  let hex = alternativeHex;
  let dark = true;
  if (!custom) {
    if (lowContrastDark || lowContrastLight) {
      hex = getReverseColorAsHex(brand);
    }
    if (lowContrastLight) {
      dark = false;
    }
    if (!lowContrastDark && !lowContrastLight) {
      hex = brand;
    }
  }

  const isValid =
    chroma.contrast(
      chroma.hex(hex),
      chroma.hex(neutralColors.at(dark ? -1 : 0)?.hex || "hotpink"),
    ) < 3;
  return {
    custom,
    hex,
    dark,
    isValid,
  };
};
