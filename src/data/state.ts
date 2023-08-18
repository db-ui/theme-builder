import { ColorType, DefaultColorMappingType } from "../utils/data.ts";

export const THEME_BUILDER_STATE = "theme-builder-state";
export const THEME_BUILDER_INTERNAL_STATE = "TB Internal";

export type ThemeBuilderState = {
  defaultColors: DefaultColorMappingType;
  colors: ColorType[];
  darkMode: boolean;
  resetDefaultColors: () => void;
};

export type ValidType = {
  [key: string]: boolean;
};

export type InternalState = {
  validColors: ValidType;
  changeValidColor: (validType: ValidType) => void;
};
