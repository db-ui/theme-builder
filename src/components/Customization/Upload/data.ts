export type UploadPropsType = {
  label: string;
  accept?: string;
  onUpload: (result: string) => void;
  tooltip?: string;
};
