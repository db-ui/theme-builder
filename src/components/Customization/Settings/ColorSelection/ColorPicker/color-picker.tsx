import { useCallback, useState } from "react";
import { ColorPickerType } from "./data";
import "./index.scss";
import { getLuminance } from "../../../../../utils";
import {
  DBButton,
  DBDivider,
  DBDrawer,
  DBInput,
} from "@db-ui/react-components";
import { CustomColorMappingType } from "../../../../../utils/data.ts";
import { useTranslation } from "react-i18next";
import { useThemeBuilderStore } from "../../../../../store";

const ColorPicker = ({
  label,
  color,
  setColor,
  onDelete,
  customColor,
  isAddColor,
  darkColor,
  setDarkColor,
}: ColorPickerType) => {
  const { t } = useTranslation();
  const [addColor, setAddColor] = useState<string>(color);
  const [open, setOpen] = useState<boolean>();
  const [colorName, setColorName] = useState<string>(isAddColor ? "" : label);
  const { customColors, darkMode } = useThemeBuilderStore((state) => state);

  const setCustomColors = (colorMappingType: CustomColorMappingType) => {
    useThemeBuilderStore.setState({
      customColors: colorMappingType,
    });
  };

  const getColor = useCallback(() => {
    return darkColor && darkMode ? darkColor : color;
  }, [darkMode, darkColor, color]);

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
                customColor && !!customColors[colorName] && label !== colorName
              }
              message={
                customColor && customColors[colorName] && label !== colorName
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

            {darkColor && (
              <div className="flex flex-col gap-fix-sm mt-fix-lg">
                <h6>{t("alternativeDarkBrand")}</h6>
                <DBInput
                  label={t("colorInputPicker")}
                  type="color"
                  value={darkColor}
                  onChange={(event) => {
                    if (setDarkColor) {
                      setDarkColor(event.target.value);
                    }
                  }}
                />
                <DBInput
                  label={t("colorInputHex")}
                  placeholder={t("colorInputHex")}
                  value={darkColor}
                  onChange={(event) => {
                    if (setDarkColor) {
                      setDarkColor(event.target.value);
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
                        ...customColors,
                        [colorName]: addColor,
                      });
                      setOpen(false);
                      setAddColor("#ffffff");
                      setColorName("");
                    } else {
                      const newCustomColors: CustomColorMappingType = {};
                      Object.keys(customColors).forEach((cName) => {
                        if (cName === label) {
                          newCustomColors[colorName] = customColors[cName];
                        } else {
                          newCustomColors[cName] = customColors[cName];
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
