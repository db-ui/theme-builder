import { DBButton, DBHeader, DBPage } from "@db-ui/react-components";
import { BASE_PATH } from "../../constants.ts";
import { useThemeBuilderStore } from "../../store";
import { DefaultPagePropsType } from "./data.ts";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import {
  getNonColorCssProperties,
  getPaletteOutput,
  getSpeakingNames,
} from "../../utils/outputs.ts";
import { getThemeImage } from "../../utils";

const DefaultPage = ({
  name,
  children,
  actionBar,
  className,
  themeImage,
  isLocalDarkMode,
  tonality,
}: PropsWithChildren<DefaultPagePropsType>) => {
  const {
    speakingNames,
    luminanceSteps,
    defaultColors,
    customColors,
    defaultTheme,
    darkMode,
    developerMode,
  } = useThemeBuilderStore((state) => state);
  const [localDarkMode, setLocalDarkMode] = useState<boolean>();

  useEffect(() => {
    const allColors: Record<string, string> = {
      ...defaultColors,
      ...customColors,
    };
    const cssProps: any = {
      ...getPaletteOutput(allColors, luminanceSteps),
      ...getSpeakingNames(speakingNames, allColors, false),
      ...getNonColorCssProperties(defaultTheme),
    };

    const pages = document.getElementsByClassName("theme-props-container");
    Array.from(pages).forEach((page: Element) => {
      page.setAttribute(
        "style",
        Object.entries(cssProps)
          .map((value) => `${value[0]}:${value[1]};`)
          .join(" "),
      );
    });
  }, [
    speakingNames,
    defaultColors,
    customColors,
    defaultTheme,
    luminanceSteps,
  ]);

  const isDark = useCallback(
    () => (isLocalDarkMode ? localDarkMode : darkMode),
    [isLocalDarkMode, localDarkMode, darkMode],
  );

  return (
    <div
      className="theme-props-container contents"
      data-tonality={tonality || "regular"}
    >
      <DBPage
        data-color-scheme={isDark() ? "dark" : "light"}
        className={className}
        type="fixedHeaderFooter"
        slotHeader={
          <DBHeader
            slotBrand={
              <div className="db-brand">
                <img
                  src={
                    themeImage
                      ? getThemeImage(defaultTheme.image)
                      : `${BASE_PATH}/assets/images/peace-in-a-box.svg`
                  }
                  alt="brand"
                  height="24"
                  width="34"
                />
                {name}
              </div>
            }
            slotActionBar={actionBar}
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
                <DBButton
                  variant="text"
                  icon={isDark() ? "day" : "night"}
                  noText
                  className="p-0 w-siz-md"
                  title={isDark() ? "Enable Light-Mode" : "Enable Dark-Mode"}
                  onClick={() => {
                    if (isLocalDarkMode) {
                      setLocalDarkMode(!localDarkMode);
                    } else {
                      useThemeBuilderStore.setState({ darkMode: !darkMode });
                    }
                  }}
                >
                  {isDark() ? "🌞" : "🌛"}
                </DBButton>
              </div>
            }
          />
        }
      >
        {children}
      </DBPage>
    </div>
  );
};

export default DefaultPage;
