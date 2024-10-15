import { ThemeType } from "../../data.ts";
import traverse from "traverse";
import { kebabCase } from "../../index.ts";
import {
  densities,
  designSystemName,
  devices,
  shirtSizes,
} from "./shared.ts";

export const generateSwiftUIDimensionsFile = (fileName: string, theme: ThemeType): string => {
  let resolvedTokenFile: string = `
import SwiftUI

struct ${fileName}Dimensions: DSDimensions {
`;

  traverse(theme).forEach(function (value) {
    if (
      this.isLeaf &&
      this.path.length > 0 &&
      this.path[0] !== "branding" &&
      this.path[0] !== "colors" &&
      this.path[0] !== "additionalColors" &&
      this.path[0] !== "font" &&
      this.path[0] !== "transition" &&
      this.path[0] !== "elevation" &&
      this.path[0] !== "typography" &&
      !this.path.includes("desktop") &&
      !this.path.includes("_scale")
    ) {
      const key = `${kebabCase(this.path.join("-"), true)}`;
      console.log(key)
      console.log(value)
      const finalValue =
        typeof value === "string" || value instanceof String
          ? `${Number(value) * 16 || `.nan`}`
          : value;

      resolvedTokenFile += `  let ${key}: CGFloat = ${finalValue}\n`;
    }
  });

  resolvedTokenFile += "}\n";

  return resolvedTokenFile;
};

const dimensionTypes: Record<string, string[]> = {
  spacing: ["responsive", "fixed"],
  sizing: ["base"],
  border: ["height", "radius"],
};

export const generateSwiftUIDimensionsScheme = (
  fileName: string,
  resolvedTokenFile: string,
  density: string,
  device: string,
): string => {
  console.log(fileName)

  for (const [type, values] of Object.entries(dimensionTypes)) {
    resolvedTokenFile += `    private static func get${kebabCase(type)}Dimensions${density}${device}(dimensions: DSDimensions) -> DS${kebabCase(type)}Dimensions {\n      .init(\n`;
    for (const value of values) {
      const resolvedValue = value === "base" ? "" : `-${value}`;
      const resolvedDevice = value === "responsive" ? `-${device}` : "";
      const resolvedDensity = type === "border" ? "" : `-${density}`;

      for (const size of shirtSizes) {
        resolvedTokenFile += `          ${kebabCase(`${value}-${size}`, true)}: dimensions.${kebabCase(`${type}${resolvedValue}${resolvedDensity}${resolvedDevice}-${size}`, true)}`;
        resolvedTokenFile += `,\n`
      }
    }
    resolvedTokenFile = resolvedTokenFile.substring(0, resolvedTokenFile.lastIndexOf(','));
    resolvedTokenFile += `\n        )\n     }\n\n`;
  }

  resolvedTokenFile += `    static func getDimensions${density}${device}(dimensions: DSDimensions) -> ${designSystemName}Dimensions {\n      .init(\n`;
  for (const type of Object.keys(dimensionTypes)) {
    resolvedTokenFile += `        ${type}: get${kebabCase(type)}Dimensions${density}${device}(dimensions: dimensions),\n`;
  }
  resolvedTokenFile = resolvedTokenFile.substring(0, resolvedTokenFile.lastIndexOf(','));
  resolvedTokenFile += `\n      )\n    }\n\n`;

  return resolvedTokenFile;
};

