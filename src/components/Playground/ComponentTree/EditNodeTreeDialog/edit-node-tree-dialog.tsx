import {
  DBButton,
  DBDivider,
  DBDrawer,
  DBInput,
} from "@db-ui/react-components";
import { useDragAndDropStore } from "../../../../store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { uuid } from "@db-ui/react-components/dist/utils";
import { EditNodeTreePropsType } from "./data.ts";
import { useEditor } from "@craftjs/core";

const EditNodeTreeDialog = ({
  create,
  open,
  onClose,
}: EditNodeTreePropsType) => {
  const { t } = useTranslation();
  const { currentId, nodeTrees } = useDragAndDropStore((state) => state);

  const [nodeTreeId, setNodeTreeId] = useState<string>("");
  const [nodeTreeName, setNodeTreeName] = useState<string>("");

  const [disabled, setDisabled] = useState<boolean>();

  const { actions } = useEditor();

  useEffect(() => {
    if (open) {
      if (create) {
        setNodeTreeId("");
        setNodeTreeName("");
      } else {
        const currentNode = nodeTrees[currentId];
        if (currentNode) {
          setNodeTreeId(currentId);
          setNodeTreeName(currentNode.name);
        }
      }
    }
  }, [create, currentId, nodeTrees, open]);

  useEffect(() => {
    if (nodeTreeId.length === 0) {
      setDisabled(true);
    } else if (create) {
      setDisabled(
        !!nodeTrees[nodeTreeId] ||
          nodeTreeId.length === 0 ||
          nodeTreeName.length === 0,
      );
    } else {
      setDisabled(
        nodeTreeId === currentId && nodeTreeName === nodeTrees[currentId].name,
      );
    }
  }, [create, currentId, nodeTreeId, nodeTreeName, nodeTrees]);

  return (
    <>
      <DBDrawer
        backdrop="weak"
        open={open}
        onClose={onClose}
        withCloseButton
        slotDrawerHeader={t(create ? "add" : "pgEdit")}
      >
        <div className="flex flex-col gap-fix-md py-fix-md">
          <DBInput
            label={t("id")}
            placeholder={t("id")}
            variant="floating"
            value={nodeTreeId}
            invalid={
              nodeTreeId.length === 0 || (create && nodeTrees[nodeTreeId])
                ? true
                : undefined
            }
            onChange={(event) => setNodeTreeId(event.target.value)}
          />
          <DBDivider margin="none" />
          <DBInput
            label={t("name")}
            placeholder={t("name")}
            variant="floating"
            value={nodeTreeName}
            onChange={(event) => setNodeTreeName(event.target.value)}
          />
        </div>
        <div className="flex gap-fix-md absolute bottom-fix-xs inset-x-fix-lg">
          {!create && (
            <DBButton
              width="full"
              disabled={Object.entries(nodeTrees).length < 2}
              onClick={() => {
                const tmpCopyTrees = { ...nodeTrees };
                delete tmpCopyTrees[currentId];
                useDragAndDropStore.setState({
                  nodeTrees: tmpCopyTrees,
                  currentId: Object.keys(nodeTrees)[0],
                });
                if (onClose) {
                  onClose();
                }
              }}
            >
              {t("delete")}
            </DBButton>
          )}
          <DBButton
            width="full"
            variant="brand"
            disabled={disabled}
            onClick={() => {
              const tmpCopyTrees = { ...nodeTrees };
              const newId = nodeTreeId || uuid();
              if (create) {
                tmpCopyTrees[newId] = {
                  isPage: true,
                  serializedJson: "",
                  name: nodeTreeName || "Unknown",
                };

                actions.deserialize(
                  '{"ROOT":{"type":{"resolvedName":"Root"},"isCanvas":true,"props":{"id":"canvas"},"displayName":"Root","custom":{"hover":false},"hidden":false,"nodes":[],"linkedNodes":{}}}',
                );
              } else {
                delete tmpCopyTrees[currentId];
                tmpCopyTrees[newId] = {
                  ...nodeTrees[currentId],
                  name: nodeTreeName || "Unknown",
                };
              }
              useDragAndDropStore.setState({
                nodeTrees: tmpCopyTrees,
                currentId: newId,
              });
              // TODO: Don't copy last node tree
              setNodeTreeName("");
              setNodeTreeId("");
              if (onClose) {
                onClose();
              }
            }}
          >
            {t(create ? "add" : "change")}
          </DBButton>
        </div>
      </DBDrawer>
    </>
  );
};

export default EditNodeTreeDialog;
