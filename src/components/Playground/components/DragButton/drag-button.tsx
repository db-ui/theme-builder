const DragButton = ({
  componentName,
  drag,
}: {
  componentName: string;
  drag: (dom: HTMLElement) => HTMLElement;
}) => {
  return (
    <span
      ref={(ref) => {
        if (ref) {
          drag(ref);
        }
      }}
      className="drag-button flex py-fix-3xs pl-fix-3xs"
      data-icon-after="drag_and_drop"
    >
      {componentName}
    </span>
  );
};

export default DragButton;
