import { DefaultColorType, HeisslufType, SpeakingName } from "../../data.ts";
import { kebabCase } from "../../index.ts";
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

const getSwiftUIColorFromHex = (hex: string = FALLBACK_COLOR): string => {
  return `Color(hex: 0x${hex.replace("#", "")})`;
};

export const generateSwiftUIColorFile = (
  allColors: Record<string, DefaultColorType>,
  luminanceSteps: number[],
): string => {
  let resolvedTokenFile: string = `import SwiftUI

let dbColors: [String: Color] = [
`;

  const palette: Record<string, HeisslufType[]> = getPalette(
    allColors,
    luminanceSteps,
  );
  Object.entries(allColors).forEach(([name, color]) => {
    const hslType = palette[name];
    hslType.forEach((hsl) => {
      const key = `${name}${hsl.index}`;
      resolvedTokenFile += `  "${key}": ${getSwiftUIColorFromHex(hsl.hex)},\n`;
    });

    resolvedTokenFile += `  "${name}Origin": ${getSwiftUIColorFromHex(color.origin)},\n`;

    resolvedTokenFile += `  "${name}OnOriginDefaultLight": ${getSwiftUIColorFromHex(color.onOriginLight)},\n`;
    resolvedTokenFile += `  "${name}OnOriginHoveredLight": ${getSwiftUIColorFromHex(color.onOriginLightHovered)},\n`;
    resolvedTokenFile += `  "${name}OnOriginPressedLight": ${getSwiftUIColorFromHex(color.onOriginLightPressed)},\n`;
    resolvedTokenFile += `  "${name}OriginDefaultLight": ${getSwiftUIColorFromHex(color.originLight)},\n`;
    resolvedTokenFile += `  "${name}OriginHoveredLight": ${getSwiftUIColorFromHex(color.originLightHovered)},\n`;
    resolvedTokenFile += `  "${name}OriginPressedLight": ${getSwiftUIColorFromHex(color.originLightPressed)},\n`;

    resolvedTokenFile += `  "${name}OnOriginDefaultDark": ${getSwiftUIColorFromHex(color.onOriginDark)},\n`;
    resolvedTokenFile += `  "${name}OnOriginHoveredDark": ${getSwiftUIColorFromHex(color.onOriginDarkHovered)},\n`;
    resolvedTokenFile += `  "${name}OnOriginPressedDark": ${getSwiftUIColorFromHex(color.onOriginDarkPressed)},\n`;
    resolvedTokenFile += `  "${name}OriginDefaultDark": ${getSwiftUIColorFromHex(color.originDark)},\n`;
    resolvedTokenFile += `  "${name}OriginHoveredDark": ${getSwiftUIColorFromHex(color.originDarkHovered)},\n`;
    resolvedTokenFile += `  "${name}OriginPressedDark": ${getSwiftUIColorFromHex(color.originDarkPressed)},\n`;
  });

  resolvedTokenFile = resolvedTokenFile.substring(0, resolvedTokenFile.lastIndexOf(','));
  resolvedTokenFile += `\n]
  
extension Color {
  init(hex: Int, opacity: Double = 1) {
      self.init(
          .sRGB,
          red: Double((hex >> 16) & 0xff) / 255,
          green: Double((hex >> 08) & 0xff) / 255,
          blue: Double((hex >> 00) & 0xff) / 255,
          opacity: opacity
      )
  }
}

  `;

  return resolvedTokenFile;
};

