import Editor from "../pages/Editor/editor.tsx";
import { AppRoute } from "../components/DefaultPage/Navigation/data.ts";
import Customization from "../pages/Customization";
import Landing from "../pages/Landing";
import Demo from "../pages/Demo";
import DragAndDropBuilder from "../pages/DragAndDropBuilder";

const AppRoutes: AppRoute[] = [
  { path: "/", element: <Landing />, label: "landing" },
  {
    path: "/customization",
    element: <Customization />,
    label: "customization",
  },
  { path: "/editor", element: <Editor />, label: "editor" },
  { path: "/dnd", element: <DragAndDropBuilder />, label: "dnd" },
  { path: "/demo", element: <Demo />, label: "demo" },
];

export default AppRoutes;
