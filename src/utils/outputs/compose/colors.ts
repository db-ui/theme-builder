import {
  BrandAlternativeColor,
  HeisslufType,
  SpeakingName,
} from "../../data.ts";
import { getExtraBrandColors, getPalette, prefix } from "../../outputs.ts";
import { upperCaseFirstLetters } from "../../index.ts";
import { replacePackageName } from "./shared.ts";

const brandAdditionalColors = [
  { name: "OnEnabled", light: 0, dark: 0 },
  { name: "OriginEnabled", light: 0, dark: 0 },
  { name: "OriginHover", light: 0, dark: 0 },
  { name: "OriginPressed", light: 0, dark: 0 },
];

const getComposeColorFromHex = (hex: string): string => {
  return `Color(0xff${hex.replace("#", "")})`;
};

export const generateComposeColorFile = (
  allColors: Record<string, string>,
  luminanceSteps: number[],
  altBrand: BrandAlternativeColor,
): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}
  
import androidx.compose.ui.graphics.Color
object Colors {

`;

  const palette: Record<string, HeisslufType[]> = getPalette(
    allColors,
    luminanceSteps,
  );
  const neutralHslColors = palette["neutral"];
  Object.entries(palette).forEach(([name, hslType]) => {
    hslType.forEach((hsl) => {
      const key = `${prefix}${upperCaseFirstLetters(name)}${hsl.index}`;
      resolvedTokenFile += `val ${key} = ${getComposeColorFromHex(hsl.hex)}\n`;
    });

    if (name === "brand") {
      const lightBrandColor = altBrand.dark ? allColors["brand"] : altBrand.hex;
      const darkBrandColor = !altBrand.dark ? allColors["brand"] : altBrand.hex;
      const lightBrand = getExtraBrandColors(
        lightBrandColor,
        true,
        luminanceSteps,
        neutralHslColors,
      );
      const darkBrand = getExtraBrandColors(
        darkBrandColor,
        false,
        luminanceSteps,
        neutralHslColors,
      );
      resolvedTokenFile += `val ${prefix}BrandOnLight = ${getComposeColorFromHex(lightBrand.brandOnColor)}\n`;
      resolvedTokenFile += `val ${prefix}BrandOriginLight = ${getComposeColorFromHex(lightBrand.color)}\n`;
      resolvedTokenFile += `val ${prefix}BrandHoverLight = ${getComposeColorFromHex(lightBrand.hoverColor)}\n`;
      resolvedTokenFile += `val ${prefix}BrandPressedLight = ${getComposeColorFromHex(lightBrand.pressedColor)}\n`;
      resolvedTokenFile += `val ${prefix}BrandOnDark = ${getComposeColorFromHex(darkBrand.brandOnColor)}\n`;
      resolvedTokenFile += `val ${prefix}BrandOriginDark = ${getComposeColorFromHex(darkBrand.color)}\n`;
      resolvedTokenFile += `val ${prefix}BrandHoverDark = ${getComposeColorFromHex(darkBrand.hoverColor)}\n`;
      resolvedTokenFile += `val ${prefix}BrandPressedDark = ${getComposeColorFromHex(darkBrand.pressedColor)}\n`;
    }
  });

  resolvedTokenFile += "}";

  return resolvedTokenFile;
};

const generateColorSchemeDarkLight = (
  fileName: string,
  speakingNames: SpeakingName[],
  allColors: Record<string, string>,
  resolvedNames: Record<string, string>,
  resolvedScheme: string,
  darkMode?: boolean,
): string => {
  const colorScheme = darkMode ? "dark" : "light";
  resolvedScheme += `fun ${prefix}ColorScheme${upperCaseFirstLetters(colorScheme)}(\n`;

  for (const [name] of Object.entries(allColors)) {
    for (const speakingName of speakingNames) {
      const resolvedName = resolvedNames[`${name}${speakingName.name}`];
      const color = `${prefix}${upperCaseFirstLetters(name)}${
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
        resolvedScheme += `${resolvedName}: Color = Colors.${color}.copy(${transparency}f),\n`;
      } else {
        resolvedScheme += `${resolvedName}: Color = Colors.${color},\n`;
      }
    }

