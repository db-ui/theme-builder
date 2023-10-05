import Editor from "../Editor/editor.tsx";
import { AppRoute } from "./data.ts";
import Colors from "../Colors/colors.tsx";

const AppRoutes: AppRoute[] = [
  { path: "/", element: <Colors />, label: "colors" },
  { path: "/editor", element: <Editor />, label: "editor" },
];

export default AppRoutes;
