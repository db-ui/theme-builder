import ColorPicker from "./ColorPicker";
import { useThemeBuilderStore } from "../../../../store";
import {
  CustomColorMappingType,
  DefaultColorMappingType,
  HeisslufType,
} from "../../../../utils/data.ts";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getHeissluftColors,
  getReverseColorAsHex,
} from "../../../../utils/generate-colors.ts";
import chroma from "chroma-js";

const ColorSelection = () => {
  const { t } = useTranslation();
  const [customColorArray, setCustomColorArray] = useState<string[]>([]);
  const [neutralColors, setNeutralColors] = useState<HeisslufType[]>();
  const [isAlternativeValid, setIsAlternativeValid] = useState<boolean>();

  const { defaultColors, customColors, luminanceSteps, defaultTheme } =
    useThemeBuilderStore((state) => state);

  const setCustomColors = (colorMappingType: CustomColorMappingType) => {
    useThemeBuilderStore.setState({
      customColors: colorMappingType,
    });
  };

  useEffect(() => {
    if (customColors) {
      const colorKeys = Object.keys(customColors);
      if (colorKeys.length > 0) {
        setCustomColorArray(colorKeys);
      } else {
        setCustomColorArray([]);
      }
    }
  }, [customColors]);

  const setDefaultColors = useCallback(
    (colorMappingType: DefaultColorMappingType) => {
      useThemeBuilderStore.setState({
        defaultColors: colorMappingType,
      });
    },
    [],
  );

  useEffect(() => {
    setNeutralColors(
      getHeissluftColors("neutral", defaultColors.neutral, luminanceSteps),
    );
  }, [defaultColors.neutral, luminanceSteps]);

  const setBrandColor = useCallback(
    (hex: string, dark: boolean) => {
      useThemeBuilderStore.setState({
        defaultTheme: {
          ...defaultTheme,
          branding: {
            ...defaultTheme.branding,
            alternativeColor: {
              ...defaultTheme.branding.alternativeColor,
              hex,
              dark,
            },
          },
        },
      });
    },
    [defaultTheme],
  );

  useEffect(() => {
    if (neutralColors) {
      setIsAlternativeValid(
        chroma.contrast(
          chroma.hex(defaultTheme.branding.alternativeColor.hex),
          chroma.hex(
            neutralColors.at(
              defaultTheme.branding.alternativeColor.dark ? -1 : 0,
            )?.hex || "hotpink",
          ),
        ) < 3,
      );
    }
  }, [defaultTheme.branding.alternativeColor, neutralColors]);

  return (
    <>
      <div className="flex flex-col gap-fix-md">
        <h5>{t("colors")}</h5>
        <div className="flex flex-wrap gap-fix-xs">
          <ColorPicker
            color={defaultColors.neutral}
            label="Neutral"
            setColor={(neutral) =>
              setDefaultColors({ ...defaultColors, neutral })
            }
          />

          <ColorPicker
            isBrand
            color={defaultColors.brand}
            label="Brand"
            setAlternativeColor={(color) => {
              setBrandColor(color, defaultTheme.branding.alternativeColor.dark);
            }}
            isAlternativeValid={isAlternativeValid}
            setColor={(brand) => {
              setDefaultColors({ ...defaultColors, brand });
              if (neutralColors) {
                const neutralBgDarkest = neutralColors.at(0);
                const neutralBgLightest = neutralColors.at(-1);
                const lowContrastDark =
                  chroma.contrast(
                    chroma.hex(brand),
                    chroma.hex(neutralBgDarkest?.hex || "hotpink"),
                  ) < 3;
                const lowContrastLight =
                  chroma.contrast(
                    chroma.hex(brand),
                    chroma.hex(neutralBgLightest?.hex || "hotpink"),
                  ) < 3;

                if (!defaultTheme.branding.alternativeColor.custom) {
                  if (lowContrastDark) {
                    setBrandColor(getReverseColorAsHex(brand), true);
                  } else if (lowContrastLight) {
                    setBrandColor(getReverseColorAsHex(brand), false);
                  } else {
                    setBrandColor(brand, true);
                  }
                }
              }
            }}
          />

          <ColorPicker
            color={defaultColors.informational}
            label="Informational"
            setColor={(informational) =>
              setDefaultColors({ ...defaultColors, informational })
            }
          />

          <ColorPicker
            color={defaultColors.successful}
            label="Successful"
            setColor={(successful) =>
              setDefaultColors({ ...defaultColors, successful })
            }
          />

          <ColorPicker
            color={defaultColors.warning}
            label="Warning"
            setColor={(warning) =>
              setDefaultColors({ ...defaultColors, warning })
            }
          />

          <ColorPicker
            color={defaultColors.critical}
            label="Critical"
            setColor={(critical) =>
              setDefaultColors({ ...defaultColors, critical })
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-fix-md">
        <h5>{t("custom")}</h5>
        <div className="flex flex-wrap gap-fix-xs">
          <ColorPicker
            color="#ffffff"
            label={t("addColor")}
            setColor={() => {}}
            customColor
            isAddColor
          />
          {customColorArray?.length > 0 &&
            customColorArray.map((color) => (
              <ColorPicker
                key={color}
                color={customColors[color]}
                label={color}
                setColor={(changedColor) =>
                  setCustomColors({ ...customColors, [color]: changedColor })
                }
                customColor
                onDelete={() => {
                  const copyCustomColors = { ...customColors };
                  delete copyCustomColors[color];
                  setCustomColors(copyCustomColors);
                }}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default ColorSelection;
