import { useCallback, useState } from "react";
import { ColorPickerType } from "./data";
import "./index.scss";
import { getLuminance } from "../../../../../utils";
import {
  DBButton,
  DBCheckbox,
  DBDivider,
  DBDrawer,
  DBInfotext,
  DBInput,
} from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import { useThemeBuilderStore } from "../../../../../store";

const ColorPicker = ({
  label,
  color,
  setColor,
  onDelete,
  customColor,
  isAddColor,
  isBrand,
  setAlternativeColor,
  setAlternativeCustom,
}: ColorPickerType) => {
  const { t } = useTranslation();
  const [addColor, setAddColor] = useState<string>(color);
  const [open, setOpen] = useState<boolean>();
  const [colorName, setColorName] = useState<string>(isAddColor ? "" : label);
  const { darkMode, theme, setCustomColors } = useThemeBuilderStore(
    (state) => state,
  );

  const getColor = useCallback(() => {
    return isBrand && theme.branding.alternativeColor.dark === darkMode
      ? theme.branding.alternativeColor.hex
      : color;
  }, [
    isBrand,
    theme.branding.alternativeColor.dark,
    theme.branding.alternativeColor.hex,
    darkMode,
    color,
  ]);

  return (
    <div className="color-picker-container">
      <div className="color-input-container">
        <button
          data-icon={isAddColor ? "add" : undefined}
          className="color-tag"
          style={{
            backgroundColor: getColor(),
            color: getLuminance(getColor()) < 0.4 ? "#fff" : "#000",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            "--db-current-icon-color":
              getLuminance(getColor()) < 0.4 ? "#fff" : "#000",
            borderColor: `var(--db-${label.toLowerCase()}-contrast-high)`,
          }}
          onClick={() => setOpen(true)}
          title="Change Color"
        >
          {label}
        </button>
        <DBDrawer
          backdrop="weak"
          open={open}
          onClose={() => setOpen(false)}
          slotDrawerHeader={t("editColor", { colorName })}
          withCloseButton
        >
          <div className="flex flex-col gap-fix-sm mt-fix-md">
            <DBInput
              id={`input-${colorName}`}
              label={t("colorName")}
              required
              value={colorName}
              disabled={!customColor}
              invalid={
                customColor &&
                !!theme.customColors?.[colorName] &&
                label !== colorName
              }
              message={
                customColor &&
                !!theme.customColors?.[colorName] &&
                label !== colorName
                  ? t("customColorExists")
                  : undefined
              }
              onChange={(event) => setColorName(event.target.value)}
            />

            <DBInput
              label={t("colorInputPicker")}
              type="color"
              value={isAddColor ? addColor : color}
              onChange={(event) => {
                if (isAddColor) {
                  setAddColor(event.target.value);
                } else {
                  setColor(event.target.value);
                }
              }}
            />

            <DBInput
              label={t("colorInputHex")}
              placeholder={t("colorInputHex")}
              value={isAddColor ? addColor : color}
              onChange={(event) => {
                if (isAddColor) {
                  setAddColor(event.target.value);
                } else {
                  setColor(event.target.value);
                }
              }}
            />

            {isBrand &&
              (theme.branding.alternativeColor.custom ||
                theme.branding.alternativeColor.hex !== color) && (
                <div className="flex flex-col gap-fix-sm mt-fix-lg">
                  <h6>{t("alternativeBrand")}</h6>
                  {!(
                    theme.branding.alternativeColor.custom &&
                    theme.branding.alternativeColor.isValid
                  ) && (
                    <DBInfotext
                      semantic={
                        theme.branding.alternativeColor.custom &&
                        !theme.branding.alternativeColor.isValid
                          ? "critical"
                          : "warning"
                      }
                    >
                      {theme.branding.alternativeColor.custom &&
                      !theme.branding.alternativeColor.isValid
                        ? t("alternativeBrandCritical")
                        : t("alternativeBrandWarning")}
                    </DBInfotext>
                  )}
                  <DBCheckbox
                    label={t("alternativeBrandCheckbox")}
                    defaultChecked={theme.branding.alternativeColor.custom}
                    onChange={(event) => {
                      if (setAlternativeCustom) {
                        setAlternativeCustom(event.target.checked);
                      }
                    }}
                  />
                  <DBInput
                    label={t("colorInputPicker")}
                    type="color"
                    value={theme.branding.alternativeColor.hex}
                    disabled={!theme.branding.alternativeColor.custom}
                    onChange={(event) => {
                      if (setAlternativeColor) {
                        setAlternativeColor(event.target.value);
                      }
                    }}
                  />
                  <DBInput
                    label={t("colorInputHex")}
                    placeholder={t("colorInputHex")}
                    value={theme.branding.alternativeColor.hex}
                    disabled={!theme.branding.alternativeColor.custom}
                    onChange={(event) => {
                      if (setAlternativeColor) {
                        setAlternativeColor(event.target.value);
                      }
                    }}
                  />
                </div>
              )}
          </div>

          {customColor && (
            <>
              <DBDivider />
              <div className="ml-auto flex gap-fix-md">
                {!isAddColor && (
                  <DBButton
                    icon="delete"
                    onClick={() => {
                      if (onDelete) {
                        onDelete();
                      }
                    }}
                  >
                    {t("deleteColor")}
                  </DBButton>
                )}

                <DBButton
                  className="ml-auto"
                  variant="brand"
                  disabled={colorName.length === 0 || label === colorName}
                  onClick={() => {
                    if (isAddColor) {
                      setCustomColors({
                        ...theme.customColors,
                        [colorName]: addColor,
                      });
                      setOpen(false);
                      setAddColor("#ffffff");
                      setColorName("");
                    } else if (theme.customColors) {
                      const newCustomColors: Record<string, string> = {};
                      Object.keys(theme.customColors).forEach((cName) => {
                        if (cName === label) {
                          newCustomColors[colorName] =
                            theme.customColors?.[cName] || "";
                        } else {
                          newCustomColors[cName] =
                            theme.customColors?.[cName] || "";
                        }
                      });
                      setCustomColors(newCustomColors);
                    }
                  }}
                >
                  {isAddColor ? t("addColor") : t("changeColor")}
                </DBButton>
              </div>
            </>
          )}
        </DBDrawer>
      </div>
    </div>
  );
};

export default ColorPicker;
