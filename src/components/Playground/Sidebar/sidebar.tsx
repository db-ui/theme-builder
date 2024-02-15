import { SidebarType } from "./data.ts";
import { DBButton, DBDivider } from "@db-ui/react-components";
import { useEditor } from "@craftjs/core";
import { useEffect, useState } from "react";
import Customize from "./Customize";
import ComponentList from "./ComponentList";
import { useTranslation } from "react-i18next";

const Sidebar = ({ className }: SidebarType) => {
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

  const [componentsActive, setComponentsActive] = useState<boolean>(true);

  useEffect(() => {
    setComponentsActive(!selected);
  }, [selected]);

  return (
    <div
      className={`border-l flex flex-col overflow-hidden ${className || ""}`}
    >
      <div className="grid grid-cols-2 items-center justify-center min-h-siz-md px-fix-xs">
        <DBButton
          className="m-auto"
          onClick={() => setComponentsActive(true)}
          size="small"
          width="full"
          variant={componentsActive ? "solid" : "text"}
        >
          {t("components")}
        </DBButton>
        <DBButton
          className="m-auto"
          disabled={!selected}
          onClick={() => setComponentsActive(false)}
          size="small"
          width="full"
          variant={!componentsActive ? "solid" : "text"}
        >
          {t("customize")}
        </DBButton>
      </div>

      <DBDivider margin="none" />
      {!componentsActive && selected && <Customize />}

      {componentsActive && <ComponentList />}
    </div>
  );
};

export default Sidebar;
