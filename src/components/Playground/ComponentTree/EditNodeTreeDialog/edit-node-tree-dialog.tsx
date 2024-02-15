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

const EditNodeTreeDialog = ({ create }: EditNodeTreePropsType) => {
  const { t } = useTranslation();
  const { currentId, nodeTrees } = useDragAndDropStore((state) => state);
  const [open, setOpen] = useState<boolean>(false);

  const [nodeTreeId, setNodeTreeId] = useState<string | undefined>();
  const [nodeTreeName, setNodeTreeName] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      if (create) {
        setNodeTreeId(undefined);
        setNodeTreeName(undefined);
      } else {
        const currentNode = nodeTrees[currentId];
        if (currentNode) {
          setNodeTreeId(currentId);
          setNodeTreeName(currentNode.name);
        }
      }
    }
  }, [create, currentId, nodeTrees, open]);

  return (
    <>
      <DBButton
        data-tonality={create ? "regular" : "functional"}
        noText={!create}
        icon={create ? "add" : "edit"}
        variant={create ? "primary" : "text"}
        onClick={() => setOpen(true)}
      >
        {t(create ? "add" : "pgEdit")}
      </DBButton>
      <DBDrawer
        backdrop="weak"
        open={open}
        onClose={() => setOpen(false)}
        withCloseButton
        slotDrawerHeader={t(create ? "add" : "pgEdit")}
      >
        <div className="flex flex-col gap-fix-md py-fix-md">
          <DBInput
            label={t("id")}
            placeholder={t("id")}
            labelVariant="floating"
            value={nodeTreeId}
            onChange={(event) => setNodeTreeId(event.target.value)}
          />
          <DBDivider margin="none" />
          <DBInput
            label={t("name")}
            placeholder={t("name")}
            labelVariant="floating"
            value={nodeTreeName}
            onChange={(event) => setNodeTreeName(event.target.value)}
          />
        </div>
        <DBButton
          className="absolute bottom-fix-xs right-fix-xs"
          variant="primary"
          disabled={
            (create && (!nodeTreeId || !nodeTreeName)) ||
            (nodeTreeId === currentId &&
              nodeTreeName === nodeTrees[currentId].name)
          }
          onClick={() => {
            const tmpCopyTrees = { ...nodeTrees };
            const newId = nodeTreeId || uuid();
            if (create) {
              tmpCopyTrees[newId] = {
                isPage: true,
                serializedJson: "",
                name: nodeTreeName || "Unknown",
              };
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
            setOpen(false);
          }}
        >
          {t(create ? "add" : "change")}
        </DBButton>
      </DBDrawer>
    </>
  );
};

export default EditNodeTreeDialog;
