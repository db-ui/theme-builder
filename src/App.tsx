import { DBBrand, DBButton, DBHeader, DBPage } from "@db-ui/react-components";
import { useEffect, useState } from "react";
import { useThemeBuilderStore } from "./store";
import ActionBar from "./components/ActionBar";
import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import { generateColors, getStrong } from "./utils/generate-colors.ts";
import { getColorCssProperties } from "./utils/outputs.ts";
import Notifications from "./components/Notifications";

const App = () => {
  const { darkMode, defaultColors, customColors } = useThemeBuilderStore(
    (state) => state,
  );

  useEffect(() => {
    const generatedColors = generateColors(
      {
        ...defaultColors,
        bgBase: darkMode ? defaultColors.onBgBase : defaultColors.bgBase,
        bgBaseStrong: getStrong(
          darkMode ? defaultColors.onBgBase : defaultColors.bgBase,
          darkMode,
        ),
        onBgBase: darkMode ? defaultColors.bgBase : defaultColors.onBgBase,
      },
      darkMode,
      undefined,
      customColors,
    );
    useThemeBuilderStore.setState({ colors: generatedColors });

    const cssProps = getColorCssProperties(generatedColors);
    Object.keys(cssProps).forEach((key) => {
      document
        .getElementsByTagName("html")
        ?.item(0)
        ?.style.setProperty(key, cssProps[key]);
    });
  }, [defaultColors, darkMode, customColors]);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <>
      <Notifications />
      <DBPage
        type="fixedHeaderFooter"
        slotHeader={
          <DBHeader
            drawerOpen={drawerOpen}
            onToggle={setDrawerOpen}
            slotBrand={<DBBrand anchorChildren>Theme Builder</DBBrand>}
            slotActionBar={<ActionBar />}
            slotCallToAction={
              <DBButton
                variant="text"
                icon={darkMode ? "day" : "night"}
                noText
                className="p-0 w-siz-md"
                title={darkMode ? "Enable Light-Mode" : "Enable Dark-Mode"}
                onClick={() =>
                  useThemeBuilderStore.setState({ darkMode: !darkMode })
                }
              >
                {darkMode ? "🌞" : "🌛"}
              </DBButton>
            }
          >
            <Navigation />
          </DBHeader>
        }
      >
        <Outlet />
      </DBPage>
    </>
  );
};

export default App;
