import { DBNavigation, DBNavigationItem } from "@db-ux/react-core-components";
import { useDragAndDropStore } from "../../../store";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import EditNodeTreeDialog from "../ComponentTree/EditNodeTreeDialog";

const PageNavigation = () => {
  const { t } = useTranslation();
  const { currentId, nodeTrees } = useDragAndDropStore((state) => state);

  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <DBNavigation>
        {Object.entries(nodeTrees).map(([id, nodeTree]) => (
          <DBNavigationItem key={id} active={id === currentId}>
            <a onClick={() => useDragAndDropStore.setState({ currentId: id })}>
              {nodeTree.name}
            </a>
          </DBNavigationItem>
        ))}
        <DBNavigationItem icon="plus">
          <a
            onClick={() => {
              setOpen(true);
            }}
          >
            {t("add")}
          </a>
        </DBNavigationItem>
      </DBNavigation>
      <EditNodeTreeDialog create open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default PageNavigation;
