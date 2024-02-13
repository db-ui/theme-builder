import { DBButton, DBHeader, DBPage } from "@db-ui/react-components";
import { BASE_PATH } from "../../constants.ts";
import { useThemeBuilderStore } from "../../store";
import { DefaultPagePropsType } from "./data.ts";
import { PropsWithChildren } from "react";

const DefaultPage = ({
  name,
  children,
  actionBar,
  className,
}: PropsWithChildren<DefaultPagePropsType>) => {
  const { darkMode, developerMode } = useThemeBuilderStore((state) => state);
  return (
    <DBPage
      data-color-scheme={darkMode ? "dark" : "light"}
      className={className}
      type="fixedHeaderFooter"
      slotHeader={
        <DBHeader
          slotBrand={
            <div className="db-brand">
              <img
                src={`${BASE_PATH}/assets/images/db_logo.svg`}
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
        />
      }
    >
      {children}
    </DBPage>
  );
};

export default DefaultPage;
