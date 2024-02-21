import { DBCard, DBIcon, DBSection } from "@db-ui/react-components";
import { getExtraBrandColors } from "../../../utils/outputs.ts";
import { useThemeBuilderStore } from "../../../store";
import { Link } from "react-router-dom";
import Demo from "../../../pages/Demo";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDarkMode } from "usehooks-ts";

import { DefaultThemeType } from "../../../utils/data.ts";
import DefaultTheme from "../../../data/default-theme.json";
import DBTheme from "../../../data/db-theme.json";
import SBahnTheme from "../../../data/sbahn-theme.json";

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
  const { isDarkMode } = useDarkMode();
  const { luminanceSteps } = useThemeBuilderStore((state) => state);
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
            {themes.map(({ key, theme }) => {
              const brandColors = getExtraBrandColors(
                theme.colors.brand,
                isDarkMode,
                luminanceSteps,
              );
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedTheme(key);
                    useThemeBuilderStore.setState({
                      defaultTheme: theme,
                      defaultColors: theme.colors,
                    });
                  }}
                  style={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    "--landing-select-card-on-color": brandColors.brandOnColor,
                    "--landing-select-card-color": brandColors.color,
                    "--landing-select-card-color-hover": brandColors.hoverColor,
                    "--landing-select-card-color-pressed":
                      brandColors.pressedColor,
                  }}
                >
                  <DBCard
                    className="h-full min-h-siz-xl landing-select-card"
                    spacing="small"
                    variant={selectedTheme === key ? "default" : "interactive"}
                    data-selected={selectedTheme === key}
                  >
                    <span className="m-auto break-all">{t(key)}</span>
                  </DBCard>
                </button>
              );
            })}
            <Link className="no-underline" to="/customization" target="_blank">
              <DBCard
                className="items-center justify-center min-h-siz-xl"
                spacing="small"
                variant="interactive"
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
