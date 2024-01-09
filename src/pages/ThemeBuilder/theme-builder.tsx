import { useTranslation } from "react-i18next";
import { Fragment, ReactElement, useState } from "react";
import {
  DBAccordion,
  DBAccordionItem,
  DBButton,
} from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../store";
import ColorSelection from "../../components/Colors/ColorSelection";
import ShirtSelection from "../../components/ShirtSelection";
import ColorPalettes from "../../components/Colors/ColorPalettes";
import ScreenContainer from "../../components/ScreenContainer";
import ComponentContainer from "../../components/ComponentContainer";
import SpeakingColors from "../../components/Colors/SpeakingColors";

type AccordionItemType = {
  title: string;
  component: ReactElement;
};

type TabItemType = {
  text: string;
  component: ReactElement;
  onlyDeveloper?: boolean;
};

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

const ThemeBuilder = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const { developerMode } = useThemeBuilderStore((state) => state);

  return (
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
        className="db-bg-neutral p-fix-sm md:p-res-sm
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
            <Fragment key={`tab-${tabItem.text}`}>{tabItem.component}</Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeBuilder;
