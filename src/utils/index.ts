import chroma from "chroma-js";
import {
  CustomColorMappingType,
  DefaultColorMappingType,
  DefaultThemeType,
  SpeakingName,
} from "./data.ts";
import {
  getCssPropertyAsString,
  getCssThemeProperties,
  getPaletteOutput,
  getSpeakingNames,
} from "./outputs.ts";
import JSZip from "jszip";

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

export const downloadTheme = async (
  speakingNames: SpeakingName[],
  luminanceSteps: number[],
  defaultTheme: DefaultThemeType,
  colorMapping: DefaultColorMappingType,
  customColorMapping?: CustomColorMappingType,
) => {
  const theme: DefaultThemeType = { ...defaultTheme, colors: colorMapping };

  const allColors = { ...colorMapping, ...customColorMapping };

  const fileName = `default-theme`;
  const themeJsonString = JSON.stringify(theme);
  const themeProperties = getCssThemeProperties(defaultTheme);

  const zip = new JSZip();
  zip.file(`${fileName}.json`, themeJsonString);
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
