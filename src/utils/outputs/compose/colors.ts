import { DefaultColorType, HeisslufType, SpeakingName } from "../../data.ts";
import { kebabCase } from "../../index.ts";
import { designSystemName, replacePackageName, replacePackagePath } from "./shared.ts";
import { getPalette } from "../index.ts";
import { FALLBACK_COLOR } from "../../../constants.ts";

const originAdditionalColors = [
  { name: "onOriginDefault", light: 0, dark: 0 },
  { name: "onOriginHovered", light: 0, dark: 0 },
  { name: "onOriginPressed", light: 0, dark: 0 },
  { name: "originDefault", light: 0, dark: 0 },
  { name: "originHovered", light: 0, dark: 0 },
  { name: "originPressed", light: 0, dark: 0 },
];

const getComposeColorFromHex = (hex: string = FALLBACK_COLOR): string => {
  return `Color(0xff${hex.replace("#", "")})`;
};

export const generateComposeColorFile = (
  brandName: string,
  allColors: Record<string, DefaultColorType>,
  luminanceSteps: number[],
): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}${replacePackagePath}.${brandName.toLowerCase()}.data
  
import androidx.compose.ui.graphics.Color

val ${brandName}ColorMap = mapOf (
`;

  const palette: Record<string, HeisslufType[]> = getPalette(
    allColors,
    luminanceSteps,
  );
  Object.entries(allColors).forEach(([name, color]) => {
    const hslType = palette[name];
    hslType.forEach((hsl) => {
      const key = `${name}${hsl.index}`;
      resolvedTokenFile += `\t"${key}" to ${getComposeColorFromHex(hsl.hex)},\n`;
    });

    resolvedTokenFile += `\t"${name}Origin" to ${getComposeColorFromHex(color.origin)},\n`;

    resolvedTokenFile += `\t"${name}OnOriginDefaultLight" to ${getComposeColorFromHex(color.onOriginLight)},\n`;
    resolvedTokenFile += `\t"${name}OnOriginHoveredLight" to ${getComposeColorFromHex(color.onOriginLightHovered)},\n`;
    resolvedTokenFile += `\t"${name}OnOriginPressedLight" to ${getComposeColorFromHex(color.onOriginLightPressed)},\n`;
    resolvedTokenFile += `\t"${name}OriginDefaultLight" to ${getComposeColorFromHex(color.originLight)},\n`;
    resolvedTokenFile += `\t"${name}OriginHoveredLight" to ${getComposeColorFromHex(color.originLightHovered)},\n`;
    resolvedTokenFile += `\t"${name}OriginPressedLight" to ${getComposeColorFromHex(color.originLightPressed)},\n`;

    resolvedTokenFile += `\t"${name}OnOriginDefaultDark" to ${getComposeColorFromHex(color.onOriginDark)},\n`;
    resolvedTokenFile += `\t"${name}OnOriginHoveredDark" to ${getComposeColorFromHex(color.onOriginDarkHovered)},\n`;
    resolvedTokenFile += `\t"${name}OnOriginPressedDark" to ${getComposeColorFromHex(color.onOriginDarkPressed)},\n`;
    resolvedTokenFile += `\t"${name}OriginDefaultDark" to ${getComposeColorFromHex(color.originDark)},\n`;
    resolvedTokenFile += `\t"${name}OriginHoveredDark" to ${getComposeColorFromHex(color.originDarkHovered)},\n`;
    resolvedTokenFile += `\t"${name}OriginPressedDark" to ${getComposeColorFromHex(color.originDarkPressed)},\n`;
  });

  resolvedTokenFile += ")\n";

  return resolvedTokenFile;
};

const generateColorSchemeDarkLightObjects = (
  colorKeys: string[],
  resolvedScheme: string,
  darkMode?: boolean,
): string => {
  const colorScheme = kebabCase(darkMode ? "dark" : "light");

  resolvedScheme += `fun getColorScheme${colorScheme}(colorMap: Map<String, Color>): ${designSystemName}ColorScheme =
\t${designSystemName}ColorScheme(\n`;
  for (const name of colorKeys) {
    resolvedScheme += `\t\t${name} = AdaptiveColors.${colorScheme.toLowerCase()}(colorMap, "${name}"),\n`;
  }
  resolvedScheme += "\t)\n\n";
  return resolvedScheme;
};

export const generateColorScheme = (
  brandName: string,
  speakingNames: SpeakingName[],
  allColors: Record<string, DefaultColorType>,
): string => {
  const colorKeys = Object.keys(allColors);
  let resolvedScheme: string = `package ${replacePackageName}${replacePackagePath}

import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import ${replacePackageName}${replacePackagePath}.${brandName.toLowerCase()}.data.${brandName}ColorMap

`;

resolvedScheme += getInterfaceConstruct()
  // 1. Generate semantic color classes like 'NeutralColors'
  const allSpeakingNames = [...speakingNames, ...originAdditionalColors];
  resolvedScheme += `class AdaptiveColors private constructor(\n`;
  for (const speakingName of allSpeakingNames) {
    const resolvedName = `${kebabCase(speakingName.name, true)}`;
    resolvedScheme += `\tval ${resolvedName}: Color,\n`;
  }
  resolvedScheme += `) {\n`;
  resolvedScheme += getInterfaceImplConstruct()

  resolvedScheme = generateConstructorsDarkLight(speakingNames, resolvedScheme)

  resolvedScheme += `class ${designSystemName}ColorScheme(\n`;
  for (const name of colorKeys) {
    resolvedScheme += `\tval ${name}: AdaptiveColors,\n`;
  }
  resolvedScheme += `)\n\n`;

  resolvedScheme = generateColorSchemeDarkLightObjects(colorKeys, resolvedScheme, true)
  resolvedScheme = generateColorSchemeDarkLightObjects(colorKeys, resolvedScheme, false)
  
  resolvedScheme += `val LocalColors = staticCompositionLocalOf { getColorSchemeLight(${brandName}ColorMap) }
val LocalActiveColor =\n\tstaticCompositionLocalOf { getColorSchemeLight(${brandName}ColorMap).neutral }
`;

  return resolvedScheme;
};

const generateConstructorsDarkLight = (speakingNames: SpeakingName[], resolvedScheme:string): string => {

  const colorSchemes = ["dark", "light"];
  resolvedScheme += `\tcompanion object {\n`;

  for (const colorScheme of colorSchemes) {
    resolvedScheme += `\t\tfun ${colorScheme}(colorMap: Map<String, Color>, colorName: String) = AdaptiveColors(\n`;
    for (const speakingName of speakingNames) {
      let transparency = "";
      if (colorScheme == "light" && speakingName.transparencyLight !== undefined) {
        transparency = `.copy(${(speakingName.transparencyLight || 0) / 100}f)`;
      } else if (colorScheme == "dark" && speakingName.transparencyDark !== undefined) {
        transparency = `.copy(${(speakingName.transparencyDark || 0) / 100}f)`;
      }
      resolvedScheme += `\t\t\tcolorMap.getValue(colorName + ${colorScheme == "dark" ? speakingName.dark : speakingName.light})${transparency},\n`;
    }
    resolvedScheme += `\t\t\tcolorMap.getValue(colorName + "OnOriginDefault${kebabCase(colorScheme)}"),\n`;
    resolvedScheme += `\t\t\tcolorMap.getValue(colorName + "OnOriginHovered${kebabCase(colorScheme)}"),\n`;
    resolvedScheme += `\t\t\tcolorMap.getValue(colorName + "OnOriginPressed${kebabCase(colorScheme)}"),\n`;
    resolvedScheme += `\t\t\tcolorMap.getValue(colorName + "OriginDefault${kebabCase(colorScheme)}"),\n`;
    resolvedScheme += `\t\t\tcolorMap.getValue(colorName + "OriginHovered${kebabCase(colorScheme)}"),\n`;
    resolvedScheme += `\t\t\tcolorMap.getValue(colorName + "OriginPressed${kebabCase(colorScheme)}"),\n`;
    resolvedScheme += `\t\t)\n\n`;
  }

  resolvedScheme += `\t}\n}\n\n`;

  return resolvedScheme;
}

const getInterfaceConstruct = (): string => {
  return `interface IStateColor {
    val Default: Color
    val Hovered: Color
    val Pressed: Color
}

interface IBasic {
    interface IBackground {
        interface ITransparent {
            val Full: Color
            val Semi: Color
            val Hovered: Color
            val Pressed: Color
        }

        val Level1: IStateColor
        val Level2: IStateColor
        val Level3: IStateColor
        val Transparent: ITransparent
    }

    interface IText {
        val Default: IStateColor
        val Emphasis100: IStateColor
        val Emphasis90: IStateColor
        val Emphasis80: IStateColor
    }

    interface IIcon {
        val Default: IStateColor
        val Emphasis100: IStateColor
        val Emphasis90: IStateColor
        val Emphasis80: IStateColor
        val Emphasis70: IStateColor
    }

    interface IBorder {
        val Default: IStateColor
        val Emphasis100: IStateColor
        val Emphasis70: IStateColor
        val Emphasis60: IStateColor
        val Emphasis50: IStateColor
    }

    val Background: IBackground
    val Text: IText
    val Icon: IIcon
    val Border: IBorder
}

interface IInverted {
    interface IBackground {
        val ContrastMax: IStateColor
        val ContrastHigh: IStateColor
        val ContrastLow: IStateColor
    }

    val Background: IBackground
    val OnBackground: IStateColor
}\n\n`;
}

const getInterfaceImplConstruct = (): string => {
  return `    val Basic = object : IBasic {
        override val Background = object : IBasic.IBackground {
            override val Level1 = object : IStateColor {
                override val Default = bgBasicLevel1Default
                override val Hovered = bgBasicLevel1Hovered
                override val Pressed = bgBasicLevel1Pressed
            }
            override val Level2 = object : IStateColor {
                override val Default = bgBasicLevel2Default
                override val Hovered = bgBasicLevel2Hovered
                override val Pressed = bgBasicLevel2Pressed
            }
            override val Level3 = object : IStateColor {
                override val Default = bgBasicLevel3Default
                override val Hovered = bgBasicLevel3Hovered
                override val Pressed = bgBasicLevel3Pressed
            }
            override val Transparent = object : IBasic.IBackground.ITransparent {
                override val Full = bgBasicTransparentFullDefault
                override val Semi = bgBasicTransparentSemiDefault
                override val Hovered = bgBasicTransparentHovered
                override val Pressed = bgBasicTransparentPressed
            }
        }

        override val Text = object : IBasic.IText {
            val e100 = object : IStateColor {
                override val Default = onBgBasicEmphasis100Default
                override val Hovered = onBgBasicEmphasis100Hovered
                override val Pressed = onBgBasicEmphasis100Pressed
            }

            override val Default = e100
            override val Emphasis100 = e100
            override val Emphasis90 = object : IStateColor {
                override val Default = onBgBasicEmphasis90Default
                override val Hovered = onBgBasicEmphasis90Hovered
                override val Pressed = onBgBasicEmphasis90Pressed
            }
            override val Emphasis80 = object : IStateColor {
                override val Default = onBgBasicEmphasis80Default
                override val Hovered = onBgBasicEmphasis80Hovered
                override val Pressed = onBgBasicEmphasis80Pressed
            }
        }

        override val Icon = object : IBasic.IIcon {
            val e70 = object : IStateColor {
                override val Default = onBgBasicEmphasis70Default
                override val Hovered = onBgBasicEmphasis70Hovered
                override val Pressed = onBgBasicEmphasis70Pressed
            }

            override val Default = e70
            override val Emphasis100 = object : IStateColor {
                override val Default = onBgBasicEmphasis100Default
                override val Hovered = onBgBasicEmphasis100Hovered
                override val Pressed = onBgBasicEmphasis100Pressed
            }
            override val Emphasis90 = object : IStateColor {
                override val Default = onBgBasicEmphasis90Default
                override val Hovered = onBgBasicEmphasis90Hovered
                override val Pressed = onBgBasicEmphasis90Pressed
            }
            override val Emphasis80 = object : IStateColor {
                override val Default = onBgBasicEmphasis80Default
                override val Hovered = onBgBasicEmphasis80Hovered
                override val Pressed = onBgBasicEmphasis80Pressed
            }
            override val Emphasis70 = e70
        }

        override val Border = object : IBasic.IBorder {
            val e60 = object : IStateColor {
                override val Default = onBgBasicEmphasis60Default
                override val Hovered = onBgBasicEmphasis60Hovered
                override val Pressed = onBgBasicEmphasis60Pressed
            }

            override val Default = e60
            override val Emphasis100 = object : IStateColor {
                override val Default = onBgBasicEmphasis100Default
                override val Hovered = onBgBasicEmphasis100Hovered
                override val Pressed = onBgBasicEmphasis100Pressed
            }
            override val Emphasis70 = object : IStateColor {
                override val Default = onBgBasicEmphasis70Default
                override val Hovered = onBgBasicEmphasis70Hovered
                override val Pressed = onBgBasicEmphasis70Pressed
            }
            override val Emphasis60 = e60
            override val Emphasis50 = object : IStateColor {
                override val Default = onBgBasicEmphasis50Default
                override val Hovered = onBgBasicEmphasis50Hovered
                override val Pressed = onBgBasicEmphasis50Pressed
            }
        }
    }

    val Inverted = object : IInverted {
        override val Background = object : IInverted.IBackground {
            override val ContrastMax = object : IStateColor {
                override val Default = bgInvertedContrastMaxDefault
                override val Hovered = bgInvertedContrastMaxHovered
                override val Pressed = bgInvertedContrastMaxPressed
            }
            override val ContrastHigh = object : IStateColor {
                override val Default = bgInvertedContrastHighDefault
                override val Hovered = bgInvertedContrastHighHovered
                override val Pressed = bgInvertedContrastHighPressed
            }
            override val ContrastLow = object : IStateColor {
                override val Default = bgInvertedContrastLowDefault
                override val Hovered = bgInvertedContrastLowHovered
                override val Pressed = bgInvertedContrastLowPressed
            }
        }
        override val OnBackground = object : IStateColor {
            override val Default = onBgInvertedDefault
            override val Hovered = onBgInvertedHovered
            override val Pressed = onBgInvertedPressed
        }
    }

    val Origin = object : IStateColor {
          override val Default = originDefault
          override val Hovered = originHovered
          override val Pressed = originPressed
    }

    val OnOrigin = object : IStateColor {
          override val Default = onOriginDefault
          override val Hovered = onOriginHovered
          override val Pressed = onOriginPressed
    }\n\n`;
};
