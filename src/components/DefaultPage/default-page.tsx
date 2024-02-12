import { DBBrand, DBButton, DBHeader, DBPage } from "@db-ui/react-components";
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
  const { darkMode } = useThemeBuilderStore((state) => state);
  return (
    <DBPage
      className={className}
      type="fixedHeaderFooter"
      slotHeader={
        <DBHeader
          slotBrand={
            <DBBrand
              imgSrc={`${BASE_PATH}/assets/images/db_logo.svg`}
              anchorChildren
            >
              {name}
            </DBBrand>
          }
          slotActionBar={actionBar}
          slotCallToAction={
            <div className="flex gap-fix-sm">
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
