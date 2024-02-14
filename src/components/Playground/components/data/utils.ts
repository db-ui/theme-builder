export const getDragClassNames = (selected: boolean, className?: string) =>
  `drag-container ${selected ? " selected" : ""}${className ? ` ${className}` : ""}`;
