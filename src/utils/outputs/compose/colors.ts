import { DefaultColorType, HeisslufType, SpeakingName } from "../../data.ts";
import { kebabCase } from "../../index.ts";
import { replacePackageName } from "./shared.ts";
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
  allColors: Record<string, DefaultColorType>,
  luminanceSteps: number[],
): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}.theme
  
import androidx.compose.ui.graphics.Color
object Colors {

`;

  const palette: Record<string, HeisslufType[]> = getPalette(
    allColors,
    luminanceSteps,
  );
  Object.entries(allColors).forEach(([name, color]) => {
    const hslType = palette[name];
    hslType.forEach((hsl) => {
      const key = `${name}${hsl.index}`;
      resolvedTokenFile += `val ${key} = ${getComposeColorFromHex(hsl.hex)}\n`;
    });

    resolvedTokenFile += `val ${name}Origin = ${getComposeColorFromHex(color.origin)}\n`;

    resolvedTokenFile += `val ${name}OnOriginDefaultLight = ${getComposeColorFromHex(color.onOriginLight)}\n`;
    resolvedTokenFile += `val ${name}OnOriginHoveredLight = ${getComposeColorFromHex(color.onOriginLightHovered)}\n`;
    resolvedTokenFile += `val ${name}OnOriginPressedLight = ${getComposeColorFromHex(color.onOriginLightPressed)}\n`;
    resolvedTokenFile += `val ${name}OriginDefaultLight = ${getComposeColorFromHex(color.originLight)}\n`;
    resolvedTokenFile += `val ${name}OriginHoveredLight = ${getComposeColorFromHex(color.originLightHovered)}\n`;
    resolvedTokenFile += `val ${name}OriginPressedLight = ${getComposeColorFromHex(color.originLightPressed)}\n`;

    resolvedTokenFile += `val ${name}OnOriginDefaultDark = ${getComposeColorFromHex(color.onOriginDark)}\n`;
    resolvedTokenFile += `val ${name}OnOriginHoveredDark = ${getComposeColorFromHex(color.onOriginDarkHovered)}\n`;
    resolvedTokenFile += `val ${name}OnOriginPressedDark = ${getComposeColorFromHex(color.onOriginDarkPressed)}\n`;
    resolvedTokenFile += `val ${name}OriginDefaultDark = ${getComposeColorFromHex(color.originDark)}\n`;
    resolvedTokenFile += `val ${name}OriginHoveredDark = ${getComposeColorFromHex(color.originDarkHovered)}\n`;
    resolvedTokenFile += `val ${name}OriginPressedDark = ${getComposeColorFromHex(color.originDarkPressed)}\n`;
  });

  resolvedTokenFile += "}";

  return resolvedTokenFile;
};

const generateColorSchemeDarkLight = (
  fileName: string,
  speakingNames: SpeakingName[],
  colorKeys: string[],
  resolvedScheme: string,
  darkMode?: boolean,
): string => {
  const colorScheme = kebabCase(darkMode ? "dark" : "light");

  for (const name of colorKeys) {
    resolvedScheme += `val ${kebabCase(name)}Colors${colorScheme} = ${kebabCase(name)}Colors(\n`;
    for (const speakingName of speakingNames) {
      const color = `${name}${
        darkMode ? speakingName.dark : speakingName.light
      }`;
      if (
        speakingName.transparencyDark !== undefined ||
        speakingName.transparencyLight !== undefined
      ) {
        const transparency =
          (speakingName.transparencyDark !== undefined
            ? speakingName.transparencyDark
            : speakingName.transparencyLight || 0) / 100;
        resolvedScheme += `Colors.${color}.copy(${transparency}f),\n`;
      } else {
        resolvedScheme += `Colors.${color},\n`;
      }
    }

    resolvedScheme += `Colors.${name}OnOriginDefault${colorScheme},\n`;
    resolvedScheme += `Colors.${name}OnOriginHovered${colorScheme},\n`;
    resolvedScheme += `Colors.${name}OnOriginPressed${colorScheme},\n`;
    resolvedScheme += `Colors.${name}OriginDefault${colorScheme},\n`;
    resolvedScheme += `Colors.${name}OriginHovered${colorScheme},\n`;
    resolvedScheme += `Colors.${name}OriginPressed${colorScheme},\n`;
    resolvedScheme += `)\n`;
  }

  resolvedScheme += `fun getColorScheme${colorScheme}(\n`;

  for (const name of colorKeys) {
    const semanticColor = `${kebabCase(name)}Colors`;
    resolvedScheme += `${name}: ${semanticColor} = ${kebabCase(name)}Colors${colorScheme},\n`;
  }
  resolvedScheme += `\n):${fileName}ColorScheme = ${fileName}ColorScheme(\n`;
  for (const name of colorKeys) {
    resolvedScheme += `${name}=${name},\n`;
  }
  resolvedScheme += `)\n`;

  return resolvedScheme;
};

export const generateColorScheme = (
  fileName: string,
  speakingNames: SpeakingName[],
  allColors: Record<string, DefaultColorType>,
): string => {
  const resolvedNames: Record<string, string> = {};
  const colorKeys = Object.keys(allColors);
  let resolvedScheme: string = `package ${replacePackageName}.theme

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.runtime.structuralEqualityPolicy
import androidx.compose.runtime.staticCompositionLocalOf

import androidx.compose.ui.graphics.Color
`;

  // 1. Generate semantic color classes like 'NeutralColors'
  for (const name of colorKeys) {
    const allSpeakingNames = [...speakingNames, ...originAdditionalColors];
    resolvedScheme += `class ${kebabCase(name)}Colors(\n`;
    for (const speakingName of allSpeakingNames) {
      const resolvedName = `${kebabCase(speakingName.name, true)}`;
      resolvedNames[`${name}${speakingName.name}`] = resolvedName;
      resolvedScheme += `${resolvedName}: Color,\n`;
    }
    resolvedScheme += `) {\n`;
    for (const speakingName of allSpeakingNames) {
      const resolvedName = resolvedNames[`${name}${speakingName.name}`];
      resolvedScheme += `var ${resolvedName} by mutableStateOf(${resolvedName}, structuralEqualityPolicy())
  internal set\n`;
    }
    resolvedScheme += `}\n`;
  }

  // 2. Generate ColorScheme with semantic colors
  resolvedScheme += `class ${fileName}ColorScheme(\n`;
  for (const name of colorKeys) {
    const semanticColor = `${kebabCase(name)}Colors`;
    resolvedScheme += `${name}: ${semanticColor},\n`;
  }
  resolvedScheme += `){\n`;
  for (const name of colorKeys) {
    resolvedScheme += `var ${name} by mutableStateOf(${name}, structuralEqualityPolicy())
  internal set\n`;
  }
  resolvedScheme += `}\n`;

  resolvedScheme = generateColorSchemeDarkLight(
    fileName,
    speakingNames,
    colorKeys,
    resolvedScheme,
    true,
  );

  resolvedScheme = generateColorSchemeDarkLight(
    fileName,
    speakingNames,
    colorKeys,
    resolvedScheme,
    false,
  );

  resolvedScheme += `
val LocalColors = staticCompositionLocalOf { getColorSchemeLight() }
`;

  return resolvedScheme;
};
