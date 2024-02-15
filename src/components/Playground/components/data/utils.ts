export const getDragClassNames = (
  selected: boolean,
  hovered: boolean,
  className?: string,
) =>
  `drag-container${selected ? " selected" : ""}${hovered ? " hovered" : ""}${className ? ` ${className}` : ""}`;
