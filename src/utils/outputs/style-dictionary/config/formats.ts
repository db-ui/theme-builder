import { Format, TransformedToken } from "style-dictionary/types";

const getSyntax = (token: TransformedToken) => {
  if (token.type === "dimension") {
    return "length";
  }
  if (token.type === "color") {
    return "color";
  }

  return "*";
};

export const CssPropertyFormat: Format = {
  name: "cssPropertyFormat",
  format: ({ dictionary }) => {
    return dictionary.allTokens
      .map(
        (token: TransformedToken) =>
          `@property --${token.name} { 
  syntax: "<${getSyntax(token)}>"; 
  initial-value: ${token.value}; 
  inherits: true; 
}

`,
      )
      .join("");
  },
};

export const CssAppOverwriteFormat: Format = {
  name: "cssAppOverwriteFormat",
  format: ({ dictionary }) => {
    return dictionary.allTokens
      .map(
        (token: TransformedToken) =>
          `--${token.name}:${token.value};
`,
      )
      .join("");
  },
};
