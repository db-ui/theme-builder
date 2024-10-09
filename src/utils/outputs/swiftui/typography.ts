import { FontType, ThemeType } from "../../data.ts";
import traverse from "traverse";
import { kebabCase } from "../../index.ts";
import {
  densities,
  devices,
  shirtSizes,
} from "./shared.ts";

export const generateSwiftUIFontFamilyFile = (headlineFont: [string, FontType][], sansFont: [string, FontType][]): string => {
  let resolvedTokenFile = `import SwiftUI
struct DBFont {
  let name: String
  
  private init(named name: String) {
      self.name = name
      do {
          try registerFont(fontName: name)
          print("Registered Font \\(name)")
      } catch {
          let reason = error.localizedDescription
          fatalError("Failed to register font: \(reason)")
      }
  }

  static let dbFlex = DBFont(named: "DBNeoScreenFlex")

}

public enum FontError: Swift.Error {
   case failedToRegisterFont
}

func registerFont(fontName: String) throws {
    guard let asset = NSDataAsset(name: "Fonts/\(fontName)", bundle: Bundle.main),
          let provider = CGDataProvider(data: asset.data as NSData),
          let font = CGFont(provider),
          CTFontManagerRegisterGraphicsFont(font, nil) else {
        throw FontError.failedToRegisterFont
    }
}
`
  return resolvedTokenFile
}

export const generateSwiftUITypographyFile = (theme: ThemeType): string => {
  let resolvedTokenFile: string = `import SwiftUI
  
let dbTypography: [String: CGFloat] = [
`;

  traverse(theme).forEach(function (value) {
    if (
      this.isLeaf &&
      this.path.length === 6 &&
      this.path[0] === "typography" &&
      !this.path.includes("desktop") &&
      !this.path.includes("_scale")
    ) {
      const resolvedNameArray = [
        this.path[3],
        this.path[5],
        this.path[1],
        this.path[2],
        this.path[4],
      ];
      const key = `${kebabCase(resolvedNameArray.join("-"), true)}`;

      let finalValue = `${Number(value) * 16}`;
      if (this.path.at(-1) === "lineHeight") {
        const fontSizePath = [...this.path];
        fontSizePath[fontSizePath.length - 1] = "fontSize";
        finalValue = `${Number(traverse(theme).get(fontSizePath)) * value * 16}`;
      }

      resolvedTokenFile += `    "${key}": ${finalValue},\n`;
    }
  });;

  resolvedTokenFile += `]\n`

  return resolvedTokenFile;
};

const typoVariants: string[] = ["body", "headline"];
const typoTypes: string[] = ["lineHeight", "fontSize"];

const fontsTypes: Record<string, string> = {
  h1: "Xl",
  h2: "Lg",
  h3: "Md",
  h4: "Sm",
  h5: "Xs",
  h6: "2xs",
  body: "Md",
  body3xl: "3xl",
  body2xl: "2xl",
  bodyXl: "Xl",
  bodyLg: "Lg",
  bodyMd: "Md",
  bodySm: "Sm",
  bodyXs: "Xs",
  body2xs: "2xs",
  body3xs: "3xs",
};

export const generateSwiftUITypographyScheme = (
  fileName: string,
  resolvedTokenFile: string,
  density: string,
  device: string,
): string => {
  for (const variant of typoVariants) {
    resolvedTokenFile += `let ${variant}Typography${density}${device}: Typography = .init(\n`;
    resolvedTokenFile += `    variant: TypographyVariant.${variant.toLowerCase()},\n`
    resolvedTokenFile += `    density: Density.${density.toLowerCase()},\n`
    resolvedTokenFile += `    device: DeviceType.${device.toLowerCase()}\n`
    resolvedTokenFile += `\n)\n\n`
  } 

  resolvedTokenFile += `func getTypography${density}${device}(`;

  for (const variant of typoVariants) {
    resolvedTokenFile += `${variant}: Typography = ${variant}Typography${density}${device},\n`;
  }
  resolvedTokenFile = resolvedTokenFile.substring(0, resolvedTokenFile.lastIndexOf(','));
  resolvedTokenFile += `) -> ${fileName}Typography {
    .init(\n`;
  for (const variant of typoVariants) {
    resolvedTokenFile += `        ${variant}: ${variant},\n`;
  }
  resolvedTokenFile = resolvedTokenFile.substring(0, resolvedTokenFile.lastIndexOf(','));
  resolvedTokenFile += `\n    )\n}\n\n`;

  return resolvedTokenFile;
};

