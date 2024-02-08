import { ComponentTreePropsType } from "./data.ts";
import { EditorState, useEditor } from "@craftjs/core";
import { DBButton, DBDivider } from "@db-ui/react-components";
import { Node } from "@craftjs/core/lib/interfaces/nodes";
import { Fragment, useState } from "react";

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

  const item = (
    <div
      className={` 
      ${selected?.id === id ? "db-bg-neutral" : ""} 
      flex items-center justify-between w-full`}
      role="button"
      onClick={() => {
        actions.selectNode(id);
      }}
    >
      <span className="break-words">{data.displayName}</span>

      <DBButton
        variant="text"
        icon={data.hidden ? "visibility_off" : "visibility"}
        noText
        onClick={() => {
          actions.setHidden(id, !data.hidden);
        }}
      >
        Hide {data.displayName}({id})
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
            variant="text"
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
        <div className="flex flex-col pl-siz-md w-full">
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
  const { nodes } = useEditor((state: EditorState) => ({
    nodes: state.nodes,
  }));

  return (
    <div className={`shadow-md h-full${className ? ` ${className}` : ""}`}>
      <div className="h-siz-md flex items-center p-fix-xs">
        <h6>Component Tree</h6>
      </div>
      <DBDivider margin="none" />
      <div data-tonality="functional" className="flex flex-col p-fix-xs">
        <TreeItem node={nodes["ROOT"]} />
      </div>
    </div>
  );
};
export default ComponentTree;
