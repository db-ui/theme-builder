import Editor from "../Editor/editor.tsx";
import { AppRoute } from "./data.ts";
import Colors from "../Colors/colors.tsx";

const AppRoutes: AppRoute[] = [
  { path: "/", element: <Colors />, label: "Colors" },
  { path: "/editor", element: <Editor />, label: "Editor" },
];

export default AppRoutes;
