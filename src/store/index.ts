import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { THEME_BUILDER_STATE, ThemeBuilderState } from "./state.ts";
import { DefaultThemeType } from "../utils/data.ts";

import DefaultTheme from "../data/default-theme.json";

const defaultTheme = DefaultTheme as unknown as DefaultThemeType;

export const useThemeBuilderStore = create<ThemeBuilderState>()(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  devtools(
    persist(
      (set) => ({
        colors: [],
        darkMode: false,
        defaultColors: defaultTheme.colors,
        resetDefaultColors: () =>
          set(() => ({
            defaultColors: defaultTheme.colors,
          })),
        editorMarkup: "",
        defaultTheme: defaultTheme,
      }),
      {
        name: THEME_BUILDER_STATE,
      },
    ),
  ),
);

export default { useThemeBuilderStore };
