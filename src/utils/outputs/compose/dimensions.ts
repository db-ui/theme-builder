import { ThemeType } from "../../data.ts";
import traverse from "traverse";
import { kebabCase } from "../../index.ts";
import {
  densities,
  designSystemName,
  devices,
  replacePackageName,
  replacePackagePath,
  shirtSizes,
} from "./shared.ts";

export const generateComposeDimensionsFile = (brandName: string, theme: ThemeType): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}${replacePackagePath}.${brandName.toLowerCase()}.data
  
import androidx.compose.ui.unit.dp

val ${brandName}DimensionsMap = mapOf(
`;

  traverse(theme).forEach(function (value) {
    if (
      this.isLeaf &&
      this.path.length > 0 &&
      this.path[0] !== "branding" &&
      this.path[0] !== "colors" &&
      this.path[0] !== "additionalColors" &&
      this.path[0] !== "customColors" &&
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

      resolvedTokenFile += `\t"${key}" to ${finalValue},\n`;
    }
  });

  resolvedTokenFile += ")\n";

  return resolvedTokenFile;
};

const dimensionTypes: Record<string, string[]> = {
  spacing: ["responsive", "fixed"],
  sizing: ["base"],
  border: ["height", "radius"],
};

export const generateDimensionsScheme = (
  resolvedTokenFile: string,
  density: string,
  device: string,
): string => {
  const params = [density, device]

  resolvedTokenFile += `fun getDimensions${density}${device}(
    dimensionsMap: Map<String, Dp>,
): ${designSystemName}Dimensions = ${designSystemName}Dimensions(`;
  for (const type of Object.keys(dimensionTypes)) {
    resolvedTokenFile += `\n\t${type} = ${kebabCase(type)}Dimensions(dimensionsMap, ${params.map(param => `"${param}"`).join(", ")}),`;
    params.pop()
  }
  resolvedTokenFile += `\n)\n\n`;

  return resolvedTokenFile;
};

export const generateDimensionsSchemeFile = (brandName: string): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}${replacePackagePath}

import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
import ${replacePackageName}${replacePackagePath}.${brandName.toLowerCase()}.data.${brandName}DimensionsMap

`;

  const params = ["density", "device"]
  for (const [type, values] of Object.entries(dimensionTypes)) {
    resolvedTokenFile += `class ${kebabCase(type)}Dimensions private constructor(`;
    for (const value of values) {
      for (const size of shirtSizes) {
        // val fixedXl: Dp = Dimensions.spacingFixedXl,
        resolvedTokenFile += `\n\tval ${kebabCase(`${value}-${size}`, true)}: Dp,`;
      }
    }
    resolvedTokenFile += "\n) {";
    resolvedTokenFile += `\n\tconstructor(dimensionsMap: Map<String, Dp>, ${params.map(param => `${param}: String`).join(", ")}) : this(`;
    for(const value of values) {
      for(const size of shirtSizes) {
        const resolvedValue = value === "base" ? "" : `-${value}`;
        const resolvedParams = params.map(param => `-\${${param}}`).join("")
        resolvedTokenFile += `\n\t\tdimensionsMap.getValue("${kebabCase(`${type}${resolvedValue}${resolvedParams}-${size}`, true)}"),`;
      }
      if(params.length == 2 || type == "sizing") {
        params.pop()
      }
    }
    resolvedTokenFile += "\n\t)\n}\n\n";
  }

  resolvedTokenFile += `data class ${designSystemName}Dimensions(`;
  for (const type of Object.keys(dimensionTypes)) {
    resolvedTokenFile += `\n\tval ${type}: ${kebabCase(type)}Dimensions,`;
  }
  resolvedTokenFile += "\n)\n\n";

  for (const density of densities) {
    for (const device of devices) {
      resolvedTokenFile = generateDimensionsScheme(
        resolvedTokenFile,
        density,
        device,
      );
    }
  }

  resolvedTokenFile += `val LocalDimensions = staticCompositionLocalOf {
    getDimensionsRegularMobile(
        ${brandName}DimensionsMap
    )
}
`;

  return resolvedTokenFile;
};
