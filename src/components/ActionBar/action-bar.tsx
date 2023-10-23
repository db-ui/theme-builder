import { DBButton } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../store";
import { downloadTheme } from "../../utils";
import { useTranslation } from "react-i18next";

const ActionBar = () => {
  const { t } = useTranslation();
  const { defaultColors, resetDefaultColors, defaultTheme } =
    useThemeBuilderStore((state) => state);

  return (
    <>
      <DBButton
        icon="undo"
        onClick={() => resetDefaultColors()}
        title={t("resetDesc")}
      >
        {t("reset")}
      </DBButton>
      <DBButton
        variant="primary"
        icon="download"
        onClick={() => downloadTheme(defaultTheme, defaultColors)}
        title={t("downloadDesc")}
      >
        {t("download")}
      </DBButton>
    </>
  );
};

export default ActionBar;
