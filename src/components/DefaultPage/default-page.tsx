import { DBButton, DBHeader, DBPage } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../store";
import { DefaultPagePropsType } from "./data.ts";
import { PropsWithChildren } from "react";
import { getThemeImage } from "../../utils";

const DefaultPage = ({
  name,
  children,
  actionBar,
  className,
  density,
  navigation,
}: PropsWithChildren<DefaultPagePropsType>) => {
  const { defaultTheme, darkMode, developerMode } = useThemeBuilderStore(
    (state) => state,
  );

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
            slotBrand={
              <div className="db-brand">
                <img
                  className="logo"
                  src={getThemeImage(
                    darkMode && defaultTheme.branding.image.dark
                      ? defaultTheme.branding.image.dark
                      : defaultTheme.branding.image.light,
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
                  title={darkMode ? "Enable Light-Mode" : "Enable Dark-Mode"}
                  onClick={() => {
                    useThemeBuilderStore.setState({ darkMode: !darkMode });
                  }}
                >
                  {darkMode ? "🌞" : "🌛"}
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
