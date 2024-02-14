import { PropsWithChildren } from "react";
import { Element, useEditor, useNode } from "@craftjs/core";
import DropContainer from "./drop-container.tsx";
import { getDragClassNames } from "./data/utils.ts";
import Setting from "../Sidebar/Customize/Setting";
import DragButton from "./DragButton";

export type ContainerPropsType = {
  className?: string;
  display?: "flex" | "grid";
  direction?: "column" | "row";
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  width?: "full" | "fit";
  cells?: number;
};

const getFlexLayout = ({
  display,
  direction,
  gap,
  width,
  cells,
}: ContainerPropsType) => {
  let layout = "";

  if (display === "grid") {
    layout += " grid";

    if (direction === "column") {
      layout += ` grid-cols-${cells || 4}`;
    } else {
      layout += ` grid-rows-${cells || 4}`;
    }
  } else {
    layout += " flex";

    if (direction === "column") {
      layout += " flex-col";
    } else {
      layout += " flex-row";
    }
  }

  if (gap) {
    layout += ` gap-fix-${gap}`;
  }

  if (width === "fit") {
    layout += ` w-fit`;
  } else {
    layout += ` w-full`;
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
          connect(ref);
        }
      }}
    >
      <Element id="drop-container" is={DropContainer} canvas={true}>
        {props.children}
      </Element>

      <DragButton drag={drag} />
    </div>
  );
};

const ContainerSettings = () => (
  <Setting
    settings={[
      {
        key: "width",
        type: "select",
        selectOptions: [
          { label: "full", value: "full" },
          { label: "fit", value: "fit" },
        ],
      },
      {
        key: "display",
        type: "select",
        selectOptions: [
          { label: "flex", value: "flex" },
          { label: "grid", value: "grid" },
        ],
      },
      {
        key: "direction",
        type: "select",
        selectOptions: [
          { label: "row", value: "row" },
          { label: "column", value: "column" },
        ],
      },
      {
        key: "cells",
        type: "number",
        numberOptions: {
          min: 1,
          max: 8,
        },
        isHidden: (props) => props.display === "flex",
      },
      {
        key: "gap",
        type: "select",
        selectOptions: [
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
  props: {
    display: "flex",
    direction: "row",
    gap: "md",
    width: "full",
    cells: 4,
  },
  related: {
    settings: ContainerSettings,
  },
};

export default Container;
