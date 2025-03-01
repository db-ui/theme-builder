import { ValueLabelType } from "@db-ux/react-core-components/dist/shared/model";

export type SelectOptionType = {
  label?: string;
  value: any;
};
export type NumberOptionType = {
  min?: number;
  max?: number;
  step?: number;
};

export type SettingOptionType = {
  key: string;
  type:
    | "text"
    | "select"
    | "number"
    | "textarea"
    | "switch"
    | "icon"
    | "richtext"
    | "color";
  selectOptions?: SelectOptionType[];
  numberOptions?: NumberOptionType;
  changeType?: "props" | "custom" | "hidden";
  isHidden?: (props: Record<string, any>) => boolean;
  dataList?: ValueLabelType[];
};

export type SettingPropsType = {
  settings: SettingOptionType[];
};
