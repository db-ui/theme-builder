import {
  DBButton,
  DBDivider,
  DBInfotext,
  DBInput,
} from "@db-ui/react-components";
import { ColorInputsType } from "./data.ts";
import { useTranslation } from "react-i18next";

const ColorInputs = ({
  name,
  color,
  onColorChange,
  error,
  alternative,
  contrast,
  contrastMin,
}: ColorInputsType) => {
  const { t } = useTranslation();
  return (
    <>
      <DBDivider />
      <p className="font-bold">{name}</p>
      {contrast && (
        <DBInfotext
          semantic={contrast < (contrastMin ?? 3) ? "critical" : "successful"}
          size="small"
        >
          {contrast.toFixed(2)}:1
        </DBInfotext>
      )}
      <div className="grid grid-cols-2 gap-fix-md">
        <DBInput
          label={t("colorInputPicker")}
          type="color"
          value={color}
          onChange={(event) => {
            onColorChange(event.target.value);
          }}
        />

        <DBInput
          label={t("colorInputHex")}
          placeholder={t("colorInputHex")}
          value={color}
          onChange={(event) => {
            onColorChange(event.target.value);
          }}
        />
      </div>
      {error && <DBInfotext semantic="warning">{t(error)}</DBInfotext>}
      {alternative && (
        <div className="grid grid-cols-2 gap-fix-md">
          <div
            className="w-full h-full text-[0]"
            style={{ backgroundColor: alternative }}
          >
            {alternative}
          </div>
          <DBButton
            onClick={() => {
              onColorChange(alternative);
            }}
          >
            {t("overwrite")}
          </DBButton>
        </div>
      )}
    </>
  );
};

export default ColorInputs;
