import { memo } from "react";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { UploadPropsType } from "./data.ts";
import { DBButtonProps } from "@db-ux/react-core-components/dist/components/button/model";
import { DBTooltip } from "@db-ux/react-core-components";

const Upload = memo(
  ({
    label,
    accept,
    onUpload,
    size,
    variant,
    noText,
    tooltip,
  }: UploadPropsType & DBButtonProps) => {
    const { t } = useTranslation();

    return (
      <label
        className="upload-button relative"
        data-icon="upload"
        data-size={size}
        data-variant={variant}
        data-no-text={noText}
      >
        {t(label)}
        <input
          type="file"
          accept={accept}
          className="absolute w-full h-full"
          title=""
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
        {tooltip && <DBTooltip placement="bottom">{t(tooltip)}</DBTooltip>}
      </label>
    );
  },
);

export default Upload;
