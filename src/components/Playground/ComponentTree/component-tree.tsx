import { ComponentTreePropsType } from "./data.ts";
import { EditorState, useEditor } from "@craftjs/core";
import { DBButton, DBIcon } from "@db-ui/react-components";
import { Node } from "@craftjs/core/lib/interfaces/nodes";
import { Fragment, useState } from "react";
import { useDragAndDropStore } from "../../../store";
import EditNodeTreeDialog from "./EditNodeTreeDialog";
import { useTranslation } from "react-i18next";

type TreeItemPropsType = {
  node: Node;
};
const TreeItem = ({ node }: TreeItemPropsType) => {
  const { selected, actions, allNodes } = useEditor((state: EditorState) => {
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
      allNodes: state.nodes,
    };
  });
  const [open, setOpen] = useState<boolean>(false);

  if (!node) {
    return null;
  }

  const { id, data } = node;
  let childNodes = [...data.nodes, ...Object.values(data.linkedNodes)];

  const hasDropContainer =
    childNodes.length === 1 &&
    allNodes[childNodes[0]].data.name === "DropContainer";

  if (hasDropContainer) {
    const dropContainerData = allNodes[childNodes[0]].data;

    childNodes = [
      ...dropContainerData.nodes,
      ...Object.values(dropContainerData.linkedNodes),
    ];
  }

  const name = data.custom.displayName || data.name;

  const item = (
    <div
      className={` 
      ${selected?.id === id ? "db-informational-bg-lvl-3" : ""} 
      tree-item
      flex items-center justify-between w-full`}
      role="button"
      onClick={() => {
        actions.selectNode(id);
      }}
    >
      {childNodes.length === 0 && (
        <DBIcon className="w-siz-md" icon="intermediary_stop" />
      )}
      <span
        className={`break-all w-full`}
        onMouseEnter={() =>
          actions.setCustom(id, (data) => {
            data.hover = true;
          })
        }
        onMouseLeave={() =>
          actions.setCustom(id, (data) => {
            data.hover = false;
          })
        }
      >
        {name}
      </span>

      <DBButton
        className="min-w-siz-md"
        variant="ghost"
        icon={data.hidden ? "visibility_off" : "visibility"}
        noText
        onClick={() => {
          actions.setHidden(id, !data.hidden);
        }}
      >
        Hide {name}({id})
      </DBButton>
    </div>
  );

  if (childNodes.length > 0) {
    return (
      <details open={open}>
        <summary
          onDoubleClick={() => setOpen(!open)}
          onClick={(event) => {
            event.preventDefault();
          }}
          className="flex items-center"
        >
          <DBButton
            variant="ghost"
            icon={open ? "expand_more" : "chevron_right"}
            noText
            onClick={() => {
              setOpen(!open);
            }}
          >
            Open {data.displayName}({id})
          </DBButton>
          {item}
        </summary>
        <div className="flex flex-col pl-fix-xs w-full">
          {childNodes.map((nodeId: string) => (
            <Fragment key={`tree-item-${nodeId}`}>
              <TreeItem node={allNodes[nodeId]} />
            </Fragment>
          ))}
        </div>
      </details>
    );
  }

  return item;
};

const ComponentTree = ({ className }: ComponentTreePropsType) => {
  const { t } = useTranslation();
  const { currentId, nodeTrees } = useDragAndDropStore((state) => state);
  const { nodes } = useEditor((state: EditorState) => ({
    nodes: state.nodes,
  }));
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      data-density="functional"
      className={`h-full${className ? ` ${className}` : ""} border-r overflow-hidden`}
    >
      {nodeTrees[currentId] && (
        <div className="h-siz-md flex items-center justify-between p-fix-sm">
          <h6>{nodeTrees[currentId].name}</h6>
          <DBButton
            data-tonality={"functional"}
            noText
            icon="edit"
            variant="ghost"
            onClick={() => setOpen(true)}
          >
            {t("pgEdit")}
          </DBButton>
          <EditNodeTreeDialog open={open} onClose={() => setOpen(false)} />
        </div>
      )}
      <div
        data-density="functional"
        className="flex flex-col p-fix-sm h-full overflow-auto"
      >
        <TreeItem node={nodes["ROOT"]} />
      </div>
    </div>
  );
};
export default ComponentTree;
