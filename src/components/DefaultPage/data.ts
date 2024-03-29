import { ReactElement } from "react";

export type DefaultPagePropsType = {
  name: string;
  actionBar?: ReactElement;
  navigation?: ReactElement;
  className?: string;
  density?: string;
  withDevMode?: boolean;
};
