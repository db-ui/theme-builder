import { useEffect } from "react";
import { useThemeBuilderStore } from "./store";
import { Outlet } from "react-router-dom";
import { generateColors, getStrong } from "./utils/generate-colors.ts";
import {
  getColorCssProperties,
  getNonColorCssProperties,
} from "./utils/outputs.ts";
import Notifications from "./components/Notifications";

const App = () => {
  const { darkMode, defaultColors, customColors, defaultTheme } =
    useThemeBuilderStore((state) => state);

  useEffect(() => {
    const defaultColorMapping = {
      ...defaultColors,
      bgBase: darkMode ? defaultColors.onBgBase : defaultColors.bgBase,
      bgBaseStrong: getStrong(
        darkMode ? defaultColors.onBgBase : defaultColors.bgBase,
        darkMode,
      ),
      onBgBase: darkMode ? defaultColors.bgBase : defaultColors.onBgBase,
    };
    const generatedColors = generateColors(
      defaultColorMapping,
      darkMode,
      undefined,
      customColors,
    );
    useThemeBuilderStore.setState({ colors: generatedColors });

    const cssProps: any = {
      ...getColorCssProperties(generatedColors),
      ...getNonColorCssProperties(defaultTheme),
    };
    Object.keys(cssProps).forEach((key) => {
      document
        .getElementsByTagName("html")
        ?.item(0)
        ?.style.setProperty(key, cssProps[key]);
    });
  }, [defaultColors, darkMode, customColors, defaultTheme]);

  return (
    <>
      <Notifications />
      <Outlet />
    </>
  );
};

export default App;
