import traverse from "traverse";
import { defaultTheme } from "../../../../store/themes.ts";

export type ShirtSelectionType = {
  label: string;
  params: string[];
};

const theme = traverse(defaultTheme);

export const getShirtValue = (
  scaleString: string,
  path: string[],
): string | number | undefined => {
  if (path.at(-2) === "_scale") {
    return scaleString;
  }

  let scale: number;

  if (scaleString === "none") {
    scale = 0;
  } else if (scaleString === "full") {
    scale = 5;
  } else {
    scale = Number(scaleString.replace("%", "")) / 100;
  }

  if (path.length < 1 && !theme.has(path)) {
    return undefined;
  }

  if (path.length < 2) {
    return undefined;
  }

  if (path[0] === "border") {
    if (path[1] === "radius") {
      return `${Number(theme.get(path)) * scale}`;
    }
    if (path[1] === "height") {
      const height = Number(theme.get(path));
      return `${height + height * (scale - 1)}`;
    }
  }

  if (path[0] === "sizing") {
    if (!path.includes("fixed")) {
      const size = Number(theme.get(path));
      return `${size + size * (scale - 1)}`;
    }
  }

  if (path[0] === "spacing") {
    const size = Number(theme.get(path));
    return `${size + size * (scale - 1)}`;
  }

  return undefined;
};
