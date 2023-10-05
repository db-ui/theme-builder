import ColorSelection from "./ColorSelection";
import ComponentPreview from "./ComponentPreview";
import ColorTable from "./ColorTable";
import { useState } from "react";
import { DBButton } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";

const Colors = () => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<boolean>(true);

  return (
    <div className="content flex flex-col m:flex-row m:h-full m:overflow-hidden">
      <ColorSelection />
      <div
        className="db-bg-neutral-transparent-semi p-res-sm
      flex flex-col gap-res-sm w-full m:h-full m:overflow-auto"
      >
        <div className="flex gap-fix-3xs">
          <DBButton
            variant={preview ? "outlined" : "text"}
            onClick={() => setPreview(true)}
          >
            {t("preview")}
          </DBButton>
          <DBButton
            variant={!preview ? "outlined" : "text"}
            onClick={() => setPreview(false)}
          >
            {t("colors")}
          </DBButton>
        </div>
        {preview ? <ComponentPreview /> : <ColorTable />}
      </div>
    </div>
  );
};
export default Colors;
