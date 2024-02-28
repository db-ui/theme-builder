import { DBButton } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../../store";
import { downloadTheme } from "../../../utils";
import { useTranslation } from "react-i18next";
import Upload from "../Upload";
import { DefaultThemeType } from "../../../utils/data.ts";

const ActionBar = () => {
  const { t } = useTranslation();
  const {
    resetDefaults,
    luminanceSteps,
    defaultTheme,
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
            const resultAsJson: DefaultThemeType = JSON.parse(resultAsString);
            useThemeBuilderStore.setState({
              defaultTheme: resultAsJson,
            });
          } catch (error: any) {
            useThemeBuilderStore.setState({
              notification: error.message,
            });
            console.error(error);
          }
        }}
      />
      <DBButton
        variant="brand"
        icon="download"
        onClick={() =>
          downloadTheme(speakingNames, luminanceSteps, defaultTheme)
        }
        title={t("exportDesc")}
      >
        {t("export")}
      </DBButton>
    </>
  );
};

export default ActionBar;
