import { DBButton, DBRadio } from "@db-ui/react-components";
import { DBButtonProps } from "@db-ui/react-components/dist/components/button/model";
import DragContainer from "./drag-container.tsx";
import { useNode } from "@craftjs/core";

const Button = (props: DBButtonProps) => {
  return (
    <DragContainer>
      <DBButton {...props}>{props.children}</DBButton>
    </DragContainer>
  );
};

const ButtonSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="flex flex-col">
      <DBRadio
        name="variant"
        value="outlined"
        defaultChecked={!props.variant || props.variant === "outlined"}
        onChange={(e) =>
          setProp((props: any) => (props.variant = e.target.value))
        }
      >
        Outlined
      </DBRadio>
      <DBRadio
        defaultChecked={props.variant === "primary"}
        name="variant"
        value="primary"
        onChange={(e) =>
          setProp((props: any) => (props.variant = e.target.value))
        }
      >
        Primary
      </DBRadio>
    </div>
  );
};

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
