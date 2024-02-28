import DefaultPage from "../../components/DefaultPage";
import { DBCard, DBInfotext } from "@db-ui/react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DemoPropsType } from "./data.ts";
import Sidenav from "../../components/Demo/Sidenav";
import "./index.scss";

const Demo = ({ linkToDemo, density }: DemoPropsType) => {
  const { t } = useTranslation();
  return (
    <DefaultPage
      name="Demo"
      density={density}
      actionBar={
        <>
          <Link
            to={linkToDemo ? "/demo" : "/"}
            className="db-button"
            data-variant="brand"
            target="_blank"
          >
            {linkToDemo ? t("openDemo") : t("openMainPage")}
          </Link>
        </>
      }
    >
      <main className="overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          <Sidenav />
          <div className="flex flex-col gap-fix-md py-fix-md px-res-sm db-neutral-bg-lvl-2 w-full h-full overflow-y-auto">
            <h1>{t("dashboard")}</h1>
            <div className="demo-dashboard grid gap-fix-md h-full">
              <DBCard
                spacing="small"
                className="dashboard-short1 db-neutral-bg-lvl-1"
              >
                <div className="flex flex-col gap-fix-md h-full">
                  <h5>Mobile Users</h5>
                  <h3>500</h3>
                  <DBInfotext className="mt-auto" semantic="successful">
                    Good capacity
                  </DBInfotext>
                </div>
              </DBCard>
              <DBCard
                spacing="small"
                className="dashboard-short2 db-neutral-bg-lvl-1"
              >
                <div className="flex flex-col gap-fix-md h-full">
                  <h5>Tablet Users</h5>
                  <h3>200</h3>
                  <DBInfotext className="mt-auto" semantic="warning">
                    Medium capacity
                  </DBInfotext>
                </div>
              </DBCard>
              <DBCard
                spacing="small"
                className="dashboard-long db-brand-bg"
                elevationLevel="1"
              >
                <div className="flex flex-col gap-fix-md h-full">
                  <h5>Progress</h5>
                  <div className="dashboard-progress">
                    <h5 className="m-auto">50%</h5>
                  </div>
                </div>
              </DBCard>
              <DBCard
                spacing="small"
                className="dashboard-big db-neutral-bg-lvl-1 flex-row justify-between"
              >
                <div className="flex flex-col gap-fix-md h-full">
                  <h5>Desktop Users</h5>
                  <h3>100</h3>
                  <DBInfotext className="mt-auto" semantic="critical">
                    Bad capacity
                  </DBInfotext>
                </div>
              </DBCard>
            </div>
          </div>
        </div>
      </main>
    </DefaultPage>
  );
};

export default Demo;
