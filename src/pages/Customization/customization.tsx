import { useTranslation } from "react-i18next";
import ColorSelection from "../../components/Customization/Settings/ColorSelection";
import { TabItemType } from "./data.ts";
import ComponentContainer from "../../components/Customization/Preview/ComponentContainer";
import ColorPalettes from "../../components/Customization/Preview/ColorPalettes";
import DefaultPage from "../../components/DefaultPage";
import { DBDivider, DBInput } from "@db-ui/react-components";
import ActionBar from "../../components/Customization/ActionBar";
import { useThemeBuilderStore } from "../../store";
import SpeakingColors from "../../components/Customization/Preview/SpeakingColors";
import LogoUpload from "../../components/Customization/LogoUpload";
import InteractiveDemo from "../../components/Customization/Preview/InteractiveDemo";
import Scaling from "../../components/Customization/Settings/Scaling";
import Tabs from "../../components/Customization/Tabs";

const tabs: TabItemType[] = [
  {
    text: "demo",
    component: <InteractiveDemo />,
  },
  { text: "components", component: <ComponentContainer /> },
  { text: "colorPalettes", component: <ColorPalettes />, onlyDeveloper: true },
  {
    text: "speakingColors",
    component: <SpeakingColors />,
    onlyDeveloper: true,
  },
];

const Customization = () => {
  const { t } = useTranslation();
  const {  theme } = useThemeBuilderStore((state) => state);

  return (
    <DefaultPage actionBar={<ActionBar />} name={t("customization")}>
      <div className="content flex flex-col md:flex-row md:h-full md:overflow-hidden">
        <div className="flex flex-col p-res-xs w-full md:w-2/5 md:h-full md:overflow-auto border-r gap-fix-xl">
          <div className="flex flex-col gap-fix-md">
            <h5>{t("name")}</h5>
            <DBInput
              variant="floating"
              label={t("themeName")}
              placeholder={t("themeName")}
              value={theme.branding.name}
              onChange={(event) =>
                useThemeBuilderStore.setState({
                  theme: {
                    ...theme,
                    branding: {
                      ...theme.branding,
                      name: event.target.value,
                    },
                  },
                })
              }
            />
          </div>

          <LogoUpload />

          <DBDivider margin="none" />
          <ColorSelection />
          <DBDivider margin="none" />

          <Scaling label="spacing" params={["spacing"]} />

          <Scaling label="sizing" params={["sizing"]} />

          <Scaling label="elevation" params={["elevation"]} />

          <Scaling label="borderHeight" params={["border", "height"]} />

          <Scaling label="borderRadius" params={["border", "radius"]} />
        </div>
        <div
          className="db-neutral-bg-lvl-2 p-fix-sm md:p-res-sm
      flex flex-col gap-res-sm w-full overflow-auto"
        >
          <Tabs tabs={tabs} />
        </div>
      </div>
    </DefaultPage>
  );
};

export default Customization;
