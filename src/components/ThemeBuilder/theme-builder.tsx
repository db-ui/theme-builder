import { useTranslation } from "react-i18next";
import { ReactElement, useState } from "react";
import ColorSelection from "../Colors/ColorSelection";
import {
  DBAccordion,
  DBAccordionItem,
  DBButton,
} from "@db-ui/react-components";
import ComponentPreview from "../Colors/ComponentPreview";
import ShirtSelection from "./ShirtSelection";
import ColorPalettes from "../Colors/ColorPalettes";
import SpeakingColors from "../Colors/SpeakingColors";

type AccordionItemType = {
  title: string;
  component: ReactElement;
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

const ThemeBuilder = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<number>(0);

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
      flex flex-col gap-res-sm w-full md:h-full md:overflow-auto"
      >
        <div className="flex gap-fix-3xs">
          <DBButton
            variant={tab === 0 ? "outlined" : "text"}
            onClick={() => setTab(0)}
          >
            {t("preview")}
          </DBButton>
          <DBButton
            variant={tab === 1 ? "outlined" : "text"}
            onClick={() => setTab(1)}
          >
            {t("colorPalettes")}
          </DBButton>
          <DBButton
            className="hidden"
            variant={tab === 2 ? "outlined" : "text"}
            onClick={() => setTab(2)}
          >
            {t("speakingColors")}
          </DBButton>
        </div>
        {tab === 0 ? (
          <ComponentPreview />
        ) : tab === 1 ? (
          <ColorPalettes />
        ) : (
          <SpeakingColors />
        )}
      </div>
    </div>
  );
};

export default ThemeBuilder;
