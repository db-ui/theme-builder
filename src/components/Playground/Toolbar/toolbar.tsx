import { ToolbarType } from "./data.ts";
import { useEditor } from "@craftjs/core";
import { DBButton, DBTooltip } from "@db-ui/react-components";
import { useDragAndDropStore } from "../../../store";
import { useTranslation } from "react-i18next";
import Upload from "../../Customization/Upload";
import {downloadPlayground} from "../../../utils/outputs/download.ts";

const Toolbar = ({ className }: ToolbarType) => {
  const { t } = useTranslation();
  const { currentId, nodeTrees, showBorders, showSpacings } =
    useDragAndDropStore((state) => state);
  const { actions, canUndo, canRedo, query } = useEditor((state, query) => {
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
            {canUndo && (
              <DBTooltip placement="right">{t("playgroundUndo")}</DBTooltip>
            )}
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
            {canRedo && (
              <DBTooltip placement="bottom">{t("playgroundRedo")}</DBTooltip>
            )}
          </DBButton>
        </div>
        <div className="flex gap-fix-sm">
          <Upload
            noText
            variant="ghost"
            label="import"
            accept="application/JSON"
            tooltip="import"
            onUpload={(result) => {
              try {
                const resultAsString = atob(result.split("base64,")[1]);
                actions.deserialize(resultAsString);
              } catch (error: any) {
                console.error(error);
              }
            }}
          />
          <DBButton
            variant="ghost"
            noText
            icon="download"
            onClick={() => {
              downloadPlayground({
                [nodeTrees[currentId].name]: query.serialize(),
              });
            }}
          >
            {t("export")}
            <DBTooltip placement="bottom">{t("export")}</DBTooltip>
          </DBButton>
          <DBButton
            variant="ghost"
            noText
            icon="resize"
            onClick={() => {
              useDragAndDropStore.setState({ showSpacings: !showSpacings });
            }}
          >
            {t("playgroundShowSpacings")}
            <DBTooltip placement="bottom">
              {t("playgroundShowSpacings")}
            </DBTooltip>
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
            <DBTooltip placement="left">{t("playgroundShowBorders")}</DBTooltip>
          </DBButton>
        </div>
      </div>
    </div>
  );
};
export default Toolbar;
