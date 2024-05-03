import { EditorState, Node, NodeTree, useEditor } from "@craftjs/core";
import { Fragment, useState } from "react";
import { DBButton, DBIcon } from "@db-ui/react-components";
import { TreeItemPropsType } from "./data.ts";
import { WithoutPrivateActions } from "@craftjs/core/lib/hooks/useEditor";
import { uuid } from "@db-ui/react-components/dist/utils";
import { SerializedNode } from "@craftjs/core/lib/interfaces";

const addCopy = (
  actions: WithoutPrivateActions,
  query: any,
  id: string,
  parent: string,
) => {
  const nodeTree: NodeTree = query.node(id).toNodeTree();
  const newIds: Record<string, string> = {};
  Object.keys(nodeTree.nodes).forEach((key) => {
    newIds[key] = uuid();
  });

  const nodeArray: Node[] = Object.entries(newIds).map(([old, current]) => {
    const serializedNode: SerializedNode = query.node(old).toSerializedNode();
    if (serializedNode.parent) {
      serializedNode.parent = newIds[serializedNode.parent];
    }

    serializedNode.nodes = serializedNode.nodes.map((node) => newIds[node]);
    serializedNode.linkedNodes = Object.entries(
      serializedNode.linkedNodes,
    ).reduce((a, [name, id]) => ({ ...a, [name]: newIds[id] }), {});

    const newNode: Node = query.parseSerializedNode(serializedNode).toNode();
    newNode.id = current;
    return newNode;
  });
  const nodes = nodeArray.reduce((a, node) => ({ ...a, [node.id]: node }), {});
  actions.addNodeTree(
    {
      nodes,
      rootNodeId: nodeArray[0].id,
    },
    parent,
  );
};

const TreeItem = ({ node }: TreeItemPropsType) => {
  const { selected, actions, allNodes, query } = useEditor(
    (state: EditorState) => {
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
    },
  );
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
      flex items-center justify-between w-full gap-fix-md`}
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
      <div className="flex gap-fix-3xs">
        {id !== "ROOT" && (
          <DBButton
            className="min-w-siz-md"
            variant="ghost"
            icon="copy"
            noText
            onClick={() => {
              if (data.parent) {
                addCopy(actions, query, id, data.parent);
              }
            }}
          >
            Copy {name}({id})
          </DBButton>
        )}

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
            icon={open ? "chevron_down" : "chevron_right"}
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

export default TreeItem;
