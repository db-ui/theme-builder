import chroma from "chroma-js";
import {
  CustomColorMappingType,
  DefaultColorMappingType,
  DefaultThemeType,
  HeisslufType,
  SpeakingName,
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

export const getLuminance = (color: string): number =>
  chroma.hex(color).luminance();

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
        luminanceSteps
      );

      return {
        [name]: hslColors,
      };
    })
    .reduce(
      (previousValue, currentValue) => ({ ...previousValue, ...currentValue }),
      {}
    );
const mergeColorsWithSpeakingNames = (
  speakingNames: Record<string, string>,
  colors: Record<string, string>
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
        speakingName = `On/Brand/01-Enabled`;
      } else if (speakingName.includes("origin-enabled")) {
        speakingName = `Brand/Origin/01-Enabled`;
      } else if (speakingName.includes("origin-hover")) {
        speakingName = `Brand/Origin/02-Hover`;
      } else if (speakingName.includes("origin-pressed")) {
        speakingName = `Brand/Origin/03-Pressed`;
      }
      colorHex = value;
    } else {
      const variableMatch = value.match(/var\((.*?)\)/);
      const variableName = variableMatch ? variableMatch[1] : "";
      if (variableName && colors.hasOwnProperty(variableName)) {
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
  customColorMapping?: CustomColorMappingType
) => {
  const theme: DefaultThemeType = { ...defaultTheme, colors: colorMapping };

  const allColors = { ...colorMapping, ...customColorMapping };
  const colors = getPaletteOutput(getPalette(allColors, luminanceSteps));

  const lightSpeakingNames = getSpeakingNamesForJSON(
    speakingNames,
    allColors,
    true,
    luminanceSteps
  );
  const darkSpeakingNames = getSpeakingNamesForJSON(
    speakingNames,
    allColors,
    false,
    luminanceSteps
  );

  const lightSpeakingNamesWithHex = mergeColorsWithSpeakingNames(
    lightSpeakingNames,
    colors
  );
  const darkSpeakingNamesWithHex = mergeColorsWithSpeakingNames(
    darkSpeakingNames,
    colors
  );
  console.log(
    "result light:",
    lightSpeakingNamesWithHex,
    "result dark:",
    darkSpeakingNamesWithHex
  );

  const fileName = `default-theme`;
  const themeJsonString = JSON.stringify(theme);
  const colorsJsonString = JSON.stringify({
    light: lightSpeakingNamesWithHex,
    dark: darkSpeakingNamesWithHex,
  });
  const themeProperties = getCssThemeProperties(defaultTheme);

  const zip = new JSZip();
  zip.file(`${fileName}.json`, themeJsonString);
  zip.file(`${fileName}-colors.json`, colorsJsonString);
  zip.file(`${fileName}-theme.css`, themeProperties);
  zip.file(`${fileName}-palette.css`, getCssPropertyAsString(colors));
  zip.file(
    `${fileName}-speaking-names-light.css`,
    getCssPropertyAsString(
      getSpeakingNames(speakingNames, allColors, false, luminanceSteps)
    )
  );
  zip.file(
    `${fileName}-speaking-names-dark.css`,
    getCssPropertyAsString(
      getSpeakingNames(speakingNames, allColors, true, luminanceSteps)
    )
  );
  const zipFile = await zip.generateAsync({ type: "blob" });
  download(`${fileName}.zip`, zipFile);
};
