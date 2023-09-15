import { ReactNode } from "react";

export type AppRoute = {
  path: string;
  label: string;
  element: ReactNode | null;
};
