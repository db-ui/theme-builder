import JSZip from "jszip";
import { DefaultColorType, SpeakingName, ThemeType } from "../data.ts";
import { generateReadmeFile } from "./web/readme.ts";
import { generateThemeFile } from "./compose/theme.ts";
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
import { generateSwiftUIColorFile, generateSwiftUIColorScheme } from "./swiftui/colors.ts";
import { generateSwiftUIReadmeFile } from "./swiftui/readme.ts";
import { generateSwiftUIDimensionsFile, generateSwiftUIDimensionsSchemeFile } from "./swiftui/dimensions.ts";
import { generateSwiftUIDensityEnumFile } from "./swiftui/density.ts";
import { generateSwiftUIDesignSystemThemeFile, generateSwiftUIThemeFile } from "./swiftui/theme.ts";
import { designSystemName, generateStaticSwiftUIFiles } from "./swiftui/shared.ts";
import { generateSwiftUIElevationsFile } from "./swiftui/elevation.ts";
import { generateSwiftUIFontFamilyFile, generateSwiftUITypographyFile, generateSwiftUITypographySchemeFile } from "./swiftui/typography.ts";

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

  const composeFileName = kebabCase(fileName);

  const zip = new JSZip();
  zip.file(`${fileName}.json`, themeJsonString);

  //Android
  const androidFolder: string = "Android";
  const androidThemeFolder: string = `${androidFolder}/theme`;
  const androidDataFolder: string = `${androidThemeFolder}/data`;
  zip.file(
    `${androidFolder}/README.md`,
    generateAndroidReadmeFile(composeFileName),
  );
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
    generateComposeColorFile(allColors, luminanceSteps),
  );
  zip.file(`${androidDataFolder}/Density.kt`, generateDensityEnumFile());

  // SwiftUI (iOS)
  const iOSFileName = kebabCase(fileName);

  const iOSFolder: string = "swiftui";
  const iOSThemeBrandingName: string = kebabCase(theme.branding.name)
  const iOSCoreFolder: string = `${iOSFolder}/core`;
  const iOSThemeFolder: string = `${iOSFolder}/${iOSThemeBrandingName}`;
  const iOSDataFolder: string = `${iOSThemeFolder}/data`;
  zip.file(
    `${iOSFolder}/README.md`,
    generateSwiftUIReadmeFile(iOSFileName),
  );
  zip.file(
    `${iOSFolder}/${designSystemName}ColorScheme.swift`,
    generateSwiftUIColorScheme(iOSFileName, speakingNames, allColors),
  );
  zip.file(
    `${iOSFolder}/${designSystemName}Dimensions.swift`,
    generateSwiftUIDimensionsSchemeFile(iOSFileName),
  );
  zip.file(
    `${iOSFolder}/${designSystemName}Typography.swift`,
    generateSwiftUITypographySchemeFile(iOSFileName),
  );
  zip.file(
    `${iOSFolder}/${designSystemName}Theme.swift`,
    generateSwiftUIDesignSystemThemeFile(iOSThemeBrandingName),
  );
  // iOS - Theme
  zip.file(
    `${iOSThemeFolder}/${iOSFileName}.swift`,
    generateSwiftUIThemeFile(iOSThemeBrandingName),
  );
  // iOS - Theme - Date
  zip.file(
    `${iOSDataFolder}/${iOSThemeBrandingName}Dimensions.swift`,
    generateSwiftUIDimensionsFile(iOSThemeBrandingName, theme),
  );
  zip.file(
    `${iOSDataFolder}/${iOSThemeBrandingName}Typography.swift`,
    generateSwiftUITypographyFile(iOSThemeBrandingName, theme),
  );
  zip.file(
    `${iOSDataFolder}/${iOSThemeBrandingName}Colors.swift`,
    generateSwiftUIColorFile(iOSThemeBrandingName, allColors, luminanceSteps),
  );
  // iOS - Core
  zip.file(
    `${iOSCoreFolder}/AdaptiveColors+Descriptive.swift`,
    generateStaticSwiftUIFiles()
  );
  zip.file(`${iOSCoreFolder}/Fonts.swift`, generateSwiftUIFontFamilyFile());
  zip.file(
    `${iOSCoreFolder}/Elevations.swift`,
    generateSwiftUIElevationsFile(theme.elevation),
  );
  zip.file(`${iOSCoreFolder}/Density.swift`, generateSwiftUIDensityEnumFile());

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
