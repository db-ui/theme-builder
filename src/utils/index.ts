import chroma from "chroma-js";
import {
  CustomColorMappingType,
  DefaultColorMappingType,
  DefaultThemeType,
  SpeakingName,
  HeisslufType,
} from "./data.ts";
import { getHeissluftColors } from "./generate-colors.ts";
import {
  getCssThemeProperties,
  getCssPropertyAsString,
  getPaletteOutput,
  getSpeakingNames,
  getSpeakingNamesForJSON,
} from "./outputs.ts";
import JSZip from "jszip";
import { BASE_PATH } from "../constants.ts";

export const getThemeImage = (image: string): string => {
  if (image.startsWith("data:image")) {
    return image;
  }

  return `${BASE_PATH}/assets/images/${image || "peace-in-a-box.svg"}`;
};

export const getLuminance = (color: string): number =>
  chroma.valid(color) ? chroma.hex(color).luminance() : -1;

const download = (fileName: string, file: Blob) => {
  const element = document.createElement("a");
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const getPalette = (allColors: object, luminanceSteps: number[]): any =>
  Object.entries(allColors)
    .map((value) => {
      const name = value[0];
      const color = value[1];
      const hslColors: HeisslufType[] = getHeissluftColors(
        color,
        luminanceSteps,
      );

      return {
        [name]: hslColors,
      };
    })
    .reduce(
      (previousValue, currentValue) => ({ ...previousValue, ...currentValue }),
      {},
    );
const mergeColorsWithSpeakingNames = (
  speakingNames: Record<string, string>,
  colors: any,
): Record<string, string> => {
  const result: Record<string, string> = {};

  Object.entries(speakingNames).forEach(([speakingName, value]) => {
    let transparency = "0%";
    let colorHex = "";

    const transparencyMatch = value.match(/transparency (\d+%)/);
    if (transparencyMatch) {
      transparency = transparencyMatch[1];
    }

    if (speakingName.startsWith("--")) {
      if (speakingName.includes("on-enabled")) {
        speakingName = `On/brand/01-Enabled`;
      } else if (speakingName.includes("origin-enabled")) {
        speakingName = `brand/Origin/01-Enabled`;
      } else if (speakingName.includes("origin-hover")) {
        speakingName = `brand/Origin/02-Hover`;
      } else if (speakingName.includes("origin-pressed")) {
        speakingName = `brand/Origin/03-Pressed`;
      }
      colorHex = value;
    } else {
      const variableMatch = value.match(/var\((.*?)\)/);
      const variableName = variableMatch ? variableMatch[1] : "";
      if (variableName && colors[variableName]) {
        colorHex = colors[variableName];
      }
    }
    result[speakingName] = `${transparency}, ${colorHex}`;
  });

  return result;
};

export const downloadTheme = async (
  speakingNames: SpeakingName[],
  luminanceSteps: number[],
  defaultTheme: DefaultThemeType,
  colorMapping: DefaultColorMappingType,
  customColorMapping?: CustomColorMappingType,
) => {
  const theme: DefaultThemeType = { ...defaultTheme, colors: colorMapping };

  const allColors: Record<string, string> = { ...colorMapping, ...customColorMapping };
   // TODO
/*  const colors = getPalette(allColors, luminanceSteps);

  const lightSpeakingNames = getSpeakingNamesForJSON(
    speakingNames,
    colors,
    true,
    luminanceSteps,
  );
  const darkSpeakingNames = getSpeakingNamesForJSON(
    speakingNames,
    colors,
    false,
    luminanceSteps,
  );*/

  const fileName = theme.name || `default-theme`;
  const themeJsonString = JSON.stringify(theme);
/*  const colorsJsonString = JSON.stringify({
    light: lightSpeakingNames,
    dark: darkSpeakingNames,
  });*/
  const themeProperties = getCssThemeProperties(defaultTheme);

  const zip = new JSZip();
  zip.file(`${fileName}.json`, themeJsonString);/*
  zip.file(`${fileName}-colors.json`, colorsJsonString);*/

  zip.file(`${fileName}-theme.css`, themeProperties);
  zip.file(
    `${fileName}-palette.css`,
    getCssPropertyAsString(getPaletteOutput(allColors, luminanceSteps)),
  );
  zip.file(
    `${fileName}-speaking-names-light.css`,
    getCssPropertyAsString(getSpeakingNames(speakingNames, allColors, false)),
  );
  zip.file(
    `${fileName}-speaking-names-dark.css`,
    getCssPropertyAsString(getSpeakingNames(speakingNames, allColors, true)),
  );
  const zipFile = await zip.generateAsync({ type: "blob" });
  download(`${fileName}.zip`, zipFile);
};
