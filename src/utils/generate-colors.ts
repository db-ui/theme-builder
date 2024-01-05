import { defaultMinContrast, HeisslufType } from "./data.ts";
import { Hsluv } from "hsluv";
import chroma from "chroma-js";

export const white = "#fff";
export const black = "#000";

export const getHeissluftColors = (
  color: string,
  contrast: number = defaultMinContrast,
): HeisslufType[] => {
  if (!color) {
    return [];
  }

  const platte: HeisslufType[] = [];
  let currentLuminance = 0;

  while (currentLuminance <= 100) {
    const hsluv = new Hsluv();
    hsluv.hex = color;
    hsluv.hexToHsluv();
    hsluv.hsluv_l = currentLuminance;
    const paletteColor: HeisslufType = {
      hex: "",
      saturation: hsluv.hsluv_s,
      hue: hsluv.hsluv_h,
      luminance: currentLuminance,
    };
    hsluv.hsluvToHex();
    paletteColor.hex = hsluv.hex;

    if (
      platte.length === 0 ||
      currentLuminance === 100 ||
      chroma.contrast(
        chroma.hex(paletteColor.hex),
        chroma.hex(platte.at(-1)!.hex),
      ) > contrast
    ) {
      platte.push(paletteColor);
    }

    currentLuminance++;
  }

  return platte.map((hsl, index) => ({ ...hsl, index }));
};
