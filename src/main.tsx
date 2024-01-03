import ReactDOM from "react-dom/client";
import "./index.scss";
import "./tailwind.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "@db-ui/foundations/build/css/colors/classes/all.css";
import AppRoutes from "./components/Navigation/app-routes.tsx";

import "./i18n";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<App />}>
      {AppRoutes.map((route) => (
        <Route
          key={`route-${route.path}`}
          path={route.path}
          element={route.element}
        />
      ))}
    </Route>,
  ]),
  { basename: `/theme-builder${import.meta.env.VITE_FEATURE_BRANCH ?? ""}` },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
