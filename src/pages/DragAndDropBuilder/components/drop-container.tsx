import { PropsWithChildren } from "react";
import { useEditor, useNode } from "@craftjs/core";

export type DropContainerPropsType = {
  className?: string;
};
const DropContainer = ({
  children,
  className,
}: PropsWithChildren<DropContainerPropsType>) => {
  const {
    connectors: { connect },
    id,
  } = useNode();

  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    return { selected: id === currentNodeId };
  });

  return (
    <div
      className={`drop-container ${className || ""}${selected ? " selected" : ""}`}
      ref={(ref) => {
        if (ref) {
          connect(ref);
        }
      }}
    >
      {children}
    </div>
  );
};

DropContainer.craft = {
  rules: {
    canMoveIn: (incomingNodes: any) =>
      incomingNodes.every(() => {
        return true;
      }),
  },
};

export default DropContainer;
