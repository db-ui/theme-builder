import { ReactElement } from "react";

export type DefaultPagePropsType = {
  name: string;
  actionBar?: ReactElement;
  navigation?: ReactElement;
  className?: string;
  themeImage?: boolean;
  isLocalDarkMode?: boolean;
  tonality?: string;
};
