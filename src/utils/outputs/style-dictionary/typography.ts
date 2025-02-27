import { ThemeType } from "../../data.ts";
import traverse from "traverse";
import { setObjectByPath } from "./colors.ts";

export const getSDBaseIconProps = (theme: ThemeType): any => {
  const baseIconWeight = {};
  const baseIconFontSize = {};

  traverse(theme.typography).map(function (value) {
    if (
      this.isLeaf &&
      this.path.length > 0 &&
      this.path.at(-1) === "fontSize"
    ) {
      const lineHeightPath = [...this.path];
      lineHeightPath[lineHeightPath.length - 1] = "lineHeight";
      const fontSizeAsNumber = Number(value.replace("rem", ""));
      const lineHeightAsNumber = Number(
        traverse(theme.typography).get(lineHeightPath),
      );

      lineHeightPath.pop();

      const fontSizing = lineHeightAsNumber * fontSizeAsNumber;
      setObjectByPath(
        baseIconWeight,
        lineHeightPath.join("."),
        fontSizing * 16,
      );
      setObjectByPath(
        baseIconFontSize,
        lineHeightPath.join("."),
        `${fontSizing}rem`,
      );
    }
  });

  return {
    base: {
      icon: {
        weight: baseIconWeight,
        "font-size": baseIconFontSize,
      },
    },
  };
};
