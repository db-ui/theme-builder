import { useTranslation } from "react-i18next";
import { Fragment, useState } from "react";
import ShirtSelection from "../../components/Customization/Settings/ShirtSelection";
import ColorSelection from "../../components/Customization/Settings/ColorSelection";
import { AccordionItemType, TabItemType } from "./data.ts";
import ScreenContainer from "../../components/Customization/Preview/ScreenContainer";
import ComponentContainer from "../../components/Customization/Preview/ComponentContainer";
import ColorPalettes from "../../components/Customization/Preview/ColorPalettes";
import DefaultPage from "../../components/DefaultPage";
import {
  DBAccordion,
  DBAccordionItem,
  DBButton,
} from "@db-ui/react-components";
import ActionBar from "../../components/Customization/ActionBar";
import { useThemeBuilderStore } from "../../store";
import SpeakingColors from "../../components/Customization/Settings/SpeakingColors";

const accordion: AccordionItemType[] = [
  { title: "colors", component: <ColorSelection /> },
  {
    title: "elevation",
    component: (
      <ShirtSelection
        label="elevation"
        params={["elevation"]}
        shirtSizes={["sm", "md", "lg"]}
        isTextArea
      />
    ),
  },
  {
    title: "borderRadius",
    component: (
      <ShirtSelection
        label="borderRadius"
        params={["border", "radius"]}
        shirtSizes={["sm", "md", "lg", "3xl"]}
      />
    ),
  },
];

const tabs: TabItemType[] = [
  { text: "preview", component: <ScreenContainer /> },
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
  const { developerMode } = useThemeBuilderStore((state) => state);

  return (
    <DefaultPage actionBar={<ActionBar />} name={t("customization")}>
      <div className="content flex flex-col md:flex-row md:h-full md:overflow-hidden">
        <div className="flex flex-col p-res-xs w-full md:w-2/5 md:h-full md:overflow-auto">
          <h2 className="mb-fix-sm" data-variant="light">
            {t("createThemeHeadline")}
          </h2>
          <DBAccordion behaviour="single" initOpenIndex={[0]}>
            {accordion.map((item, index) => (
              <DBAccordionItem
                key={`${item.title}-${index}`}
                title={t(item.title)}
              >
                {item.component}
              </DBAccordionItem>
            ))}
          </DBAccordion>
        </div>
        <div
          className="db-neutral-bg-2 p-fix-sm md:p-res-sm
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
