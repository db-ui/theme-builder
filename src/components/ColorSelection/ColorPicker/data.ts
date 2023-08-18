export type ColorPickerType = {
  label: string;
  color: string;
  setColor: (color: string) => void;
  variant?:
    | "adaptive"
    | "critical"
    | "informational"
    | "warning"
    | "successful";
  title?: string;
};
