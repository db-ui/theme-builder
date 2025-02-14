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
} from "@db-ux/react-core-components";
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
  const getWarningIcon = useCallback(() => {
    if (isAddColor) {
      return undefined;
    } else if (!color.originDarkAccessible || !color.originLightAccessible) {
      return "exclamation_mark_triangle";
    } else if (
      !color.onOriginDarkAccessible ||
      !color.onOriginLightAccessible
    ) {
      return "exclamation_mark_circle";
    } else {
      return undefined;
    }
  }, [isAddColor, color]);

  return (
    <div className="color-picker-container">
      <div className="color-input-container">
        <DBTag>
          <button
            className="color-tag"
            data-icon={isAddColor ? "plus" : undefined}
            data-icon-after={getWarningIcon()}
            style={
              isAddColor
                ? {}
                : {
                    // @ts-expect-error
                    "--db-current-origin-color": color.origin,
                    "--db-adaptive-bg-basic-level-3-default": `var(--db-${label.toLowerCase()}-bg-basic-level-3-default)`,
                    "--db-adaptive-bg-basic-level-3-hovered": `var(--db-${label.toLowerCase()}-bg-basic-level-3-hovered)`,
                    "--db-adaptive-bg-basic-level-3-pressed": `var(--db-${label.toLowerCase()}-bg-basic-level-3-pressed)`,
                    "--db-adaptive-on-bg-basic-emphasis-60-default": `var(--db-${label.toLowerCase()}-on-bg-basic-emphasis-60-default)`,
                  }
            }
            onClick={() => setOpen(true)}
          >
            {t(label)}
            {!isAddColor && (
              <DBTooltip
                placement="bottom"
                className="db-neutral-bg-basic-level-1"
              >
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
        >
          <div className="flex flex-col gap-fix-sm mt-fix-md overflow-y-auto">
            <DBInput
              id={`input-${colorName}`}
              label={t("colorName")}
              required
              value={colorName}
              disabled={!customColor}
              validation={
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
                  color={color.originLightDefault ?? FALLBACK_COLOR}
                  alternative={
                    color.originLightAccessible
                      ? undefined
                      : color.originLightAlternative
                  }
                  error={
                    color.originLightAccessible
                      ? undefined
                      : "accessibilityCriticalBgColor"
                  }
                  contrasts={[
                    {
                      value: getContrast(
                        color.originLightDefault,
                        color.originHSLBgLight,
                      ),
                    },
                  ]}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        originLightDefault,
                        originLightAccessible,
                        originLightPressed,
                        originLightHovered,
                        onOriginLightDefault,
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
                        originLightDefault,
                        originLightAccessible,
                        originLightAlternative,
                        originLightPressed,
                        originLightHovered,
                        onOriginLightDefault,
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
                  color={color.onOriginLightDefault ?? FALLBACK_COLOR}
                  alternative={
                    color.onOriginLightAccessible ||
                    color.onOriginLightAlternative === "#ffffff" ||
                    color.onOriginLightAlternative === "#000000"
                      ? undefined
                      : color.onOriginLightAlternative
                  }
                  error={
                    color.onOriginLightAccessible
                      ? undefined
                      : "accessibilityCriticalOnColor"
                  }
                  contrasts={[
                    {
                      name: "On Default",
                      min: 4.5,
                      value: getContrast(
                        color.originLightDefault,
                        color.onOriginLightDefault,
                      ),
                    },
                    {
                      name: "On Hovered",
                      min: 4.5,
                      value: getContrast(
                        color.originLightHovered,
                        color.onOriginLightDefault,
                      ),
                    },
                    {
                      name: "On Pressed",
                      min: 4.5,
                      value: getContrast(
                        color.originLightPressed,
                        color.onOriginLightDefault,
                      ),
                    },
                  ]}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        onOrigin: onOriginLightDefault,
                        onOriginAccessible: onOriginLightAccessible,
                        onOriginAlternative: onOriginLightAlternative,
                        hoverColor: onOriginLightHovered,
                        pressedColor: onOriginLightPressed,
                      } = getOriginOnColors(
                        color.originLightDefault ?? FALLBACK_COLOR,
                        color.originLightPressed ?? FALLBACK_COLOR,
                        false,
                        col,
                      );
                      setOriginColor({
                        ...color,
                        onOriginLightDefault,
                        onOriginLightHovered,
                        onOriginLightPressed,
                        onOriginLightAccessible,
                        onOriginLightAlternative,
                      });
                    }
                  }}
                />
                <ColorInputs
                  name="origin-dark"
                  color={color.originDarkDefault ?? FALLBACK_COLOR}
                  alternative={
                    color.originDarkAccessible
                      ? undefined
                      : color.originDarkAlternative
                  }
                  error={
                    color.originDarkAccessible
                      ? undefined
                      : "accessibilityCriticalBgColor"
                  }
                  contrasts={[
                    {
                      value: getContrast(
                        color.originDarkDefault,
                        color.originHSLBgDark,
                      ),
                    },
                  ]}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        originDarkDefault,
                        originDarkAccessible,
                        originDarkAlternative,
                        originDarkPressed,
                        originDarkHovered,
                        onOriginDarkDefault,
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
                        originDarkDefault,
                        originDarkAccessible,
                        originDarkAlternative,
                        originDarkPressed,
                        originDarkHovered,
                        onOriginDarkDefault,
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
                  color={color.onOriginDarkDefault ?? FALLBACK_COLOR}
                  alternative={
                    color.onOriginDarkAccessible ||
                    color.onOriginDarkAlternative === "#ffffff" ||
                    color.onOriginDarkAlternative === "#000000"
                      ? undefined
                      : color.onOriginDarkAlternative
                  }
                  error={
                    color.onOriginDarkAccessible
                      ? undefined
                      : "accessibilityCriticalOnColor"
                  }
                  contrasts={[
                    {
                      name: "On Default",
                      min: 4.5,
                      value: getContrast(
                        color.originDarkDefault,
                        color.onOriginDarkDefault,
                      ),
                    },
                    {
                      name: "On Hovered",
                      min: 4.5,
                      value: getContrast(
                        color.originDarkHovered,
                        color.onOriginDarkDefault,
                      ),
                    },
                    {
                      name: "On Pressed",
                      min: 4.5,
                      value: getContrast(
                        color.originDarkPressed,
                        color.onOriginDarkDefault,
                      ),
                    },
                  ]}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        onOrigin: onOriginDarkDefault,
                        onOriginAccessible: onOriginDarkAccessible,
                        onOriginAlternative: onOriginDarkAlternative,
                        hoverColor: onOriginDarkHovered,
                        pressedColor: onOriginDarkPressed,
                      } = getOriginOnColors(
                        color.originDarkDefault ?? FALLBACK_COLOR,
                        color.originDarkPressed ?? FALLBACK_COLOR,
                        true,
                        col,
                      );
                      setOriginColor({
                        ...color,
                        onOriginDarkDefault: onOriginDarkDefault,
                        onOriginDarkHovered,
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
