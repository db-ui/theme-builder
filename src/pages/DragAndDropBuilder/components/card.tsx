import { DBCard } from "@db-ui/react-components";
import { DBCardProps } from "@db-ui/react-components/dist/components/card/model";
import DragContainer from "./drag-container.tsx";
import { Element } from "@craftjs/core";
import DropContainer from "./drop-container.tsx";

const Card = (props: DBCardProps) => {
  return (
    <DragContainer>
      <DBCard {...props} spacing="small">
        <Element id="card-children" is={DropContainer} canvas>
          {props.children}
        </Element>
      </DBCard>
    </DragContainer>
  );
};

export default Card;
