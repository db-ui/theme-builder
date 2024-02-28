import { HeisslufType, SpeakingName } from "../data";
import { getExtraBrandColors } from "../outputs";

const isStateName = (name: string) => (
    name.includes("enabled") ||
    name.includes("hover") ||
    name.includes("pressed")
);

const processState = (name: string) => {
    const stateIndex = name.lastIndexOf("-");
    const state = name.slice(stateIndex + 1);
    const nameWithoutState = name.slice(0, stateIndex);

    const numOfState =
      state === "enabled" ? "01" : state === "hover" ? "02" : "03";
    const stateNumbered = `${numOfState}-${state}`;

    return {nameWithoutState, numOfState, state, stateNumbered};
  };

  const getTransparency = (speakingName: SpeakingName, darkMode: boolean) => {
    let transparency;
    if (
      speakingName.transparencyDark !== undefined ||
      speakingName.transparencyLight !== undefined
    ) {
        transparency = darkMode
        ? speakingName.transparencyDark
        : speakingName.transparencyLight;
    } else {
        transparency = 0;
    }
    return transparency;
  }

export const getSketchColors = (
  speakingNames: SpeakingName[],
  allColors: Record<string, string>,
  colors: Record<string, HeisslufType[]>,
  darkMode: boolean,
  luminanceSteps: number[],
  speakingNamesDefaultMapping: SpeakingName[]
): any => {
  let result: any = {};

  Object.entries(colors).forEach(([name, color]) => {
    if (name === "brand") {
      const brandColor = allColors["brand"];
      const lightBrand = getExtraBrandColors(brandColor, false, luminanceSteps);
      const darkBrand = getExtraBrandColors(brandColor, true, luminanceSteps);

      const brandTheme = darkMode ? darkBrand : lightBrand;

      result = {
        ...result,
        "brand/On/01-Enabled": `transparency 0%, ${brandTheme.brandOnColor}`,
        "brand/Origin/01-Enabled": `transparency 0%, ${brandTheme.color}`,
        "brand/Origin/02-Hover": `transparency 0%, ${brandTheme.hoverColor}`,
        "brand/Origin/03-Pressed": `transparency 0%, ${brandTheme.pressedColor}`,
      };
    }

    speakingNames.forEach((speakingName) => {
      const mappedName = speakingNamesDefaultMapping.find(
        (mapping) => mapping.name === speakingName.name
      );

      if (mappedName) {
        const colorNumber = darkMode ? mappedName.dark : mappedName.light;
        const hexValue = color[colorNumber].hex;

        const transparency = getTransparency(speakingName, darkMode);

        if (speakingName.name.includes("on-")) {
          const nameWithoutOnPrefix = speakingName.name.replace("on-", "");
          if (isStateName(speakingName.name)) {
            const {nameWithoutState, numOfState, state} = processState(nameWithoutOnPrefix);
            const processedState = state.replace(/^ak-/, "").replace(/^bg-/, "");
            const stateWithNum = `${numOfState}-${processedState}`;
            result[`${name}/On/${nameWithoutState}/${stateWithNum}`] =
              `transparency ${transparency}%, ${hexValue}`;
          } else {
            result[`${name}/On/${nameWithoutOnPrefix}`] =
              `transparency ${transparency}%, ${hexValue}`;
          }
        } else if (isStateName(speakingName.name)) {
          const {nameWithoutState, stateNumbered} = processState(speakingName.name);
          result[`${name}/${nameWithoutState}/${stateNumbered}`] =
            `transparency ${transparency}%, ${hexValue}`;
        } else {
          result[`${name}/${speakingName.name}`] =
            `transparency ${transparency}%, ${hexValue}`;
        }
      }
    });
  });
  return result;
};
