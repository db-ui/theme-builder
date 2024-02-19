import DefaultTheme from "../../../../data/default-theme.json";
import traverse from "traverse";

export type ShirtSelectionType = {
  label: string;
  params: string[];
};

const defaultTheme = traverse(DefaultTheme);

export const getShirtValue = (
  scaleString: string,
  path: string[],
): string | number | undefined => {
  if (path.at(-1) === "_scale") {
    return scaleString;
  }

  let scale = 1;

  if (scaleString === "3xs") {
    scale = 0;
  } else if (scaleString === "2xs") {
    scale = 0.33;
  } else if (scaleString === "xs") {
    scale = 0.5;
  } else if (scaleString === "sm") {
    scale = 0.75;
  } else if (scaleString === "md") {
    scale = 1;
  } else if (scaleString === "lg") {
    scale = 1.5;
  } else if (scaleString === "xl") {
    scale = 2;
  } else if (scaleString === "2xl") {
    scale = 3;
  } else if (scaleString === "3xl") {
    scale = 10;
  }

  if (path.length < 1 && !defaultTheme.has(path)) {
    return undefined;
  }

  if (path[0] === "elevation") {
    if (path.at(-1) === "sm") {
      return (
        `0 0 ${scale}px -${scale}px rgba(0, 0, 0, 0.2),` +
        `0 0 ${4 * scale}px ${scale}px rgba(0, 0, 0, 0.12),` +
        `0 0 ${2 * scale}px 0 rgba(0, 0, 0, 0.14)`
      );
    }
    if (path.at(-1) === "md") {
      return (
        `0 0 ${2 * scale}px -${scale}px rgba(0, 0, 0, 0.2),` +
        `0 0 ${8 * scale}px ${scale}px rgba(0, 0, 0, 0.12),` +
        `0 0 ${4 * scale}px 0 rgba(0, 0, 0, 0.14)`
      );
    }
    if (path.at(-1) === "lg") {
      return (
        `0 0 ${4 * scale}px -${3 * scale}px rgba(0, 0, 0, 0.2),` +
        `0 0 ${16 * scale}px ${3 * scale}px rgba(0, 0, 0, 0.12),` +
        `0 0 ${8 * scale}px ${scale}px rgba(0, 0, 0, 0.14)`
      );
    }
  }

  if (path.length < 2) {
    return undefined;
  }

  if (path[0] === "border") {
    if (path[1] === "radius") {
      return `${Number(defaultTheme.get(path)) * scale}`;
    }
    if (path[1] === "height") {
      const height = Number(defaultTheme.get(path));
      return `${height + (height * (scale - 1)) / 3}`;
    }
  }

  if (path[0] === "sizing") {
    if (!path.includes("fixed")) {
      const size = Number(defaultTheme.get(path));
      return `${size + (size * (scale - 1)) / 10}`;
    }
  }

  if (path[0] === "spacing") {
    const size = Number(defaultTheme.get(path));
    return `${size + (size * (scale - 1)) / 5}`;
  }

  return undefined;
};
