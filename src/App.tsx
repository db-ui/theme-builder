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
  const { speakingNames, luminanceSteps, defaultTheme, darkMode } =
    useThemeBuilderStore((state) => state);

  useEffect(() => {
    const allColors: Record<string, string> = {
      ...defaultTheme.colors,
      ...defaultTheme.customColors,
    };

    const cssProps: any = {
      ...getPaletteOutput(
        allColors,
        luminanceSteps,
        defaultTheme.branding.alternativeColor,
      ),
      ...getSpeakingNames(speakingNames, allColors, darkMode),
      ...getNonColorCssProperties(defaultTheme),
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
  }, [speakingNames, defaultTheme, luminanceSteps, darkMode]);

  return (
    <>
      <Notifications />
      <Outlet />
    </>
  );
};

export default App;
