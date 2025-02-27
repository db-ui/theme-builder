import { DirectoryJSON, Volume } from "@bundled-es-modules/memfs";
import StyleDictionary, { type Config } from "style-dictionary";
import { CustomCssTransFormGroup } from "./config/transform-groups.ts";
import { CssAppOverwriteFormat, CssPropertyFormat } from "./config/formats.ts";
import { SemanticColorsTransform } from "./config/transforms.ts";

StyleDictionary.registerFormat(CssPropertyFormat);
StyleDictionary.registerFormat(CssAppOverwriteFormat);
StyleDictionary.registerTransform(SemanticColorsTransform);
StyleDictionary.registerTransformGroup(CustomCssTransFormGroup);

export const runStyleDictionary = async (config: Config) => {
  const volume = new Volume();
  const sd = new StyleDictionary(config, { volume });
  await sd.buildAllPlatforms();

  return volume.toJSON();
};

export const convertDirectoryJsonToFiles = (
  directoryJSON: DirectoryJSON<string | null>,
) =>
  Object.entries(directoryJSON).flatMap(([path, content]) => {
    if (!content) {
      return [];
    }
    return new File([content], path);
  });
