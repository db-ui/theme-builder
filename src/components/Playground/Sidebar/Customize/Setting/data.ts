import { DBSelectOptionType } from "@db-ui/react-components/dist/components/select/model";

export type SettingOptionType = {
  key: string;
  type: "text" | "select" | "number" | "textarea" | "switch";
  options?: DBSelectOptionType[];
  changeType?: "props" | "custom" | "hidden";
  isHidden?: (props: Record<string, any>) => boolean;
};

export type SettingPropsType = {
  settings: SettingOptionType[];
};
