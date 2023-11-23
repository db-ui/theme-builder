import chroma from "chroma-js";
import {
  ColorType,
  CustomColorMappingType,
  DefaultColorMappingType,
  defaultLuminances,
  HeisslufType,
} from "./data.ts";
import {
  getContrast,
  getContrastHslSuggestion,
  getContrastSuggestion,
  getElementColor,
  getLuminance,
  isValidColor,
} from "./index.ts";
import { Hsluv } from "hsluv";

const mixValue1 = 1;
const mixValue2 = 0.75;
const mixValue3 = 0.5;
const mixValue4 = 0.25;
const mixValue5 = 0;
const mixValue6 = 0.92;
const mixValue7 = 0.64;
const mixValue8 = 0.32;
const mixValue9 = 0.16;
const mixValue10 = 0.08;
const mixValue11 = 0.04;

const transparent = chroma([0, 0, 0, 0]);

const invalidColor = "#ff00ff";

export const getHeissluftColors = (
  color: string,
  luminanceSteps: number[],
): HeisslufType[] => {
  const platte: HeisslufType[] = [];

  const hsluv = new Hsluv();
  hsluv.hex = color;
  hsluv.hexToHsluv();
  const hue = hsluv.hsluv_h;
  const saturation = hsluv.hsluv_s;
  const luminance = hsluv.hsluv_l;

  luminanceSteps.forEach((currentLuminance) => {
    const paletteColor: HeisslufType = {
      name: currentLuminance.toString(),
      hex: "",
      saturation,
      hue,
      luminance: Math.pow(1000 - currentLuminance, 0.33) * 10,
    };
    hsluv.hsluv_l = paletteColor.luminance;
    hsluv.hsluvToHex();
    paletteColor.hex = hsluv.hex;
    platte.push(paletteColor);
    hsluv.hexToHsluv();
  });

  hsluv.hsluv_l = 1000;
  hsluv.hsluvToHex();
  platte.push({
    name: "-1",
    hex: hsluv.hex,
    saturation,
    hue,
    luminance: 100,
  });

  return [
    ...platte.sort((a, b) => {
      if (a.luminance > b.luminance) {
        return 1;
      } else if (a.luminance < b.luminance) {
        return -1;
      }
      return 0;
    }),
    { name: "origin", hex: color, hue, saturation, luminance },
  ];
};

export const getStrong = (color: string, darkMode?: boolean): string =>
  isValidColor(color)
    ? chroma(color)
        .mix(darkMode ? "#fff" : "#000", mixValue11)
        .hex()
    : invalidColor;

const getInitColors = (
  defaultColorMapping: DefaultColorMappingType,
  darkMode?: boolean,
  auto?: boolean,
  customColorMapping?: CustomColorMappingType,
) => {
  let colorKeys = [
    "base",
    ...Object.keys(defaultColorMapping).filter(
      (key) => !key.startsWith("on") && !key.startsWith("bg"),
    ),
  ];

  let allColors: any = { ...defaultColorMapping };
  if (customColorMapping) {
    colorKeys = colorKeys.concat(Object.keys(customColorMapping));
    allColors = { ...allColors, ...customColorMapping };
  }

  const shading1 = darkMode ? "#000" : "#fff";
  const shading2 = darkMode ? "#fff" : "#000";

  let bgBase = defaultColorMapping.bgBase;
  let bgBaseStrong = defaultColorMapping.bgBaseStrong;
  let onBgBase = defaultColorMapping.onBgBase;
  if (auto) {
    bgBase = darkMode
      ? defaultColorMapping.onBgBase
      : defaultColorMapping.bgBase;
    bgBaseStrong = getStrong(
      darkMode ? defaultColorMapping.onBgBase : defaultColorMapping.bgBase,
      darkMode,
    );
    onBgBase = darkMode
      ? defaultColorMapping.bgBase
      : defaultColorMapping.onBgBase;
  }

  const bgLuminance = getLuminance(bgBaseStrong);
  const bgLuminanceShading = bgLuminance < 0.4 ? "#fff" : "#000";

  const bgNeutralColor = isValidColor(bgBase) ? bgBase : invalidColor;

  return {
    shading1,
    shading2,
    colorKeys,
    allColors,
    bgBaseStrong,
    onBgBase,
    bgLuminance,
    bgLuminanceShading,
    bgNeutralColor,
  };
};

