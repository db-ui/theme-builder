import { PropsWithChildren } from "react";
import { Element, useEditor, useNode } from "@craftjs/core";
import DropContainer from "./drop-container.tsx";
import { getDragClassNames } from "./data/utils.ts";
import Setting from "../Sidebar/Customize/Setting";

export type ContainerPropsType = {
  className?: string;
  display?: "flex" | "grid";
  flexDirection?: "column" | "row";
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
};

const getFlexLayout = ({ display, flexDirection, gap }: ContainerPropsType) => {
  let layout = "";

  if (display === "grid") {
    layout += " grid";
  } else {
    layout += " flex";
  }

  if (flexDirection === "column") {
    layout += " flex-col";
  } else {
    layout += " flex-row";
  }

  if (gap) {
    layout += ` gap-fix-${gap}`;
  }
  return layout;
};
const Container = (props: PropsWithChildren<ContainerPropsType>) => {
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
      className={`${getDragClassNames(selected, `${getFlexLayout(props)}${props.className || ""}`)}`}
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
    >
      <Element id="drop-container" is={DropContainer} canvas={true}>
        {props.children}
      </Element>
    </div>
  );
};

const ContainerSettings = () => (
  <Setting
    settings={[
      {
        key: "display",
        type: "select",
        options: [
          { label: "flex", value: "flex" },
          { label: "grid", value: "grid" },
        ],
      },
      {
        key: "flexDirection",
        type: "select",
        options: [
          { label: "row", value: "row" },
          { label: "column", value: "column" },
        ],
        isHidden: (props) => props.display === "grid",
      },
      {
        key: "gap",
        type: "select",
        options: [
          { label: "xs", value: "xs" },
          { label: "sm", value: "sm" },
          { label: "md", value: "md" },
          { label: "lg", value: "lg" },
          { label: "xl", value: "xl" },
        ],
      },
    ]}
  />
);

Container.craft = {
  props: { display: "flex", flexDirection: "row", gap: "md" },
  related: {
    settings: ContainerSettings,
  },
};

export default Container;
