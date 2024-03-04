import {ThemeType} from "../../data.ts";
import traverse from "traverse";
import {prefix} from "../../outputs.ts";
import {upperCaseFirstLetters} from "../../index.ts";
import {replacePackageName} from "./shared.ts";

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