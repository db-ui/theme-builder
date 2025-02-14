import ReactDOM from "react-dom/client";
import "./index.scss";
import "./tailwind.css";
import App from "./App.tsx";
import Error from "./pages/Error";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import "./i18n";
import { BASE_PATH } from "./constants.ts";
import AppRoutes from "./utils/app-routes.tsx";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<App />} errorElement={<Error />}>
      {AppRoutes.map((route) => (
        <Route
          key={`route-${route.path}`}
          path={route.path}
          element={route.element}
        />
      ))}
    </Route>,
  ]),
  { basename: BASE_PATH },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
