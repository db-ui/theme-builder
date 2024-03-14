import {
  BrandAlternativeColor,
  HeisslufType,
  SpeakingName,
} from "../../data.ts";
import { getExtraBrandColors, getPalette } from "../../outputs.ts";
import { kebabCase } from "../../index.ts";
import { replacePackageName } from "./shared.ts";

const brandAdditionalColors = [
  { name: "onEnabled", light: 0, dark: 0 },
  { name: "originEnabled", light: 0, dark: 0 },
  { name: "originHover", light: 0, dark: 0 },
  { name: "originPressed", light: 0, dark: 0 },
];

const getComposeColorFromHex = (hex: string): string => {
  return `Color(0xff${hex.replace("#", "")})`;
};

export const generateComposeColorFile = (
  allColors: Record<string, string>,
  luminanceSteps: number[],
  altBrand: BrandAlternativeColor,
): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}.theme
  
import androidx.compose.ui.graphics.Color
object Colors {

`;

  const palette: Record<string, HeisslufType[]> = getPalette(
    allColors,
    luminanceSteps,
  );
  Object.entries(palette).forEach(([name, hslType]) => {
    hslType.forEach((hsl) => {
      const key = `${name}${hsl.index}`;
      resolvedTokenFile += `val ${key} = ${getComposeColorFromHex(hsl.hex)}\n`;
    });

    if (name === "brand") {
      const lightBrandColor = altBrand.dark ? allColors["brand"] : altBrand.hex;
      const darkBrandColor = !altBrand.dark ? allColors["brand"] : altBrand.hex;
      const lightBrand = getExtraBrandColors(
        lightBrandColor,
        true,
        luminanceSteps,
      );
      const darkBrand = getExtraBrandColors(
        darkBrandColor,
        false,
        luminanceSteps,
      );
      resolvedTokenFile += `val brandOnLight = ${getComposeColorFromHex(lightBrand.brandOnColor)}\n`;
      resolvedTokenFile += `val brandOriginLight = ${getComposeColorFromHex(lightBrand.color)}\n`;
      resolvedTokenFile += `val brandHoverLight = ${getComposeColorFromHex(lightBrand.hoverColor)}\n`;
      resolvedTokenFile += `val brandPressedLight = ${getComposeColorFromHex(lightBrand.pressedColor)}\n`;
      resolvedTokenFile += `val brandOnDark = ${getComposeColorFromHex(darkBrand.brandOnColor)}\n`;
      resolvedTokenFile += `val brandOriginDark = ${getComposeColorFromHex(darkBrand.color)}\n`;
      resolvedTokenFile += `val brandHoverDark = ${getComposeColorFromHex(darkBrand.hoverColor)}\n`;
      resolvedTokenFile += `val brandPressedDark = ${getComposeColorFromHex(darkBrand.pressedColor)}\n`;
    }
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

    if (name === "brand") {
      resolvedScheme += `Colors.brandOn${colorScheme},\n`;
      resolvedScheme += `Colors.brandOrigin${colorScheme},\n`;
      resolvedScheme += `Colors.brandHover${colorScheme},\n`;
      resolvedScheme += `Colors.brandPressed${colorScheme},\n`;
    }
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
  allColors: Record<string, string>,
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
    const allSpeakingNames =
      name === "brand"
        ? [...speakingNames, ...brandAdditionalColors]
        : speakingNames;
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
