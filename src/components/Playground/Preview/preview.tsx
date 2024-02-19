import { PreviewType } from "./data.ts";
import { Element, Frame, useEditor } from "@craftjs/core";
import Root from "../components/root.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDragAndDropStore } from "../../../store";
import {
  compress,
  compressToBase64,
  decompressFromBase64,
  decompress,
} from "lz-string";

const Preview = ({ className }: PreviewType) => {
  const ref = useRef<HTMLDivElement>(null);
  const { currentId, nodeTrees } = useDragAndDropStore();
  const { query, actions } = useEditor();
  const [init, setInit] = useState<string>();
  const [length, setLength] = useState<number>(0);
  const [tick, setTick] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) {
      useDragAndDropStore.setState({
        previewContainer: ref.current.getBoundingClientRect(),
      });
    }
  }, [ref]);

  const updateSerializedJson = useCallback(() => {
    const json = compressToBase64(compress(query.serialize()));
    const currentJson = nodeTrees[currentId].serializedJson;
    if (
      json !== currentJson &&
      currentId === init &&
      length === Object.keys(nodeTrees).length
    ) {
      useDragAndDropStore.setState({
        nodeTrees: {
          ...nodeTrees,
          [currentId]: {
            ...nodeTrees[currentId],
            serializedJson: json,
          },
        },
      });
    }
  }, [currentId, init, length, nodeTrees, query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSerializedJson();
      setTick(!tick);
    }, 2000);
    return () => clearTimeout(timer);
  }, [tick, updateSerializedJson]);

  useEffect(() => {
    if (currentId && nodeTrees && nodeTrees[currentId] && actions) {
      if (
        currentId !== init &&
        (length === 0 || length === Object.keys(nodeTrees).length)
      ) {
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
      setLength(Object.keys(nodeTrees).length);
    }
  }, [actions, currentId, nodeTrees, init, length]);

  return (
    <div
      ref={ref}
      className={`${className || ""} p-fix-3xs h-full overflow-y-auto`}
    >
      <Frame>
        <Element id="canvas" is={Root} canvas></Element>
      </Frame>
    </div>
  );
};

export default Preview;
