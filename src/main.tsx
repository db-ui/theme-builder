import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AppRoutes from "./components/Navigation/app-routes.tsx";

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
  { basename: "/theme-builder" },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
