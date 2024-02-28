import { DBCard, DBIcon, DBSection, DBTooltip } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../../store";
import { Link } from "react-router-dom";
import Demo from "../../../pages/Demo";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { DefaultThemeType } from "../../../utils/data.ts";
import DefaultTheme from "../../../data/default-theme.json";
import DBTheme from "../../../data/db-theme.json";
import SBahnTheme from "../../../data/sbahn-theme.json";
import { getThemeImage } from "../../../utils";

const defaultTheme = DefaultTheme as unknown as DefaultThemeType;
const sBahnTheme = SBahnTheme as unknown as DefaultThemeType;
const dbTheme = DBTheme as unknown as DefaultThemeType;

type Themes = {
  key: string;
  theme: DefaultThemeType;
};

const themes: Themes[] = [
  { key: "neutralTheme", theme: defaultTheme },
  { key: "dbTheme", theme: dbTheme },
  { key: "sbahnTheme", theme: sBahnTheme },
];

const ThemeSelect = () => {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState<string>(themes[0].key);
  const { darkMode } = useThemeBuilderStore((state) => state);
  return (
    <DBSection
      variant="large"
      size="large"
      className="flex md:h-[100vh] items-center"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-fix-md">
        <div className="flex flex-col gap-fix-md">
          <h1>Design System Platform</h1>
          <h4 data-variant="light">By all, for all</h4>
          <p>{t("landingDesignSystemText")}</p>
          <div className="grid grid-cols-4 gap-fix-md">
            {themes.map(({ key, theme }) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedTheme(key);
                  useThemeBuilderStore.setState({
                    defaultTheme: theme,
                    defaultColors: theme.colors,
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
                  <DBTooltip>{t(key)}</DBTooltip>
                </DBCard>
              </button>
            ))}
            <Link className="no-underline" to="/customization" target="_blank">
              <DBCard
                className="items-center justify-center min-h-siz-xl"
                spacing="small"
                data-selected="false"
                elevationLevel="2"
                behaviour="interactive"
              >
                <DBIcon icon="add">Add custom theme</DBIcon>
              </DBCard>
            </Link>
          </div>
        </div>
        <div className="flex col-span-2 md:h-[60vh]">
          <div className="scale-down w-full">
            <Demo linkToDemo />
          </div>
        </div>
      </div>
    </DBSection>
  );
};
export default ThemeSelect;
