import { DBButton, DBHeader, DBPage } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../store";
import { DefaultPagePropsType } from "./data.ts";
import { PropsWithChildren, useCallback, useState } from "react";
import { getThemeImage } from "../../utils";

const DefaultPage = ({
  name,
  children,
  actionBar,
  className,
  isLocalDarkMode,
  tonality,
  navigation,
}: PropsWithChildren<DefaultPagePropsType>) => {
  const { defaultTheme, darkMode, developerMode } = useThemeBuilderStore(
    (state) => state,
  );

  const [localDarkMode, setLocalDarkMode] = useState<boolean>();

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
                  className="logo"
                  src={getThemeImage(
                    isDark() && defaultTheme.imageDark
                      ? defaultTheme.imageDark
                      : defaultTheme.image,
                  )}
                  alt="brand"
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
                  variant="ghost"
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
                  variant="ghost"
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
          >
            {navigation}
          </DBHeader>
        }
      >
        {children}
      </DBPage>
    </div>
  );
};

export default DefaultPage;
