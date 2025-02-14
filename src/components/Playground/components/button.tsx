import { DBButton } from "@db-ux/react-core-components";
import { DBButtonProps } from "@db-ux/react-core-components/dist/components/button/model";
import Setting from "../Sidebar/Customize/Setting";
import { useEditor, useNode } from "@craftjs/core";
import { getDragClassNames } from "./data/utils.ts";
import DragButton from "./DragButton";

const Button = (props: DBButtonProps) => {
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
    <DBButton
      className={`${getDragClassNames(selected, hovered, props.className)}`}
      ref={(ref) => {
        if (ref) {
          connect(ref);
        }
      }}
      {...props}
    >
      {props.children}
      <DragButton componentName={name} drag={drag} />
    </DBButton>
  );
};

const ButtonSettings = () => (
  <Setting
    settings={[
      {
        key: "children",
        type: "text",
      },
      {
        key: "variant",
        type: "select",
        selectOptions: [
          { label: "outlined", value: "outlined" },
          { label: "brand", value: "brand" },
          { label: "filled", value: "filled" },
          { label: "ghost", value: "ghost" },
        ],
      },
      {
        key: "disabled",
        type: "switch",
      },
      {
        key: "size",
        type: "select",
        selectOptions: [
          { label: "small", value: "small" },
          { label: "medium", value: "medium" },
        ],
      },
      {
        key: "noText",
        type: "switch",
      },
      {
        key: "width",
        type: "select",
        selectOptions: [
          { label: "auto", value: "auto" },
          { label: "full", value: "full" },
        ],
      },
      {
        key: "icon",
        type: "icon",
      },
    ]}
  />
);

Button.craft = {
  props: {
    variant: "outlined",
    children: "Test",
    size: "medium",
    disabled: false,
    noText: false,
    width: "auto",
    icon: "none",
  },
  related: {
    settings: ButtonSettings,
  },
};

export default Button;
