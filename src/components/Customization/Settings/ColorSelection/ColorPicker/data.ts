import { DefaultColorType, HeisslufType } from "../../../../../utils/data.ts";
import {
  getHeissluftColors,
  getValidPaletteColorAsHex,
} from "../../../../../utils/generate-colors.ts";
import { Hsluv } from "hsluv";
import { getContrast, isValidColor } from "../../../../../utils";
import { FALLBACK_COLOR } from "../../../../../constants.ts";

export type ColorPickerType = {
  label: string;
  color: DefaultColorType;
  setOriginColor?: (color: DefaultColorType) => void;
  onAddColor?: (name: string, color: DefaultColorType) => void;
  customColor?: boolean;
  isAddColor?: boolean;
  onDelete?: () => void;
};

export const getAccessibleOriginColors = (
  heissluftColors: HeisslufType[],
  color: string,
) => {
  const origin = isValidColor(color) ? color : FALLBACK_COLOR;
  const originBgDark = heissluftColors.at(0);
  const originBgLight = heissluftColors.at(-3);
  const lowContrastDark = getContrast(origin, originBgDark?.hex) < 3;
  const lowContrastLight = getContrast(origin, originBgLight?.hex) < 3;

  return {
    originBgDark: originBgDark?.hex ?? FALLBACK_COLOR,
    originBgLight: originBgLight?.hex ?? FALLBACK_COLOR,
    originLightAlternative: lowContrastLight
      ? getValidPaletteColorAsHex(heissluftColors, false, originBgLight)
      : color,
    originDarkAlternative: lowContrastDark
      ? getValidPaletteColorAsHex(heissluftColors, true, originBgDark)
      : color,
  };
};

// We use this for hover/pressed
const originLuminanceDifference: number = 10;

const getHoverPressedColors = (defaultColor: string, darkMode: boolean) => {
  let hsluv = new Hsluv();
  hsluv.hex = defaultColor;
  hsluv.hexToHsluv();
  const defaultColorLuminance = hsluv.hsluv_l;

  let hoverColorLuminance: number;
  let pressedColorLuminance: number;
  if (darkMode) {
    if (defaultColorLuminance <= 80) {
      hoverColorLuminance = defaultColorLuminance + originLuminanceDifference;
      pressedColorLuminance =
        defaultColorLuminance + originLuminanceDifference * 2;
    } else {
      hoverColorLuminance = defaultColorLuminance - originLuminanceDifference;
      pressedColorLuminance =
        defaultColorLuminance - originLuminanceDifference * 2;
    }
  } else {
    if (defaultColorLuminance >= 20) {
      hoverColorLuminance = defaultColorLuminance - originLuminanceDifference;
      pressedColorLuminance =
        defaultColorLuminance - originLuminanceDifference * 2;
    } else {
      hoverColorLuminance = defaultColorLuminance + originLuminanceDifference;
      pressedColorLuminance =
        defaultColorLuminance + originLuminanceDifference * 2;
    }
  }

  hsluv.hsluv_l = hoverColorLuminance;
  hsluv.hsluvToHex();
  const hoverColor = hsluv.hex;
  hsluv = new Hsluv();
  hsluv.hex = defaultColor;
  hsluv.hexToHsluv();

  hsluv.hsluv_l = pressedColorLuminance;
  hsluv.hsluvToHex();
  const pressedColor = hsluv.hex;

  return { hoverColor, pressedColor };
};

const onOriginLightLuminance = 98;
const onOriginDarkLuminance = 2;

const getValidColor = (
  originBgColor: string,
  color: string,
  fallbackLuminance: number,
): string | undefined => {
  if (getContrast(originBgColor, color) < 4.5) {
    const hsluv = new Hsluv();
    hsluv.hex = originBgColor;
    hsluv.hexToHsluv();
    hsluv.hsluv_l = fallbackLuminance;
    hsluv.hsluvToHex();
    return hsluv.hex;
  }
  return undefined;
};

