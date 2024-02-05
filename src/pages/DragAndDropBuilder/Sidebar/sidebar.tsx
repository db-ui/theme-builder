import { SidebarType } from "./data.ts";
import { DBButton } from "@db-ui/react-components";
import { useEditor } from "@craftjs/core";
import { useEffect, useState } from "react";
import Customize from "./Customize";
import ComponentList from "./ComponentList";

const Sidebar = ({ className }: SidebarType) => {
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
    <div className={`shadow-md flex flex-col ${className || ""}`}>
      <div className="grid grid-cols-2 items-center justify-center min-h-siz-md px-fix-xs">
        <DBButton
          className="m-auto"
          onClick={() => setComponentsActive(true)}
          size="small"
          width="full"
          variant={componentsActive ? "solid" : "text"}
        >
          Components
        </DBButton>
        <DBButton
          className="m-auto"
          disabled={!selected}
          onClick={() => setComponentsActive(false)}
          size="small"
          width="full"
          variant={!componentsActive ? "solid" : "text"}
        >
          Customize
        </DBButton>
      </div>

      {!componentsActive && selected && <Customize />}

      {componentsActive && <ComponentList />}
    </div>
  );
};

export default Sidebar;