export const generateSwiftUIDimensionsSchemeFile = (fileName: string): string => {
  let resolvedTokenFile: string = `
import SwiftUI

protocol DSDimensions {
    var spacingResponsiveRegularTablet3xs: CGFloat { get }
    var spacingResponsiveRegularTablet2xs: CGFloat { get }
    var spacingResponsiveRegularTabletXs: CGFloat { get }
    var spacingResponsiveRegularTabletSm: CGFloat { get }
    var spacingResponsiveRegularTabletMd: CGFloat { get }
    var spacingResponsiveRegularTabletLg: CGFloat { get }
    var spacingResponsiveRegularTabletXl: CGFloat { get }
    var spacingResponsiveRegularTablet2xl: CGFloat { get }
    var spacingResponsiveRegularTablet3xl: CGFloat { get }
    var spacingResponsiveRegularMobile3xs: CGFloat { get }
    var spacingResponsiveRegularMobile2xs: CGFloat { get }
    var spacingResponsiveRegularMobileXs: CGFloat { get }
    var spacingResponsiveRegularMobileSm: CGFloat { get }
    var spacingResponsiveRegularMobileMd: CGFloat { get }
    var spacingResponsiveRegularMobileLg: CGFloat { get }
    var spacingResponsiveRegularMobileXl: CGFloat { get }
    var spacingResponsiveRegularMobile2xl: CGFloat { get }
    var spacingResponsiveRegularMobile3xl: CGFloat { get }
    var spacingResponsiveFunctionalTablet3xs: CGFloat { get }
    var spacingResponsiveFunctionalTablet2xs: CGFloat { get }
    var spacingResponsiveFunctionalTabletXs: CGFloat { get }
    var spacingResponsiveFunctionalTabletSm: CGFloat { get }
    var spacingResponsiveFunctionalTabletMd: CGFloat { get }
    var spacingResponsiveFunctionalTabletLg: CGFloat { get }
    var spacingResponsiveFunctionalTabletXl: CGFloat { get }
    var spacingResponsiveFunctionalTablet2xl: CGFloat { get }
    var spacingResponsiveFunctionalTablet3xl: CGFloat { get }
    var spacingResponsiveFunctionalMobile3xs: CGFloat { get }
    var spacingResponsiveFunctionalMobile2xs: CGFloat { get }
    var spacingResponsiveFunctionalMobileXs: CGFloat { get }
    var spacingResponsiveFunctionalMobileSm: CGFloat { get }
    var spacingResponsiveFunctionalMobileMd: CGFloat { get }
    var spacingResponsiveFunctionalMobileLg: CGFloat { get }
    var spacingResponsiveFunctionalMobileXl: CGFloat { get }
    var spacingResponsiveFunctionalMobile2xl: CGFloat { get }
    var spacingResponsiveFunctionalMobile3xl: CGFloat { get }
    var spacingResponsiveExpressiveTablet3xs: CGFloat { get }
    var spacingResponsiveExpressiveTablet2xs: CGFloat { get }
    var spacingResponsiveExpressiveTabletXs: CGFloat { get }
    var spacingResponsiveExpressiveTabletSm: CGFloat { get }
    var spacingResponsiveExpressiveTabletMd: CGFloat { get }
    var spacingResponsiveExpressiveTabletLg: CGFloat { get }
    var spacingResponsiveExpressiveTabletXl: CGFloat { get }
    var spacingResponsiveExpressiveTablet2xl: CGFloat { get }
    var spacingResponsiveExpressiveTablet3xl: CGFloat { get }
    var spacingResponsiveExpressiveMobile3xs: CGFloat { get }
    var spacingResponsiveExpressiveMobile2xs: CGFloat { get }
    var spacingResponsiveExpressiveMobileXs: CGFloat { get }
    var spacingResponsiveExpressiveMobileSm: CGFloat { get }
    var spacingResponsiveExpressiveMobileMd: CGFloat { get }
    var spacingResponsiveExpressiveMobileLg: CGFloat { get }
    var spacingResponsiveExpressiveMobileXl: CGFloat { get }
    var spacingResponsiveExpressiveMobile2xl: CGFloat { get }
    var spacingResponsiveExpressiveMobile3xl: CGFloat { get }
    var spacingFixedRegular3xs: CGFloat { get }
    var spacingFixedRegular2xs: CGFloat { get }
    var spacingFixedRegularXs: CGFloat { get }
    var spacingFixedRegularSm: CGFloat { get }
    var spacingFixedRegularMd: CGFloat { get }
    var spacingFixedRegularLg: CGFloat { get }
    var spacingFixedRegularXl: CGFloat { get }
    var spacingFixedRegular2xl: CGFloat { get }
    var spacingFixedRegular3xl: CGFloat { get }
    var spacingFixedFunctional3xs: CGFloat { get }
    var spacingFixedFunctional2xs: CGFloat { get }
    var spacingFixedFunctionalXs: CGFloat { get }
    var spacingFixedFunctionalSm: CGFloat { get }
    var spacingFixedFunctionalMd: CGFloat { get }
    var spacingFixedFunctionalLg: CGFloat { get }
    var spacingFixedFunctionalXl: CGFloat { get }
    var spacingFixedFunctional2xl: CGFloat { get }
    var spacingFixedFunctional3xl: CGFloat { get }
    var spacingFixedExpressive3xs: CGFloat { get }
    var spacingFixedExpressive2xs: CGFloat { get }
    var spacingFixedExpressiveXs: CGFloat { get }
    var spacingFixedExpressiveSm: CGFloat { get }
    var spacingFixedExpressiveMd: CGFloat { get }
    var spacingFixedExpressiveLg: CGFloat { get }
    var spacingFixedExpressiveXl: CGFloat { get }
    var spacingFixedExpressive2xl: CGFloat { get }
    var spacingFixedExpressive3xl: CGFloat { get }
    var sizingFixedMobileHeader: CGFloat { get }
    var sizingRegular3xl: CGFloat { get }
    var sizingRegular2xl: CGFloat { get }
    var sizingRegularXl: CGFloat { get }
    var sizingRegularLg: CGFloat { get }
    var sizingRegularMd: CGFloat { get }
    var sizingRegularSm: CGFloat { get }
    var sizingRegularXs: CGFloat { get }
    var sizingRegular2xs: CGFloat { get }
    var sizingRegular3xs: CGFloat { get }
    var sizingFunctional3xs: CGFloat { get }
    var sizingFunctional2xs: CGFloat { get }
    var sizingFunctionalXs: CGFloat { get }
    var sizingFunctionalSm: CGFloat { get }
    var sizingFunctionalMd: CGFloat { get }
    var sizingFunctionalLg: CGFloat { get }
    var sizingFunctionalXl: CGFloat { get }
    var sizingFunctional2xl: CGFloat { get }
    var sizingFunctional3xl: CGFloat { get }
    var sizingExpressive3xs: CGFloat { get }
    var sizingExpressive2xs: CGFloat { get }
    var sizingExpressiveXs: CGFloat { get }
    var sizingExpressiveSm: CGFloat { get }
    var sizingExpressiveMd: CGFloat { get }
    var sizingExpressiveLg: CGFloat { get }
    var sizingExpressiveXl: CGFloat { get }
    var sizingExpressive2xl: CGFloat { get }
    var sizingExpressive3xl: CGFloat { get }
    var borderHeight3xs: CGFloat { get }
    var borderHeight2xs: CGFloat { get }
    var borderHeightXs: CGFloat { get }
    var borderHeightSm: CGFloat { get }
    var borderHeightMd: CGFloat { get }
    var borderHeightLg: CGFloat { get }
    var borderHeightXl: CGFloat { get }
    var borderHeight2xl: CGFloat { get }
    var borderHeight3xl: CGFloat { get }
    var borderRadius3xs: CGFloat { get }
    var borderRadius2xs: CGFloat { get }
    var borderRadiusXs: CGFloat { get }
    var borderRadiusSm: CGFloat { get }
    var borderRadiusMd: CGFloat { get }
    var borderRadiusLg: CGFloat { get }
    var borderRadiusXl: CGFloat { get }
    var borderRadius2xl: CGFloat { get }
    var borderRadius3xl: CGFloat { get }
    var borderRadiusFull: CGFloat { get }
}

`;

  for (const [type, values] of Object.entries(dimensionTypes)) {
    resolvedTokenFile += `public struct DS${kebabCase(type)}Dimensions {\n`;
    for (const value of values) {
      for (const size of shirtSizes) {
        // val fixedXl: Dp = Dimensions.spacingFixedXl,
        resolvedTokenFile += `    public var ${kebabCase(`${value}-${size}`, true)}: CGFloat\n`;
      }
    }
    resolvedTokenFile += "}\n\n";
  }

  resolvedTokenFile += `public struct ${designSystemName}Dimensions {\n`;
  for (const type of Object.keys(dimensionTypes)) {
    resolvedTokenFile += `    public var ${type}: DS${kebabCase(type)}Dimensions\n\n`;
  }

  resolvedTokenFile += `
    init(spacing: DSSpacingDimensions, sizing: DSSizingDimensions, border: DSBorderDimensions) {
        self.spacing = spacing
        self.sizing = sizing
        self.border = border
    }

`

  for (const density of densities) {
    for (const device of devices) {
      resolvedTokenFile = generateSwiftUIDimensionsScheme(
        fileName,
        resolvedTokenFile,
        density,
        device,
      );
    }
  }

  resolvedTokenFile += "\n}\n";

  return resolvedTokenFile;
};
