import { DBCard, DBIcon, DBSection, DBTooltip } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../../store";
import { Link } from "react-router-dom";
import Demo from "../../../pages/Demo";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import {
  defaultLuminances,
  ThemeType,
  speakingNamesDefaultMapping,
} from "../../../utils/data.ts";
import DefaultTheme from "../../../data/default-theme.json";
import DBTheme from "../../../data/db-theme.json";
import SBahnTheme from "../../../data/sbahn-theme.json";
import { getThemeImage } from "../../../utils";

const defaultTheme = DefaultTheme as unknown as ThemeType;
const sBahnTheme = SBahnTheme as unknown as ThemeType;
const dbTheme = DBTheme as unknown as ThemeType;

const themes: Record<string, ThemeType> = {
  neutralTheme: defaultTheme,
  dbTheme: dbTheme,
  sbahnTheme: sBahnTheme,
};

const ThemeSelect = () => {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState<string>("neutralTheme");
  const { darkMode, theme } = useThemeBuilderStore((state) => state);
  return (
    <DBSection
      width="large"
      spacing="large"
      className="flex md:h-[100vh] items-center"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-fix-md md:gap-fix-3xl">
        <div className="flex flex-col gap-fix-md">
          <h1>
            <span className="brand-name">{theme.branding.name}</span>
            <br />
            {t("product")}
          </h1>
          <h4 data-variant="light">{t("claim")}</h4>
          <p>{t("landingDesignSystemText")}</p>
          <div className="grid grid-cols-4 gap-fix-md">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedTheme(key);
                  useThemeBuilderStore.setState({
                    theme: theme,
                    luminanceSteps: defaultLuminances,
                    speakingNames: speakingNamesDefaultMapping,
                  });
                }}
              >
                <DBCard
                  className="min-h-siz-xl"
                  spacing="small"
                  data-selected={selectedTheme === key}
                  elevationLevel="2"
                  behaviour="interactive"
                >
                  <img
                    className="logo m-auto"
                    src={getThemeImage(
                      darkMode && theme.branding.image.dark
                        ? theme.branding.image.dark
                        : theme.branding.image.light,
                    )}
                    alt="brand"
                  />
                  <DBTooltip placement="bottom">{t(key)}</DBTooltip>
                </DBCard>
              </button>
            ))}
            <Link className="no-underline" to="/customization">
              <DBCard
                className="items-center justify-center min-h-siz-xl"
                spacing="small"
                data-selected="false"
                elevationLevel="2"
                behaviour="interactive"
              >
                <DBIcon icon="plus">Add custom theme</DBIcon>
              </DBCard>
            </Link>
          </div>
        </div>
        <div className="flex col-span-2 relative">
          <div className="scale-down w-full md:w-[100vw] md:h-[100vh] md:absolute">
            <Demo linkToDemo />
          </div>
        </div>
      </div>
    </DBSection>
  );
};
export default ThemeSelect;
