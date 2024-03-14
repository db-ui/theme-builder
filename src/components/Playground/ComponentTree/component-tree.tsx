import { ComponentTreePropsType } from "./data.ts";
import { EditorState, useEditor } from "@craftjs/core";
import { DBButton } from "@db-ui/react-components";
import { useState } from "react";
import { useDragAndDropStore } from "../../../store";
import EditNodeTreeDialog from "./EditNodeTreeDialog";
import { useTranslation } from "react-i18next";
import TreeItem from "./TreeItem";

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
      className={`h-full${className ? ` ${className}` : ""} grow-0 shrink-0 min-w-siz-3xl max-w-[20%] border-r overflow-hidden`}
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
