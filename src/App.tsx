import { Outlet } from "react-router-dom";
import Notifications from "./components/Notifications";
import { useThemeBuilderStore } from "./store";
import { useEffect } from "react";
import {
  getNonColorCssProperties,
  getPaletteOutput,
  getSpeakingNames,
} from "./utils/outputs.ts";

const App = () => {
  const {
    speakingNames,
    luminanceSteps,
    defaultColors,
    customColors,
    defaultTheme,
  } = useThemeBuilderStore((state) => state);

  useEffect(() => {
    const allColors: Record<string, string> = {
      ...defaultColors,
      ...customColors,
    };
    const cssProps: any = {
      ...getPaletteOutput(allColors, luminanceSteps),
      ...getSpeakingNames(speakingNames, allColors, false),
      ...getNonColorCssProperties(defaultTheme),
    };

    const pages = document.getElementsByClassName("theme-props-container");
    Array.from(pages).forEach((page: Element) => {
      page.setAttribute(
        "style",
        Object.entries(cssProps)
          .map((value) => `${value[0]}:${value[1]};`)
          .join(" "),
      );
    });
  }, [
    speakingNames,
    defaultColors,
    customColors,
    defaultTheme,
    luminanceSteps,
  ]);

  return (
    <>
      <Notifications />
      <Outlet />
    </>
  );
};

export default App;
