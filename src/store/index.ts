import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import {
  DRAG_AND_DROP_STATE,
  DragAndDropState,
  THEME_BUILDER_STATE,
  ThemeBuilderState,
} from "./state.ts";
import { defaultLuminances, DefaultThemeType } from "../utils/data.ts";

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
            }));
          },
          editorMarkup: "",
          luminanceSteps: defaultLuminances,
          defaultTheme: defaultTheme,
        };
      },
      {
        name: THEME_BUILDER_STATE,
      },
    ),
  ),
);

export const useDragAndDropStore = create<DragAndDropState>()(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  devtools(
    persist(
      () => {
        return {
          serializedJson: "",
        };
      },
      {
        name: DRAG_AND_DROP_STATE,
      },
    ),
  ),
);

export default { useThemeBuilderStore };
