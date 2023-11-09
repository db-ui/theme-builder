export type ContrastCheckerType = {
  backgroundColor: string;
  backgroundColorDark?: string;
  label: string;
  initColor: string;
  onChange?: (color: string) => void;
  isCustom?: boolean;
};
