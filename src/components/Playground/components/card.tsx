import { DBCard } from "@db-ux/react-core-components";
import { DBCardProps } from "@db-ux/react-core-components/dist/components/card/model";
import { Element, useEditor, useNode } from "@craftjs/core";
import DropContainer from "./drop-container.tsx";
import { getDragClassNames } from "./data/utils.ts";
import Setting from "../Sidebar/Customize/Setting";
import DragButton from "./DragButton";

const Card = (props: DBCardProps) => {
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
    <DBCard
      className={`${getDragClassNames(selected, hovered, props.className)}`}
      ref={(ref) => {
        if (ref) {
          connect(ref);
        }
      }}
      {...props}
    >
      <Element id="card-children" is={DropContainer} canvas>
        {props.children}
      </Element>

      <DragButton componentName={name} drag={drag} />
    </DBCard>
  );
};

const CardSettings = () => (
  <Setting
    settings={[
      {
        key: "spacing",
        type: "select",
        selectOptions: [
          { value: "none" },
          { value: "small" },
          { value: "medium" },
        ],
      },
      {
        key: "elevationLevel",
        type: "select",
        selectOptions: [{ value: "1" }, { value: "2" }, { value: "3" }],
      },
      {
        key: "behaviour",
        type: "select",
        selectOptions: [{ value: "default" }, { value: "interactive" }],
      },
    ]}
  />
);

Card.craft = {
  props: {
    spacing: "small",
    behavior: "default",
    elevationLevel: "1",
  },
  related: {
    settings: CardSettings,
  },
};

export default Card;
