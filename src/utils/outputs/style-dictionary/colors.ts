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
        comment: "This is just to resolve the original origin color",
        value: color.origin,
      },
    };

    colorValues.light = {
      origin: {
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
      on: {
        origin: {
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
      },
    };

    colorValues.dark = {
      origin: {
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
      on: {
        origin: {
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
  const colors: any = { light: {}, dark: {} };
  const colorTheme = ["light", "dark"];
  for (const [unformattedName] of Object.entries(allColors)) {
    const name = unformattedName.toLowerCase();

    for (const theme of colorTheme) {
      const isDark = theme === "dark";
      const themeObj: any = {
        origin: {
          default: {
            value: `{colors.${name}.${theme}.origin.default.value}`,
          },
          hovered: {
            value: `{colors.${name}.${theme}.origin.hovered.value}`,
          },
          pressed: {
            value: `{colors.${name}.${theme}.origin.pressed.value}`,
          },
        },
        on: {
          origin: {
            default: {
              value: `{colors.${name}.${theme}.on.origin.default.value}`,
            },
            hovered: {
              value: `{colors.${name}.${theme}.on.origin.hovered.value}`,
            },
            pressed: {
              value: `{colors.${name}.${theme}.on.origin.pressed.value}`,
            },
          },
        },
      };

      for (const speakingName of speakingNames) {
        const dotName = speakingName.name.replaceAll("-", ".");

        setObjectByPath(
          themeObj,
          `${dotName}.value`,
          `{colors.${name}.${isDark ? speakingName.dark : speakingName.light}.value}`,
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

      colors[theme][name] = themeObj;
    }
  }
  return { colors };
};
