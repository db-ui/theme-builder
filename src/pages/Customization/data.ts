import { ReactElement } from "react";

export type TabItemType = {
  text: string;
  component: ReactElement;
  onlyDeveloper?: boolean;
};
