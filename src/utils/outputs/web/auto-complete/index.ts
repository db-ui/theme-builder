import { prefix } from "../..";
import { allClasses, allVariables, generateColorProperties } from "./data";
import { DefaultColorType } from "../../../data.ts";

export const getDimensionVariables = (): string => {
  let result = "";
  allVariables.forEach((variableSet) => {
    if (variableSet.link) {
      result += `/* ${variableSet.link} */\n`;
    }
    variableSet.sizes.forEach((size) => {
      result +=
        ["-", prefix, variableSet.name, size].join("-") +
        `: "${variableSet.description}";`;
      result += "\n";
    });
  });

  return result;
};

export const getColorVariables = (
  allColors: Record<string, DefaultColorType>,
): string => {
  let result = "/* NOTE: Most of the time you just need adaptive.*/\n";
  result +=
    "/* https://marketingportal.extranet.deutschebahn.com/marketingportal/Design-Anwendungen/db-ux-design-system/version-3/foundation/colors*/\n";
  result += generateColorProperties("adaptive");
  result += "\n\n";

  Object.keys(allColors).forEach((color) => {
    result += generateColorProperties(color);
  });

  return result;
};

const getClasses = (allColors: Record<string, DefaultColorType>) => {
  const combinedClasses = [
    ...allClasses,
    { name: `container-color`, description: "", sizes: Object.keys(allColors) },
  ];
  let result = "";
  combinedClasses.forEach((classSet) => {
    classSet.sizes.forEach((size) => {
      result += `.${[prefix, classSet.name, size].join("-")}{\n`;
      result += `/* ${classSet.description} */\n`;
      result += "}\n";
    });
  });

  return result;
};

export const getAutoCompleteFile = (
  allColors: Record<string, DefaultColorType>,
) => {
  return [
    "/* DON'T USE THIS FILE IN PRODUCTION. */",
    "/* THIS IS ONLY FOR YOUR IDES AUTO-COMPLETE. */",
    "head {",
    "/* DIMENSION */",
    getDimensionVariables(),
    "/* COLORS */",
    getColorVariables(allColors),
    "}",
    getClasses(allColors),
  ].join("\n");
};
