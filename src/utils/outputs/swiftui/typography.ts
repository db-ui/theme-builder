import { ThemeType } from "../../data.ts";
import traverse from "traverse";
import { kebabCase } from "../../index.ts";
import {
  densities,
  designSystemName,
  devices,
  shirtSizes,
} from "./shared.ts";

export const generateSwiftUIFontFamilyFile = (): string => {
  return `import SwiftUI
struct DBFont {
  let name: String
  private let publicName: String
  
  private init(named name: String, publicName: String) {
      self.name = name
      self.publicName = publicName
      do {
          try registerFont(fontName: name)
          print("Registered Font \\(name)")
      } catch {
          let reason = error.localizedDescription
          fatalError("Failed to register font: \\(reason)")
      }
  }

  public func font(size: CGFloat) -> Font {
      Font.custom(publicName, size: size)
  }

  static let dbFlex = DBFont(named: "DBNeoScreenFlex", publicName: "DB Neo Screen Flex")

}

public enum FontError: Swift.Error {
    case failedToRegisterFont
}

func registerFont(fontName: String) throws {
    guard let fontURL = Bundle.module.url(forResource: "\\(fontName)", withExtension: "ttf") else {
        throw FontError.failedToRegisterFont
    }
    
    let fontURLs = [fontURL] as CFArray
    
    CTFontManagerRegisterFontURLs(fontURLs, .process, true) { errors, done in
        let errors = errors as! [CFError]
        guard errors.isEmpty else {
            preconditionFailure(errors.map(\\.localizedDescription).joined())
        }
        return true
    }
}
`;
}

export const generateSwiftUITypographyFile = (fileName: string, theme: ThemeType): string => {
  let resolvedTokenFile: string = `import SwiftUI
  
let ${fileName}Typography: [String: CGFloat] = [
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
  });

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
  console.log(fileName)
  
  resolvedTokenFile += `extension ${designSystemName}Typography {\n`
  for (const variant of typoVariants) {
    resolvedTokenFile += `    private static func ${variant}Typography${density}${device}(sizes: [String: CGFloat]) -> Typography { .init(\n`;
    resolvedTokenFile += `        variant: TypographyVariant.${variant.toLowerCase()},\n`
    resolvedTokenFile += `        density: Density.${density.toLowerCase()},\n`
    resolvedTokenFile += `        device: DeviceType.${device.toLowerCase()},\n`
    resolvedTokenFile += `        sizes: sizes\n`
    resolvedTokenFile += `\n      )\n    }\n\n`
  } 

  resolvedTokenFile += `    static func getTypography${density}${device}(sizes: [String: CGFloat]) -> ${designSystemName}Typography {
    .init(\n`;
  for (const variant of typoVariants) {
    resolvedTokenFile += `        ${variant}: ${variant}Typography${density}${device}(sizes: sizes),\n`;
  }
  resolvedTokenFile = resolvedTokenFile.substring(0, resolvedTokenFile.lastIndexOf(','));
  resolvedTokenFile += `\n        )\n    }\n}\n\n`;

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

  resolvedTokenFile += `struct ${designSystemName}Typography {\n`;
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
    init(variant: TypographyVariant, density: Density, device: DeviceType, sizes: [String: CGFloat]) {
        lineHeight3xs = sizes["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)3xs", default: 12]
        lineHeight2xs = sizes["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)2xs", default: 12]
        lineHeightXs = sizes["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)Xs", default: 12]
        lineHeightSm = sizes["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)Sm", default: 12]
        lineHeightMd = sizes["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)Md", default: 12]
        lineHeightLg = sizes["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)Lg", default: 12]
        lineHeightXl = sizes["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)Xl", default: 12]
        lineHeight2xl = sizes["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)2xl", default: 12]
        lineHeight3xl = sizes["\\(variant)LineHeight\\(density.rawValue)\\(device.rawValue)3xl", default: 12]
        
        fontSize3xs = sizes["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)3xs", default: 12]
        fontSize2xs = sizes["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)2xs", default: 12]
        fontSizeXs = sizes["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)2xs", default: 12]
        fontSizeSm = sizes["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)Sm", default: 12]
        fontSizeMd = sizes["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)Md", default: 12]
        fontSizeLg = sizes["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)Lg", default: 12]
        fontSizeXl = sizes["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)Xl", default: 12]
        fontSize2xl = sizes["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)2xl", default: 12]
        fontSize3xl = sizes["\\(variant)FontSize\\(density.rawValue)\\(device.rawValue)3xl", default: 12]
    }
}

`

  resolvedTokenFile += `struct ${designSystemName}Fonts{\n`;
  for (const [font] of Object.entries(fontsTypes)) {
    resolvedTokenFile += `    let ${font}: Font\n`;
  }
  resolvedTokenFile += `\n\n`;

  resolvedTokenFile += `    static func getFonts(typo: ${designSystemName}Typography) -> ${designSystemName}Fonts { 
      .init(\n`;
  for (const [font, size] of Object.entries(fontsTypes)) {
    resolvedTokenFile += `            ${font}: .init(font: DBFont.dbFlex.font(size: typo.${font.includes("body") ? "body" : "headline"}.fontSize${size}), uiFont: DBFont.dbFlex.uiFont(size: typo.${font.includes("body") ? "body" : "headline"}.fontSize${size}), lineHeight: typo.${font.includes("body") ? "body" : "headline"}.lineHeight${size}, fontWeight: ${font.includes("body") ? ".regular" : ".black"}),\n`
    // resolvedTokenFile += `            ${font}: DBFont.dbFlex.font(size: typo.${font.includes("body") ? "body" : "headline"}.fontSize${size}).weight(${font.includes("body") ? ".regular" : ".black"}),\n`;
  }
  resolvedTokenFile = resolvedTokenFile.substring(0, resolvedTokenFile.lastIndexOf(','));
  resolvedTokenFile += `\n        )\n    }\n}\n`;

  return resolvedTokenFile;
};
