import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  PLAYGROUND_STATE,
  PlaygroundState,
  THEME_BUILDER_STATE,
  ThemeBuilderState,
} from "./state.ts";
import {
  defaultLuminances,
  ThemeType,
  speakingNamesDefaultMapping,
} from "../utils/data.ts";

import DefaultTheme from "../data/default-theme.json";

const defaultTheme = DefaultTheme as unknown as ThemeType;

export const useThemeBuilderStore = create<ThemeBuilderState>()(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  devtools(
    persist(
      (set) => {
        return {
          darkMode: false,
          editorMarkup: "",
          theme: defaultTheme,
          speakingNames: speakingNamesDefaultMapping,
          luminanceSteps: defaultLuminances,
          developerMode: false,
          resetDefaults: () => {
            set(() => ({
              theme: defaultTheme,
              luminanceSteps: defaultLuminances,
              speakingNames: speakingNamesDefaultMapping,
            }));
          },
          setColors: (colors) => {
            set(({ theme }) => ({
              theme: { ...theme, colors },
            }));
          },
          setAdditionalColors: (additionalColors) => {
            set(({ theme }) => ({
              theme: { ...theme, additionalColors },
            }));
          },
          setCustomColors: (customColors) => {
            set(({ theme }) => ({
              theme: { ...theme, customColors },
            }));
          },
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
          nodeTrees: {
            page: { name: "Page", serializedJson: "", isPage: true },
          },
          currentId: "page",
          showBorders: false,
          showSpacings: false,
        };
      },
      {
        name: PLAYGROUND_STATE,
      },
    ),
  ),
);

export default { useThemeBuilderStore, useDragAndDropStore };
