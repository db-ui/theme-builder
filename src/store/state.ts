import {
  CustomColorMappingType,
  DefaultColorMappingType,
  DefaultThemeType,
  SpeakingName,
} from "../utils/data.ts";

export const THEME_BUILDER_STATE = "theme-builder-state";

export type ThemeBuilderState = {
  defaultColors: DefaultColorMappingType;
  customColors: CustomColorMappingType;
  darkMode: boolean;
  resetDefaults: () => void;
  editorMarkup: string;
  notification?: string;
  defaultTheme: DefaultThemeType;
  speakingNames: SpeakingName[];
  luminanceSteps: number[];
  developerMode: boolean;
};

export const PLAYGROUND_STATE = "playground-state";

export type PlaygroundNodeTree = {
  name: string;
  serializedJson: string;
  isPage: boolean;
  children?: string[];
};

export type PlaygroundState = {
  currentId: string;
  nodeTrees: Record<string, PlaygroundNodeTree>;
  showBorders: boolean;
  showSpacings: boolean;
  previewContainer?: DOMRect;
};
