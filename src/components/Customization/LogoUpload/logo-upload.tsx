import { useThemeBuilderStore } from "../../../store";
import { memo } from "react";
import "./index.scss";
import { getThemeImage } from "../../../utils";
import { useTranslation } from "react-i18next";

const LogoUpload = memo(() => {
  const { defaultTheme } = useThemeBuilderStore((state) => state);
  const { t } = useTranslation();

  return (
    <div className="flex gap-fix-md justify-between">
      <img
        src={getThemeImage(defaultTheme.image)}
        alt="logo"
        height="24"
        width="34"
      />
      <label className="upload-button relative" data-icon="upload">
        {t("uploadLogo")}
        <input
          type="file"
          accept="image/*"
          className="absolute w-full h-full"
          onChange={(event) => {
            const files = event.target.files;
            if (files && files.length > 0) {
              const reader = new FileReader();

              reader.addEventListener(
                "load",
                () => {
                  useThemeBuilderStore.setState({
                    defaultTheme: {
                      ...defaultTheme,
                      image: reader.result as string,
                    },
                  });
                },
                false,
              );
              reader.readAsDataURL(files[0]);
            }
          }}
        />
      </label>
    </div>
  );
});

export default LogoUpload;
