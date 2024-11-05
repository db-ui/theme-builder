import { prefix } from "../../index.ts";

export const onBackgroundColors = [
  "emphasis-100",
  "emphasis-90",
  "emphasis-80",
  "emphasis-70",
  "emphasis-60",
  "emphasis-50",
];

export const backgroundColors = [
  "basic-level-1",
  "basic-level-2",
  "basic-level-3",
  "basic-transparent-semi",
  "basic-transparent-full",
];
export const invertedColors = ["contrast-max", "contrast-high", "contrast-low"];
export const colorStates = ["default", "hovered", "pressed"];

export const generateColorProperties = (color: string): string => {
  let result = `/* ${color.toUpperCase()} */\n`;
  colorStates.forEach((state) => {
    backgroundColors.forEach((bgColor) => {
      result +=
        ["-", prefix, color, "bg", bgColor, state].join("-") + `: "";\n`;
    });
    onBackgroundColors.forEach((onBgColor) => {
      result +=
        ["-", prefix, color, "on-bg", onBgColor, state].join("-") + `: "";\n`;
    });
    invertedColors.forEach((invertedColor) => {
      result +=
        ["-", prefix, color, "bg-inverted", invertedColor, state].join("-") +
        `: "";\n`;
    });

    result +=
      ["-", prefix, color, "on-bg", "inverted", state].join("-") + `: "";\n`;
    result += ["-", prefix, color, "origin", state].join("-") + `: "";\n`;
    result += ["-", prefix, color, "on-origin", state].join("-") + `: "";\n`;
  });
  return result;
};

export const tShirtSizes: string[] = [
  "3xs",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
];

export const densities: string[] = ["expressive", "regular", "functional"];

export const dividerPositions = ["top", "bottom", "left", "right"];
export const dividerSlots = ["before", "after"];

const getDividerSizes = () => {
  const dSizes: string[] = [];
  dividerSlots.forEach((slot) => {
    dividerPositions.forEach((position) => {
      dSizes.push([position, slot].join("-"));
    });
  });
  return dSizes;
};

export type Variable = {
  name: string;
  link?: string;
  description: string;
  sizes: string[];
};

export const allVariables: Variable[] = [
  {
    name: "sizing",
    link: "https://marketingportal.extranet.deutschebahn.com/marketingportal/Design-Anwendungen/db-ux-design-system/version-3/foundation/sizing",
    description:
      "Use sizing's for fixed heights/widths e.g. the db-button has always a fixed height.",
    sizes: tShirtSizes,
  },
  {
    name: "spacing-fixed",
    description:
      "Use fixed spacings for all kind of distances (margin, padding, ...).",
    link: "https://marketingportal.extranet.deutschebahn.com/marketingportal/Design-Anwendungen/db-ux-design-system/version-3/foundation/spacing",
    sizes: tShirtSizes,
  },

  {
    name: "spacing-responsive",
    description:
      "The primary use-case for responsive spacings are paddings/gaps in an application e.g. the <main> should have a responsive padding.",
    link: "https://marketingportal.extranet.deutschebahn.com/marketingportal/Design-Anwendungen/db-ux-design-system/version-3/foundation/spacing",
    sizes: tShirtSizes,
  },
  {
    name: "elevation",
    description: "Changes elevation of element.",
    link: "https://marketingportal.extranet.deutschebahn.com/marketingportal/Design-Anwendungen/db-ux-design-system/version-3/foundation/elevation",
    sizes: ["sm", "md", "lg"],
  },
  {
    name: "border-height",
    description: "Changes border-height of element",
    link: "https://marketingportal.extranet.deutschebahn.com/marketingportal/Design-Anwendungen/db-ux-design-system/version-3/foundation/border-height",
    sizes: tShirtSizes,
  },
  {
    name: "border-radius",
    description: "Changes border-radius of element",
    link: "https://marketingportal.extranet.deutschebahn.com/marketingportal/Design-Anwendungen/db-ux-design-system/version-3/foundation/border-radius",
    sizes: tShirtSizes,
  },
];

export const allClasses: Variable[] = [
  {
    name: "density",
    description: "Use this to change the density of the element.",
    sizes: densities,
  },
  {
    name: "focus",
    description: "Use this to set default focus outline.",
    sizes: ["default"],
  },
  {
    name: "divider",
    description: "Use this to add a divider as :before or :after element.",
    sizes: getDividerSizes(),
  },
  {
    name: "bg-color",
    description: "Change the background color level of the current element.",
    sizes: backgroundColors,
  },
  {
    name: "on-bg-color",
    description:
      "Change the foreground color with another emphasis of the current element.",
    sizes: onBackgroundColors,
  },
];
