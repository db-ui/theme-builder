import { useThemeBuilderStore } from "../../../store";
import { memo } from "react";
import { getThemeImage } from "../../../utils";
import Upload from "../Upload";
import { useTranslation } from "react-i18next";
import { DBDivider, DBInfotext } from "@db-ui/react-components";

const LogoUpload = memo(() => {
  const { t } = useTranslation();
  const { theme } = useThemeBuilderStore((state) => state);

  return (
    <div className="flex flex-col gap-fix-md">
      <h5>{t("logo")}</h5>
      <div className="flex gap-fix-md">
        <div
          className="flex flex-col gap-fix-md p-fix-sm"
          data-color-scheme="light"
        >
          <DBInfotext icon="sun">Light</DBInfotext>
          <img
            className="h-siz-md mx-auto"
            src={getThemeImage(theme.branding.image.light)}
            alt="logo"
          />
          <Upload
            size="small"
            label="uploadLogo"
            accept="image/*"
            onUpload={(result) => {
              useThemeBuilderStore.setState({
                theme: {
                  ...theme,
                  branding: {
                    ...theme.branding,
                    image: {
                      ...theme.branding.image,
                      light: result,
                    },
                  },
                },
              });
            }}
          />
        </div>
        <DBDivider margin="none" variant="vertical" />
        <div
          className="flex flex-col gap-fix-md p-fix-sm"
          data-color-scheme="dark"
        >
          <DBInfotext icon="moon">Dark</DBInfotext>
          <img
            className="h-siz-md mx-auto"
            src={getThemeImage(
              theme.branding.image.dark || theme.branding.image.light,
            )}
            alt="logo"
          />
          <Upload
            size="small"
            label="uploadLogo"
            accept="image/*"
            onUpload={(result) => {
              useThemeBuilderStore.setState({
                theme: {
                  ...theme,
                  branding: {
                    ...theme.branding,
                    image: {
                      ...theme.branding.image,
                      dark: result,
                    },
                  },
                },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default LogoUpload;
