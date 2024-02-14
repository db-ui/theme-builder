import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import {
  PLAYGROUND_STATE,
  PlaygroundState,
  THEME_BUILDER_STATE,
  ThemeBuilderState,
} from "./state.ts";
import {
  defaultLuminances,
  DefaultThemeType,
  speakingNamesDefaultMapping,
} from "../utils/data.ts";

import DefaultTheme from "../data/default-theme.json";

const defaultTheme = DefaultTheme as unknown as DefaultThemeType;

export const useThemeBuilderStore = create<ThemeBuilderState>()(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  devtools(
    persist(
      (set) => {
        return {
          colors: [],
          customColors: {},
          darkMode: false,
          defaultColors: defaultTheme.colors,
          resetDefaults: () => {
            set(() => ({
              defaultColors: defaultTheme.colors,
              defaultTheme,
              luminanceSteps: defaultLuminances,
              speakingNames: speakingNamesDefaultMapping,
            }));
          },
          editorMarkup: "",
          defaultTheme: defaultTheme,
          speakingNames: speakingNamesDefaultMapping,
          luminanceSteps: defaultLuminances,
          developerMode: false,
        };
      },
      {
        name: THEME_BUILDER_STATE,
      },
    ),
  ),
);

export const useDragAndDropStore = create<PlaygroundState>()(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  devtools(
    persist(
      () => {
        return {
          serializedJson: "",
          showBorders: false,
        };
      },
      {
        name: PLAYGROUND_STATE,
      },
    ),
  ),
);

export default { useThemeBuilderStore, useDragAndDropStore };
