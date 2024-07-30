export type ColorInputsType = {
  name: string;
  color: string;
  onColorChange: (color: string) => void;
  error?: string;
  alternative?: string;
  contrast?: number;
  contrastMin?: number;
};
