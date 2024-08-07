import { Outlet } from "react-router-dom";
import Notifications from "./components/Notifications";
import { useThemeBuilderStore } from "./store";
import { useEffect } from "react";
import {
  getNonColorCssProperties,
  getPaletteOutput,
  getSpeakingNames,
} from "./utils/outputs";
import { DefaultColorType } from "./utils/data.ts";

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

    const cssProps: any = {
      ...getPaletteOutput(allColors, luminanceSteps),
      ...getSpeakingNames(speakingNames, allColors),
      ...getNonColorCssProperties(theme),
    };

    const pages = document.getElementsByTagName("html");
    Array.from(pages).forEach((page: Element) => {
      page.setAttribute(
        "style",
        Object.entries(cssProps)
          .map((value) => `${value[0]}:${value[1]};`)
          .join(" "),
      );
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
