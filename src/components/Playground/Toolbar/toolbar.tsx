import { ToolbarType } from "./data.ts";
import { useEditor } from "@craftjs/core";
import { DBButton, DBTooltip } from "@db-ui/react-components";
import { useDragAndDropStore } from "../../../store";
import { useTranslation } from "react-i18next";

const Toolbar = ({ className }: ToolbarType) => {
  const { t } = useTranslation();
  const { showBorders, showSpacings } = useDragAndDropStore((state) => state);
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
      data-density="functional"
      className={`flex h-siz-md db-neutral-bg-transparent-semi px-fix-sm ${className || ""}`}
    >
      <div className="flex w-full justify-between m-auto">
        <div className="flex gap-fix-sm">
          <DBButton
            variant="ghost"
            noText
            icon="undo"
            disabled={!canUndo}
            onClick={() => {
              actions.history.undo();
            }}
          >
            {t("playgroundUndo")}
            {canUndo && <DBTooltip>{t("playgroundUndo")}</DBTooltip>}
          </DBButton>
          <DBButton
            variant="ghost"
            noText
            icon="fast_forward_empty"
            disabled={!canRedo}
            onClick={() => {
              actions.history.redo();
            }}
          >
            {t("playgroundRedo")}
            {canRedo && <DBTooltip>{t("playgroundRedo")}</DBTooltip>}
          </DBButton>
        </div>
        <div className="flex gap-fix-sm">
          <DBButton
            variant="ghost"
            noText
            icon="resize"
            onClick={() => {
              useDragAndDropStore.setState({ showSpacings: !showSpacings });
            }}
          >
            {t("playgroundShowSpacings")}
            <DBTooltip>{t("playgroundShowSpacings")}</DBTooltip>
          </DBButton>
          <DBButton
            variant="ghost"
            noText
            icon="grid_view"
            onClick={() => {
              useDragAndDropStore.setState({ showBorders: !showBorders });
            }}
          >
            {t("playgroundShowBorders")}
            <DBTooltip>{t("playgroundShowBorders")}</DBTooltip>
          </DBButton>
        </div>
      </div>
    </div>
  );
};
export default Toolbar;
