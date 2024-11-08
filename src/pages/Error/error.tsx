import { useTranslation } from "react-i18next";
import { useThemeBuilderStore } from "../../store";
import { DBButton, DBInfotext } from "@db-ui/react-components";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const { t } = useTranslation();
  const { resetDefaults } = useThemeBuilderStore((state) => state);
  const navigate = useNavigate();

  return (
    <div className="w-[100vw] h-[100vh] flex">
      <div className="m-auto flex flex-col gap-fix-md">
        <DBInfotext semantic="critical" icon="quiet_zone">
          {t("errorMessage")}
        </DBInfotext>
        <DBButton
          className="mx-auto"
          size="small"
          icon="undo"
          onClick={() => {
            resetDefaults();
            navigate(0);
          }}
        >
          {t("reset")}
        </DBButton>
      </div>
    </div>
  );
};

export default Error;
