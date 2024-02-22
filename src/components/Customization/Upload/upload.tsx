import { memo } from "react";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { UploadPropsType } from "./data.ts";

const Upload = memo(({ label, accept, onUpload, size }: UploadPropsType) => {
  const { t } = useTranslation();

  return (
    <label
      className="upload-button relative"
      data-icon="upload"
      data-size={size}
    >
      {t(label)}
      <input
        type="file"
        accept={accept}
        className="absolute w-full h-full"
        onChange={(event) => {
          const files = event.target.files;
          if (files && files.length > 0) {
            const reader = new FileReader();

            reader.addEventListener(
              "load",
              () => {
                onUpload(reader.result as string);
              },
              false,
            );
            reader.readAsDataURL(files[0]);
          }
        }}
      />
    </label>
  );
});

export default Upload;
