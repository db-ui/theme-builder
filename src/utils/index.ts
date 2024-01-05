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

export const getPalette = (allColors: object, minContrast: number): any =>
  Object.entries(allColors)
    .map((value) => {
      const name = value[0];
      const color = value[1];
      const hslColors: HeisslufType[] = getHeissluftColors(color, minContrast);

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
  minContrast: number,
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
    getCssPropertyAsString(
      getPaletteOutput(getPalette(allColors, minContrast)),
    ),
  );
  zip.file(
    `${fileName}-speaking-names-light.css`,
    getCssPropertyAsString(
      getSpeakingNames(speakingNames, allColors, false, minContrast),
    ),
  );
  zip.file(
    `${fileName}-speaking-names-dark.css`,
    getCssPropertyAsString(
      getSpeakingNames(speakingNames, allColors, true, minContrast),
    ),
  );
  const zipFile = await zip.generateAsync({ type: "blob" });
  download(`${fileName}.zip`, zipFile);
};
