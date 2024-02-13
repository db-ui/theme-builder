export type ColorPickerType = {
  label: string;
  color: string;
  setColor: (color: string) => void;
  customColor?: boolean;
  isAddColor?: boolean;
  onDelete?: () => void;
};
