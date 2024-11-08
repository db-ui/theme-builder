import JSZip from "jszip";
import { DefaultColorType, SpeakingName, ThemeType } from "../data.ts";
import { generateReadmeFile } from "./web/readme.ts";
import { generateBrandThemeFile, generateThemeFile } from "./compose/theme.ts";
import {
  generateColorScheme,
  generateComposeColorFile,
} from "./compose/colors.ts";
import {
  generateComposeDimensionsFile,
  generateDimensionsSchemeFile,
} from "./compose/dimensions.ts";
import {
  generateComposeTypographyFile,
  generateFontFamilyFile,
  generateTypographySchemeFile,
} from "./compose/typography.ts";
import { generateDensityEnumFile } from "./compose/density.ts";
import { getSketchColorsAsString } from "./sketch.ts";
import { getFontFaces } from "./web/fonts.ts";
import { kebabCase } from "../index.ts";
import {
  getCssPropertyAsString,
  getTypedCssPropertyAsString,
  getCssThemeProperties,
  getFullColorCss,
  getPaletteOutput,
  getSpeakingNames,
} from "./index.ts";
import { generateCustomColorClass } from "./web/custom-color-class.ts";
import { generateAndroidReadmeFile } from "./compose/readme.ts";
import { generateComposeElevationFile } from "./compose/elevation.ts";
import { designSystemName, designSystemShortName } from "./compose/shared.ts";

const download = (fileName: string, file: Blob) => {
  const element = document.createElement("a");
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadPlayground = async (files: Record<string, string>) => {
  const zip = new JSZip();
  for (const [name, content] of Object.entries(files)) {
    zip.file(`${name}.json`, content);
  }
  const zipFile = await zip.generateAsync({ type: "blob" });
  download(`Playground.zip`, zipFile);
};

export const downloadTheme = async (
  speakingNames: SpeakingName[],
  luminanceSteps: number[],
  theme: ThemeType,
) => {
  const allColors: Record<string, DefaultColorType> = {
    ...theme.colors,
    ...theme.additionalColors,
    ...theme.customColors,
  };

  const fileName = (theme.branding.name || `default-theme`) + "Theme";
  const themeJsonString = JSON.stringify(theme);
  const themeProperties = getCssThemeProperties(theme);

  const brandName = kebabCase(theme.branding.name);
  const composeFileName = kebabCase(fileName);

  const zip = new JSZip();
  zip.file(`${fileName}.json`, themeJsonString);

  //Android
  const androidFolder: string = "Android";
  const androidThemeFolder: string = `${androidFolder}/theme`;
  const androidCoreFolder: string = `${androidThemeFolder}/core`;
  const androidBrandFolder: string = `${androidThemeFolder}/${kebabCase(theme.branding.name).toLowerCase()}`;
  const androidDataFolder: string = `${androidBrandFolder}/data`;
  zip.file(`${androidFolder}/README.md`, generateAndroidReadmeFile());
  zip.file(
    `${androidThemeFolder}/${designSystemName}Theme.kt`,
    generateThemeFile(composeFileName, brandName),
  );
  zip.file(
    `${androidThemeFolder}/${designSystemName}ColorScheme.kt`,
    generateColorScheme(brandName, speakingNames, allColors),
  );
  zip.file(
    `${androidThemeFolder}/${designSystemName}Dimensions.kt`,
    generateDimensionsSchemeFile(brandName),
  );
  zip.file(
    `${androidThemeFolder}/${designSystemName}Typography.kt`,
    generateTypographySchemeFile(brandName),
  );
  zip.file(
    `${androidCoreFolder}/${designSystemShortName}Font.kt`,
    generateFontFamilyFile(),
  );
  zip.file(
    `${androidDataFolder}/${brandName}Dimensions.kt`,
    generateComposeDimensionsFile(brandName, theme),
  );
  zip.file(
    `${androidCoreFolder}/${designSystemShortName}Elevations.kt`,
    generateComposeElevationFile(theme.elevation),
  );
  zip.file(
    `${androidDataFolder}/${brandName}Typography.kt`,
    generateComposeTypographyFile(brandName, theme),
  );
  zip.file(
    `${androidDataFolder}/${brandName}Colors.kt`,
    generateComposeColorFile(brandName, allColors, luminanceSteps),
  );
  zip.file(
    `${androidBrandFolder}/${brandName}Theme.kt`,
    generateBrandThemeFile(brandName),
  );
  zip.file(
    `${androidCoreFolder}/${designSystemShortName}Density.kt`,
    generateDensityEnumFile(),
  );

  // Utils
  const utilsFolder: string = "Utils";
  zip.file(
    `${utilsFolder}/${fileName}-sketch-colors.json`,
    getSketchColorsAsString(speakingNames, allColors, luminanceSteps),
  );
  zip.file(`${utilsFolder}/${fileName}-font-faces.scss`, getFontFaces(theme));

  // Web
  const webFolder: string = "Web";

  zip.file(`${webFolder}/${fileName}-theme.css`, themeProperties);

  const colorsPalette = getTypedCssPropertyAsString(
    getPaletteOutput(allColors, luminanceSteps),
    "color",
  );
  const colorSpeakingNames = getCssPropertyAsString(
    getSpeakingNames(speakingNames, allColors),
    true,
  );
  zip.file(
    `${webFolder}/${fileName}-colors-full.css`,
    getFullColorCss(colorsPalette, colorSpeakingNames),
  );
  zip.file(`${webFolder}/${fileName}-palette.css`, colorsPalette);
  zip.file(`${webFolder}/${fileName}-speaking-names.css`, colorSpeakingNames);
  zip.file(`${webFolder}/README.md`, generateReadmeFile(fileName));

  // Custom Colors
  if (theme.customColors) {
    const customColorsFolder: string = "Custom Colors";

    const customColorsPalette = getTypedCssPropertyAsString(
      getPaletteOutput(theme.customColors, luminanceSteps),
      "color",
    );

    const customColorsSpeakingNames = getCssPropertyAsString(
      getSpeakingNames(speakingNames, theme.customColors),
      true,
    );

    let allCustomColorClasses = "";
    for (const colorName of Object.keys(theme.customColors)) {
      const colorClass = generateCustomColorClass(colorName);
      zip.file(
        `${webFolder}/${customColorsFolder}/classes/${colorName}.css`,
        colorClass,
      );
      allCustomColorClasses += colorClass;
    }

    zip.file(
      `${webFolder}/${customColorsFolder}/classes/all.css`,
      allCustomColorClasses,
    );

    zip.file(
      `${webFolder}/${customColorsFolder}/${fileName}-custom-colors-full.css`,
      getFullColorCss(customColorsPalette, customColorsSpeakingNames),
    );

    zip.file(
      `${webFolder}/${customColorsFolder}/${fileName}-custom-colors-palette.css`,
      customColorsPalette,
    );

    zip.file(
      `${webFolder}/${customColorsFolder}/${fileName}-speaking-names-custom-colors.css`,
      customColorsSpeakingNames,
    );
  }

  const zipFile = await zip.generateAsync({ type: "blob" });
  download(`${fileName}.zip`, zipFile);
};
