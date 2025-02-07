export type ColorInputsType = {
  name: string;
  color: string;
  onColorChange: (color: string) => void;
  error?: string;
  alternative?: string;
  contrasts?: { value: number; min?: number; name?: string }[];
};
