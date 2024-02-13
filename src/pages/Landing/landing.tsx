import { BASE_PATH } from "../../constants.ts";
import { DBButton, DBCard, DBIcon } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState } from "react";
import Demo from "../Demo";

const Landing = () => {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState<string>("default-theme");

  return (
    <div className="flex flex-col overflow-y-auto h-full">
      <div className="py-fix-xs px-fix-md md:py-fix-md">
        <div className="flex min-h-siz-md">
          <img
            className="my-auto"
            src={`${BASE_PATH}/assets/images/db_logo.svg`}
            alt="Brand Image"
            height={24}
            width={34}
          />
        </div>
      </div>
      <main className="flex flex-col gap-fix-md">
        <div
          id="feature-1"
          className="grid grid-cols-1 md:grid-cols-3 px-res-xs md:px-res-md gap-fix-md"
        >
          <div className="flex flex-col gap-fix-md">
            <h1>Headline</h1>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut.
            </p>
            <div className="grid grid-cols-3 gap-fix-md">
              <button onClick={() => setSelectedTheme("default-theme")}>
                <DBCard
                  className={`h-full min-h-siz-xl${selectedTheme === "default-theme" ? " db-neutral-bg-3" : ""}`}
                  spacing="small"
                  variant="interactive"
                >
                  <span className="m-auto">Theme 1</span>
                </DBCard>
              </button>
              <button onClick={() => setSelectedTheme("theme-2")}>
                <DBCard
                  className={`h-full min-h-siz-xl${selectedTheme === "theme-2" ? " db-neutral-bg-3" : ""}`}
                  spacing="small"
                  variant="interactive"
                >
                  <span className="m-auto">Theme 2</span>
                </DBCard>
              </button>
              <Link className="no-underline" to="/customization">
                <DBCard
                  className="items-center justify-center min-h-siz-xl"
                  spacing="small"
                  variant="interactive"
                >
                  <DBIcon icon="add">Add custom theme</DBIcon>
                </DBCard>
              </Link>
            </div>
          </div>
          <div className="flex col-span-2 md:h-[60vh]">
            <div className="scale-down w-full relative">
              <Demo />
              <Link
                to="/demo"
                className="db-button open-demo absolute bottom-0 right-0 no-underline"
                data-variant="primary"
              >
                {t("openDemo")}
              </Link>
            </div>
          </div>
        </div>
        <div id="feature-2" className="db-neutral-bg-3">
          <div className="flex flex-col gap-fix-md items-center p-res-md">
            <h2>Feature 2</h2>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut.
            </p>
          </div>
        </div>
        <div id="feature-3">
          <div className="flex flex-col gap-fix-md items-center p-res-md">
            <h2>Feature 3</h2>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut.
            </p>
          </div>
        </div>
        <div id="feature-4" className="db-neutral-bg-3">
          <div className="flex flex-col gap-fix-md items-center p-res-md">
            <h2>Feature 4</h2>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut.
            </p>
          </div>
        </div>
        <div id="feature-5">
          <div className="flex flex-col gap-fix-md items-center p-res-md">
            <h2>Feature 5</h2>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut.
            </p>
            <div className="flex gap-fix-md mx-auto">
              <DBButton>CTA1</DBButton>
              <DBButton>CTA2</DBButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
