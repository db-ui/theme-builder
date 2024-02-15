import { PreviewType } from "./data.ts";
import { Element, Frame, useEditor } from "@craftjs/core";
import Root from "../components/root.tsx";
import { useEffect, useState } from "react";
import { useDragAndDropStore } from "../../../store";
import { decompress, decompressFromBase64 } from "lz-string";

const Preview = ({ className }: PreviewType) => {
  const { currentId, nodeTrees } = useDragAndDropStore();
  const { actions } = useEditor();
  const [init, setInit] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (currentId && nodeTrees && nodeTrees[currentId] && actions) {
      if (currentId !== init) {
        const serializedJson = nodeTrees[currentId].serializedJson;
        const json =
          serializedJson.length === 0
            ? undefined
            : decompress(decompressFromBase64(serializedJson));
        if (json) {
          actions.deserialize(json);
        }
      }
      setInit(currentId);
    }
  }, [actions, currentId, nodeTrees, init]);

  return (
    <div className={`${className || ""} p-fix-3xs h-full overflow-y-auto`}>
      <Frame>
        <Element id="canvas" is={Root} canvas></Element>
      </Frame>
    </div>
  );
};

export default Preview;
