import JSZip from "jszip";
import {
  SpeakingName,
  speakingNamesDefaultMapping,
  ThemeType,
} from "../data.ts";
import { generateReadmeFile } from "./compose/readme.ts";
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
import { getFontFaces } from "./fonts.ts";
import { kebabCase } from "../index.ts";
import {
  getCssPropertyAsString,
  getCssThemeProperties,
  getPaletteOutput,
  getSpeakingNames,
} from "./index.ts";

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
  const allColors: Record<string, string> = {
    ...theme.colors,
    ...theme.customColors,
  };

  const fileName = (theme.branding.name || `default-theme`) + "Theme";
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
      theme.branding.alternativeColors,
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
      theme.branding.alternativeColors,
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
        theme.branding.alternativeColors,
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

  if (theme.customColors) {
    zip.file(
      `${webFolder}/${fileName}-custom-colors-palette.css`,
      getCssPropertyAsString(
        getPaletteOutput(
          theme.customColors,
          luminanceSteps,
          theme.branding.alternativeColors,
        ),
      ),
    );

    zip.file(
      `${webFolder}/${fileName}-speaking-names-custom-colors-light.css`,
      getCssPropertyAsString(
        getSpeakingNames(speakingNames, theme.customColors, false),
      ),
    );
    zip.file(
      `${webFolder}/${fileName}-speaking-names-custom-colors-dark.css`,
      getCssPropertyAsString(
        getSpeakingNames(speakingNames, theme.customColors, true),
      ),
    );
  }

  const zipFile = await zip.generateAsync({ type: "blob" });
  download(`${fileName}.zip`, zipFile);
};
