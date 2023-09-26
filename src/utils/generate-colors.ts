import chroma from "chroma-js";
import { ColorType, DefaultColorMappingType } from "./data.ts";
import {
  getContrastSuggestion,
  getElementColor,
  getLuminance,
  isValidColor,
} from "./index.ts";

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

export const getStrong = (color: string, darkMode?: boolean): string =>
  isValidColor(color)
    ? chroma(color)
        .mix(darkMode ? "#fff" : "#000", mixValue11)
        .hex()
    : invalidColor;

export const generateColors = (
  defaultColorMapping: DefaultColorMappingType,
  darkMode?: boolean,
): ColorType[] => {
  const colors: ColorType[] = [];

  const colorKeys = [
    "base",
    ...Object.keys(defaultColorMapping).filter(
      (key) => !key.startsWith("on") && !key.startsWith("bg"),
    ),
  ];

  const shading1 = darkMode ? "#000" : "#fff";
  const shading2 = darkMode ? "#fff" : "#000";

  const bgLuminance = getLuminance(defaultColorMapping.bgBaseStrong);
  const bgLuminanceShading = bgLuminance < 0.4 ? "#fff" : "#000";

  const bgNeutralColor = isValidColor(defaultColorMapping.bgBase)
    ? defaultColorMapping.bgBase
    : invalidColor;

  colorKeys.forEach((key) => {
    let color: string = (defaultColorMapping as any)[key];
    if (key === "base") {
      color = isValidColor(defaultColorMapping.onBgBase)
        ? defaultColorMapping.onBgBase
        : invalidColor;
    }

    if (!isValidColor(color)) {
      color = invalidColor;
    }

    const text =
      getContrastSuggestion(
        defaultColorMapping.bgBaseStrong,
        color,
        4.5,
        bgLuminance < 0.4,
      ) || color;

    const background =
      key === "base"
        ? bgNeutralColor
        : chroma(text).mix(shading1, mixValue6).hex();

    const bgStrongColor = chroma(background).mix(shading2, mixValue11).hex();
    const onBG =
      key === "base" ? color : chroma(text).mix(shading2, mixValue7).hex();

    const element =
      getElementColor(defaultColorMapping.bgBaseStrong, text) || text;

    let colorResult: ColorType = {
      name: key,
      "origin-enabled": chroma(color).hex(),
      "origin-hover": chroma(color).mix(bgLuminanceShading, mixValue9).hex(),
      "origin-pressed": chroma(color).mix(bgLuminanceShading, mixValue8).hex(),
      "text-enabled": text,
      "text-hover": chroma(text).mix(shading2, mixValue9).hex(),
      "text-pressed": chroma(text).mix(shading2, mixValue8).hex(),
      "on-enabled": chroma(shading1)
        .mix(transparent, darkMode ? mixValue2 : mixValue1)
        .hex(),
      "on-hover": chroma(shading1)
        .mix(transparent, darkMode ? mixValue3 : mixValue2)
        .hex(),
      "on-pressed": chroma(shading1)
        .mix(transparent, darkMode ? mixValue4 : mixValue3)
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
      "on-bg-hover": chroma(onBG).mix(transparent, mixValue2).hex(),
      "on-bg-pressed": chroma(onBG).mix(transparent, mixValue3).hex(),
      "on-bg-weak-enabled": chroma(onBG).mix(transparent, mixValue2).hex(),
      "on-bg-weak-hover": chroma(onBG).mix(transparent, mixValue3).hex(),
      "on-bg-weak-pressed": chroma(onBG).mix(transparent, mixValue4).hex(),
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
      const elementHover = chroma(element).mix(shading2, mixValue9).hex();
      const elementPressed = chroma(element).mix(shading2, mixValue8).hex();
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
        "on-hover": chroma(brandColor).mix(transparent, mixValue2).hex(),
        "on-pressed": chroma(brandColor).mix(transparent, mixValue3).hex(),
      };
    }

    if (key === "base") {
      colorResult = {
        ...colorResult,
        "on-enabled": chroma(bgNeutralColor).hex(),
        "on-hover": chroma(bgNeutralColor).mix(transparent, mixValue2).hex(),
        "on-pressed": chroma(bgNeutralColor).mix(transparent, mixValue3).hex(),
      };
    }

    colors.push(colorResult);
  });

  return colors;
};
