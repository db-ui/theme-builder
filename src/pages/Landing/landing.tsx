import { BASE_PATH } from "../../constants.ts";
import { DBCard, DBIcon, DBLink } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState } from "react";
import Demo from "../Demo";
import { DefaultThemeType } from "../../utils/data.ts";

import DefaultTheme from "../../data/default-theme.json";
import DBTheme from "../../data/db-theme.json";
import SBahnTheme from "../../data/sbahn-theme.json";
import { useThemeBuilderStore } from "../../store";
import { useDarkMode } from "usehooks-ts";

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

const Landing = () => {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState<string>(themes[0].key);
  const { isDarkMode } = useDarkMode();

  return (
    <div className="flex flex-col overflow-y-auto h-full">
      <div className="py-fix-xs px-fix-md md:py-fix-md">
        <div className="flex justify-between min-h-siz-md">
          <img
            className="my-auto"
            src={`${BASE_PATH}/assets/images/peace-in-a-box.svg`}
            alt="Brand Image"
            height={24}
            width={34}
          />
          <a
            href="https://github.com/db-ui/theme-builder"
            target="_blank"
            referrerPolicy="no-referrer"
          >
            <img
              className="my-auto"
              src={`${BASE_PATH}/assets/images/github-mark${isDarkMode ? "-white" : ""}.svg`}
              alt="GitHub Mark"
              height={24}
              width={34}
            />
          </a>
        </div>
      </div>
      <main className="flex flex-col gap-fix-md">
        <div
          id="feature-1"
          className="grid grid-cols-1 md:grid-cols-3 px-res-xs md:px-res-md gap-fix-md"
        >
          <div className="flex flex-col gap-fix-md">
            <h1>Titan</h1>
            <h4 data-variant="light">The only Design System you need!</h4>
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
                    className={`h-full min-h-siz-xl${selectedTheme === key ? " db-neutral-bg-lvl-3" : ""}`}
                    spacing="small"
                    variant="interactive"
                  >
                    <span className="m-auto">{t(key)}</span>
                  </DBCard>
                </button>
              ))}
              <Link
                className="no-underline"
                to="/customization"
                target="_blank"
              >
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
        <div id="feature-5">
          <div className="flex flex-col gap-fix-md items-center p-res-md db-neutral-bg-lvl-3">
            <h2>{t("landingMoreTitle")}</h2>
            <p>{t("landingMoreText")}</p>
            <div className="flex gap-fix-md mx-auto">
              <DBLink
                href="https://marketingportal.extranet.deutschebahn.com/marketingportal"
                target="_blank"
                content="external"
              >
                {t("gettingStarted")}
              </DBLink>
              <Link
                to="/playground"
                className="db-link"
                data-content="internal"
                target="_blank"
              >
                {t("tryIt")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
