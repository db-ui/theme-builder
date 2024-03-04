import chroma from "chroma-js";
import {
  ThemeType,
  SpeakingName,
  speakingNamesDefaultMapping,
} from "./data.ts";
import {
  getCssPropertyAsString,
  getCssThemeProperties,
  getPaletteOutput,
  getSpeakingNames,
} from "./outputs.ts";
import JSZip from "jszip";
import { BASE_PATH } from "../constants.ts";
import { getFontFaces } from "./outputs/fonts.ts";
import { getSketchColorsAsString } from "./outputs/sketch.ts";
import {
  generateColorScheme,
  generateComposeColorFile,
} from "./outputs/compose/colors.ts";
import { generateComposeDimensionsFile } from "./outputs/compose/dimensions.ts";
import { generateComposeTypographyFile } from "./outputs/compose/typography.ts";

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

export const upperCaseFirstLetters = (input: string): string => {
  try {
    return input
      .split(" ")
      .map((split) => split[0].toUpperCase() + split.substring(1, split.length))
      .join("");
  } catch (error) {
    console.error(error);
  }
  return "ERROR";
};

export const downloadTheme = async (
  speakingNames: SpeakingName[],
  luminanceSteps: number[],
  theme: ThemeType,
) => {
  const allColors: Record<string, string> = {
    ...theme.colors,
    ...theme.customColors,
  };

  const fileName = theme.branding.name || `default-theme`;
  const themeJsonString = JSON.stringify(theme);
  const themeProperties = getCssThemeProperties(theme);

  const composeFileName = upperCaseFirstLetters(theme.branding.name);

  const zip = new JSZip();
  zip.file(`${fileName}.json`, themeJsonString);

  //Android
  const androidFolder: string = "Android";
  const androidDataFolder: string = "Android/data";
  zip.file(
    `${androidFolder}/${composeFileName}SpeakingColorScheme.kt`,
    generateColorScheme(composeFileName, speakingNames, allColors),
  );
  zip.file(
    `${androidDataFolder}/${composeFileName}Dimensions.kt`,
    generateComposeDimensionsFile(theme),
  );
  zip.file(
    `${androidDataFolder}/${composeFileName}Typography.kt`,
    generateComposeTypographyFile(theme),
  );
  zip.file(
    `${androidDataFolder}/${composeFileName}Colors.kt`,
    generateComposeColorFile(
      allColors,
      luminanceSteps,
      theme.branding.alternativeColor,
    ),
  );

  // Utils
  const utilsFolder: string = "Utils";
  zip.file(
    `${utilsFolder}/${fileName}-sketch-colors.json`,
    getSketchColorsAsString(
      speakingNames,
      allColors,
      luminanceSteps,
      speakingNamesDefaultMapping,
      theme.branding.alternativeColor,
    ),
  );
  zip.file(`${utilsFolder}/${fileName}-font-faces.scss`, getFontFaces(theme));

  // Web
  const webFolder: string = "Web";

  zip.file(`${webFolder}/${fileName}-theme.css`, themeProperties);
  zip.file(
    `${webFolder}/${fileName}-palette.css`,
    getCssPropertyAsString(
      getPaletteOutput(
        allColors,
        luminanceSteps,
        theme.branding.alternativeColor,
      ),
    ),
  );
  zip.file(
    `${webFolder}/${fileName}-speaking-names-light.css`,
    getCssPropertyAsString(getSpeakingNames(speakingNames, allColors, false)),
  );
  zip.file(
    `${webFolder}/${fileName}-speaking-names-dark.css`,
    getCssPropertyAsString(getSpeakingNames(speakingNames, allColors, true)),
  );
  const zipFile = await zip.generateAsync({ type: "blob" });
  download(`${fileName}.zip`, zipFile);
};