export const generateSwiftUITypographySchemeFile = (fileName: string): string => {
  let resolvedTokenFile: string = `import SwiftUI
`;

  resolvedTokenFile += `struct Typography {\n`;
  for (const type of typoTypes) {
    for (const size of shirtSizes) {
      resolvedTokenFile += `    let ${kebabCase(`${type}-${size}`, true)}: CGFloat\n`;
    }
  }
  resolvedTokenFile += "}\n\n";

  resolvedTokenFile += `struct ${fileName}Typography {\n`;
  for (const variant of typoVariants) {
    resolvedTokenFile += `    let ${variant}: Typography\n`;
  }
  resolvedTokenFile += "}\n\n";

  for (const density of densities) {
    for (const device of devices) {
      resolvedTokenFile = generateSwiftUITypographyScheme(
        fileName,
        resolvedTokenFile,
        density,
        device,
      );
    }
  }

  resolvedTokenFile += `
enum DeviceType: String {
    case mobile = "Mobile"
    case tablet = "Tablet"
}

enum TypographyVariant: String {
    case body
    case headline
}

extension Typography {
    init(variant: TypographyVariant, density: Density, device: DeviceType) {
        lineHeight3xs = dbTypography["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)3xs", default: 12]
        lineHeight2xs = dbTypography["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)2xs", default: 12]
        lineHeightXs = dbTypography["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)Xs", default: 12]
        lineHeightSm = dbTypography["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)Sm", default: 12]
        lineHeightMd = dbTypography["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)Md", default: 12]
        lineHeightLg = dbTypography["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)Lg", default: 12]
        lineHeightXl = dbTypography["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)Xl", default: 12]
        lineHeight2xl = dbTypography["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)2xl", default: 12]
        lineHeight3xl = dbTypography["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)3xl", default: 12]
        
        fontSize3xs = dbTypography["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)3xs", default: 12]
        fontSize2xs = dbTypography["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)2xs", default: 12]
        fontSizeXs = dbTypography["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)2xs", default: 12]
        fontSizeSm = dbTypography["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)Sm", default: 12]
        fontSizeMd = dbTypography["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)Md", default: 12]
        fontSizeLg = dbTypography["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)Lg", default: 12]
        fontSizeXl = dbTypography["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)Xl", default: 12]
        fontSize2xl = dbTypography["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)2xl", default: 12]
        fontSize3xl = dbTypography["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)3xl", default: 12]
    }
}
  `

  resolvedTokenFile += `struct ${fileName}Fonts{\n`;
  for (const [font] of Object.entries(fontsTypes)) {
    resolvedTokenFile += `let ${font}: Font\n`;
  }
  resolvedTokenFile += "}\n\n";

  resolvedTokenFile += `func getFonts(typo: DeutscheBahnThemeTypography) -> ${fileName}Fonts { 
    .init(\n`;
  for (const [font, size] of Object.entries(fontsTypes)) {
    resolvedTokenFile += `        ${font}: DBFont.flex.font(size: typo.${font.includes("body") ? "body" : "headline"}.fontSize${size}),\n`;
  }
  resolvedTokenFile = resolvedTokenFile.substring(0, resolvedTokenFile.lastIndexOf(','));
  resolvedTokenFile += `\n    )\n}\n\n`;

  return resolvedTokenFile;
};