    if (name === "brand") {
      resolvedScheme += `dbBrandOnEnabled: Color = Colors.dbBrandOn${upperCaseFirstLetters(colorScheme)},\n`;
      resolvedScheme += `dbBrandOriginEnabled: Color =Colors.dbBrandOrigin${upperCaseFirstLetters(colorScheme)},\n`;
      resolvedScheme += `dbBrandOriginHover: Color = Colors.dbBrandHover${upperCaseFirstLetters(colorScheme)},\n`;
      resolvedScheme += `dbBrandOriginPressed: Color =Colors.dbBrandPressed${upperCaseFirstLetters(colorScheme)},\n`;
    }
  }

  resolvedScheme += `\n):${fileName}ColorScheme = ${fileName}ColorScheme(\n`;

  for (const [name] of Object.entries(allColors)) {
    for (const speakingName of name === "brand"
      ? [...speakingNames, ...brandAdditionalColors]
      : speakingNames) {
      const resolvedName = resolvedNames[`${name}${speakingName.name}`];
      resolvedScheme += `${resolvedName}=${resolvedName},\n`;
    }
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
  let resolvedScheme: string = `package ${replacePackageName}
import ${replacePackageName}.Colors 

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.runtime.structuralEqualityPolicy
import androidx.compose.runtime.staticCompositionLocalOf

import androidx.compose.ui.graphics.Color
class ${fileName}ColorScheme(

`;

  for (const [name] of Object.entries(allColors)) {
    for (const speakingName of name === "brand"
      ? [...speakingNames, ...brandAdditionalColors]
      : speakingNames) {
      const resolvedName = `${prefix}${upperCaseFirstLetters(name)}${upperCaseFirstLetters(speakingName.name.replace(/-/g, " "))}`;
      resolvedNames[`${name}${speakingName.name}`] = resolvedName;
      resolvedScheme += `${resolvedName}: Color,\n`;
    }
  }

  resolvedScheme += `) {\n`;

  for (const [name] of Object.entries(allColors)) {
    for (const speakingName of name === "brand"
      ? [...speakingNames, ...brandAdditionalColors]
      : speakingNames) {
      const resolvedName = resolvedNames[`${name}${speakingName.name}`];
      resolvedScheme += `var ${resolvedName} by mutableStateOf(${resolvedName}, structuralEqualityPolicy())
  internal set\n`;
    }
  }

  resolvedScheme += `fun copy(\n`;
  for (const [name] of Object.entries(allColors)) {
    for (const speakingName of name === "brand"
      ? [...speakingNames, ...brandAdditionalColors]
      : speakingNames) {
      const resolvedName = resolvedNames[`${name}${speakingName.name}`];
      resolvedScheme += `${resolvedName}:Color = this.${resolvedName},\n`;
    }
  }
  resolvedScheme += `):${fileName}ColorScheme =
  ${fileName}ColorScheme(\n`;
  for (const [name] of Object.entries(allColors)) {
    for (const speakingName of name === "brand"
      ? [...speakingNames, ...brandAdditionalColors]
      : speakingNames) {
      const resolvedName = resolvedNames[`${name}${speakingName.name}`];
      resolvedScheme += `${resolvedName} = ${resolvedName},\n`;
    }
  }
  resolvedScheme += `)\n`;
  resolvedScheme += `}\n\n`;

  resolvedScheme = generateColorSchemeDarkLight(
    fileName,
    speakingNames,
    allColors,
    resolvedNames,
    resolvedScheme,
    true,
  );

  resolvedScheme = generateColorSchemeDarkLight(
    fileName,
    speakingNames,
    allColors,
    resolvedNames,
    resolvedScheme,
    false,
  );

  resolvedScheme += `
val LocalColors = staticCompositionLocalOf { ${prefix}ColorSchemeLight() }
`;

  return resolvedScheme;
};
