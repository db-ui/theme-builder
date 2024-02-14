import { DBButton } from "@db-ui/react-components";
import { DBButtonProps } from "@db-ui/react-components/dist/components/button/model";
import Setting from "../Sidebar/Customize/Setting";
import { useEditor, useNode } from "@craftjs/core";
import { getDragClassNames } from "./data/utils.ts";

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
          connect(drag(ref));
        }
      }}
      {...props}
    >
      {props.children}
    </DBButton>
  );
};

const ButtonSettings = () => (
  <Setting
    settings={[
      {
        key: "variant",
        type: "select",
        options: [
          { label: "outlined", value: "outlined" },
          { label: "primary", value: "primary" },
          { label: "solid", value: "solid" },
          { label: "text", value: "text" },
        ],
      },
    ]}
  />
);

Button.craft = {
  props: {
    variant: "outlined",
    children: "Test",
  },
  related: {
    settings: ButtonSettings,
  },
};

export default Button;
