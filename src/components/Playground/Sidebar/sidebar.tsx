import { SidebarType } from "./data.ts";
import { DBTab, DBTabList, DBTabPanel, DBTabs } from "@db-ui/react-components";
import { useEditor } from "@craftjs/core";
import { useEffect, useRef } from "react";
import Customize from "./Customize";
import ComponentList from "./ComponentList";
import { useTranslation } from "react-i18next";

const Sidebar = ({ className }: SidebarType) => {
  const customizeTabRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      const node = state.nodes[currentNodeId];

      selected = {
        id: currentNodeId,
        data: node.data,
        settings: node.related && node.related.settings,
      };
    }

    return {
      selected,
    };
  });

  useEffect(() => {
    if (customizeTabRef.current && selected) {
      customizeTabRef.current.click();
    }
  }, [selected, customizeTabRef]);

  return (
    <div
      data-density="functional"
      className={`border-l flex flex-col grow-0 shrink-0 w-[320px] overflow-hidden ${className || ""}`}
    >
      <DBTabs className="h-full" alignment="center" width="full">
        <DBTabList>
          <DBTab>{t("components")}</DBTab>
          <DBTab disabled={!selected} ref={customizeTabRef}>
            {t("customize")}
          </DBTab>
        </DBTabList>
        <DBTabPanel>
          <ComponentList />
        </DBTabPanel>
        <DBTabPanel>
          <Customize />
        </DBTabPanel>
      </DBTabs>
    </div>
  );
};

export default Sidebar;
