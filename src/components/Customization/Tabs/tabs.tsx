import { DBTab, DBTabList, DBTabPanel, DBTabs } from "@db-ui/react-components";
import { TabsPropsType } from "./data.ts";
import { useTranslation } from "react-i18next";
import { useThemeBuilderStore } from "../../../store";

const Tabs = ({ tabs }: TabsPropsType) => {
  const { t } = useTranslation();
  const { developerMode } = useThemeBuilderStore((state) => state);
  return (
    <DBTabs alignment="center" width="full">
      <DBTabList>
        {tabs
          .filter((tabItem) => developerMode || !tabItem.onlyDeveloper)
          .map((tabItem) => (
            <DBTab key={`tab-${tabItem.text}`}>{t(tabItem.text)}</DBTab>
          ))}
      </DBTabList>

      {tabs
        .filter((tabItem) => developerMode || !tabItem.onlyDeveloper)
        .map((tabItem) => (
          <DBTabPanel key={`tab-panel-${tabItem.text}`}>
            {tabItem.component}
          </DBTabPanel>
        ))}
    </DBTabs>
  );
};

export default Tabs;
