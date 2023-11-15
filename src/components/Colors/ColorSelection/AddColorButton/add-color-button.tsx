import {
  DBButton,
  DBDivider,
  DBDrawer,
  DBInput,
} from "@db-ui/react-components";
import ColorPicker from "../ColorPicker";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CustomColorMappingType } from "../../../../utils/data.ts";
import { useThemeBuilderStore } from "../../../../store";

const AddColorButton = () => {
  const { t } = useTranslation();
  const [addColor, setAddColor] = useState<string>("#ffffff");
  const [colorName, setColorName] = useState<string>("");
  const [open, setOpen] = useState<boolean>();
  const { customColors } = useThemeBuilderStore((state) => state);

  const setCustomColors = (colorMappingType: CustomColorMappingType) => {
    useThemeBuilderStore.setState({
      customColors: colorMappingType,
    });
  };

  return (
    <div className="mx-auto my-fix-md">
      <DBButton icon="add" onClick={() => setOpen(true)}>
        {t("addColor")}
      </DBButton>
      <DBDrawer
        backdrop="weak"
        open={open}
        onClose={() => setOpen(false)}
        slotDrawerHeader={t("addColor")}
        withCloseButton
      >
        <div className="flex flex-col gap-fix-md py-fix-md">
          <DBInput
            id={`input-${colorName}`}
            labelVariant="floating"
            label={t("colorName")}
            required
            value={colorName}
            variant={customColors[colorName] ? "critical" : "adaptive"}
            message={
              customColors[colorName] ? t("customColorExists") : undefined
            }
            onChange={(event) => setColorName(event.target.value)}
          />
          <ColorPicker
            label={t("color")}
            color={addColor}
            setColor={setAddColor}
          />
          <DBDivider />
          <DBButton
            className="ml-auto"
            variant="primary"
            disabled={colorName.length === 0 || !!customColors[colorName]}
            onClick={() => {
              setCustomColors({ ...customColors, [colorName]: addColor });
              setOpen(false);
              setColorName("");
              setAddColor("#ffffff");
            }}
          >
            {t("addColor")}
          </DBButton>
        </div>
      </DBDrawer>
    </div>
  );
};

export default AddColorButton;
