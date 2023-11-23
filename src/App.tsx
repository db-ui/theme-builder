import {
  DBBrand,
  DBButton,
  DBHeader,
  DBPage,
  DBSelect,
} from "@db-ui/react-components";
import { useEffect, useState } from "react";
import { useThemeBuilderStore } from "./store";
import ActionBar from "./components/ActionBar";
import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import { generateColors, getStrong } from "./utils/generate-colors.ts";
import {
  getColorCssProperties,
  getNonColorCssProperties,
} from "./utils/outputs.ts";
import Notifications from "./components/Notifications";
import { useTranslation } from "react-i18next";

const App = () => {
  const { darkMode, defaultColors, customColors, defaultTheme } =
    useThemeBuilderStore((state) => state);
  const { t } = useTranslation();

  const [tonality, setTonality] = useState<string>("regular");

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

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <>
      <Notifications />
      <DBPage
        className={`db-ui-${tonality}`}
        type="fixedHeaderFooter"
        slotHeader={
          <DBHeader
            drawerOpen={drawerOpen}
            onToggle={setDrawerOpen}
            slotBrand={<DBBrand anchorChildren>Theme Builder</DBBrand>}
            slotActionBar={<ActionBar />}
            slotMetaNavigation={
              <DBSelect
                label={t("tonality")}
                labelVariant="floating"
                value={tonality}
                onChange={(event) => setTonality(event.target.value)}
              >
                <option value="functional">functional</option>
                <option value="regular">regular</option>
                <option value="expressive">expressive</option>
              </DBSelect>
            }
            slotCallToAction={
              <div className="flex gap-fix-sm">
                <DBSelect
                  className="tonality-select-call-to-action"
                  label={t("tonality")}
                  labelVariant="floating"
                  value={tonality}
                  onChange={(event) => setTonality(event.target.value)}
                >
                  <option value="functional">functional</option>
                  <option value="regular">regular</option>
                  <option value="expressive">expressive</option>
                </DBSelect>
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
              </div>
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
