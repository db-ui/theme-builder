import { AppRoute } from "../components/Navigation/data.ts";
import ThemeBuilder from "../pages/ThemeBuilder";
import Editor from "../pages/Editor/editor.tsx";
import DragAndDropBuilder from "../pages/DragAndDropBuilder";

const AppRoutes: AppRoute[] = [
  { path: "/", element: <ThemeBuilder />, label: "themeBuilder" },
  { path: "/editor", element: <Editor />, label: "editor" },
  { path: "/dnd", element: <DragAndDropBuilder />, label: "dnd" },
];

export default AppRoutes;
