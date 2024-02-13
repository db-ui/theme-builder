import { useEffect } from "react";
import { useThemeBuilderStore } from "./store";
import { Outlet } from "react-router-dom";
import {
  getNonColorCssProperties,
  getPaletteOutput,
  getSpeakingNames,
} from "./utils/outputs.ts";
import Notifications from "./components/Notifications";
import { getPalette } from "./utils";

const App = () => {
  const {
    speakingNames,
    luminanceSteps,
    defaultColors,
    customColors,
    defaultTheme,
  } = useThemeBuilderStore((state) => state);

  useEffect(() => {
    const allColors = { ...defaultColors, ...customColors };
    const cssProps: any = {
      ...getPaletteOutput(getPalette(allColors, luminanceSteps)),
      ...getSpeakingNames(speakingNames, allColors, false, luminanceSteps),
      ...getNonColorCssProperties(defaultTheme),
    };
    Object.keys(cssProps).forEach((key) => {
      document
        .getElementsByTagName("html")
        ?.item(0)
        ?.style.setProperty(key, cssProps[key]);
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
