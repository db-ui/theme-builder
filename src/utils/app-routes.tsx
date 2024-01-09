import { AppRoute } from "../components/Navigation/data.ts";
import ThemeBuilder from "../pages/ThemeBuilder";
import Editor from "../pages/Editor/editor.tsx";

const AppRoutes: AppRoute[] = [
  { path: "/", element: <ThemeBuilder />, label: "themeBuilder" },
  { path: "/editor", element: <Editor />, label: "editor" },
];

export default AppRoutes;
