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
  const testColor = isValidColor(color) ? color : FALLBACK_COLOR;
  const originHSLBgDark = heissluftColors.at(0);
  const originHSLBgLight = heissluftColors.at(-3);
  const lowContrastDark = getContrast(testColor, originHSLBgDark?.hex) < 3;
  const lowContrastLight = getContrast(testColor, originHSLBgLight?.hex) < 3;

  return {
    originHSLBgDark: originHSLBgDark?.hex ?? FALLBACK_COLOR,
    originHSLBgLight: originHSLBgLight?.hex ?? FALLBACK_COLOR,
    originLightAlternative: lowContrastLight
      ? getValidPaletteColorAsHex(heissluftColors, false, originHSLBgLight)
      : color,
    originDarkAlternative: lowContrastDark
      ? getValidPaletteColorAsHex(heissluftColors, true, originHSLBgDark)
      : color,
  };
};

// We use this for hover/pressed
const originLuminanceDifference: number = 10;
const maxDarkLuminance = 2 * originLuminanceDifference;
const maxLightLuminance = 100 - maxDarkLuminance;

const getHoverPressedColors = (
  defaultColor: string,
  darkMode: boolean,
  origin?: string,
) => {
  let hsluv = new Hsluv();
  hsluv.hex = defaultColor;
  hsluv.hexToHsluv();
  const defaultColorLuminance = hsluv.hsluv_l;
  hsluv.hsluvToHex();
  hsluv.hex = origin ?? defaultColor;
  hsluv.hexToHsluv();

  let hoverColorLuminance: number;
  let pressedColorLuminance: number;
  if (darkMode) {
    if (defaultColorLuminance <= maxLightLuminance) {
      hoverColorLuminance = defaultColorLuminance + originLuminanceDifference;
      pressedColorLuminance = defaultColorLuminance + maxDarkLuminance;
    } else {
      hoverColorLuminance = defaultColorLuminance - originLuminanceDifference;
      pressedColorLuminance = defaultColorLuminance - maxDarkLuminance;
    }
  } else {
    if (defaultColorLuminance >= maxDarkLuminance) {
      hoverColorLuminance = defaultColorLuminance - originLuminanceDifference;
      pressedColorLuminance = defaultColorLuminance - maxDarkLuminance;
    } else {
      hoverColorLuminance = defaultColorLuminance + originLuminanceDifference;
      pressedColorLuminance = defaultColorLuminance + maxDarkLuminance;
    }
  }

  hsluv.hsluv_l = hoverColorLuminance;
  hsluv.hsluvToHex();
  const hoverColor = hsluv.hex;
  hsluv = new Hsluv();
  hsluv.hex = origin ?? defaultColor;
  hsluv.hexToHsluv();

  hsluv.hsluv_l = pressedColorLuminance;
  hsluv.hsluvToHex();
  const pressedColor = hsluv.hex;

  return { hoverColor, pressedColor };
};

const getColorWithLuminance = (
  originBgColor: string,
  luminance: number,
): string => {
  const hsluv = new Hsluv();
  hsluv.hex = originBgColor;
  hsluv.hexToHsluv();
  hsluv.hsluv_l = luminance;
  hsluv.hsluvToHex();
  return hsluv.hex;
};

const getOnColorByContrast = (
  originBgColor: string,
  originPressedBgColor: string,
  darkMode: boolean,
): { onColor: string; accessible: boolean } => {
  const luminance: number[] = darkMode ? [98, 99, 100] : [2, 1, 0];
  for (const lum of luminance) {
    const onBgColorPressed = getColorWithLuminance(originBgColor, lum);

    const defaultContrast = getContrast(originBgColor, onBgColorPressed);
    const pressedContrast = getContrast(originPressedBgColor, onBgColorPressed);

    if (defaultContrast >= 4.5 && pressedContrast >= 4.5) {
      return { onColor: onBgColorPressed, accessible: true };
    }
  }

  const onBgColorPressed = getColorWithLuminance(
    originBgColor,
    luminance.at(-1) || 0,
  );

  return { onColor: onBgColorPressed, accessible: false };
};

