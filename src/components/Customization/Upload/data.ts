export type UploadPropsType = {
  label: string;
  accept?: string;
  onUpload: (result: string) => void;
  size?: "small";
};
