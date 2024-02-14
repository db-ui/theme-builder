import { DBButton } from "@db-ui/react-components";
import { DBButtonProps } from "@db-ui/react-components/dist/components/button/model";
import Setting from "../Sidebar/Customize/Setting";
import { useEditor, useNode } from "@craftjs/core";
import { getDragClassNames } from "./data/utils.ts";
import DragButton from "./DragButton";

const Button = (props: DBButtonProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    return { selected: id === currentNodeId };
  });
  return (
    <DBButton
      className={`${getDragClassNames(selected, props.className)}`}
      ref={(ref) => {
        if (ref) {
          connect(ref);
        }
      }}
      {...props}
    >
      {props.children}
      <DragButton drag={drag} />
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
          { label: "primary", value: "primary" },
          { label: "solid", value: "solid" },
          { label: "text", value: "text" },
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
