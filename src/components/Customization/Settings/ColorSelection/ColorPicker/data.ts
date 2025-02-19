import { DefaultColorType } from "../../../../../utils/data.ts";
import { Hsluv } from "hsluv";
import { getContrast } from "../../../../../utils";
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
  darkMode: boolean,
): { onColor: string; accessible: boolean } => {
  const luminance: number[] = darkMode ? [98, 99, 100] : [2, 1, 0];
  for (const lum of luminance) {
    const onBgColorPressed = getColorWithLuminance(originBgColor, lum);

    const defaultContrast = getContrast(originBgColor, onBgColorPressed);

    if (defaultContrast >= 4.5) {
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
  darkMode: boolean,
  customFgColor?: string,
): {
  onOrigin: string;
  hoverColor: string;
  pressedColor: string;
} => {
  const originLuminanceDark = getOriginLuminanceDark(origin);
  let color: string;
  const { onColor, accessible: accessibleOnColor } = getOnColorByContrast(
    originBgColor,
    originLuminanceDark,
  );

  color = onColor;

  if (!accessibleOnColor) {
    const { onColor: alternativeOnColor, accessible: alternativeAccessible } =
      getOnColorByContrast(originBgColor, !originLuminanceDark) ??
      FALLBACK_COLOR;
    if (alternativeAccessible) {
      color = alternativeOnColor;
    }
  }

  const fgColor = customFgColor ?? color;

  const hoverPressedColors = getHoverPressedColors(fgColor, darkMode);

  return {
    onOrigin: fgColor,
    ...hoverPressedColors,
  };
};

const getOriginLuminanceDark = (origin: string): boolean => {
  const hsluv = new Hsluv();
  hsluv.hex = origin;
  hsluv.hexToHsluv();

  // We use one origin color as initial suggestion based on origin luminance
  // The user can overwrite it in ui based on the a11y tested light alternative or with a custom value

  return hsluv.hsluv_l < 42; // <- I found the question
};

const getOriginBackgroundColor = (
  origin: string,
  color: string,
  onOrigin: string,
  darkMode: boolean,
): DefaultColorType => {
  let hoverColor;
  let pressedColor;

  const originLuminanceDark = getOriginLuminanceDark(origin);

  const { hoverColor: hoverColorPrio, pressedColor: pressedColorPrio } =
    getHoverPressedColors(color, originLuminanceDark);

  if (getContrast(pressedColorPrio, onOrigin) < 4.5) {
    const { hoverColor: hoverColorSec, pressedColor: pressedColorSc } =
      getHoverPressedColors(color, !originLuminanceDark);
    hoverColor = hoverColorSec;
    pressedColor = pressedColorSc;
  } else {
    hoverColor = hoverColorPrio;
    pressedColor = hoverColorPrio;
  }

  const backgroundColorsLight = {
    originLightDefault: color,
    originLightHovered: hoverColor,
    originLightPressed: pressedColor,
  };

  const backgroundColorsDark = {
    originDarkDefault: color,
    originDarkHovered: hoverColor,
    originDarkPressed: pressedColor,
  };

  return {
    origin,
    ...(darkMode ? backgroundColorsDark : backgroundColorsLight),
  };
};

export const generateColorsByOrigin = ({
  origin,
  customFgColor,
  customBgColor,
  darkMode,
}: {
  origin: string;
  darkMode: boolean;
  customBgColor?: string;
  customFgColor?: string;
}): DefaultColorType => {
  const color = customBgColor ?? origin;

  const { onOrigin, hoverColor, pressedColor } = getOriginOnColors(
    color,
    darkMode,
    customFgColor,
  );

  const backgroundColors = getOriginBackgroundColor(
    origin,
    color,
    onOrigin,
    darkMode,
  );

  const contrastOrigin = getContrast(
    darkMode
      ? backgroundColors.originDarkDefault
      : backgroundColors.originLightDefault,
    onOrigin,
  );
  const contrastOriginHovered = getContrast(
    darkMode
      ? backgroundColors.originDarkHovered
      : backgroundColors.originLightHovered,
    onOrigin,
  );
  const contrastOriginPressed = getContrast(
    darkMode
      ? backgroundColors.originDarkPressed
      : backgroundColors.originLightPressed,
    onOrigin,
  );

  const onOriginAccessible =
    contrastOrigin === 1 ||
    (contrastOrigin >= 4.5 &&
      contrastOriginHovered >= 4.5 &&
      contrastOriginPressed >= 4.5);

  if (darkMode) {
    return {
      ...backgroundColors,
      onOriginDarkDefault: onOrigin,
      onOriginDarkHovered: hoverColor,
      onOriginDarkPressed: pressedColor,
      onOriginDarkAccessible: onOriginAccessible,
    };
  }

  return {
    ...backgroundColors,
    onOriginLightDefault: onOrigin,
    onOriginLightHovered: hoverColor,
    onOriginLightPressed: pressedColor,
    onOriginLightAccessible: onOriginAccessible,
  };
};
