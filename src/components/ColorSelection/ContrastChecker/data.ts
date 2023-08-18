export type ContrastCheckerType = {
  id: string;
  backgroundColor: string;
  label: string;
  initColor: string;
  onChange?: (color: string) => void;
};