export const getOriginOnColors = (
  originBgColor: string,
  darkMode: boolean,
  customFgColor?: string,
) => {
  const primaryLuminance = darkMode
    ? onOriginDarkLuminance
    : onOriginLightLuminance;
  const fallbackLuminance = darkMode
    ? onOriginLightLuminance
    : onOriginDarkLuminance;
  const fallback2Luminance = darkMode ? 99 : 1;
  const fallback3Luminance = darkMode ? 100 : 0;
  // eslint-disable-next-line prefer-const
  let hsluv = new Hsluv();
  hsluv.hex = originBgColor;
  hsluv.hexToHsluv();
  hsluv.hsluv_l = primaryLuminance;
  hsluv.hsluvToHex();
  let color = hsluv.hex;
  const fallbackColor1 = getValidColor(originBgColor, color, fallbackLuminance);
  if (fallbackColor1) {
    color = fallbackColor1;
    const fallbackColor2 = getValidColor(
      originBgColor,
      color,
      fallback2Luminance,
    );
    if (fallbackColor2) {
      color = fallbackColor2;
      const fallbackColor3 = getValidColor(
        originBgColor,
        color,
        fallback3Luminance,
      );
      if (fallbackColor3) {
        color = fallbackColor3;
      }
    }
  }

  const fgColor = customFgColor ?? color;
  const contrast = getContrast(originBgColor, fgColor);

  return {
    onOrigin: fgColor,
    onOriginAlternative: color,
    onOriginAccessible: contrast === 1 || contrast >= 4.5,
    ...getHoverPressedColors(fgColor, darkMode),
  };
};

const getOriginBackgroundColor = (
  name: string,
  origin: string,
  luminanceSteps: number[],
  color: string,
): DefaultColorType => {
  const heissluftColors = getHeissluftColors(name, origin, luminanceSteps);
  const {
    originLightAlternative,
    originDarkAlternative,
    originBgLight,
    originBgDark,
  } = getAccessibleOriginColors(heissluftColors, color);
  const { hoverColor: originLightHovered, pressedColor: originLightPressed } =
    getHoverPressedColors(color, false);
  const { hoverColor: originDarkHovered, pressedColor: originDarkPressed } =
    getHoverPressedColors(color, true);

  return {
    origin,
    originBgLight,
    originBgDark,
    originLight: color,
    originLightAlternative,
    originLightAccessible: color === originLightAlternative,
    originLightHovered,
    originLightPressed,
    originDark: color,
    originDarkAlternative,
    originDarkAccessible: color === originDarkAlternative,
    originDarkHovered,
    originDarkPressed,
  };
};

export const generateColorsByOrigin = (
  name: string,
  origin: string,
  luminanceSteps: number[],
  customBgColor?: string,
): DefaultColorType => {
  const color = customBgColor ?? origin;
  const {
    onOrigin: onOriginLight,
    hoverColor: onOriginLightHover,
    pressedColor: onOriginLightPressed,
    onOriginAccessible: onOriginLightAccessible,
    onOriginAlternative: onOriginLightAlternative,
  } = getOriginOnColors(color, false);
  const {
    onOrigin: onOriginDark,
    hoverColor: onOriginDarkHover,
    pressedColor: onOriginDarkPressed,
    onOriginAccessible: onOriginDarkAccessible,
    onOriginAlternative: onOriginDarkAlternative,
  } = getOriginOnColors(color, true);

  return {
    ...getOriginBackgroundColor(name, origin, luminanceSteps, color),
    onOriginLight,
    onOriginLightHovered: onOriginLightHover,
    onOriginLightPressed,
    onOriginLightAccessible,
    onOriginLightAlternative,
    onOriginDark,
    onOriginDarkHovered: onOriginDarkHover,
    onOriginDarkPressed,
    onOriginDarkAccessible,
    onOriginDarkAlternative,
  };
};
