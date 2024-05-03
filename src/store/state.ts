import {
  AlternativeColor,
  DefaultColorMappingType,
  ThemeType,
  SpeakingName,
} from "../utils/data.ts";

export const THEME_BUILDER_STATE = "theme-builder-state";

export type ThemeBuilderStateFunctions = {
  resetDefaults: () => void;
  setColors: (colors: DefaultColorMappingType) => void;
  setCustomColors: (colors: Record<string, string>) => void;
  setAlternativeColors: (
    alternativeColors: Record<string, AlternativeColor>,
  ) => void;
};

export type ThemeBuilderState = {
  darkMode: boolean;
  editorMarkup: string;
  notification?: string;
  theme: ThemeType;
  luminanceSteps: number[];
  speakingNames: SpeakingName[];
  developerMode: boolean;
} & ThemeBuilderStateFunctions;

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
