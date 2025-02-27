import { Outlet } from "react-router-dom";
import Notifications from "./components/Notifications";
import { useThemeBuilderStore } from "./store";
import { useEffect } from "react";
import { DefaultColorType } from "./utils/data.ts";
import {
  getSDColorPalette,
  getSDSpeakingColors,
} from "./utils/outputs/style-dictionary/colors.ts";
import { mergeObjectsRecursive } from "./utils";
import { runStyleDictionary } from "./utils/outputs/style-dictionary";
import { appConfig } from "./utils/outputs/style-dictionary/config";
import { getSDBaseIconProps } from "./utils/outputs/style-dictionary/typography.ts";

const App = () => {
  const { speakingNames, luminanceSteps, theme } = useThemeBuilderStore(
    (state) => state,
  );

  useEffect(() => {
    const allColors: Record<string, DefaultColorType> = {
      ...theme.colors,
      ...theme.additionalColors,
      ...theme.customColors,
    };

    const sdColorPalette = getSDColorPalette(allColors, luminanceSteps);
    const sdSpeakingColors = getSDSpeakingColors(speakingNames, allColors);

    const finalTheme = {
      ...getSDBaseIconProps(theme),
      ...theme,
      ...mergeObjectsRecursive(sdColorPalette, sdSpeakingColors),
    };

    runStyleDictionary({
      tokens: finalTheme,
      ...appConfig,
    }).then((result) => {
      const page = document.querySelector("html");
      const overwrites = result["/overwrites"];
      if (page && overwrites) {
        page.setAttribute("style", overwrites);
      }
    });
  }, [speakingNames, theme, luminanceSteps]);

  return (
    <>
      <Notifications />
      <Outlet />
    </>
  );
};

export default App;
