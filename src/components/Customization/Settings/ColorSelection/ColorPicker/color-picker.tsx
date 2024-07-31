/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useState } from "react";
import {
  ColorPickerType,
  generateColorsByOrigin,
  getOriginOnColors,
} from "./data";
import "./index.scss";
import {
  DBButton,
  DBDivider,
  DBDrawer,
  DBInput,
  DBTag,
  DBTooltip,
} from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import { useThemeBuilderStore } from "../../../../../store";
import { DefaultColorType } from "../../../../../utils/data.ts";
import ColorInputs from "../ColorInputs";
import { FALLBACK_COLOR } from "../../../../../constants.ts";
import { getContrast } from "../../../../../utils";

const ColorPicker = ({
  label,
  color,
  setOriginColor,
  onAddColor,
  onDelete,
  isAddColor,
  customColor,
}: ColorPickerType) => {
  const { t } = useTranslation();
  const [addColor, setAddColor] = useState<DefaultColorType>(color);
  const [open, setOpen] = useState<boolean>();
  const [valid, setValid] = useState<boolean>(true);
  const [colorName, setColorName] = useState<string>(isAddColor ? "" : label);
  const { theme, setCustomColors, luminanceSteps } = useThemeBuilderStore(
    (state) => state,
  );

  const getOriginColor = useCallback(
    () => (isAddColor ? addColor : color).origin,
    [isAddColor, addColor, color],
  );

  return (
    <div className="color-picker-container">
      <div className="color-input-container">
        <DBTag>
          <button
            className="color-tag"
            data-icon={isAddColor ? "plus" : undefined}
            data-icon-after={
              isAddColor ||
              (color.onOriginLightAccessible &&
                color.onOriginDarkAccessible &&
                color.originDarkAccessible &&
                color.originLightAccessible)
                ? undefined
                : "warning_triangle"
            }
            style={
              isAddColor
                ? {}
                : {
                    // @ts-expect-error
                    "--db-current-origin-color": color.origin,
                    "--db-current-icon-color": `var(--db-${label.toLowerCase()}-on-bg-inverted-contrast-high-default)`,
                    "--db-current-color-enabled": `var(--db-${label.toLowerCase()}-on-bg-inverted-contrast-high-default)`,
                    "--db-current-color-bg-enabled": `var(--db-${label.toLowerCase()}-bg-inverted-contrast-high-default)`,
                    "--db-current-color-contrast-high-hover": `var(--db-${label.toLowerCase()}-bg-inverted-contrast-high-80-hovered)`,
                    "--db-current-color-contrast-high-pressed": `var(--db-${label.toLowerCase()}-bg-inverted-contrast-high-80-pressed)`,
                    "--db-current-color-border": `var(--db-${label.toLowerCase()}-on-bg-basic-emphasis-60-default)`,
                  }
            }
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
          <div className="flex flex-col gap-fix-sm mt-fix-md overflow-y-auto">
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

            <ColorInputs
              name="origin"
              color={getOriginColor()}
              onColorChange={(col) => {
                if (isAddColor) {
                  setAddColor(
                    generateColorsByOrigin(colorName, col, luminanceSteps),
                  );
                } else if (setOriginColor) {
                  setOriginColor(
                    generateColorsByOrigin(colorName, col, luminanceSteps),
                  );
                }
              }}
            />

            {!isAddColor && (
              <>
                <ColorInputs
                  name="origin-light"
                  color={color.originLight ?? FALLBACK_COLOR}
                  alternative={
                    color.originLightAccessible
                      ? undefined
                      : color.originLightAlternative
                  }
                  error={
                    color.originLightAccessible
                      ? undefined
                      : "accessibilityCritical"
                  }
                  contrast={getContrast(color.originLight, color.originBgLight)}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        originLight,
                        originLightAccessible,
                        originLightPressed,
                        originLightHovered,
                        onOriginLight,
                        onOriginLightHovered,
                        onOriginLightPressed,
                        onOriginLightAccessible,
                        onOriginLightAlternative,
                        originLightAlternative,
                      } = generateColorsByOrigin(
                        colorName,
                        color.origin,
                        luminanceSteps,
                        col,
                      );

                      setOriginColor({
                        ...color,
                        originLight,
                        originLightAccessible,
                        originLightAlternative,
                        originLightPressed,
                        originLightHovered,
                        onOriginLight,
                        onOriginLightHovered,
                        onOriginLightPressed,
                        onOriginLightAccessible,
                        onOriginLightAlternative,
                      });
                    }
                  }}
                />
                <ColorInputs
                  name="on-origin-light"
                  color={color.onOriginLight ?? FALLBACK_COLOR}
                  alternative={
                    color.onOriginLightAccessible
                      ? undefined
                      : color.onOriginLightAlternative
                  }
                  error={
                    color.onOriginLightAccessible
                      ? undefined
                      : "accessibilityCritical"
                  }
                  contrastMin={4.5}
                  contrast={getContrast(color.originLight, color.onOriginLight)}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        onOrigin: onOriginLight,
                        onOriginAccessible: onOriginLightAccessible,
                        onOriginAlternative: onOriginLightAlternative,
                        hoverColor: onOriginLightHover,
                        pressedColor: onOriginLightPressed,
                      } = getOriginOnColors(
                        color.originLight ?? FALLBACK_COLOR,
                        false,
                        col,
                      );
                      setOriginColor({
                        ...color,
                        onOriginLight,
                        onOriginLightHovered: onOriginLightHover,
                        onOriginLightPressed,
                        onOriginLightAccessible,
                        onOriginLightAlternative,
                      });
                    }
                  }}
                />
                <ColorInputs
                  name="origin-dark"
                  color={color.originDark ?? FALLBACK_COLOR}
                  alternative={
                    color.originDarkAccessible
                      ? undefined
                      : color.originDarkAlternative
                  }
                  error={
                    color.originDarkAccessible
                      ? undefined
                      : "accessibilityCritical"
                  }
                  contrast={getContrast(color.originDark, color.originBgDark)}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        originDark,
                        originDarkAccessible,
                        originDarkAlternative,
                        originDarkPressed,
                        originDarkHovered,
                        onOriginDark,
                        onOriginDarkHovered,
                        onOriginDarkPressed,
                        onOriginDarkAccessible,
                        onOriginDarkAlternative,
                      } = generateColorsByOrigin(
                        colorName,
                        color.origin,
                        luminanceSteps,
                        col,
                      );

                      setOriginColor({
                        ...color,
                        originDark,
                        originDarkAccessible,
                        originDarkAlternative,
                        originDarkPressed,
                        originDarkHovered,
                        onOriginDark,
                        onOriginDarkHovered,
                        onOriginDarkPressed,
                        onOriginDarkAccessible,
                        onOriginDarkAlternative,
                      });
                    }
                  }}
                />
                <ColorInputs
                  name="on-origin-dark"
                  contrastMin={4.5}
                  color={color.onOriginDark ?? FALLBACK_COLOR}
                  alternative={
                    color.onOriginDarkAccessible
                      ? undefined
                      : color.onOriginDarkAlternative
                  }
                  error={
                    color.onOriginDarkAccessible
                      ? undefined
                      : "accessibilityCritical"
                  }
                  contrast={getContrast(color.originDark, color.onOriginDark)}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        onOrigin: onOriginDark,
                        onOriginAccessible: onOriginDarkAccessible,
                        onOriginAlternative: onOriginDarkAlternative,
                        hoverColor: onOriginDarkHover,
                        pressedColor: onOriginDarkPressed,
                      } = getOriginOnColors(
                        color.originDark ?? FALLBACK_COLOR,
                        true,
                        col,
                      );
                      setOriginColor({
                        ...color,
                        onOriginDark,
                        onOriginDarkHovered: onOriginDarkHover,
                        onOriginDarkPressed,
                        onOriginDarkAccessible,
                        onOriginDarkAlternative,
                      });
                    }
                  }}
                />
              </>
            )}

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
                        setAddColor({ origin: "#ffffff" });
                        setColorName("");
                      } else if (theme.customColors) {
                        const newCustomColors: Record<
                          string,
                          DefaultColorType
                        > = {};
                        Object.keys(theme.customColors).forEach((cName) => {
                          if (theme.customColors?.[cName]) {
                            if (cName === label) {
                              newCustomColors[colorName] =
                                theme.customColors?.[cName];
                            } else {
                              newCustomColors[cName] =
                                theme.customColors?.[cName];
                            }
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
          </div>
        </DBDrawer>
      </div>
    </div>
  );
};

export default ColorPicker;
