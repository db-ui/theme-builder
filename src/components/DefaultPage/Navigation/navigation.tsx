import { DBMainNavigation, DBNavigationItem } from "@db-ui/react-components";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppRoutes from "../../../utils/app-routes.tsx";

const Navigation = () => {
  const { t } = useTranslation();
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
          <Link to={route.path}>{t(route.label)}</Link>
        </DBNavigationItem>
      ))}
    </DBMainNavigation>
  );
};

export default Navigation;
