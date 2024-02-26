export type ColorPickerType = {
  label: string;
  color: string;
  darkColor?: string;
  setColor: (color: string) => void;
  setDarkColor?: (color: string) => void;
  customColor?: boolean;
  isAddColor?: boolean;
  onDelete?: () => void;
};
