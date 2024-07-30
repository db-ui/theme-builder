import { DefaultColorType, HeisslufType, SpeakingName } from "../data";
import { getPalette, prefix } from "../outputs";
import { FALLBACK_COLOR } from "../../constants.ts";

const isStateName = (name: string) =>
  name.includes("default") ||
  name.includes("hovered") ||
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

const getSketchColors = (
  speakingNames: SpeakingName[],
  allColors: Record<string, DefaultColorType>,
  colors: Record<string, HeisslufType[]>,
  darkMode: boolean,
): any => {
  const result: any = {};

  for (const [name, origin] of Object.entries(allColors)) {
    const color = colors[name];
    for (const speakingName of speakingNames) {
      const colorNumber = darkMode ? speakingName.dark : speakingName.light;
      const hexValue = color[colorNumber]?.hex ?? FALLBACK_COLOR;

      const transparency = getTransparency(speakingName, darkMode);

      if (speakingName.name.includes("on-")) {
        const nameWithoutOnPrefix = speakingName.name.replace("on-", "");
        if (isStateName(speakingName.name)) {
          const { nameWithoutState, state } = processState(nameWithoutOnPrefix);
          state.replace(/^ak-/, "").replace(/^bg-/, "");
          result[`${prefix}-${name}/on/${nameWithoutState}/${state}`] =
            `transparency ${transparency}%, ${hexValue}`;
        } else {
          result[`${prefix}-${name}/on/${nameWithoutOnPrefix}`] =
            `transparency ${transparency}%, ${hexValue}`;
        }
      } else if (isStateName(speakingName.name)) {
        const { nameWithoutState, state } = processState(speakingName.name);
        result[`${prefix}-${name}/${nameWithoutState}/${state}`] =
          `transparency ${transparency}%, ${hexValue}`;
      } else {
        result[`${prefix}-${name}/${speakingName.name}`] =
          `transparency ${transparency}%, ${hexValue}`;
      }
    }

    result[`${prefix}-${name}/origin`] = `transparency 0%, ${origin.origin}`;
    result[`${prefix}-${name}/origin-light/default`] =
      `transparency 0%, ${origin.originLight}`;
    result[`${prefix}-${name}/origin-light/hovered`] =
      `transparency 0%, ${origin.originLightHovered}`;
    result[`${prefix}-${name}/origin-light/pressed`] =
      `transparency 0%, ${origin.originLightPressed}`;
    result[`${prefix}-${name}/on/origin-light/default`] =
      `transparency 0%, ${origin.onOriginLight}`;
    result[`${prefix}-${name}/on/origin-light/hovered`] =
      `transparency 0%, ${origin.onOriginLightHovered}`;
    result[`${prefix}-${name}/on/origin-light/pressed`] =
      `transparency 0%, ${origin.onOriginLightPressed}`;

    result[`${prefix}-${name}/origin-dark/default`] =
      `transparency 0%, ${origin.originDark}`;
    result[`${prefix}-${name}/origin-dark/hovered`] =
      `transparency 0%, ${origin.originDarkHovered}`;
    result[`${prefix}-${name}/origin-dark/pressed`] =
      `transparency 0%, ${origin.originDarkPressed}`;
    result[`${prefix}-${name}/on/origin-dark/default`] =
      `transparency 0%, ${origin.onOriginDark}`;
    result[`${prefix}-${name}/on/origin-dark/hovered`] =
      `transparency 0%, ${origin.onOriginDarkHovered}`;
    result[`${prefix}-${name}/on/origin-dark/pressed`] =
      `transparency 0%, ${origin.onOriginDarkPressed}`;
  }
  return result;
};

export const getSketchColorsAsString = (
  speakingNames: SpeakingName[],
  allColors: Record<string, DefaultColorType>,
  luminanceSteps: number[],
): string => {
  const colors = getPalette(allColors, luminanceSteps);

  const lightSpeakingNames = getSketchColors(
    speakingNames,
    allColors,
    colors,
    false,
  );
  const darkSpeakingNames = getSketchColors(
    speakingNames,
    allColors,
    colors,
    true,
  );

  return JSON.stringify({
    light: lightSpeakingNames,
    dark: darkSpeakingNames,
  });
};
