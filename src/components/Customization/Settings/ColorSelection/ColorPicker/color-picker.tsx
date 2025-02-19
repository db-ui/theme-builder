/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useEffect, useState } from "react";
import { ColorPickerType, generateColorsByOrigin } from "./data";
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
import { DefaultColorType, HeisslufType } from "../../../../../utils/data.ts";
import ColorInputs from "../ColorInputs";
import { FALLBACK_COLOR } from "../../../../../constants.ts";
import { getContrast } from "../../../../../utils";
import { getHeissluftColors } from "../../../../../utils/generate-colors.ts";

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
  const [lightHeisluftColors, setLightHeisluftColors] =
    useState<HeisslufType[]>();
  const [darkHeisluftColors, setDarkHeisluftColors] =
    useState<HeisslufType[]>();
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

  useEffect(() => {
    if (color) {
      setLightHeisluftColors(
        getHeissluftColors(
          colorName,
          color.originLightDefault || FALLBACK_COLOR,
          luminanceSteps,
        ),
      );
      setDarkHeisluftColors(
        getHeissluftColors(
          colorName,
          color.originDarkDefault || FALLBACK_COLOR,
          luminanceSteps,
        ),
      );
    }
  }, [colorName, color, luminanceSteps]);

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
                className="db-bg-color-basic-level-1"
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
                const generatedOriginColors = {
                  ...generateColorsByOrigin({ origin: col, darkMode: true }),
                  ...generateColorsByOrigin({ origin: col, darkMode: false }),
                };
                if (isAddColor) {
                  setAddColor(generatedOriginColors);
                } else if (setOriginColor) {
                  setOriginColor(generatedOriginColors);
                }
              }}
            />

            {!isAddColor && (
              <>
                <ColorInputs
                  name="origin-light"
                  color={color.originLightDefault ?? FALLBACK_COLOR}
                  contrastGroups={[
                    {
                      groupName: "Level-1",
                      contrasts: [
                        {
                          name: "Default",
                          value: getContrast(
                            color.originLightDefault,
                            lightHeisluftColors?.at(-1)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Hovered",
                          value: getContrast(
                            color.originLightHovered,
                            lightHeisluftColors?.at(-1)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Pressed",
                          value: getContrast(
                            color.originLightPressed,
                            lightHeisluftColors?.at(-1)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                      ],
                    },
                    {
                      groupName: "Level-2",
                      contrasts: [
                        {
                          name: "Default",
                          value: getContrast(
                            color.originLightDefault,
                            lightHeisluftColors?.at(-2)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Hovered",
                          value: getContrast(
                            color.originLightHovered,
                            lightHeisluftColors?.at(-2)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Pressed",
                          value: getContrast(
                            color.originLightPressed,
                            lightHeisluftColors?.at(-2)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                      ],
                    },
                    {
                      groupName: "Level-3",
                      contrasts: [
                        {
                          name: "Default",
                          value: getContrast(
                            color.originLightDefault,
                            lightHeisluftColors?.at(-3)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Hovered",
                          value: getContrast(
                            color.originLightHovered,
                            lightHeisluftColors?.at(-3)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Pressed",
                          value: getContrast(
                            color.originLightPressed,
                            lightHeisluftColors?.at(-3)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                      ],
                    },
                  ]}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        originLightDefault,
                        originLightAccessible,
                        originLightPressed,
                        originLightHovered,
                      } = generateColorsByOrigin({
                        origin: color.origin,
                        darkMode: false,
                        customBgColor: col,
                      });

                      setOriginColor({
                        ...color,
                        originLightDefault,
                        originLightAccessible,
                        originLightPressed,
                        originLightHovered,
                      });
                    }
                  }}
                />
                <ColorInputs
                  name="on-origin-light"
                  color={color.onOriginLightDefault ?? FALLBACK_COLOR}
                  contrastGroups={[
                    {
                      groupName: "On Origin",
                      contrasts: [
                        {
                          name: "Default",
                          min: 4.5,
                          value: getContrast(
                            color.originLightDefault,
                            color.onOriginLightDefault,
                          ),
                        },
                        {
                          name: "Hovered",
                          min: 4.5,
                          value: getContrast(
                            color.originLightHovered,
                            color.onOriginLightDefault,
                          ),
                        },
                        {
                          name: "Pressed",
                          min: 4.5,
                          value: getContrast(
                            color.originLightPressed,
                            color.onOriginLightDefault,
                          ),
                        },
                      ],
                    },
                  ]}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        onOriginLightDefault,
                        onOriginLightAccessible,
                        onOriginLightHovered,
                        onOriginLightPressed,
                      } = generateColorsByOrigin({
                        origin: color.originLightDefault ?? FALLBACK_COLOR,
                        darkMode: false,
                        customFgColor: col,
                      });
                      setOriginColor({
                        ...color,
                        onOriginLightDefault,
                        onOriginLightHovered,
                        onOriginLightPressed,
                        onOriginLightAccessible,
                      });
                    }
                  }}
                />
                <ColorInputs
                  name="origin-dark"
                  color={color.originDarkDefault ?? FALLBACK_COLOR}
                  contrastGroups={[
                    {
                      groupName: "Level-1",
                      contrasts: [
                        {
                          name: "Default",
                          value: getContrast(
                            color.originDarkDefault,
                            darkHeisluftColors?.at(2)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Hovered",
                          value: getContrast(
                            color.originDarkHovered,
                            darkHeisluftColors?.at(2)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Pressed",
                          value: getContrast(
                            color.originDarkPressed,
                            darkHeisluftColors?.at(2)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                      ],
                    },
                    {
                      groupName: "Level-2",
                      contrasts: [
                        {
                          name: "Default",
                          value: getContrast(
                            color.originDarkDefault,
                            darkHeisluftColors?.at(1)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Hovered",
                          value: getContrast(
                            color.originDarkHovered,
                            darkHeisluftColors?.at(1)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Pressed",
                          value: getContrast(
                            color.originDarkPressed,
                            darkHeisluftColors?.at(1)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                      ],
                    },
                    {
                      groupName: "Level-3",
                      contrasts: [
                        {
                          name: "Default",
                          value: getContrast(
                            color.originDarkDefault,
                            darkHeisluftColors?.at(0)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Hovered",
                          value: getContrast(
                            color.originDarkHovered,
                            darkHeisluftColors?.at(0)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                        {
                          name: "Pressed",
                          value: getContrast(
                            color.originDarkPressed,
                            darkHeisluftColors?.at(0)?.hex ?? FALLBACK_COLOR,
                          ),
                        },
                      ],
                    },
                  ]}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        originDarkDefault,
                        originDarkAccessible,
                        originDarkPressed,
                        originDarkHovered,
                      } = generateColorsByOrigin({
                        origin: color.origin,
                        darkMode: true,
                        customBgColor: col,
                      });

                      setOriginColor({
                        ...color,
                        originDarkDefault,
                        originDarkAccessible,
                        originDarkPressed,
                        originDarkHovered,
                      });
                    }
                  }}
                />
                <ColorInputs
                  name="on-origin-dark"
                  color={color.onOriginDarkDefault ?? FALLBACK_COLOR}
                  contrastGroups={[
                    {
                      groupName: "On Origin",
                      contrasts: [
                        {
                          name: "Default",
                          min: 4.5,
                          value: getContrast(
                            color.originDarkDefault,
                            color.onOriginDarkDefault,
                          ),
                        },
                        {
                          name: "Hovered",
                          min: 4.5,
                          value: getContrast(
                            color.originDarkHovered,
                            color.onOriginDarkDefault,
                          ),
                        },
                        {
                          name: "Pressed",
                          min: 4.5,
                          value: getContrast(
                            color.originDarkPressed,
                            color.onOriginDarkDefault,
                          ),
                        },
                      ],
                    },
                  ]}
                  onColorChange={(col) => {
                    if (setOriginColor) {
                      const {
                        onOriginDarkDefault,
                        onOriginDarkAccessible,
                        onOriginDarkHovered,
                        onOriginDarkPressed,
                      } = generateColorsByOrigin({
                        origin: color.originDarkDefault ?? FALLBACK_COLOR,
                        darkMode: false,
                        customFgColor: col,
                      });
                      setOriginColor({
                        ...color,
                        onOriginDarkDefault: onOriginDarkDefault,
                        onOriginDarkHovered,
                        onOriginDarkPressed,
                        onOriginDarkAccessible,
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
