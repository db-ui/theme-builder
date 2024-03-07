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
import {
  generateComposeDimensionsFile,
  generateDimensionsSchemeFile,
} from "./outputs/compose/dimensions.ts";
import {
  generateComposeTypographyFile,
  generateFontFamilyFile,
  generateTypographySchemeFile,
} from "./outputs/compose/typography.ts";
import { generateDensityEnumFile } from "./outputs/compose/density.ts";
import { generateThemeFile } from "./outputs/compose/theme.ts";
import { generateReadmeFile } from "./outputs/compose/readme.ts";

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

export const kebabCase = (input: string, firstLower?: boolean): string => {
  try {
    return input
      .replace(/-/g, " ")
      .split(" ")
      .map(
        (split, index) =>
          (firstLower && index === 0 ? split[0] : split[0].toUpperCase()) +
          split.substring(1, split.length),
      )
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

  const composeFileName = kebabCase(theme.branding.name);

  const zip = new JSZip();
  zip.file(`${fileName}.json`, themeJsonString);

  //Android
  const androidFolder: string = "Android";
  const androidThemeFolder: string = `${androidFolder}/theme`;
  const androidDataFolder: string = `${androidThemeFolder}/data`;
  zip.file(`${androidFolder}/README.md`, generateReadmeFile(composeFileName));
  zip.file(
    `${androidThemeFolder}/${composeFileName}.kt`,
    generateThemeFile(composeFileName),
  );
  zip.file(
    `${androidThemeFolder}/${composeFileName}ColorScheme.kt`,
    generateColorScheme(composeFileName, speakingNames, allColors),
  );
  zip.file(
    `${androidThemeFolder}/${composeFileName}Dimensions.kt`,
    generateDimensionsSchemeFile(composeFileName),
  );
  zip.file(
    `${androidThemeFolder}/${composeFileName}Typography.kt`,
    generateTypographySchemeFile(composeFileName),
  );
  zip.file(`${androidDataFolder}/Fonts.kt`, generateFontFamilyFile());
  zip.file(
    `${androidDataFolder}/Dimensions.kt`,
    generateComposeDimensionsFile(theme),
  );
  zip.file(
    `${androidDataFolder}/Typography.kt`,
    generateComposeTypographyFile(theme),
  );
  zip.file(
    `${androidDataFolder}/Colors.kt`,
    generateComposeColorFile(
      allColors,
      luminanceSteps,
      theme.branding.alternativeColor,
    ),
  );
  zip.file(`${androidDataFolder}/Density.kt`, generateDensityEnumFile());

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
