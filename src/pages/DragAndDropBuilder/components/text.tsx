import { useNode } from "@craftjs/core";
import DragContainer from "./drag-container.tsx";
import ContentEditable from "react-contenteditable";

export type TextPropsType = {
  text: string;
};
const Text = ({ text }: TextPropsType) => {
  const {
    actions: { setProp },
  } = useNode();

  return (
    <DragContainer>
      <ContentEditable
        html={text}
        onChange={(e) =>
          setProp(
            (props: TextPropsType) =>
              (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")),
          )
        }
        tagName="p"
      />
    </DragContainer>
  );
};

export default Text;
