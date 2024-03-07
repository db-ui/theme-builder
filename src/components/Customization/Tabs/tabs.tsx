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
        {tabs.map((tabItem) => (
          <DBTab
            className={developerMode || !tabItem.onlyDeveloper ? "" : "hidden"}
            key={`tab-${tabItem.text}`}
          >
            {t(tabItem.text)}
          </DBTab>
        ))}
      </DBTabList>

      {tabs.map((tabItem) => (
        <DBTabPanel
          className={developerMode || !tabItem.onlyDeveloper ? "" : "hidden"}
          key={`tab-panel-${tabItem.text}`}
        >
          {tabItem.component}
        </DBTabPanel>
      ))}
    </DBTabs>
  );
};

export default Tabs;
