/* We used this traverse testing */

import traverse from "traverse";
import DefaultTheme from "./../src/data/default-theme.json" assert { type: "json" };
import FS from "node:fs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cleanThemeTheme = () => {
  const changedTheme = { ...DefaultTheme };
  traverse(changedTheme).forEach(function (value) {
    if (typeof value === "string" || value instanceof String) {
      const asNumber = Number(value) / 16;
      this.update(asNumber.toString());
    }
  });

  FS.writeFileSync(
    "./src/data/changed-theme.json",
    JSON.stringify(changedTheme),
  );
};

const prefix = "db";
const theme = DefaultTheme;
const test = () => {
  const resolvedProperties = {};
  traverse(theme).forEach(function (value) {
    if (this.isLeaf && this.path.length > 0 && this.path[0] !== "colors") {
      const key = `--${prefix}-${this.path
        .map((path) => path.toLowerCase())
        .map((path) => {
          if (path === "lineheight") {
            return "line-height";
          } else if (path === "fontsize") {
            return "font-size";
          }
          return path;
        })
        .join("-")}`;

      resolvedProperties[key] =
        typeof value === "string" || value instanceof String
          ? `${value}rem`
          : value;

      if (this.path.includes("body") && this.path.at(-1) === "fontSize") {
        const lineHeightPath = [...this.path];
        lineHeightPath[lineHeightPath.length - 1] = "lineHeight";
        const fontSizeAsNumber = Number(value);
        const lineHeightAsNumber = Number(traverse(theme).get(lineHeightPath));

        const remainingIconPath = this.path
          .filter(
            (path) =>
              path !== "typography" && path !== "body" && path !== "fontSize",
          )
          .join("-");
        const fontSizing = fontSizeAsNumber * lineHeightAsNumber;
        resolvedProperties[
          `--${prefix}-base-icon-weight-${remainingIconPath}`
        ] = fontSizing * 16;
        resolvedProperties[
          `--${prefix}-base-icon-font-size-${remainingIconPath}`
        ] = `${fontSizing}rem`;
      }
    }
  });
  console.log(resolvedProperties);
};

test();
