import { ColorType, DefaultColorMappingType } from "../utils/data.ts";

export const THEME_BUILDER_STATE = "theme-builder-state";

export type ThemeBuilderState = {
  defaultColors: DefaultColorMappingType;
  colors: ColorType[];
  darkMode: boolean;
  resetDefaultColors: () => void;
};
