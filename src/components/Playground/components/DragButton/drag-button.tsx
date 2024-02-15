import { BASE_PATH } from "../../../../constants.ts";

const DragButton = ({
  componentName,
  drag,
}: {
  componentName: string;
  drag: (dom: HTMLElement) => HTMLElement;
}) => {
  return (
    <div
      ref={(ref) => {
        if (ref) {
          drag(ref);
        }
      }}
      className="drag-button flex gap-fix-3xs pl-fix-xs"
    >
      <span>{componentName}</span>
      <img alt="Move" src={`${BASE_PATH}/assets/images/move.svg`} />
    </div>
  );
};

export default DragButton;
