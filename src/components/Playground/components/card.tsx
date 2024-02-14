import { DBCard } from "@db-ui/react-components";
import { DBCardProps } from "@db-ui/react-components/dist/components/card/model";
import { Element, useEditor, useNode } from "@craftjs/core";
import DropContainer from "./drop-container.tsx";
import { getDragClassNames } from "./data/utils.ts";
import Setting from "../Sidebar/Customize/Setting";
import DragButton from "./DragButton";

const Card = (props: DBCardProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    return { selected: id === currentNodeId };
  });
  return (
    <DBCard
      className={`${getDragClassNames(selected, props.className)}`}
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

      <DragButton drag={drag} />
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
          { label: "none", value: "none" },
          { label: "small", value: "small" },
          { label: "medium", value: "medium" },
        ],
      },
    ]}
  />
);

Card.craft = {
  props: {
    spacing: "small",
  },
  related: {
    settings: CardSettings,
  },
};

export default Card;
