import { DBButton, DBHeader, DBPage, DBTooltip } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../store";
import { DefaultPagePropsType } from "./data.ts";
import { PropsWithChildren, useState } from "react";
import { getThemeImage } from "../../utils";
import { useTranslation } from "react-i18next";

const DefaultPage = ({
  name,
  children,
  actionBar,
  className,
  density,
  navigation,
}: PropsWithChildren<DefaultPagePropsType>) => {
  const { t } = useTranslation();
  const { theme, darkMode, developerMode } = useThemeBuilderStore(
    (state) => state,
  );
  const [drawerOpen, setDrawerOpen] = useState<boolean>();

  return (
    <div
      className="theme-props-container contents"
      data-density={density || "regular"}
    >
      <DBPage
        className={className}
        type="fixedHeaderFooter"
        slotHeader={
          <DBHeader
            drawerOpen={drawerOpen}
            onToggle={() => setDrawerOpen(!drawerOpen)}
            slotBrand={
              <div className="db-brand">
                <img
                  className="logo"
                  src={getThemeImage(
                    darkMode && theme.branding.image.dark
                      ? theme.branding.image.dark
                      : theme.branding.image.light,
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
                  icon={darkMode ? "day" : "night"}
                  noText
                  className="p-0 w-siz-md"
                  onClick={() => {
                    useThemeBuilderStore.setState({ darkMode: !darkMode });
                  }}
                >
                  {darkMode ? "🌞" : "🌛"}
                  <DBTooltip>
                    {t(darkMode ? "enableLightMode" : "enableDarkMode")}
                  </DBTooltip>
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
