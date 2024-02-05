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
import {
  getNonColorCssProperties,
  getPaletteOutput,
  getSpeakingNames,
} from "./utils/outputs.ts";
import Notifications from "./components/Notifications";
import { useTranslation } from "react-i18next";
import { getPalette } from "./utils";
import { BASE_PATH } from "./constants.ts";

const App = () => {
  const {
    speakingNames,
    darkMode,
    luminanceSteps,
    defaultColors,
    customColors,
    defaultTheme,
    developerMode,
  } = useThemeBuilderStore((state) => state);
  const { t } = useTranslation();

  const [tonality, setTonality] = useState<string>("regular");

  useEffect(() => {
    const allColors = { ...defaultColors, ...customColors };
    const cssProps: any = {
      ...getPaletteOutput(getPalette(allColors, luminanceSteps)),
      ...getSpeakingNames(speakingNames, allColors, darkMode, luminanceSteps),
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
    darkMode,
    customColors,
    defaultTheme,
    luminanceSteps,
  ]);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <>
      <Notifications />
      <DBPage
        data-color-scheme={darkMode ? "dark" : "light"}
        className={`db-ui-${tonality}`}
        type="fixedHeaderFooter"
        slotHeader={
          <DBHeader
            drawerOpen={drawerOpen}
            onToggle={setDrawerOpen}
            slotBrand={
              <DBBrand
                imgSrc={`${BASE_PATH}/assets/images/db_logo.svg`}
                anchorChildren
              >
                Theme Builder
              </DBBrand>
            }
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
                <DBButton
                  className={!developerMode ? "opacity-0" : ""}
                  icon="face_delighted"
                  variant="text"
                  noText
                  onClick={() =>
                    useThemeBuilderStore.setState({
                      developerMode: !developerMode,
                    })
                  }
                >
                  Developer Mode
                </DBButton>
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
