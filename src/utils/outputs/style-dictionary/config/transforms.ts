import { Transform } from "style-dictionary/types";
import { SEMANTIC_COLOR } from "../../../data.ts";

export const CSS_SEMANTIC_COLORS_NAME = "css/semantic-colors";
export const SemanticColorsTransform: Transform = {
  name: CSS_SEMANTIC_COLORS_NAME,
  type: "value",
  filter: (token) => token.type === SEMANTIC_COLOR,
  transform: (token, { prefix }) => {
    let lightVar = `var(--${[prefix, ...token.value.light].join("-")})`;
    let darkVar = `var(--${[prefix, ...token.value.dark].join("-")})`;

    if (token.value.transparencyDark) {
      darkVar = `color-mix(in srgb, transparent ${token.value.transparencyDark}%, ${darkVar})`;
    }

    if (token.value.transparencyLight) {
      lightVar = `color-mix(in srgb, transparent ${token.value.transparencyLight}%, ${lightVar})`;
    }

    return `light-dark(${lightVar},${darkVar});`;
  },
};
