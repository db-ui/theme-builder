import {
  getHeissluftColors,
  getValidPaletteColorAsHex,
} from "../../../../utils/generate-colors.ts";
import chroma from "chroma-js";
import { isValidColor } from "../../../../utils";

export const getAlternativeColor = (
  colors: Record<string, string>,
  name: string,
  luminanceSteps: number[],
  custom: boolean,
  alternativeHex: string,
  currentColor?: string,
) => {
  const color = currentColor ?? colors[name];
  const origin = isValidColor(color) ? color : "#ff69b4";
  const neutralColors = getHeissluftColors(
    "neutral",
    colors.neutral,
    luminanceSteps,
  );
  const heissluftColors = getHeissluftColors(name, color, luminanceSteps);
  const neutralBgDarkest = neutralColors.at(0);
  const neutralBgLightest = neutralColors.at(-1);
  const lowContrastDark =
    chroma.contrast(
      chroma.hex(origin),
      chroma.hex(neutralBgDarkest?.hex || "#ff69b4"),
    ) < 3;
  const lowContrastLight =
    chroma.contrast(
      chroma.hex(origin),
      chroma.hex(neutralBgLightest?.hex || "#ff69b4"),
    ) < 3;

  let hex = alternativeHex;
  let dark = true;
  if (!custom) {
    if (lowContrastDark) {
      hex = getValidPaletteColorAsHex(heissluftColors, true, neutralBgDarkest);
    }
    if (lowContrastLight) {
      dark = false;
      hex = getValidPaletteColorAsHex(
        heissluftColors,
        false,
        neutralBgLightest,
      );
    }
    if (!lowContrastDark && !lowContrastLight) {
      hex = origin;
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
