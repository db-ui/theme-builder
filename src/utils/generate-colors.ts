import { defaultLuminances, HeisslufType } from "./data.ts";
import { Hsluv } from "hsluv";

export const white = "#fff";
export const black = "#000";

export const getHeissluftColors = (color: string): HeisslufType[] => {
  const platte: HeisslufType[] = [];

  defaultLuminances.forEach((currentLuminance) => {
    const hsluv = new Hsluv();
    hsluv.hex = color;
    hsluv.hexToHsluv();
    const paletteColor: HeisslufType = {
      hex: "",
      saturation: hsluv.hsluv_s,
      hue: hsluv.hsluv_h,
      luminance:
        currentLuminance === 1001
          ? 100
          : currentLuminance === -1
            ? 0
            : Math.pow(1000 - currentLuminance, 0.33) * 10,
    };
    hsluv.hsluv_l = paletteColor.luminance;
    hsluv.hsluvToHex();
    paletteColor.hex = hsluv.hex;
    platte.push(paletteColor);
  });

  return [
    ...platte
      .sort((a, b) => {
        if (a.luminance > b.luminance) {
          return 1;
        } else if (a.luminance < b.luminance) {
          return -1;
        }
        return 0;
      })
      .map((hsl, index) => ({ ...hsl, index })),
  ];
};
