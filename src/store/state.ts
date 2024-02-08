import {
  ColorType,
  CustomColorMappingType,
  DefaultColorMappingType,
  DefaultThemeType,
} from "../utils/data.ts";

export const THEME_BUILDER_STATE = "theme-builder-state";

export type ThemeBuilderState = {
  defaultColors: DefaultColorMappingType;
  customColors: CustomColorMappingType;
  colors: ColorType[];
  darkMode: boolean;
  resetDefaults: () => void;
  editorMarkup: string;
  notification?: string;
  luminanceSteps: number[];
  defaultTheme: DefaultThemeType;
};

export const DRAG_AND_DROP_STATE = "drag-and-drop-state";

export type DragAndDropState = {
  serializedJson: string;
};
