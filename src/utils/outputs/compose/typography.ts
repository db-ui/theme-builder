import {ThemeType} from "../../data.ts";
import traverse from "traverse";
import {prefix} from "../../outputs.ts";
import {upperCaseFirstLetters} from "../../index.ts";
import {replacePackageName} from "./shared.ts";

export const generateComposeTypographyFile = (theme: ThemeType): string => {
    let resolvedTokenFile: string = `package ${replacePackageName}  
  
import androidx.compose.ui.unit.sp
object Typography {

`;

    traverse(theme).forEach(function (value) {
        if (
            this.isLeaf &&
            this.path.length > 0 &&
            this.path[0] === "typography" &&
            !this.path.includes("desktop") &&
            !this.path.includes("_scale")
        ) {
            const key = `${prefix}${this.path
                .map((path) => upperCaseFirstLetters(path))
                .join("")}`;

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