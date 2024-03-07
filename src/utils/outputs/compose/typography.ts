import { ThemeType } from "../../data.ts";
import traverse from "traverse";
import { kebabCase } from "../../index.ts";
import {
  densities,
  devices,
  replacePackageName,
  shirtSizes,
} from "./shared.ts";

export const generateFontFamilyFile = (): string => {
  return `package ${replacePackageName}.theme  

import ${replacePackageName}.R
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.font.Font

object Fonts {
// Required  
val sansRegular = FontFamily(
    Font(R.font.sans_regular, FontWeight.Normal)
)

val headBlack = FontFamily(
    Font(R.font.head_black, FontWeight.Black)
)

// Optional 
val headLight = FontFamily(
    Font(R.font.head_light, FontWeight.Light)
)
val headRegular = FontFamily(
    Font(R.font.head_regular, FontWeight.Normal)
)
 
val sansDigital = FontFamily(
    Font(R.font.sans_digital, FontWeight.Light)
)
 
val sansMedium = FontFamily(
    Font(R.font.sans_medium, FontWeight.Medium)
)
 
val sansSemiBold = FontFamily(
    Font(R.font.sans_semibold, FontWeight.SemiBold)
)
 
val sansBold = FontFamily(
    Font(R.font.sans_bold, FontWeight.Bold)
)
}
`;
};

export const generateComposeTypographyFile = (theme: ThemeType): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}.theme  
  
import androidx.compose.ui.unit.sp
object Typography {

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

      let finalValue = `${Number(value) * 16}.sp`;
      if (this.path.at(-1) === "lineHeight") {
        const fontSizePath = [...this.path];
        fontSizePath[fontSizePath.length - 1] = "fontSize";
        finalValue = `${Number(traverse(theme).get(fontSizePath)) * value * 16}.sp`;
      }

      resolvedTokenFile += `val ${key} = ${finalValue}\n`;
    }
  });

  resolvedTokenFile += "}";

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

export const generateTypographyScheme = (
  fileName: string,
  resolvedTokenFile: string,
  density: string,
  device: string,
): string => {
  for (const variant of typoVariants) {
    resolvedTokenFile += `val ${variant}Typography${density}${device} = ${kebabCase(variant)}Typography(`;
    for (const type of typoTypes) {
      for (const size of shirtSizes) {
        resolvedTokenFile += `Typography.${kebabCase(`${variant}-${type}-${density}-${device}-${size}`, true)},\n`;
      }
    }
    resolvedTokenFile += `)\n`;
  }

  resolvedTokenFile += `fun getTypography${density}${device}(`;

  for (const variant of typoVariants) {
    resolvedTokenFile += `${variant}: ${kebabCase(variant)}Typography = ${variant}Typography${density}${device},\n`;
  }
  resolvedTokenFile += `\n):${fileName}Typography = ${fileName}Typography(\n`;
  for (const variant of typoVariants) {
    resolvedTokenFile += `${variant}=${variant},\n`;
  }
  resolvedTokenFile += `)\n`;

  return resolvedTokenFile;
};

export const generateTypographySchemeFile = (fileName: string): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}.theme

import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.text.font.FontWeight
`;

  for (const variant of typoVariants) {
    resolvedTokenFile += `data class ${kebabCase(variant)}Typography(\n`;
    for (const size of shirtSizes) {
      for (const type of typoTypes) {
        resolvedTokenFile += `val ${kebabCase(`${type}-${size}`, true)}: TextUnit,\n`;
      }
    }
    resolvedTokenFile += ")\n";
  }

  resolvedTokenFile += `data class ${fileName}Typography(\n`;
  for (const variant of typoVariants) {
    resolvedTokenFile += `val ${variant}: ${kebabCase(variant)}Typography,\n`;
  }
  resolvedTokenFile += ")\n";

  for (const density of densities) {
    for (const device of devices) {
      resolvedTokenFile = generateTypographyScheme(
        fileName,
        resolvedTokenFile,
        density,
        device,
      );
    }
  }

  resolvedTokenFile += `data class ${fileName}TextStyles(\n`;
  for (const [font] of Object.entries(fontsTypes)) {
    resolvedTokenFile += `val ${font}: TextStyle,\n`;
  }
  resolvedTokenFile += ")\n";

  resolvedTokenFile += `fun getTextStyles(typo: DBThemeTypography): ${fileName}TextStyles = ${fileName}TextStyles(`;
  for (const [font, size] of Object.entries(fontsTypes)) {
    resolvedTokenFile += `TextStyle(
            fontFamily = Fonts.${font.includes("body") ? "sansRegular" : "headBlack"},
            fontWeight = FontWeight.${font.includes("body") ? "Normal" : "Black"},
            fontSize = typo.${font.includes("body") ? "body" : "headline"}.fontSize${size},
            lineHeight = typo.${font.includes("body") ? "body" : "headline"}.lineHeight${size}
        ),\n`;
  }
  resolvedTokenFile += ")\n";

  resolvedTokenFile += `
val LocalTypography = staticCompositionLocalOf { getTextStyles(getTypographyRegularMobile()) }
`;

  return resolvedTokenFile;
};