const generateSwiftUIAdaptiveColorsExtension = (
  speakingNames: SpeakingName[],
  resolvedScheme: string,
  darkMode: boolean
): string => {
  const colorScheme = kebabCase(darkMode ? "dark" : "light");

    for (const speakingName of speakingNames) {
      const color = `${name}${
        darkMode ? speakingName.dark : speakingName.light
      }`;
      const resolvedName = `${kebabCase(speakingName.name, true)}`;
      if (
        speakingName.transparencyDark !== undefined ||
        speakingName.transparencyLight !== undefined
      ) {
        const transparency =
          (speakingName.transparencyDark !== undefined
            ? speakingName.transparencyDark
            : speakingName.transparencyLight || 0) / 100;
        resolvedScheme += `          self.${resolvedName} = dbColors["\\(colorName)${color}", default: .clear].opacity(${transparency})\n`; // DBColors.${color}.opacity(${transparency})\n`;
      } else {
        resolvedScheme += `          self.${resolvedName} = dbColors["\\(colorName)${color}", default: .clear]\n`;
      }
    }

    resolvedScheme += `          self.onOriginDefault = dbColors["\\(colorName)${name}${colorScheme}", default: .clear]\n`;
    resolvedScheme += `          self.onOriginHovered = dbColors["\\(colorName)${name}OnOriginHovered${colorScheme}", default: .clear]\n`;
    resolvedScheme += `          self.onOriginPressed = dbColors["\\(colorName)${name}OnOriginPressed${colorScheme}", default: .clear]\n`;
    resolvedScheme += `          self.originDefault = dbColors["\\(colorName)${name}OriginDefault${colorScheme}", default: .clear]\n`;
    resolvedScheme += `          self.originHovered = dbColors["\\(colorName)${name}OriginHovered${colorScheme}", default: .clear]\n`;
    resolvedScheme += `          self.originPressed = dbColors["\\(colorName)${name}OriginPressed${colorScheme}", default: .clear]\n`;
  return resolvedScheme;
};

const generateSwiftUIColorSchemeDarkLight = (
  fileName: string,
  colorKeys: string[],
  resolvedScheme: string,
  darkMode?: boolean,
): string => {
  const colorScheme = kebabCase(darkMode ? "dark" : "light");

  for (const name of colorKeys) {
    resolvedScheme += `
let ${name.toLowerCase()}Colors${colorScheme}: AdaptiveColors = .init(.${colorScheme.toLowerCase()}, colorName: "${name.toLowerCase()}")\n`;
  }

  resolvedScheme += `\nfunc getColorScheme${colorScheme}(\n`;

  colorKeys.forEach((name, index) => {
    resolvedScheme += `  ${name}: AdaptiveColors = ${name.toLowerCase()}Colors${colorScheme}`;
     // if not last element:
     if (index < colorKeys.length - 1) {
      resolvedScheme += `,\n`
    }
  });
  resolvedScheme += `\n) -> ${fileName}ColorScheme {
    .init(\n`;
  colorKeys.forEach((name, index) => {
    resolvedScheme += `        ${name}: ${name}`;
    // if not last element:
    if (index < colorKeys.length - 1) {
      resolvedScheme += `,\n`
    }
  });
  resolvedScheme += `\n)
  \n}\n`;

  return resolvedScheme;
};

export const generateSwiftUIColorScheme = (
  fileName: string,
  speakingNames: SpeakingName[],
  allColors: Record<string, DefaultColorType>,
): string => {
  const resolvedNames: Record<string, string> = {};
  const colorKeys = Object.keys(allColors);
  let resolvedScheme: string = `import SwiftUI

`;

  // 1. Generate generic AdaptiveColors protocol'
  const name = colorKeys[0]
  const allSpeakingNames = [...speakingNames, ...originAdditionalColors];
  resolvedScheme += `struct AdaptiveColors {\n`;
  for (const speakingName of allSpeakingNames) {
    const resolvedName = `${kebabCase(speakingName.name, true)}`;
    resolvedNames[`${name}${speakingName.name}`] = resolvedName;
    resolvedScheme += `  let ${resolvedName}: Color\n`;
  }

  resolvedScheme += `}\n`;

  // 2. Generate ColorSchemes for semantic colors
  resolvedScheme += `struct ${fileName}ColorScheme {\n`;
  for (const name of colorKeys) {
    resolvedScheme += ` let ${name}: AdaptiveColors\n`;
  }

  resolvedScheme += `}\n`;

  resolvedScheme = generateSwiftUIColorSchemeDarkLight(
    fileName,
    colorKeys,
    resolvedScheme,
    true,
  );

  resolvedScheme = generateSwiftUIColorSchemeDarkLight(
    fileName,
    colorKeys,
    resolvedScheme,
    false,
  );

  resolvedScheme += `
enum DBColorScheme {
    case light
    case dark
}

extension AdaptiveColors {
  init(_ scheme: DBColorScheme, colorName: String) {
      switch scheme {
        case .dark:
`;

  resolvedScheme = generateSwiftUIAdaptiveColorsExtension(
    speakingNames,
    resolvedScheme,
    true
  );

  resolvedScheme += `
        case .light:
`;

  resolvedScheme = generateSwiftUIAdaptiveColorsExtension(
    speakingNames,
    resolvedScheme,
    false
  );

  resolvedScheme += `
        }
    }
}
`;

  return resolvedScheme;
};
