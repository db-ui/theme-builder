import {
  DefaultColorType,
  HeisslufType,
  SEMANTIC_COLOR,
  SpeakingName,
} from "../../data.ts";
import { getPalette } from "../index.ts";

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
    for (const hsl of hslType) {
      colorValues[`${hsl.index ?? hsl.name}`] = {
        value: hsl.hex,
        type: "color",
      };
    }

    colorValues.origin = {
      base: {
        comment: "This is just to resolve the original origin color",
        value: color.origin,
        type: "color",
      },
      light: {
        default: {
          value: color.originLightDefault,
          type: "color",
        },
        hovered: {
          value: color.originLightHovered,
          type: "color",
        },
        pressed: {
          value: color.originLightPressed,
          type: "color",
        },
      },
      dark: {
        default: {
          value: color.originDarkDefault,
          type: "color",
        },
        hovered: {
          value: color.originDarkHovered,
          type: "color",
        },
        pressed: {
          value: color.originDarkPressed,
          type: "color",
        },
      },
    };

    colorValues.on = {
      origin: {
        light: {
          default: {
            value: color.onOriginLightDefault,
            type: "color",
          },
          hovered: {
            value: color.onOriginLightHovered,
            type: "color",
          },
          pressed: {
            value: color.onOriginLightPressed,
            type: "color",
          },
        },
        dark: {
          default: {
            value: color.onOriginDarkDefault,
            type: "color",
          },
          hovered: {
            value: color.onOriginDarkHovered,
            type: "color",
          },
          pressed: {
            value: color.onOriginDarkPressed,
            type: "color",
          },
        },
      },
    };

    colors[name] = colorValues;
  });

  return colors;
};

export const setObjectByPath = (
  initObj: any,
  path: string,
  value: any,
): any => {
  if (path == "") return value;

  const [k, next] = path.split({
    [Symbol.split](s) {
      const i = s.indexOf(".");
      return i == -1 ? [s, ""] : [s.slice(0, i), s.slice(i + 1)];
    },
  });

  if (initObj !== undefined && typeof initObj !== "object") {
    console.error(`cannot set property ${k} of ${typeof initObj}`);
  }

  return Object.assign(initObj ?? {}, {
    [k]: setObjectByPath(initObj?.[k], next, value),
  });
};

export const getSDSpeakingColors = (
  speakingNames: SpeakingName[],
  allColors: Record<string, DefaultColorType>,
): any => {
  const colors: any = {};
  for (const [unformattedName] of Object.entries(allColors)) {
    const name = unformattedName.toLowerCase();

    const themeObj: any = {
      origin: {
        default: {
          type: SEMANTIC_COLOR,
          value: {
            light: [name, "origin", "light", "default"],
            dark: [name, "origin", "dark", "default"],
          },
        },
        hovered: {
          type: SEMANTIC_COLOR,
          value: {
            light: [name, "origin", "light", "hovered"],
            dark: [name, "origin", "dark", "hovered"],
          },
        },
        pressed: {
          type: SEMANTIC_COLOR,
          value: {
            light: [name, "origin", "light", "pressed"],
            dark: [name, "origin", "dark", "pressed"],
          },
        },
      },
      on: {
        origin: {
          default: {
            type: SEMANTIC_COLOR,
            value: {
              light: [name, "on", "origin", "light", "default"],
              dark: [name, "on", "origin", "dark", "default"],
            },
          },
          hovered: {
            type: SEMANTIC_COLOR,
            value: {
              light: [name, "on", "origin", "light", "hovered"],
              dark: [name, "on", "origin", "dark", "hovered"],
            },
          },
          pressed: {
            type: SEMANTIC_COLOR,
            value: {
              light: [name, "on", "origin", "light", "pressed"],
              dark: [name, "on", "origin", "dark", "pressed"],
            },
          },
        },
      },
    };

    for (const speakingName of speakingNames) {
      const dotName = speakingName.name.replaceAll("-", ".");

      setObjectByPath(themeObj, `${dotName}`, {
        type: SEMANTIC_COLOR,
        value: {
          light: [name, speakingName.light],
          dark: [name, speakingName.dark],
          transparencyDark: speakingName.transparencyDark,
          transparencyLight: speakingName.transparencyLight,
        },
      });
    }

    colors[name] = themeObj;
  }
  return colors;
};
