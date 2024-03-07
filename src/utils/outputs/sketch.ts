import { BrandAlternativeColor, HeisslufType, SpeakingName } from "../data";
import { getExtraBrandColors, prefix } from "../outputs";
import { getHeissluftColors } from "../generate-colors.ts";

const isStateName = (name: string) =>
  name.includes("enabled") ||
  name.includes("hover") ||
  name.includes("pressed");

const processState = (name: string) => {
  const stateIndex = name.lastIndexOf("-");
  const state = name.slice(stateIndex + 1);
  const nameWithoutState = name.slice(0, stateIndex);

  return { nameWithoutState, state };
};

const getTransparency = (
  speakingName: SpeakingName,
  darkMode: boolean,
): number | undefined =>
  speakingName.transparencyDark !== undefined ||
  speakingName.transparencyLight !== undefined
    ? darkMode
      ? speakingName.transparencyDark
      : speakingName.transparencyLight
    : 0;

const getPalette = (allColors: object, luminanceSteps: number[]): any =>
  Object.entries(allColors)
    .map(([name, color]) => {
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

const getSketchColors = (
  speakingNames: SpeakingName[],
  allColors: Record<string, string>,
  colors: Record<string, HeisslufType[]>,
  darkMode: boolean,
  luminanceSteps: number[],
  speakingNamesDefaultMapping: SpeakingName[],
  altBrand: BrandAlternativeColor,
): any => {
  let result: any = {};

  const neutralHslColors = colors["neutral"];

  Object.entries(colors).forEach(([name, color]) => {
    if (name === "brand") {
      const lightBrandColor = altBrand.dark ? allColors["brand"] : altBrand.hex;
      const darkBrandColor = !altBrand.dark ? allColors["brand"] : altBrand.hex;
      const lightBrand = getExtraBrandColors(
        lightBrandColor,
        false,
        luminanceSteps,
        neutralHslColors,
      );
      const darkBrand = getExtraBrandColors(
        darkBrandColor,
        true,
        luminanceSteps,
        neutralHslColors,
      );

      const brandTheme = darkMode ? darkBrand : lightBrand;

      result = {
        ...result,
        [`${prefix}-brand/on/enabled`]: `transparency 0%, ${brandTheme.brandOnColor}`,
        [`${prefix}-brand/on/origin/enabled`]: `transparency 0%, `,
        [`${prefix}-brand/on/origin/hover`]: `transparency 0%, `,
        [`${prefix}-brand/on/origin/pressed`]: `transparency 0%, `,
        [`${prefix}-brand/origin/enabled`]: `transparency 0%, ${brandTheme.color}`,
        [`${prefix}-brand/origin/hover`]: `transparency 0%, ${brandTheme.hoverColor}`,
        [`${prefix}-brand/origin/pressed`]: `transparency 0%, ${brandTheme.pressedColor}`,
      };
    }

    speakingNames.forEach((speakingName) => {
      const mappedName = speakingNamesDefaultMapping.find(
        (mapping) => mapping.name === speakingName.name,
      );

      if (mappedName) {
        const colorNumber = darkMode ? mappedName.dark : mappedName.light;
        const hexValue = color[colorNumber].hex;

        const transparency = getTransparency(speakingName, darkMode);

        if (speakingName.name.includes("on-")) {
          const nameWithoutOnPrefix = speakingName.name.replace("on-", "");
          if (isStateName(speakingName.name)) {
            const { nameWithoutState, state } =
              processState(nameWithoutOnPrefix);
            state
              .replace(/^ak-/, "")
              .replace(/^bg-/, "");
            result[`${prefix}-${name}/on/${nameWithoutState}/${state}`] =
              `transparency ${transparency}%, ${hexValue}`;
          } else {
            result[`${prefix}-${name}/on/${nameWithoutOnPrefix}`] =
              `transparency ${transparency}%, ${hexValue}`;
          }
        } else if (isStateName(speakingName.name)) {
          const { nameWithoutState, state } = processState(
            speakingName.name,
          );
          result[`${prefix}-${name}/${nameWithoutState}/${state}`] =
            `transparency ${transparency}%, ${hexValue}`;
        } else {
          result[`${prefix}-${name}/${speakingName.name}`] =
            `transparency ${transparency}%, ${hexValue}`;
        }
      }
    });
  });
  return result;
};

export const getSketchColorsAsString = (
  speakingNames: SpeakingName[],
  allColors: Record<string, string>,
  luminanceSteps: number[],
  speakingNamesDefaultMapping: SpeakingName[],
  altBrand: BrandAlternativeColor,
): string => {
  const colors = getPalette(allColors, luminanceSteps);

  const lightSpeakingNames = getSketchColors(
    speakingNames,
    allColors,
    colors,
    false,
    luminanceSteps,
    speakingNamesDefaultMapping,
    altBrand,
  );
  const darkSpeakingNames = getSketchColors(
    speakingNames,
    allColors,
    colors,
    true,
    luminanceSteps,
    speakingNamesDefaultMapping,
    altBrand,
  );

  return JSON.stringify({
    light: lightSpeakingNames,
    dark: darkSpeakingNames,
  });
};
