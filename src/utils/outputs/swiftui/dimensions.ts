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

struct ${fileName}Dimensions: Dimensions {
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
    resolvedTokenFile += `    private static func get${kebabCase(type)}Dimensions${density}${device}(dimensions: Dimensions) -> ${kebabCase(type)}Dimensions {\n      .init(\n`;
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

  resolvedTokenFile += `    static func getDimensions${density}${device}(`;

  // for (const type of Object.keys(dimensionTypes)) {
  //   resolvedTokenFile += `      ${type}: ${kebabCase(type)}Dimensions,\n`;
  // }
  resolvedTokenFile += `dimensions: Dimensions`
  resolvedTokenFile += `) -> ${designSystemName}Dimensions {\n      .init(\n`;
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

  resolvedTokenFile += `struct ${designSystemName}Dimensions {\n`;
  for (const type of Object.keys(dimensionTypes)) {
    resolvedTokenFile += `  var ${type}: ${kebabCase(type)}Dimensions\n\n`;
  }

  resolvedTokenFile += `
    init(spacing: SpacingDimensions, sizing: SizingDimensions, border: BorderDimensions) {
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
