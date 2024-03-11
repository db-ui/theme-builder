import {
  getHeissluftColors,
  getValidPaletteColorAsHex,
} from "../../../../utils/generate-colors.ts";
import chroma from "chroma-js";
import { DefaultColorMappingType } from "../../../../utils/data.ts";
import { isValidColor } from "../../../../utils";

export const getAlternativeBrand = (
  colors: DefaultColorMappingType,
  luminanceSteps: number[],
  custom: boolean,
  alternativeHex: string,
) => {
  const brand = isValidColor(colors.brand) ? colors.brand : "#ff69b4";
  const neutralColors = getHeissluftColors(
    "neutral",
    colors.neutral,
    luminanceSteps,
  );
  const brandColors = getHeissluftColors("brand", colors.brand, luminanceSteps);
  const neutralBgDarkest = neutralColors.at(0);
  const neutralBgLightest = neutralColors.at(-1);
  const lowContrastDark =
    chroma.contrast(
      chroma.hex(brand),
      chroma.hex(neutralBgDarkest?.hex || "#ff69b4"),
    ) < 3;
  const lowContrastLight =
    chroma.contrast(
      chroma.hex(brand),
      chroma.hex(neutralBgLightest?.hex || "#ff69b4"),
    ) < 3;

  let hex = alternativeHex;
  let dark = true;
  if (!custom) {
    if (lowContrastDark) {
      hex = getValidPaletteColorAsHex(
        brandColors,
        true,
        neutralBgDarkest,
      );
    }
    if (lowContrastLight) {
      dark = false;
      hex = getValidPaletteColorAsHex(
          brandColors,
          false,
          neutralBgLightest,
      );
    }
    if (!lowContrastDark && !lowContrastLight) {
      hex = brand;
    }
  }

  const isValid =
    chroma.contrast(
      chroma.hex(hex),
      chroma.hex(neutralColors.at(dark ? -1 : 0)?.hex || "#ff69b4"),
    ) < 3;
  return {
    custom,
    hex,
    dark,
    isValid,
  };
};
