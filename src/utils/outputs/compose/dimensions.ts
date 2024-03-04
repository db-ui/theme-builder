import { ThemeType } from "../../data.ts";
import traverse from "traverse";
import { prefix } from "../../outputs.ts";
import { upperCaseFirstLetters } from "../../index.ts";
import {
  densities,
  devices,
  replacePackageName,
  shirtSizes,
} from "./shared.ts";

export const generateComposeDimensionsFile = (theme: ThemeType): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}  
  
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
      this.path[0] !== "font" &&
      this.path[0] !== "transition" &&
      this.path[0] !== "elevation" &&
      this.path[0] !== "typography" &&
      !this.path.includes("desktop") &&
      !this.path.includes("_scale")
    ) {
      const key = `${prefix}${this.path
        .map((path) => upperCaseFirstLetters(path))
        .join("")}`;
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

const dimensionTypes = [
  "SpacingResponsive",
  "SpacingFixed",
  "Sizing",
  "BorderHeight",
  "BorderRadius",
];

export const generateDimensionsScheme = (
  fileName: string,
  resolvedTokenFile: string,
  density: string,
  device: string,
): string => {
  resolvedTokenFile += `fun ${prefix}Dimensions${density}${device}(`;

  for (const type of dimensionTypes) {
    for (const size of shirtSizes) {
      const uSize = upperCaseFirstLetters(size);
      resolvedTokenFile += `${prefix}${type}${uSize}: Dp = Dimensions.${prefix}${type}${type.includes("Border") ? "" : density}${type.includes("Responsive") ? device : ""}${uSize},\n`;
    }
  }
  resolvedTokenFile += `\n):${fileName}Dimensions = ${fileName}Dimensions(\n`;
  for (const type of dimensionTypes) {
    for (const size of shirtSizes) {
      const uSize = upperCaseFirstLetters(size);
      resolvedTokenFile += `${prefix}${type}${uSize}=${prefix}${type}${uSize},\n`;
    }
  }
  resolvedTokenFile += `)\n`;

  return resolvedTokenFile;
};

export const generateDimensionsSchemeFile = (fileName: string): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}

import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
data class ${fileName}Dimensions(
`;

  for (const type of dimensionTypes) {
    for (const size of shirtSizes) {
      const uSize = upperCaseFirstLetters(size);
      resolvedTokenFile += `val ${prefix}${type}${uSize}: Dp = Dimensions.${prefix}${type}${type.includes("Border") ? "" : "Regular"}${type.includes("Responsive") ? "Mobile" : ""}${uSize},\n`;
    }
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
val LocalDimensions = staticCompositionLocalOf { ${prefix}DimensionsRegularMobile() }
`;

  return resolvedTokenFile;
};
