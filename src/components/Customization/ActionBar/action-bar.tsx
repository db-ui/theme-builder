import { DBButton } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../../store";
import { downloadTheme } from "../../../utils";
import { useTranslation } from "react-i18next";
import Upload from "../Upload";
import { ThemeType } from "../../../utils/data.ts";

const ActionBar = () => {
  const { t } = useTranslation();
  const {
    resetDefaults,
    luminanceSteps,
    theme,
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
            const resultAsJson: ThemeType = JSON.parse(resultAsString);
            useThemeBuilderStore.setState({
              theme: resultAsJson,
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
          downloadTheme(speakingNames, luminanceSteps, theme)
        }
        title={t("exportDesc")}
      >
        {t("export")}
      </DBButton>
    </>
  );
};

export default ActionBar;
