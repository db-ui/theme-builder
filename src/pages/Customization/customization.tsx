import { useTranslation } from "react-i18next";
import { Fragment, useState } from "react";
import ColorSelection from "../../components/Customization/Settings/ColorSelection";
import { TabItemType } from "./data.ts";
import ComponentContainer from "../../components/Customization/Preview/ComponentContainer";
import ColorPalettes from "../../components/Customization/Preview/ColorPalettes";
import DefaultPage from "../../components/DefaultPage";
import { DBButton, DBInput } from "@db-ui/react-components";
import ActionBar from "../../components/Customization/ActionBar";
import { useThemeBuilderStore } from "../../store";
import SpeakingColors from "../../components/Customization/Preview/SpeakingColors";
import HeadlineDivider from "../../components/Customization/HeadlineDivider";
import LogoUpload from "../../components/Customization/LogoUpload";
import InteractiveDemo from "../../components/Customization/Preview/InteractiveDemo";
import Scaling from "../../components/Customization/Settings/Scaling";

const tabs: TabItemType[] = [
  {
    text: "demo",
    component: <InteractiveDemo />,
  },
  { text: "components", component: <ComponentContainer /> },
  { text: "colorPalettes", component: <ColorPalettes /> },
  {
    text: "speakingColors",
    component: <SpeakingColors />,
    onlyDeveloper: true,
  },
];

const Customization = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const { developerMode, defaultTheme } = useThemeBuilderStore(
    (state) => state,
  );

  return (
    <DefaultPage actionBar={<ActionBar />} name={t("customization")}>
      <div className="content flex flex-col md:flex-row md:h-full md:overflow-hidden">
        <div className="flex flex-col p-res-xs w-full md:w-2/5 md:h-full md:overflow-auto border-r gap-fix-md">
          <HeadlineDivider headline="name" />
          <DBInput
            labelVariant="floating"
            label={t("themeName")}
            placeholder={t("themeName")}
            value={defaultTheme.name}
            onChange={(event) =>
              useThemeBuilderStore.setState({
                defaultTheme: { ...defaultTheme, name: event.target.value },
              })
            }
          />
          <HeadlineDivider headline="logo" />
          <LogoUpload />

          <HeadlineDivider headline="colors" />

          <ColorSelection />

          <HeadlineDivider headline="spacing" />
          <Scaling label="spacing" params={["spacing"]} />

          <HeadlineDivider headline="sizing" />
          <Scaling label="sizing" params={["sizing"]} />

          <HeadlineDivider headline="elevation" />
          <Scaling label="elevation" params={["elevation"]} />

          <HeadlineDivider headline="borderHeight" />
          <Scaling label="borderHeight" params={["border", "height"]} />

          <HeadlineDivider headline="borderRadius" />
          <Scaling label="borderRadius" params={["border", "radius"]} />
        </div>
        <div
          className="db-neutral-bg-lvl-2 p-fix-sm md:p-res-sm
      flex flex-col gap-res-sm w-full overflow-auto"
        >
          <div className="flex gap-fix-3xs w-full">
            {tabs
              .filter((tabItem) => developerMode || !tabItem.onlyDeveloper)
              .map((tabItem, index) => (
                <DBButton
                  key={`tab-button-${tabItem.text}`}
                  variant={tab === index ? "outlined" : "text"}
                  onClick={() => setTab(index)}
                >
                  {t(tabItem.text)}
                </DBButton>
              ))}
          </div>

          {tabs.map((tabItem, index) => {
            if (tab !== index) {
              return null;
            }

            return (
              <Fragment key={`tab-${tabItem.text}`}>
                {tabItem.component}
              </Fragment>
            );
          })}
        </div>
      </div>
    </DefaultPage>
  );
};

export default Customization;
