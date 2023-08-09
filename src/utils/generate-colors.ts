import chroma from "chroma-js";
import { ColorType, DefaultColorMappingType } from "./data.ts";
import { getContrastSuggestion, getLuminance } from "./index.ts";

const mixValue1 = 1;
const mixValue2 = 0.75;
const mixValue3 = 0.5;
const mixValue4 = 0.25;
const mixValue5 = 0;
const mixValue6 = 0.88;
const mixValue7 = 0.64;
const mixValue8 = 0.32;
const mixValue9 = 0.16;
const mixValue10 = 0.08;

const transparent = chroma([0, 0, 0, 0]);

export const generateColors = (
  defaultColorMapping: DefaultColorMappingType,
  darkMode?: boolean,
): ColorType[] => {
  const colors: ColorType[] = [];

  const colorKeys = Object.keys(defaultColorMapping);

  const shading1 = darkMode ? "#000" : "#fff";
  const shading2 = darkMode ? "#fff" : "#000";

  colorKeys
    .filter((key) => !key.startsWith("on"))
    .forEach((key) => {
      const color: string = (defaultColorMapping as any)[key];

      const background = chroma(color).mix(shading1, mixValue6).hex();
      const onBG = chroma(color).mix(shading2, mixValue7).hex();
      const element =
        getContrastSuggestion(
          defaultColorMapping.bgNeutral1,
          color,
          3.0,
          getLuminance(defaultColorMapping.bgNeutral1) >= 0.4,
          true,
        ) || color;
      const text =
        getContrastSuggestion(
          defaultColorMapping.bgNeutral1,
          color,
          4.5,
          getLuminance(defaultColorMapping.bgNeutral1) < 0.4,
        ) || color;

      let colorResult: ColorType = {
        name: key,
        enabled: chroma(color).hex(),
        hover: chroma(color).darken(0.16).hex(),
        pressed: chroma(color).darken(0.32).hex(),
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
        "bg-hover": chroma(background).mix(color, mixValue9).hex(),
        "bg-pressed": chroma(background).mix(color, mixValue8).hex(),
        "on-bg-enabled": onBG,
        "on-bg-hover": chroma(onBG).mix(transparent, mixValue2).hex(),
        "on-bg-pressed": chroma(onBG).mix(transparent, mixValue3).hex(),
        "on-bg-weak-enabled": chroma(onBG).mix(transparent, mixValue2).hex(),
        "on-bg-weak-hover": chroma(onBG).mix(transparent, mixValue3).hex(),
        "on-bg-weak-pressed": chroma(onBG).mix(transparent, mixValue4).hex(),
        "bg-transparent-full-enabled": chroma(color)
          .mix(transparent, mixValue5)
          .hex(),
        "bg-transparent-full-hover": chroma(color)
          .mix(transparent, mixValue9)
          .hex(),
        "bg-transparent-full-pressed": chroma(color)
          .mix(transparent, mixValue8)
          .hex(),
        "bg-transparent-semi-enabled": chroma(color)
          .mix(transparent, mixValue10)
          .hex(),
        "bg-transparent-semi-hover": chroma(color)
          .mix(transparent, mixValue9)
          .hex(),
        "bg-transparent-semi-pressed": chroma(color)
          .mix(transparent, mixValue8)
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
          "border-enabled": chroma(element)
            .mix(transparent, darkMode ? mixValue2 : mixValue7)
            .hex(),
          "border-hover": chroma(elementHover)
            .mix(transparent, darkMode ? mixValue2 : mixValue7)
            .hex(),
          "border-pressed": chroma(elementPressed)
            .mix(transparent, darkMode ? mixValue2 : mixValue7)
            .hex(),
          "border-weak-enabled": chroma(element)
            .mix(transparent, darkMode ? mixValue3 : mixValue8)
            .hex(),
          "border-weak-hover": chroma(element)
            .mix(transparent, darkMode ? mixValue3 : mixValue8)
            .hex(),
          "border-weak-pressed": chroma(element)
            .mix(transparent, darkMode ? mixValue3 : mixValue8)
            .hex(),
        };
      }

      if (text) {
        colorResult = {
          ...colorResult,
          "text-enabled": text,
          "text-hover": chroma(text).mix(shading2, mixValue9).hex(),
          "text-pressed": chroma(text).mix(shading2, mixValue8).hex(),
        };
      }

      if (key === "brand") {
        colorResult = {
          ...colorResult,
          "on-enabled": chroma(defaultColorMapping.onBrand).hex(),
          "on-hover": chroma(defaultColorMapping.onBrand)
            .mix(transparent, mixValue2)
            .hex(),
          "on-pressed": chroma(defaultColorMapping.onBrand)
            .mix(transparent, mixValue3)
            .hex(),
        };
      }

      colors.push(colorResult);
    });

  return colors;
};
