import DragContainer from "./drag-container.tsx";
import { PropsWithChildren } from "react";
import DropContainer from "./drop-container.tsx";
import { Element } from "@craftjs/core";

export type FlexPropsType = {
  direction?: "column" | "row";
};

const Flex = (props: PropsWithChildren<FlexPropsType>) => {
  return (
    <DragContainer>
      <div
        className={`flex ${props.direction === "row" ? "flex-row" : "flex-col"}`}
        {...props}
      >
        <Element id="flex-children" is={DropContainer} canvas>
          {props.children}
        </Element>
      </div>
    </DragContainer>
  );
};

Flex.craft = {
  props: {
    direction: "row",
  },
};

export default Flex;
