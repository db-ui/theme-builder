import { DBBrand, DBButton, DBHeader, DBPage } from "@db-ui/react-components";
import { useEffect, useState } from "react";
import { useThemeBuilderStore } from "./store";
import ActionBar from "./components/ActionBar";
import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import { generateColors, getNeutralStrong } from "./utils/generate-colors.ts";
import { getCssProperties } from "./utils/outputs.ts";
import Notifications from "./components/Notifications";

const App = () => {
  const { darkMode, defaultColors } = useThemeBuilderStore((state) => state);

  useEffect(() => {
    const generatedColors = generateColors(
      {
        ...defaultColors,
        bgNeutral: darkMode
          ? defaultColors.onBgNeutral
          : defaultColors.bgNeutral,
        bgNeutralStrong: getNeutralStrong(
          darkMode ? defaultColors.onBgNeutral : defaultColors.bgNeutral,
          darkMode,
        ),
        onBgNeutral: darkMode
          ? defaultColors.bgNeutral
          : defaultColors.onBgNeutral,
      },
      darkMode,
    );
    useThemeBuilderStore.setState({ colors: generatedColors });

    const cssProps = getCssProperties(generatedColors);
    Object.keys(cssProps).forEach((key) => {
      document
        .getElementsByTagName("html")
        ?.item(0)
        ?.style.setProperty(key, cssProps[key]);
    });
  }, [defaultColors, darkMode]);

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
