import { useThemeBuilderStore } from "../../../store";
import { memo } from "react";
import "./index.scss";
import { getThemeImage } from "../../../utils";
import Upload from "../Upload";
import { useTranslation } from "react-i18next";

const LogoUpload = memo(() => {
  const { t } = useTranslation();
  const { defaultTheme } = useThemeBuilderStore((state) => state);

  return (
    <div className="flex flex-col gap-fix-md">
      <h5>{t("logo")}</h5>
      <div className="flex gap-fix-md justify-between">
        <img
          className="logo"
          src={getThemeImage(defaultTheme.image)}
          alt="logo"
        />
        <Upload
          label="uploadLogo"
          accept="image/*"
          onUpload={(result) => {
            useThemeBuilderStore.setState({
              defaultTheme: {
                ...defaultTheme,
                image: result,
              },
            });
          }}
        />
      </div>
    </div>
  );
});

export default LogoUpload;
