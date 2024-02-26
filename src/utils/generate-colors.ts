import { defaultLuminances, HeisslufType } from "./data.ts";
import { Hsluv } from "hsluv";

export const white = "#fff";
export const black = "#000";

export const getHeissluftColors = (
  name: string,
  color: string,
  luminanceSteps: number[] = defaultLuminances,
): HeisslufType[] => {
  const platte: HeisslufType[] = [];

  luminanceSteps.forEach((currentLuminance, index) => {
    const hsluv = new Hsluv();
    hsluv.hex = color;
    hsluv.hexToHsluv();
    const paletteColor: HeisslufType = {
      hex: "",
      saturation: hsluv.hsluv_s,
      hue: hsluv.hsluv_h,
      luminance:
        name === "neutral" && index === luminanceSteps.length - 1
          ? 100
          : currentLuminance,
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
