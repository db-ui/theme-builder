import type { PropsWithChildren } from "react";
import { useState } from "react";
import ColorPicker from "../ColorPicker";
import "./index.scss";
import { DBButton, DBDivider, DBInput } from "@db-ui/react-components";
import InformationButton from "../InformationButton";
import { useTranslation } from "react-i18next";
import { useThemeBuilderStore } from "../../../../../store";
import { CustomColorMappingType } from "../../../../../utils/data.ts";
import { ColorPickerType } from "../ColorPicker/data.ts";

const CustomColorPicker = ({
  label,
  color,
  setColor,
}: PropsWithChildren<ColorPickerType>) => {
  const { t } = useTranslation();

  const { customColors } = useThemeBuilderStore((state) => state);
  const [colorName, setColorName] = useState<string>(label);

  const setCustomColors = (colorMappingType: CustomColorMappingType) => {
    useThemeBuilderStore.setState({
      customColors: colorMappingType,
    });
  };

  return (
    <div className="custom-color-picker-container">
      <ColorPicker label={label} color={color} setColor={setColor} />
      <InformationButton title={t("editColor", { colorName })}>
        <DBInput
          id={`input-${colorName}`}
          labelVariant="floating"
          label={t("colorName")}
          required
          value={colorName}
          variant={
            customColors[colorName] && label !== colorName
              ? "critical"
              : "adaptive"
          }
          message={
            customColors[colorName] && label !== colorName
              ? t("customColorExists")
              : undefined
          }
          onChange={(event) => setColorName(event.target.value)}
        />
        <DBDivider />
        <div className="ml-auto flex gap-fix-md">
          <DBButton
            icon="delete"
            onClick={() => {
              const copyCustomColors = { ...customColors };
              delete copyCustomColors[label];
              setCustomColors(copyCustomColors);
            }}
          >
            {t("deleteColor")}
          </DBButton>

          <DBButton
            className="ml-auto"
            variant="primary"
            disabled={
              colorName.length === 0 ||
              (!!customColors[colorName] && label !== colorName)
            }
            onClick={() => {
              const newCustomColors: CustomColorMappingType = {};
              Object.keys(customColors).forEach((cName) => {
                if (cName === label) {
                  newCustomColors[colorName] = customColors[cName];
                } else {
                  newCustomColors[cName] = customColors[cName];
                }
              });
              setCustomColors(newCustomColors);
            }}
          >
            {t("changeColor")}
          </DBButton>
        </div>
      </InformationButton>
    </div>
  );
};

export default CustomColorPicker;
