import { DBMainNavigation, DBNavigationItem } from "@db-ui/react-components";
import AppRoutes from "./app-routes.tsx";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  return (
    <DBMainNavigation>
      {AppRoutes.map((route) => (
        <DBNavigationItem
          active={
            route.path === "/"
              ? location.pathname === "/"
              : location.pathname.includes(`${route.path}/`) ||
                location.pathname === route.path
          }
          key={`router-path-${route.path}`}
        >
          <Link to={route.path}>{route.label}</Link>
        </DBNavigationItem>
      ))}
    </DBMainNavigation>
  );
};

export default Navigation;
