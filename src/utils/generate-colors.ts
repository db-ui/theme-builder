import { defaultLuminances, HeisslufType } from "./data.ts";
import { Hsluv } from "hsluv";


export const getHeissluftColors = (
  color: string,
  luminanceSteps: number[] = defaultLuminances,
): HeisslufType[] => {
  const platte: HeisslufType[] = [];

  luminanceSteps.forEach((currentLuminance) => {
    const hsluv = new Hsluv();
    hsluv.hex = color;
    hsluv.hexToHsluv();
    const paletteColor: HeisslufType = {
      hex: "",
      saturation: hsluv.hsluv_s,
      hue: hsluv.hsluv_h,
      luminance: currentLuminance,
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
