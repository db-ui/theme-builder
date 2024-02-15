import { DBMainNavigation, DBNavigationItem } from "@db-ui/react-components";
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
      <DBMainNavigation>
        {Object.entries(nodeTrees).map(([id, nodeTree]) => (
          <DBNavigationItem key={id} active={id === currentId}>
            <a onClick={() => useDragAndDropStore.setState({ currentId: id })}>
              {nodeTree.name}
            </a>
          </DBNavigationItem>
        ))}
        <DBNavigationItem icon="add">
          <a
            onClick={() => {
              setOpen(true);
            }}
          >
            {t("add")}
          </a>
        </DBNavigationItem>
      </DBMainNavigation>
      <EditNodeTreeDialog create open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default PageNavigation;
