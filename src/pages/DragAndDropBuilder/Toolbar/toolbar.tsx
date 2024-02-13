import { ToolbarType } from "./data.ts";
import { useEditor } from "@craftjs/core";
import { DBButton } from "@db-ui/react-components";

const Toolbar = ({ className }: ToolbarType) => {
  const { actions, canUndo, canRedo } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
      };
    }

    return {
      selected,
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
    };
  });

  return (
    <div
      className={`flex justify-between h-siz-md db-bg-neutral-transparent-semi px-fix-sm ${className || ""}`}
    >
      <div className="flex gap-fix-sm">
        <DBButton
          variant="text"
          noText
          icon="undo"
          disabled={!canUndo}
          onClick={() => {
            actions.history.undo();
          }}
        >
          Undo
        </DBButton>
        <DBButton
          variant="text"
          noText
          icon="fast_forward_empty"
          disabled={!canRedo}
          onClick={() => {
            actions.history.redo();
          }}
        >
          Redo
        </DBButton>
      </div>
      <div className="flex gap-fix-sm"></div>
    </div>
  );
};
export default Toolbar;
