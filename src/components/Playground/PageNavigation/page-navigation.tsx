import { DBMainNavigation, DBNavigationItem } from "@db-ui/react-components";
import { useDragAndDropStore } from "../../../store";

const PageNavigation = () => {
  const { currentId, nodeTrees } = useDragAndDropStore((state) => state);

  return (
    <DBMainNavigation>
      {Object.entries(nodeTrees).map(([id, nodeTree]) => (
        <DBNavigationItem key={id} active={id === currentId}>
          <a onClick={() => useDragAndDropStore.setState({ currentId: id })}>
            {nodeTree.name}
          </a>
        </DBNavigationItem>
      ))}
    </DBMainNavigation>
  );
};

export default PageNavigation;
