/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useState } from "react";
import { ColorPickerType } from "./data";
import "./index.scss";
import {
  DBButton,
  DBCheckbox,
  DBDivider,
  DBDrawer,
  DBInfotext,
  DBInput,
  DBTag,
  DBTooltip,
} from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import { useThemeBuilderStore } from "../../../../../store";
import { AlternativeColor } from "../../../../../utils/data.ts";

const ColorPicker = ({
  label,
  color,
  setColor,
  onAddColor,
  onDelete,
  customColor,
  isAddColor,
  isOrigin,
  setAlternativeColor,
  setAlternativeCustom,
}: ColorPickerType) => {
  const { t } = useTranslation();
  const [addColor, setAddColor] = useState<string>(color);
  const [open, setOpen] = useState<boolean>();
  const [valid, setValid] = useState<boolean>(true);
  const [colorName, setColorName] = useState<string>(isAddColor ? "" : label);
  const { darkMode, theme, setCustomColors, developerMode } =
    useThemeBuilderStore((state) => state);

  const getAlternativeColor: () => AlternativeColor | undefined =
    useCallback(() => {
      return theme.branding.alternativeColors[label];
    }, [label, theme.branding.alternativeColors]);

  const getColor = useCallback(() => {
    return isOrigin && getAlternativeColor()?.dark === darkMode
      ? getAlternativeColor()?.hex ?? "#ff69b4"
      : color;
  }, [isOrigin, getAlternativeColor, darkMode, color]);

  return (
    <div className="color-picker-container">
      <div className="color-input-container">
        <DBTag emphasis="strong">
          <button
            className="color-tag"
            data-icon={isAddColor ? "plus" : undefined}
            style={{
              // @ts-expect-error
              "--db-current-origin-color": getColor(),
              "--db-current-icon-color": `var(--db-${label.toLowerCase()}-on-contrast-enabled)`,
              "--db-current-color-enabled": `var(--db-${label.toLowerCase()}-on-contrast-enabled)`,
              "--db-current-color-bg-enabled": `var(--db-${label.toLowerCase()}-contrast-high-enabled)`,
              "--db-current-color-contrast-high-hover": `var(--db-${label.toLowerCase()}-contrast-high-hover)`,
              "--db-current-color-contrast-high-pressed": `var(--db-${label.toLowerCase()}-contrast-high-pressed)`,
              "--db-current-color-border": `var(--db-${label.toLowerCase()}-border)`,
            }}
            onClick={() => setOpen(true)}
          >
            {t(label)}
            {!isAddColor && (
              <DBTooltip placement="bottom" className="db-neutral-bg-lvl-1">
                {t("adaptColor")}
              </DBTooltip>
            )}
          </button>
        </DBTag>
        <DBDrawer
          backdrop="weak"
          open={open}
          onClose={() => setOpen(false)}
          drawerHeader={t("editColor", { colorName })}
          withCloseButton
        >
          <div className="flex flex-col gap-fix-sm mt-fix-md">
            <DBInput
              id={`input-${colorName}`}
              label={t("colorName")}
              required
              value={colorName}
              disabled={!customColor}
              customValidity={
                customColor &&
                !!theme.customColors?.[colorName] &&
                label !== colorName
                  ? "invalid"
                  : "no-validation"
              }
              message={
                customColor &&
                !!theme.customColors?.[colorName] &&
                label !== colorName
                  ? t("customColorExists")
                  : undefined
              }
              pattern="[a-zA-Z0-9\-_]+"
              onChange={(event) => {
                setColorName(event.target.value);
                setValid(event.target.validity.valid);
              }}
            />

            <DBInput
              label={t("colorInputPicker")}
              type="color"
              value={isAddColor ? addColor : color}
              onChange={(event) => {
                if (isAddColor) {
                  setAddColor(event.target.value);
                } else if (setColor) {
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
                } else if (setColor) {
                  setColor(event.target.value);
                }
              }}
            />

            {isOrigin &&
              (getAlternativeColor()?.custom ||
                getAlternativeColor()?.hex !== color) && (
                <div className="flex flex-col gap-fix-sm mt-fix-lg">
                  <h6>{t("alternativeBrand")}</h6>
                  {!(
                    getAlternativeColor()?.custom &&
                    getAlternativeColor()?.isValid
                  ) && (
                    <DBInfotext
                      semantic={
                        getAlternativeColor()?.custom &&
                        !getAlternativeColor()?.isValid
                          ? "critical"
                          : "warning"
                      }
                    >
                      {getAlternativeColor()?.custom &&
                      !getAlternativeColor()?.isValid
                        ? t("alternativeBrandCritical")
                        : t("alternativeBrandWarning")}
                    </DBInfotext>
                  )}
                  {developerMode && (
                    <DBCheckbox
                      label={t("alternativeBrandCheckbox")}
                      defaultChecked={getAlternativeColor()?.custom}
                      onChange={(event) => {
                        if (setAlternativeCustom) {
                          setAlternativeCustom(event.target.checked);
                        }
                      }}
                    />
                  )}
                  <DBInput
                    label={t("colorInputPicker")}
                    type="color"
                    value={getAlternativeColor()?.hex}
                    disabled={!getAlternativeColor()?.custom}
                    onChange={(event) => {
                      if (setAlternativeColor) {
                        setAlternativeColor(event.target.value);
                      }
                    }}
                  />
                  <DBInput
                    label={t("colorInputHex")}
                    placeholder={t("colorInputHex")}
                    value={getAlternativeColor()?.hex}
                    disabled={!getAlternativeColor()?.custom}
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
                    icon="bin"
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
                  disabled={
                    colorName.length === 0 || label === colorName || !valid
                  }
                  onClick={() => {
                    if (isAddColor) {
                      setOpen(false);
                      if (onAddColor) {
                        onAddColor(colorName, addColor);
                      }
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