export const generateColors = (
  defaultColorMapping: DefaultColorMappingType,
  darkMode?: boolean,
  auto?: boolean,
  customColorMapping?: CustomColorMappingType,
  luminanceSteps?: number[],
): ColorType[] => {
  const colors: ColorType[] = [];

  const {
    shading1,
    shading2,
    allColors,
    colorKeys,
    onBgBase,
    bgBaseStrong,
    bgLuminance,
    bgLuminanceShading,
    bgNeutralColor,
  } = getInitColors(defaultColorMapping, darkMode, auto, customColorMapping);

  colorKeys.forEach((key) => {
    let color: string = allColors[key];
    if (key === "base") {
      color = isValidColor(onBgBase) ? onBgBase : invalidColor;
    }

    if (!isValidColor(color)) {
      color = invalidColor;
    }

    const hslColors = getHeissluftColors(
      color,
      luminanceSteps ?? defaultLuminances,
    );

    const textHsl = getContrastHslSuggestion(bgBaseStrong, hslColors);
    console.log(
      key,
      bgBaseStrong,
      textHsl,
      getContrast(textHsl?.hex || invalidColor, bgBaseStrong),
    );

    const text =
      getContrastSuggestion(bgBaseStrong, color, 4.5, bgLuminance < 0.4) ||
      color;
    const element = getElementColor(bgBaseStrong, text) || text;

    const background =
      key === "base"
        ? bgNeutralColor
        : chroma(text).mix(shading1, mixValue6).hex();

    const bgStrongColor = chroma(background).mix(shading2, mixValue11).hex();
    const onBG =
      key === "base" ? color : chroma(text).mix(shading2, mixValue7).hex();

    const onBgLuminanceShading = getLuminance(onBgBase) < 0.4 ? "#fff" : "#000";
    const elementLuminanceShading =
      getLuminance(element) < 0.4 ? "#fff" : "#000";

    let colorResult: ColorType = {
      name: key,
      "origin-enabled": chroma(color).hex(),
      "origin-hover": chroma(color).mix(bgLuminanceShading, mixValue9).hex(),
      "origin-pressed": chroma(color).mix(bgLuminanceShading, mixValue8).hex(),
      "text-enabled": text,
      "text-hover": chroma(text).mix(onBgLuminanceShading, mixValue9).hex(),
      "text-pressed": chroma(text).mix(onBgLuminanceShading, mixValue8).hex(),
      "on-enabled": chroma(transparent)
        .mix(shading1, darkMode ? mixValue2 : mixValue1)
        .hex(),
      "on-hover": chroma(transparent)
        .mix(shading1, darkMode ? mixValue3 : mixValue2)
        .hex(),
      "on-pressed": chroma(transparent)
        .mix(shading1, darkMode ? mixValue4 : mixValue3)
        .hex(),
      "bg-enabled": background,
      "bg-hover": chroma(background).mix(text, mixValue9).hex(),
      "bg-pressed": chroma(background).mix(text, mixValue8).hex(),
      "bg-strong-enabled": chroma(bgStrongColor).hex(),
      "bg-strong-hover": chroma(bgStrongColor)
        .mix(bgLuminanceShading, mixValue9)
        .hex(),
      "bg-strong-pressed": chroma(bgStrongColor)
        .mix(bgLuminanceShading, mixValue8)
        .hex(),
      "on-bg-enabled": onBG,
      "on-bg-hover": chroma(transparent).mix(onBG, mixValue2).hex(),
      "on-bg-pressed": chroma(transparent).mix(onBG, mixValue3).hex(),
      "on-bg-weak-enabled": chroma(transparent).mix(onBG, mixValue2).hex(),
      "on-bg-weak-hover": chroma(transparent).mix(onBG, mixValue3).hex(),
      "on-bg-weak-pressed": chroma(transparent).mix(onBG, mixValue4).hex(),
      "bg-transparent-full-enabled": chroma(transparent)
        .mix(text, mixValue5)
        .hex(),
      "bg-transparent-full-hover": chroma(transparent)
        .mix(text, mixValue9)
        .hex(),
      "bg-transparent-full-pressed": chroma(transparent)
        .mix(text, mixValue8)
        .hex(),
      "bg-transparent-semi-enabled": chroma(transparent)
        .mix(text, mixValue10)
        .hex(),
      "bg-transparent-semi-hover": chroma(transparent)
        .mix(text, mixValue9)
        .hex(),
      "bg-transparent-semi-pressed": chroma(transparent)
        .mix(text, mixValue8)
        .hex(),
    };

    if (element) {
      const elementHover = chroma(element)
        .mix(elementLuminanceShading, mixValue9)
        .hex();
      const elementPressed = chroma(element)
        .mix(elementLuminanceShading, mixValue8)
        .hex();
      colorResult = {
        ...colorResult,
        "element-enabled": element,
        "element-hover": elementHover,
        "element-pressed": elementPressed,
        "border-enabled": chroma(transparent)
          .mix(element, darkMode ? mixValue2 : mixValue7)
          .hex(),
        "border-hover": chroma(transparent)
          .mix(elementHover, darkMode ? mixValue2 : mixValue7)
          .hex(),
        "border-pressed": chroma(transparent)
          .mix(elementPressed, darkMode ? mixValue2 : mixValue7)
          .hex(),
        "border-weak-enabled": chroma(transparent)
          .mix(element, darkMode ? mixValue3 : mixValue8)
          .hex(),
        "border-weak-hover": chroma(transparent)
          .mix(elementHover, darkMode ? mixValue3 : mixValue8)
          .hex(),
        "border-weak-pressed": chroma(transparent)
          .mix(elementPressed, darkMode ? mixValue3 : mixValue8)
          .hex(),
      };
    }

    if (key === "brand") {
      const brandColor = isValidColor(defaultColorMapping.onBrand)
        ? defaultColorMapping.onBrand
        : invalidColor;
      colorResult = {
        ...colorResult,
        "on-enabled": chroma(brandColor).hex(),
        "on-hover": chroma(transparent).mix(brandColor, mixValue2).hex(),
        "on-pressed": chroma(transparent).mix(brandColor, mixValue3).hex(),
      };
    }

    colors.push(colorResult);
  });

  return colors;
};
