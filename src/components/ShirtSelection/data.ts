export type ShirtSizeType =
  | "3xs"
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

export type ShirtSelectionType = {
  label: string;
  params: string[];
  shirtSizes: ShirtSizeType[];
  isTextArea?: boolean;
};
