import chroma from "chroma-js";
import {
  CustomColorMappingType,
  DefaultColorMappingType,
  DefaultThemeType,
  SpeakingName,
  HeisslufType,
  speakingNamesDefaultMapping,
} from "./data.ts";
import { getHeissluftColors } from "./generate-colors.ts";
import {
  getCssThemeProperties,
  getCssPropertyAsString,
  getPaletteOutput,
  getSpeakingNames,
} from "./outputs.ts";
import JSZip from "jszip";
import { BASE_PATH } from "../constants.ts";
import { getFontFaces } from "./outputs/fonts.ts";
import { getSketchColors } from "./outputs/sketch.ts";

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
        name,
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

export const downloadTheme = async (
  speakingNames: SpeakingName[],
  luminanceSteps: number[],
  defaultTheme: DefaultThemeType,
  colorMapping: DefaultColorMappingType,
  customColorMapping?: CustomColorMappingType,
) => {
  const theme: DefaultThemeType = { ...defaultTheme, colors: colorMapping };

  const allColors: Record<string, string> = {
    ...colorMapping,
    ...customColorMapping,
  };
  const colors = getPalette(allColors, luminanceSteps);

  const lightSpeakingNames = getSketchColors(
    speakingNames,
    allColors,
    colors,
    false,
    luminanceSteps,
    speakingNamesDefaultMapping,
  );
  const darkSpeakingNames = getSketchColors(
    speakingNames,
    allColors,
    colors,
    true,
    luminanceSteps,
    speakingNamesDefaultMapping,
  );
  const fileName = theme.name || `default-theme`;
  const themeJsonString = JSON.stringify(theme);
  const colorsJsonString = JSON.stringify({
    light: lightSpeakingNames,
    dark: darkSpeakingNames,
  });
  const themeProperties = getCssThemeProperties(defaultTheme);

  const zip = new JSZip();
  zip.file(`${fileName}.json`, themeJsonString);
  zip.file(`${fileName}-sketch-colors.json`, colorsJsonString);

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
  zip.file(`${fileName}-font-faces.scss`, getFontFaces(theme));
  const zipFile = await zip.generateAsync({ type: "blob" });
  download(`${fileName}.zip`, zipFile);
};
