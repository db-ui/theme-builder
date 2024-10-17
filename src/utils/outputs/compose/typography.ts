import { ThemeType } from "../../data.ts";
import traverse from "traverse";
import { kebabCase } from "../../index.ts";
import {
  densities,
  designSystemName,
  designSystemShortName,
  devices,
  replacePackageName,
  shirtSizes,
} from "./shared.ts";

export const generateFontFamilyFile = (): string => {
  return `package ${replacePackageName}.core

import ${replacePackageName}.R
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.font.Font

internal object ${designSystemShortName}Font {
    val ${designSystemShortName.toLowerCase()}NeoScreenFlex = FontFamily(
        Font(R.font.db_neo_screen_flex, FontWeight.Normal)
    )
}
`;
};

export const generateComposeTypographyFile = (brandName:string, theme: ThemeType): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}.${brandName.toLowerCase()}.data

import androidx.compose.ui.unit.sp

val ${brandName}TypographyMap = mapOf(
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

      resolvedTokenFile += `\t"${key}" to ${finalValue},\n`;
    }
  });

  resolvedTokenFile += ")\n";

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
  resolvedTokenFile: string,
  density: string,
  device: string,
): string => {
  resolvedTokenFile += `
\t\tfun getTypography${density}${device}(
\t\t\ttypographyMap: Map<String, TextUnit>,
\t\t): ${designSystemName}Typography = ${designSystemName}Typography(`;
  for (const variant of typoVariants) {
    resolvedTokenFile += `\n\t\t\t${variant} = ${designSystemShortName}Typography.create(typographyMap, "${variant}", "${density}", "${device}"),`;
  }
  resolvedTokenFile += "\n\t\t)\n";

  return resolvedTokenFile;
};

export const generateTypographySchemeFile = (brandName: string): string => {
  let resolvedTokenFile: string = `package ${replacePackageName}

import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import ${replacePackageName}.core.${designSystemShortName}Font
import ${replacePackageName}.${brandName.toLowerCase()}.data.${brandName}TypographyMap
`;

    resolvedTokenFile += `\nclass ${designSystemShortName}Typography private constructor(\n`;
    for (const size of shirtSizes) {
      for (const type of typoTypes) {
        resolvedTokenFile += `\tval ${kebabCase(`${type}-${size}`, true)}: TextUnit,\n`;
      }
    }
    resolvedTokenFile += `) {
    internal companion object {
        fun create(
            typographyMap: Map<String, TextUnit>,
            typoVariant: String,
            density: String,
            device: String,
        ): ${designSystemShortName}Typography {
            return ${designSystemShortName}Typography(
                typographyMap.getValue("\${typoVariant}LineHeight$density\${device}3xs"),
                typographyMap.getValue("\${typoVariant}FontSize$density\${device}3xs"),
                typographyMap.getValue("\${typoVariant}LineHeight$density\${device}2xs"),
                typographyMap.getValue("\${typoVariant}FontSize$density\${device}2xs"),
                typographyMap.getValue("\${typoVariant}LineHeight$density\${device}Xs"),
                typographyMap.getValue("\${typoVariant}FontSize$density\${device}Xs"),
                typographyMap.getValue("\${typoVariant}LineHeight$density\${device}Sm"),
                typographyMap.getValue("\${typoVariant}FontSize$density\${device}Sm"),
                typographyMap.getValue("\${typoVariant}LineHeight$density\${device}Md"),
                typographyMap.getValue("\${typoVariant}FontSize$density\${device}Md"),
                typographyMap.getValue("\${typoVariant}LineHeight$density\${device}Lg"),
                typographyMap.getValue("\${typoVariant}FontSize$density\${device}Lg"),
                typographyMap.getValue("\${typoVariant}LineHeight$density\${device}Xl"),
                typographyMap.getValue("\${typoVariant}FontSize$density\${device}Xl"),
                typographyMap.getValue("\${typoVariant}LineHeight$density\${device}2xl"),
                typographyMap.getValue("\${typoVariant}FontSize$density\${device}2xl"),
                typographyMap.getValue("\${typoVariant}LineHeight$density\${device}3xl"),
                typographyMap.getValue("\${typoVariant}FontSize$density\${device}3xl"),
            )
        }
    }
}\n`;

  resolvedTokenFile += `\ndata class ${designSystemName}Typography(\n`;
  for (const variant of typoVariants) {
    resolvedTokenFile += `\tval ${variant}: ${designSystemShortName}Typography,\n`;
  }
  resolvedTokenFile += ") {\n\tinternal companion object {\n";

  for (const density of densities) {
    for (const device of devices) {
      resolvedTokenFile = generateTypographyScheme(
        resolvedTokenFile,
        density,
        device,
      );
    }
  }
  resolvedTokenFile += "\t}\n}\n\n";

  resolvedTokenFile += `data class ${designSystemName}TextStyles(\n`;
  for (const [font] of Object.entries(fontsTypes)) {
    resolvedTokenFile += `\tval ${font}: TextStyle,\n`;
  }
  resolvedTokenFile += ") {\n\tinternal companion object {\n";

  resolvedTokenFile += `\t\tfun getTextStyles(typo: ${designSystemName}Typography): ${designSystemName}TextStyles =
\t\t\t${designSystemName}TextStyles(`;
  for (const [font, size] of Object.entries(fontsTypes)) {
    resolvedTokenFile += `
\t\t\tTextStyle(
\t\t\t\tfontFamily = ${designSystemShortName}Font.${designSystemShortName.toLowerCase()}NeoScreenFlex,
\t\t\t\tfontWeight = FontWeight.${font.includes("body") ? "Normal" : "Black"},
\t\t\t\tfontSize = typo.${font.includes("body") ? "body" : "headline"}.fontSize${size},
\t\t\t\tlineHeight = typo.${font.includes("body") ? "body" : "headline"}.lineHeight${size}
\t\t\t),`;
  }
  resolvedTokenFile += "\n\t\t\t)\n\t}\n}\n\n";

  resolvedTokenFile += `
val LocalTypography = staticCompositionLocalOf {
    ${designSystemName}TextStyles.getTextStyles(
        ${designSystemName}Typography.getTypographyRegularMobile(
            ${brandName}TypographyMap
        )
    )
}
`;

  return resolvedTokenFile;
};
