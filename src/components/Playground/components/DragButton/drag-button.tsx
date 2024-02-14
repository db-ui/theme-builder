import { BASE_PATH } from "../../../../constants.ts";

const DragButton = ({ drag }: { drag: (dom: HTMLElement) => HTMLElement }) => {
  return (
    <img
      className="drag-button"
      ref={(ref) => {
        if (ref) {
          drag(ref);
        }
      }}
      alt="Move"
      src={`${BASE_PATH}/assets/images/move.svg`}
    />
  );
};

export default DragButton;
