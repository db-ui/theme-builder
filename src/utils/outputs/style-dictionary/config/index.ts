import { type Config } from "style-dictionary";
import { TransformedToken } from "style-dictionary/types";
import { SEMANTIC_COLOR } from "../../../data.ts";

const scaleFilter = (token: TransformedToken) => !token.name.endsWith("scale");

const semanticColorFilter = (token: TransformedToken) =>
  token.type === SEMANTIC_COLOR;

export const appConfig: Config = {
  platforms: {
    app: {
      prefix: "db",
      transformGroup: "custom/css",
      files: [
        {
          destination: "overwrites",
          format: "cssAppOverwriteFormat",
          filter: (token: TransformedToken) => scaleFilter(token),
        },
      ],
    },
  },
};

export const platformsConfig: Config = {
  platforms: {
    css: {
      prefix: "db",
      transformGroup: "css",
      files: [
        {
          destination: "css/variables.css",
          format: "css/variables",
          filter: (token: TransformedToken) =>
            scaleFilter(token) && !semanticColorFilter(token),
        },
      ],
    },
    semanticColorVariables: {
      prefix: "db",
      transformGroup: "custom/css",
      files: [
        {
          destination: "css/semantic-color-variables.css",
          format: "css/variables",
          filter: (token: TransformedToken) => semanticColorFilter(token),
        },
      ],
    },
    properties: {
      prefix: "db",
      transformGroup: "css",
      files: [
        {
          destination: "css/properties.css",
          format: "cssPropertyFormat",
          filter: (token: TransformedToken) =>
            scaleFilter(token) && !semanticColorFilter(token),
        },
      ],
    },
    semanticColorProperties: {
      prefix: "db",
      transformGroup: "custom/css",
      files: [
        {
          destination: "css/semantic-color-properties.css",
          format: "cssPropertyFormat",
          filter: (token: TransformedToken) => semanticColorFilter(token),
        },
      ],
    },
  },
};
