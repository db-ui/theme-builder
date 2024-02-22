import { DBButton } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../../store";
import { downloadTheme } from "../../../utils";
import { useTranslation } from "react-i18next";
import Upload from "../Upload";

const ActionBar = () => {
  const { t } = useTranslation();
  const {
    defaultColors,
    resetDefaults,
    luminanceSteps,
    defaultTheme,
    customColors,
    speakingNames,
    developerMode,
  } = useThemeBuilderStore((state) => state);

  return (
    <>
      {developerMode && (
        <DBButton
          icon="undo"
          onClick={() => resetDefaults()}
          title={t("resetDesc")}
        >
          {t("reset")}
        </DBButton>
      )}
      <Upload
        label="import"
        accept="application/JSON"
        onUpload={(result) => {
          try {
            const resultAsString = atob(result.split("base64,")[1]);
            const resultAsJson = JSON.parse(resultAsString);
            useThemeBuilderStore.setState({
              defaultTheme: resultAsJson
            });
          } catch (error) {
            console.error(error);
          }
        }}
      />
      <DBButton
        variant="brand"
        icon="download"
        onClick={() =>
          downloadTheme(
            speakingNames,
            luminanceSteps,
            defaultTheme,
            defaultColors,
            customColors,
          )
        }
        title={t("exportDesc")}
      >
        {t("export")}
      </DBButton>
    </>
  );
};

export default ActionBar;
