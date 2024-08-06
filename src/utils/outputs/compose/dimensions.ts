import { ThemeType } from "../../data.ts";
import traverse from "traverse";
import { kebabCase } from "../../index.ts";
import {
  densities,
  devices,
  replacePackageName,
  shirtSizes,
} from "./shared.ts";

export const generateComposeDimensionsFile = (theme: ThemeType): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}.theme
  
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
object Dimensions {

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
      const finalValue =
        typeof value === "string" || value instanceof String
          ? `${Number(value) * 16}.dp`
          : value;

      resolvedTokenFile += `val ${key}: Dp = ${finalValue}\n`;
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

export const generateDimensionsScheme = (
  fileName: string,
  resolvedTokenFile: string,
  density: string,
  device: string,
): string => {
  for (const [type, values] of Object.entries(dimensionTypes)) {
    resolvedTokenFile += `val ${type}Dimensions${density}${device} = ${kebabCase(type)}Dimensions(`;
    for (const value of values) {
      const resolvedValue = value === "base" ? "" : `-${value}`;
      const resolvedDevice = value === "responsive" ? `-${device}` : "";
      const resolvedDensity = type === "border" ? "" : `-${density}`;
      for (const size of shirtSizes) {
        resolvedTokenFile += `Dimensions.${kebabCase(`${type}${resolvedValue}${resolvedDensity}${resolvedDevice}-${size}`, true)},\n`;
      }
    }
    resolvedTokenFile += `)\n`;
  }

  resolvedTokenFile += `fun getDimensions${density}${device}(`;

  for (const type of Object.keys(dimensionTypes)) {
    resolvedTokenFile += `${type}: ${kebabCase(type)}Dimensions = ${type}Dimensions${density}${device},\n`;
  }
  resolvedTokenFile += `\n):${fileName}Dimensions = ${fileName}Dimensions(\n`;
  for (const type of Object.keys(dimensionTypes)) {
    resolvedTokenFile += `${type}=${type},\n`;
  }
  resolvedTokenFile += `)\n`;

  return resolvedTokenFile;
};

export const generateDimensionsSchemeFile = (fileName: string): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}.theme

import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
`;

  for (const [type, values] of Object.entries(dimensionTypes)) {
    resolvedTokenFile += `data class ${kebabCase(type)}Dimensions(\n`;
    for (const value of values) {
      for (const size of shirtSizes) {
        // val fixedXl: Dp = Dimensions.spacingFixedXl,
        resolvedTokenFile += `val ${kebabCase(`${value}-${size}`, true)}: Dp,\n`;
      }
    }
    resolvedTokenFile += ")\n";
  }

  resolvedTokenFile += `data class ${fileName}Dimensions(\n`;
  for (const type of Object.keys(dimensionTypes)) {
    resolvedTokenFile += `val ${type}: ${kebabCase(type)}Dimensions,\n`;
  }
  resolvedTokenFile += ")\n";

  for (const density of densities) {
    for (const device of devices) {
      resolvedTokenFile = generateDimensionsScheme(
        fileName,
        resolvedTokenFile,
        density,
        device,
      );
    }
  }

  resolvedTokenFile += `
val LocalDimensions = staticCompositionLocalOf { getDimensionsRegularMobile() }
`;

  return resolvedTokenFile;
};
