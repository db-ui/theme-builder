import Editor from "../Editor/editor.tsx";
import { AppRoute } from "./data.ts";
import ThemeBuilder from "../ThemeBuilder";

const AppRoutes: AppRoute[] = [
  { path: "/", element: <ThemeBuilder />, label: "themeBuilder" },
  { path: "/editor", element: <Editor />, label: "editor" },
];

export default AppRoutes;
