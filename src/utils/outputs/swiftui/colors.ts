import { DefaultColorType, HeisslufType, SpeakingName } from "../../data.ts";
import { kebabCase } from "../../index.ts";
import { getPalette } from "../index.ts";
import { FALLBACK_COLOR } from "../../../constants.ts";
import { designSystemName } from "./shared.ts";

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
  fileName: string,
  allColors: Record<string, DefaultColorType>,
  luminanceSteps: number[],
): string => {
  let resolvedTokenFile: string = `import SwiftUI

let ${fileName}Colors: [String: Color] = [
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
  resolvedTokenFile += `\n]\n`;

  return resolvedTokenFile;
};

const generateSwiftUIColorVariantExtension = (
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
        resolvedScheme += `          self.${resolvedName} = colors["\\(colorName)${color}", default: .clear].opacity(${transparency})\n`; // DBColors.${color}.opacity(${transparency})\n`;
      } else {
        resolvedScheme += `          self.${resolvedName} = colors["\\(colorName)${color}", default: .clear]\n`;
      }
    }

    resolvedScheme += `          self.onOriginDefault = colors["\\(colorName)${name}${colorScheme}", default: .clear]\n`;
    resolvedScheme += `          self.onOriginHovered = colors["\\(colorName)${name}OnOriginHovered${colorScheme}", default: .clear]\n`;
    resolvedScheme += `          self.onOriginPressed = colors["\\(colorName)${name}OnOriginPressed${colorScheme}", default: .clear]\n`;
    resolvedScheme += `          self.originDefault = colors["\\(colorName)${name}OriginDefault${colorScheme}", default: .clear]\n`;
    resolvedScheme += `          self.originHovered = colors["\\(colorName)${name}OriginHovered${colorScheme}", default: .clear]\n`;
    resolvedScheme += `          self.originPressed = colors["\\(colorName)${name}OriginPressed${colorScheme}", default: .clear]\n`;
  return resolvedScheme;
};

const generateSwiftUIColorSchemeDarkLight = (
  fileName: string,
  colorKeys: string[],
  resolvedScheme: string,
  darkMode?: boolean,
): string => {
  console.log(fileName)
  const colorScheme = kebabCase(darkMode ? "dark" : "light");

  resolvedScheme += `\n    static func getColorScheme${colorScheme}(colors: [String: Color]) -> ${designSystemName}ColorScheme {\n`
    for (const name of colorKeys) {
    resolvedScheme += `
        var ${name.toLowerCase()}Colors${colorScheme}: DSColorVariant {
            .init(.${colorScheme.toLowerCase()}, colorName: "${name.toLowerCase()}", colors: colors)
        }\n`;
    }
  resolvedScheme += `

        return .init(\n`;
  colorKeys.forEach((name, index) => {
    resolvedScheme += `            ${name}: ${name}Colors${colorScheme}`;
    // if not last element:
    if (index < colorKeys.length - 1) {
      resolvedScheme += `,\n`
    }
  });
  resolvedScheme += `\n        )\n    }\n`;

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

  // 1. Generate generic DSColorVariant protocol'
  const name = colorKeys[0]
  const allSpeakingNames = [...speakingNames, ...originAdditionalColors];
  resolvedScheme += `public struct DSColorVariant {\n`;
  for (const speakingName of allSpeakingNames) {
    const resolvedName = `${kebabCase(speakingName.name, true)}`;
    resolvedNames[`${name}${speakingName.name}`] = resolvedName;
    resolvedScheme += `    public let ${resolvedName}: Color\n`;
  }

  resolvedScheme += `\n    init(_ scheme: DSColorScheme, colorName: String, colors: [String: Color]) {
      switch scheme {
        case .dark:
`;

  resolvedScheme = generateSwiftUIColorVariantExtension(
    speakingNames,
    resolvedScheme,
    true
  );

  resolvedScheme += `\n        case .light:\n`;

  resolvedScheme = generateSwiftUIColorVariantExtension(
    speakingNames,
    resolvedScheme,
    false
  );

  resolvedScheme += `\n        }\n    }\n}\n\n`;

  // 2. Generate ColorSchemes for semantic colors
  resolvedScheme += `public struct ${designSystemName}ColorScheme {\n`;
  for (const name of colorKeys) {
    resolvedScheme += `    public let ${name}: DSColorVariant\n`;
  }

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

  resolvedScheme += `\n}\n\n`;

  resolvedScheme += `
enum DSColorScheme {
    case light
    case dark
}

`;

  return resolvedScheme;
};
