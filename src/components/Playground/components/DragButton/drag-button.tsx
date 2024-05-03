import { useEffect, useState } from "react";
import { useDragAndDropStore } from "../../../../store";

const isOutsideY = (dragContainer: DOMRect, previewContainer: DOMRect) =>
  dragContainer.top < previewContainer.top;
const isOutsideX = (dragContainer: DOMRect, previewContainer: DOMRect) =>
  dragContainer.left < previewContainer.left;

const DragButton = ({
  componentName,
  drag,
}: {
  componentName: string;
  drag: (dom: HTMLElement) => HTMLElement;
}) => {
  const { previewContainer } = useDragAndDropStore();
  const [dragRef, setDragRef] = useState<HTMLSpanElement>();
  const [outsideY, setOutsideY] = useState<boolean>(false);
  const [outsideX, setOutsideX] = useState<boolean>(false);

  useEffect(() => {
    if (dragRef && previewContainer) {
      const dragContainer = dragRef.getBoundingClientRect();
      setOutsideY(isOutsideY(dragContainer, previewContainer));
      setOutsideX(isOutsideX(dragContainer, previewContainer));
    }
  }, [dragRef, previewContainer]);

  return (
    <span
      ref={(ref) => {
        if (ref) {
          drag(ref);
          setDragRef(ref);
        }
      }}
      className="drag-button flex py-fix-3xs pl-fix-3xs"
      data-icon-after="dots_drag_and_drop"
      data-outside-y={outsideY}
      data-outside-x={outsideX}
    >
      {componentName}
    </span>
  );
};

export default DragButton;
