import { getDragClassNames } from "./data/utils.ts";
import { useEditor, useNode } from "@craftjs/core";
import Setting from "../Sidebar/Customize/Setting";
import DragButton from "./DragButton";
import { DBDividerProps } from "@db-ui/react-components/dist/components/divider/model";

const Divider = (props: DBDividerProps) => {
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
      className={`db-divider text-[0] ${getDragClassNames(selected, hovered, props.className)}`}
      data-margin={props.margin}
      data-variant={props.variant}
      data-emphasis={props.emphasis}
      ref={(ref) => {
        if (ref) {
          connect(ref);
        }
      }}
    >
      Divider
      <DragButton componentName={name} drag={drag} />
    </div>
  );
};

const DividerSettings = () => (
  <Setting
    settings={[
      {
        key: "emphasis",
        type: "select",
        selectOptions: [{ value: "weak" }, { value: "strong" }],
      },
      {
        key: "variant",
        type: "select",
        selectOptions: [{ value: "horizontal" }, { value: "vertical" }],
      },
      {
        key: "margin",
        type: "select",
        selectOptions: [{ value: "auto" }, { value: "none" }],
      },
    ]}
  />
);

Divider.craft = {
  props: {
    emphasis: "weak",
    variant: "horizontal",
    margin: "auto",
  },
  related: {
    settings: DividerSettings,
  },
};

export default Divider;
