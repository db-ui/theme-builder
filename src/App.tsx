import { Outlet } from "react-router-dom";
import Notifications from "./components/Notifications";
import { useThemeBuilderStore } from "./store";
import { useEffect } from "react";
import {
  getNonColorCssProperties,
  getPaletteOutput,
  getSpeakingNames,
} from "./utils/outputs";

const App = () => {
  const { speakingNames, luminanceSteps, theme, darkMode } =
    useThemeBuilderStore((state) => state);

  useEffect(() => {
    const allColors: Record<string, string> = {
      ...theme.colors,
      ...theme.customColors,
    };

    const cssProps: any = {
      ...getPaletteOutput(
        allColors,
        luminanceSteps,
        theme.branding.alternativeColors,
      ),
      ...getSpeakingNames(speakingNames, allColors, darkMode),
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
  }, [speakingNames, theme, luminanceSteps, darkMode]);

  return (
    <>
      <Notifications />
      <Outlet />
    </>
  );
};

export default App;
