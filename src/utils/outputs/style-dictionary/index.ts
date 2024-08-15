import { ThemeType } from "../../data.ts";
import traverse from "traverse";
import {
  getTraverseKey,
  isDimensionProperty,
  nonRemProperties,
} from "../index.ts";

export const setObjectByPath = (
  initObj: any,
  path: string,
  value: any,
): any => {
  if (path == "") return value;

  const [k, next] = path.split({
    [Symbol.split](s) {
      const i = s.indexOf(".");
      return i == -1 ? [s, ""] : [s.slice(0, i), s.slice(i + 1)];
    },
  });

  if (initObj !== undefined && typeof initObj !== "object") {
    console.error(`cannot set property ${k} of ${typeof initObj}`);
  }

  return Object.assign(initObj ?? {}, {
    [k]: setObjectByPath(initObj?.[k], next, value),
  });
};

export const getDBNonColorToken = (theme: ThemeType) => {
  const resolvedProperties: any = {};
  traverse(theme).forEach(function (value) {
    if (isDimensionProperty(this)) {
      const key = getTraverseKey(this.path, ".");

      const finalValue =
        !nonRemProperties.includes(this.path[0]) &&
        (typeof value === "string" || value instanceof String)
          ? `${value}rem`
          : value;

      setObjectByPath(resolvedProperties, key, finalValue);
    }
  });

  return resolvedProperties;
};
