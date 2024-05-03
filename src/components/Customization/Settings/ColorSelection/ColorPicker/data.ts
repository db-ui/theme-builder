export type ColorPickerType = {
  label: string;
  color: string;
  setColor?: (color: string) => void;
  onAddColor?: (name: string, color: string) => void;
  customColor?: boolean;
  isAddColor?: boolean;
  onDelete?: () => void;
  isOrigin?: boolean;
  setAlternativeColor?: (color: string) => void;
  setAlternativeCustom?: (custom: boolean) => void;
};
