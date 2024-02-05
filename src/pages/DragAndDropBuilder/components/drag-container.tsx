import { PropsWithChildren } from "react";
import { useEditor, useNode } from "@craftjs/core";

const DragContainer = ({ children }: PropsWithChildren) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    return { selected: id === currentNodeId };
  });

  return (
    <div
      className={`drag-container w-fit h-fit${selected ? " selected" : ""}`}
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
    >
      {children}
    </div>
  );
};

export default DragContainer;
