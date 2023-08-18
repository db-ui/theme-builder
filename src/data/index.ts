import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { THEME_BUILDER_STATE, ThemeBuilderState } from "./state.ts";
import {
  DEFAULT_BACKGROUND,
  DEFAULT_BACKGROUND_DARK,
  DEFAULT_BRAND,
  DEFAULT_CRITICAL,
  DEFAULT_INFORMATIONAL,
  DEFAULT_NEUTRAL,
  DEFAULT_ON_BRAND,
  DEFAULT_SUCCESSFUL,
  DEFAULT_WARNING,
} from "../utils/constants.ts";
import { getNeutralStrong } from "../utils/generate-colors.ts";
import { DefaultColorMappingType } from "../utils/data.ts";

const getDefaultColorMapping = (
  darkMode?: boolean,
): DefaultColorMappingType => ({
  bgNeutral: DEFAULT_BACKGROUND,
  bgNeutralStrong: getNeutralStrong(DEFAULT_BACKGROUND, darkMode),
  onBgNeutral: DEFAULT_BACKGROUND_DARK,
  neutral: DEFAULT_NEUTRAL,
  brand: DEFAULT_BRAND,
  onBrand: DEFAULT_ON_BRAND,
  informational: DEFAULT_INFORMATIONAL,
  successful: DEFAULT_SUCCESSFUL,
  warning: DEFAULT_WARNING,
  critical: DEFAULT_CRITICAL,
});

export const useThemeBuilderStore = create<ThemeBuilderState>()(
  devtools(
    persist(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (set) => ({
        colors: [],
        darkMode: false,
        defaultColors: getDefaultColorMapping(false),
        resetDefaultColors: () =>
          set((state) => ({
            defaultColors: getDefaultColorMapping(state.darkMode),
          })),
      }),
      {
        name: THEME_BUILDER_STATE,
      },
    ),
  ),
);

export default { useThemeBuilderStore };
