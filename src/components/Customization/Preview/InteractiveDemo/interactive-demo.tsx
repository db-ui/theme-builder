import { memo, useState } from "react";
import Demo from "../../../../pages/Demo";
import { DBSelect } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";

const InteractiveDemo = memo(() => {
  const { t } = useTranslation();
  const [density, setDensity] = useState<string>("regular");

  return (
    <div className="flex-col flex w-full h-full gap-fix-md p-fix-sm overflow-hidden">
      <div className="flex gap-fix-md">
        <DBSelect
          label={t("density")}
          variant="floating"
          value={density}
          onChange={(event) => setDensity(event.target.value)}
        >
          <option value="functional">functional</option>
          <option value="regular">regular</option>
          <option value="expressive">expressive</option>
        </DBSelect>
      </div>
      <div className="scale-down w-full h-full">
        <Demo linkToDemo density={density} />
      </div>
    </div>
  );
});

export default InteractiveDemo;
