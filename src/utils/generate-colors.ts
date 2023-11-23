import chroma from "chroma-js";
import {
  ColorType,
  CustomColorMappingType,
  DefaultColorMappingType,
  defaultLuminances,
  HeisslufType,
} from "./data.ts";
import { getLuminance, isValidColor } from "./index.ts";
import { Hsluv } from "hsluv";

const mixValue1 = 1;
const mixValue2 = 0.75;
const mixValue3 = 0.5;
const mixValue4 = 0.25;
const mixValue5 = 0;
const mixValue7 = 0.64;
const mixValue8 = 0.32;
const mixValue9 = 0.16;
const mixValue10 = 0.08;

const transparent = chroma([0, 0, 0, 0]);

const invalidColor = "#ff00ff";
const white = "#fff";
const black = "#000";

export const getHeissluftColors = (
  color: string,
  darkMode?: boolean,
): HeisslufType[] => {
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
          return darkMode ? -1 : 1;
        } else if (a.luminance < b.luminance) {
          return darkMode ? 1 : -1;
        }
        return 0;
      })
      .map((hsl, index) => ({ ...hsl, index })),
  ];
};

const getInitColors = (
  defaultColorMapping: DefaultColorMappingType,
  darkMode?: boolean,
  customColorMapping?: CustomColorMappingType,
) => {
  let colorKeys = Object.keys(defaultColorMapping);

  let allColors: any = { ...defaultColorMapping };
  if (customColorMapping) {
    colorKeys = colorKeys.concat(Object.keys(customColorMapping));
    allColors = { ...allColors, ...customColorMapping };
  }

  const baseColors = getHeissluftColors(allColors.base, darkMode);

  const bgBaseStrong = baseColors.find((ht) => ht.index === 11);

  const bgLuminanceShading =
    getLuminance(bgBaseStrong?.hex ?? invalidColor) < 0.4 ? white : black;
  const baseLuminanceShading =
    getLuminance(allColors.base) < 0.4 ? white : black;

  return {
    colorKeys,
    allColors,
    bgLuminanceShading,
    baseLuminanceShading,
  };
};

export const generateColors = (
  defaultColorMapping: DefaultColorMappingType,
  darkMode?: boolean,
  customColorMapping?: CustomColorMappingType,
): ColorType[] => {
  const colors: ColorType[] = [];

  const { allColors, colorKeys, bgLuminanceShading, baseLuminanceShading } =
    getInitColors(defaultColorMapping, darkMode, customColorMapping);

  colorKeys.forEach((key) => {
    let color: string = allColors[key];

    if (!isValidColor(color)) {
      color = invalidColor;
    }

    const hslColors = getHeissluftColors(color, darkMode);

    const textHsl = hslColors.find((ht) => ht.index === 4);
    const elementHsl = hslColors.find((ht) => ht.index === 5);
    const backgroundHsl = hslColors.find((ht) => ht.index === 11);
    const bgStrongColorHsl = hslColors.find((ht) => ht.index === 10);
    const onBGHsl = hslColors.find((ht) => ht.index === 1);
    const shadingHsl = hslColors.find((ht) => ht.index === 12);

    const shading = shadingHsl?.hex ?? invalidColor;

    const text = textHsl?.hex ?? invalidColor;
    const element = elementHsl?.hex ?? invalidColor;
    const background = backgroundHsl?.hex ?? invalidColor;
    const bgStrongColor = bgStrongColorHsl?.hex ?? invalidColor;
    const onBG = onBGHsl?.hex ?? invalidColor;

    const elementLuminanceShading =
      getLuminance(element) < 0.4 ? "#fff" : "#000";
    const elementHover = chroma(element)
      .mix(elementLuminanceShading, mixValue9)
      .hex();
    const elementPressed = chroma(element)
      .mix(elementLuminanceShading, mixValue8)
      .hex();

    let colorResult: ColorType = {
      name: key,
      "origin-enabled": chroma(color).hex(),
      "origin-hover": chroma(color).mix(bgLuminanceShading, mixValue9).hex(),
      "origin-pressed": chroma(color).mix(bgLuminanceShading, mixValue8).hex(),
      "text-enabled": text,
      "text-hover": chroma(text).mix(baseLuminanceShading, mixValue9).hex(),
      "text-pressed": chroma(text).mix(baseLuminanceShading, mixValue8).hex(),
      "on-enabled": chroma(transparent)
        .mix(shading, darkMode ? mixValue2 : mixValue1)
        .hex(),
      "on-hover": chroma(transparent)
        .mix(shading, darkMode ? mixValue3 : mixValue2)
        .hex(),
      "on-pressed": chroma(transparent)
        .mix(shading, darkMode ? mixValue4 : mixValue3)
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

    if (key === "brand") {
      const brandOnColor = getLuminance(color) < 0.4 ? white : black;
      colorResult = {
        ...colorResult,
        "on-enabled": chroma(brandOnColor).hex(),
        "on-hover": chroma(transparent).mix(brandOnColor, mixValue2).hex(),
        "on-pressed": chroma(transparent).mix(brandOnColor, mixValue3).hex(),
      };
    }

    if (!darkMode && key === "base") {
      colorResult = {
        ...colorResult,
        "bg-enabled": white,
        "bg-hover": chroma(white).mix(text, mixValue9).hex(),
        "bg-pressed": chroma(white).mix(text, mixValue8).hex(),
      };
    }

    colors.push(colorResult);
  });

  return colors;
};
