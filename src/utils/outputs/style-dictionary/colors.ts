import { DefaultColorType, HeisslufType, SpeakingName } from "../../data.ts";
import { getPalette } from "../index.ts";
import { setObjectByPath } from "./index.ts";

export const getSDColorPalette = (
  allColors: Record<string, DefaultColorType>,
  luminanceSteps: number[],
): any => {
  const palette: Record<string, HeisslufType[]> = getPalette(
    allColors,
    luminanceSteps,
  );
  const colors: any = {};

  Object.entries(allColors).forEach(([unformattedName, color]) => {
    const name = unformattedName.toLowerCase();

    const colorValues: any = {};

    const hslType: HeisslufType[] = palette[unformattedName];
    hslType.forEach((hsl) => {
      colorValues[`${hsl.index ?? hsl.name}`] = { value: hsl.hex };
    });

    colorValues.origin = {
      base: {
        value: color.origin,
      },
      light: {
        default: {
          value: color.originLight,
        },
        hovered: {
          value: color.originLightHovered,
        },
        pressed: {
          value: color.originLightPressed,
        },
      },
      dark: {
        default: {
          value: color.originDark,
        },
        hovered: {
          value: color.originDarkHovered,
        },
        pressed: {
          value: color.originDarkPressed,
        },
      },
    };

    colorValues.onOrigin = {
      light: {
        default: {
          value: color.onOriginLight,
        },
        hovered: {
          value: color.onOriginLightHovered,
        },
        pressed: {
          value: color.onOriginLightPressed,
        },
      },
      dark: {
        default: {
          value: color.onOriginDark,
        },
        hovered: {
          value: color.onOriginDarkHovered,
        },
        pressed: {
          value: color.onOriginDarkPressed,
        },
      },
    };

    colors[name] = colorValues;
  });

  return { colors };
};

export const getSDSpeakingColors = (
  speakingNames: SpeakingName[],
  allColors: Record<string, DefaultColorType>,
): any => {
  const colors: any = {};
  const colorTheme = ["light", "dark"];
  for (const [unformattedName] of Object.entries(allColors)) {
    const name = unformattedName.toLowerCase();

    colors[name] = {};

    for (const theme of colorTheme) {
      const isDark = theme === "dark";
      const themeObj: any = {
        origin: {
          default: {
            value: `{colors.origin.${theme}.default.value}`,
          },
          hovered: {
            value: `colors.origin.${theme}.hovered.value`,
          },
          pressed: {
            value: `colors.origin.${theme}.pressed.value`,
          },
        },
        onOrigin: {
          default: {
            value: `colors.onOrigin.${theme}.default.value`,
          },
          hovered: {
            value: `colors.onOrigin.${theme}.hovered.value`,
          },
          pressed: {
            value: `colors.onOrigin.${theme}.pressed.value`,
          },
        },
      };

      for (const speakingName of speakingNames) {
        const dotName = speakingName.name.replaceAll("-", ".");

        setObjectByPath(
          themeObj,
          `${dotName}.value`,
          `colors.${name}.${isDark ? speakingName.dark : speakingName.light}.value`,
        );

        if (
          speakingName.transparencyDark !== undefined ||
          speakingName.transparencyLight !== undefined
        ) {
          setObjectByPath(
            themeObj,
            `${dotName}.transparent`,
            isDark
              ? speakingName.transparencyDark
              : speakingName.transparencyLight,
          );
        }
      }

      colors[name][theme] = themeObj;
    }
  }
  return { colors };
};
