import { PreviewType } from "./data.ts";
import { Element, Frame, useEditor } from "@craftjs/core";
import Root from "../components/root.tsx";
import { useEffect, useState } from "react";
import { useDragAndDropStore } from "../../../store";
import {
  compress,
  compressToBase64,
  decompressFromBase64,
  decompress,
} from "lz-string";

const Preview = ({ className }: PreviewType) => {
  const { serializedJson } = useDragAndDropStore();
  const { query, actions } = useEditor();
  const [init, setInit] = useState<boolean>(false);
  const [tick, setTick] = useState<boolean>(false);

  useEffect(() => {
    if (query) {
      const timer = setTimeout(() => {
        useDragAndDropStore.setState({
          serializedJson: compressToBase64(compress(query.serialize())),
        });
        setTick(!tick);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [query, tick]);

  useEffect(() => {
    if (!init && serializedJson && actions) {
      setInit(true);
      const json =
        serializedJson.length === 0
          ? undefined
          : decompress(decompressFromBase64(serializedJson));
      if (json) {
        actions.deserialize(json);
      }
    }
  }, [actions, serializedJson, init]);

  return (
    <div className={`${className || ""} p-fix-xs`}>
      <Frame>
        <Element id="canvas" is={Root} canvas></Element>
      </Frame>
    </div>
  );
};

export default Preview;
