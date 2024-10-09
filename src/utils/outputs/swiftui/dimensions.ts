import { ThemeType } from "../../data.ts";
import traverse from "traverse";
import { kebabCase } from "../../index.ts";
import {
  densities,
  devices,
  shirtSizes,
} from "./shared.ts";

export const generateSwiftUIDimensionsFile = (theme: ThemeType): string => {
  let resolvedTokenFile: string = `
import SwiftUI

struct Dimensions {
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

      resolvedTokenFile += `  static let ${key}: CGFloat = ${finalValue}\n`;
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
  for (const [type, values] of Object.entries(dimensionTypes)) {
    resolvedTokenFile += `var ${type}Dimensions${density}${device} = ${kebabCase(type)}Dimensions(`;
    values.forEach((value, index) => {
      const resolvedValue = value === "base" ? "" : `-${value}`;
      const resolvedDevice = value === "responsive" ? `-${device}` : "";
      const resolvedDensity = type === "border" ? "" : `-${density}`;

      shirtSizes.forEach((size, shirtIndex) => {
        resolvedTokenFile += `${kebabCase(`${value}-${size}`, true)}: Dimensions.${kebabCase(`${type}${resolvedValue}${resolvedDensity}${resolvedDevice}-${size}`, true)}`;
        resolvedTokenFile += `,\n`
      });
    });
    resolvedTokenFile = resolvedTokenFile.substring(0, resolvedTokenFile.lastIndexOf(','));
    resolvedTokenFile += `\n)\n`;
  }

  resolvedTokenFile += `func getDimensions${density}${device}(`;

  for (const type of Object.keys(dimensionTypes)) {
    resolvedTokenFile += `${type}: ${kebabCase(type)}Dimensions = ${type}Dimensions${density}${device},\n`;
  }
  resolvedTokenFile = resolvedTokenFile.substring(0, resolvedTokenFile.lastIndexOf(','));
  resolvedTokenFile += `\n) -> ${fileName}Dimensions { ${fileName}Dimensions(\n`;
  for (const type of Object.keys(dimensionTypes)) {
    resolvedTokenFile += `${type}: ${type},\n`;
  }
  resolvedTokenFile = resolvedTokenFile.substring(0, resolvedTokenFile.lastIndexOf(','));
  resolvedTokenFile += `\n)\n}\n`;

  return resolvedTokenFile;
};

export const generateSwiftUIDimensionsSchemeFile = (fileName: string): string => {
  let resolvedTokenFile: string = `
import SwiftUI

`;

  for (const [type, values] of Object.entries(dimensionTypes)) {
    resolvedTokenFile += `struct ${kebabCase(type)}Dimensions {\n`;
    for (const value of values) {
      for (const size of shirtSizes) {
        // val fixedXl: Dp = Dimensions.spacingFixedXl,
        resolvedTokenFile += `  var ${kebabCase(`${value}-${size}`, true)}: CGFloat\n`;
      }
    }
    resolvedTokenFile += "}\n";
  }

  resolvedTokenFile += `struct ${fileName}Dimensions {\n`;
  for (const type of Object.keys(dimensionTypes)) {
    resolvedTokenFile += `  var ${type}: ${kebabCase(type)}Dimensions\n`;
  }
  resolvedTokenFile += "}\n";

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

  return resolvedTokenFile;
};
