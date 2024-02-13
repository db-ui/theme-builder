import DefaultPage from "../../components/DefaultPage";
import { DBCard } from "@db-ui/react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DemoPropsType } from "./data.ts";
import "./index.scss";

const cards = ["1", "2", "3", "4", "5", "6"];

const Demo = ({ linkToDemo }: DemoPropsType) => {
  const { t } = useTranslation();
  return (
    <DefaultPage className="hide-action-bar relative" name="Demo">
      <main className="flex flex-col gap-fix-md py-fix-md px-res-sm">
        <h1 className="demo-headline mx-auto">Titan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 p-fix-md gap-fix-md">
          {cards.map((card) => (
            <DBCard key={card} spacing="small" className="gap-fix-md">
              <h4>Lorem Ipsum {card}</h4>
              <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut.
              </p>
            </DBCard>
          ))}
        </div>
      </main>
      <Link
        to={linkToDemo ? "/demo" : "/"}
        className={`db-button open-demo absolute ${linkToDemo ? "bottom-0 right-0" : "bottom-fix-xs right-fix-xs"}`}
        data-variant="primary"
      >
        {linkToDemo ? t("openDemo") : t("openMainPage")}
      </Link>
    </DefaultPage>
  );
};

export default Demo;
