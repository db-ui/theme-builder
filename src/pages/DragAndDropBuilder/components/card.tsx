import { DBCard } from "@db-ui/react-components";
import { DBCardProps } from "@db-ui/react-components/dist/components/card/model";
import { Element, useEditor, useNode } from "@craftjs/core";
import DropContainer from "./drop-container.tsx";
import { getDragClassNames } from "./data/utils.ts";

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
          connect(drag(ref));
        }
      }}
      {...props}
      spacing="small"
    >
      <Element id="card-children" is={DropContainer} canvas>
        {props.children}
      </Element>
    </DBCard>
  );
};

export default Card;
