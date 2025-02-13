import { PropsWithChildren } from "react";
import { Element, useEditor, useNode } from "@craftjs/core";
import DropContainer from "./drop-container.tsx";
import { getDragClassNames } from "./data/utils.ts";
import Setting from "../Sidebar/Customize/Setting";
import DragButton from "./DragButton";
import { COLOR } from "@db-ux/react-core-components/dist/shared/constants";

export type ContainerPropsType = {
  className?: string;
  display?: "flex" | "grid";
  direction?: "column" | "row";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  width?: "full" | "fit";
  cells?: number;
  padding?:
    | "none"
    | "3xs"
    | "2xs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl";
  color?: COLOR | string;
};

const getFlexLayout = ({
  display,
  direction,
  gap,
  width,
  cells,
  padding,
  color,
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

  if (gap && gap !== "none") {
    layout += ` gap-fix-${gap}`;
  }

  if (width === "fit") {
    layout += ` w-fit`;
  } else {
    layout += ` w-full`;
  }

  if (padding !== "none") {
    layout += ` p-fix-${padding}`;
  }

  if (color && color !== "none") {
    layout += ` db-${color}`;
  }

  return layout;
};
const Container = (props: PropsWithChildren<ContainerPropsType>) => {
  const {
    connectors: { connect, drag },
    id,
    hovered,
    name,
  } = useNode((node) => {
    return {
      name: node.data.custom.displayName || node.data.name,
      hovered: node.data.custom.hover,
    };
  });

  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    return { selected: id === currentNodeId };
  });
  return (
    <div
      className={`${getDragClassNames(selected, hovered, `${getFlexLayout(props)}${props.className || ""}`)}`}
      ref={(ref) => {
        if (ref) {
          connect(ref);
        }
      }}
    >
      <Element id="drop-container" is={DropContainer} canvas={true}>
        {props.children}
      </Element>

      <DragButton componentName={name} drag={drag} />
    </div>
  );
};

const ContainerSettings = () => (
  <Setting
    settings={[
      {
        key: "padding",
        type: "select",
        selectOptions: [
          { value: "none" },
          { value: "3xs" },
          { value: "2xs" },
          { value: "xs" },
          { value: "sm" },
          { value: "md" },
          { value: "lg" },
          { value: "xl" },
          { value: "2xl" },
          { value: "3xl" },
        ],
      },
      {
        key: "width",
        type: "select",
        selectOptions: [{ value: "full" }, { value: "fit" }],
      },
      {
        key: "display",
        type: "select",
        selectOptions: [{ value: "flex" }, { value: "grid" }],
      },
      {
        key: "direction",
        type: "select",
        selectOptions: [{ value: "row" }, { value: "column" }],
      },
      {
        key: "cells",
        type: "number",
        numberOptions: {
          min: 1,
          max: 8,
        },
        isHidden: (props) => props?.display === "flex",
      },
      {
        key: "gap",
        type: "select",
        selectOptions: [
          { value: "none" },
          { value: "xs" },
          { value: "sm" },
          { value: "md" },
          { value: "lg" },
          { value: "xl" },
        ],
      },
      { key: "color", type: "color" },
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
    padding: "none",
    color: "none",
  },
  related: {
    settings: ContainerSettings,
  },
};

export default Container;