export const getOriginOnColors = (
  originBgColor: string,
  originPressedBgColor: string,
  darkMode: boolean,
  customFgColor?: string,
): {
  onOrigin: string;
  hoverColor: string;
  pressedColor: string;
  onOriginAccessible: boolean;
  onOriginAlternative: string;
} => {
  let color: string;
  const { onColor, accessible: accessibleOnColor } = getOnColorByContrast(
    originBgColor,
    originPressedBgColor,
    darkMode,
  );

  color = onColor;

  if (!accessibleOnColor) {
    const { onColor: alternativeOnColor, accessible: alternativeAccessible } =
      getOnColorByContrast(originBgColor, originPressedBgColor, !darkMode) ??
      "#ff69b4";
    if (alternativeAccessible) {
      color = alternativeOnColor;
    }
  }

  const fgColor = customFgColor ?? color;

  const contrastPressed = getContrast(originPressedBgColor, fgColor);
  const contrastOrigin = getContrast(originBgColor, fgColor);

  const accessible =
    (contrastPressed === 1 || contrastPressed >= 4.5) &&
    (contrastOrigin === 1 || contrastOrigin >= 4.5);

  return {
    onOrigin: fgColor,
    onOriginAlternative: color,
    onOriginAccessible: accessible,
    ...getHoverPressedColors(fgColor, darkMode, originPressedBgColor),
  };
};

const getOriginBackgroundColor = (
  name: string,
  origin: string,
  luminanceSteps: number[],
  color: string,
): DefaultColorType => {
  const hsluv = new Hsluv();
  hsluv.hex = origin;
  hsluv.hexToHsluv();

  // We use one origin color as initial suggestion based on origin luminance
  // The user can overwrite it in ui based on the a11y tested light alternative or with a custom value
  const originLuminanceDark = hsluv.hsluv_l < 42; // <- I found the question

  const { hoverColor, pressedColor } = getHoverPressedColors(
    color,
    originLuminanceDark,
  );

  const heissluftColors = getHeissluftColors(name, color, luminanceSteps);
  const {
    originLightAlternative,
    originDarkAlternative,
    originHSLBgLight,
    originHSLBgDark,
  } = getAccessibleOriginColors(heissluftColors, color);

  return {
    origin,
    originHSLBgLight,
    originHSLBgDark,
    originLightAlternative,
    originLightAccessible: color === originLightAlternative,
    originLightDefault: color,
    originLightHovered: hoverColor,
    originLightPressed: pressedColor,
    originDarkAlternative,
    originDarkAccessible: color === originDarkAlternative,
    originDarkDefault: color,
    originDarkHovered: hoverColor,
    originDarkPressed: pressedColor,
  };
};

export const generateColorsByOrigin = (
  name: string,
  origin: string,
  luminanceSteps: number[],
  customBgColor?: string,
): DefaultColorType => {
  const color = customBgColor ?? origin;
  const backgroundColors = getOriginBackgroundColor(
    name,
    origin,
    luminanceSteps,
    color,
  );

  const {
    onOrigin: onOriginLightDefault,
    hoverColor: onOriginLightHovered,
    pressedColor: onOriginLightPressed,
    onOriginAccessible: onOriginLightAccessible,
    onOriginAlternative: onOriginLightAlternative,
  } = getOriginOnColors(color, backgroundColors.originLightPressed!, false);
  const {
    onOrigin: onOriginDarkDefault,
    hoverColor: onOriginDarkHovered,
    pressedColor: onOriginDarkPressed,
    onOriginAccessible: onOriginDarkAccessible,
    onOriginAlternative: onOriginDarkAlternative,
  } = getOriginOnColors(color, backgroundColors.originDarkPressed!, true);

  return {
    ...backgroundColors,
    onOriginLightDefault,
    onOriginLightHovered,
    onOriginLightPressed,
    onOriginLightAccessible,
    onOriginLightAlternative,
    onOriginDarkDefault,
    onOriginDarkHovered,
    onOriginDarkPressed,
    onOriginDarkAccessible,
    onOriginDarkAlternative,
  };
};
