import ColorPicker from "./ColorPicker";
import { useThemeBuilderStore } from "../../../../store";
import {
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
  const [neutralColors, setNeutralColors] = useState<HeisslufType[]>();
  const [isAlternativeValid, setIsAlternativeValid] = useState<boolean>();

  const { luminanceSteps, defaultTheme } = useThemeBuilderStore(
    (state) => state,
  );

  const setCustomColors = useCallback(
    (customColors: Record<string, string>) => {
      useThemeBuilderStore.setState({
        defaultTheme: { ...defaultTheme, customColors },
      });
    },
    [defaultTheme],
  );

  const setDefaultColors = useCallback(
    (colors: DefaultColorMappingType) => {
      useThemeBuilderStore.setState({
        defaultTheme: { ...defaultTheme, colors },
      });
    },
    [defaultTheme],
  );

  useEffect(() => {
    setNeutralColors(
      getHeissluftColors(
        "neutral",
        defaultTheme.colors.neutral,
        luminanceSteps,
      ),
    );
  }, [defaultTheme.colors.neutral, luminanceSteps]);

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
            color={defaultTheme.colors.neutral}
            label="Neutral"
            setColor={(neutral) =>
              setDefaultColors({ ...defaultTheme.colors, neutral })
            }
          />

          <ColorPicker
            isBrand
            color={defaultTheme.colors.brand}
            label="Brand"
            setAlternativeColor={(color) => {
              setBrandColor(color, defaultTheme.branding.alternativeColor.dark);
            }}
            isAlternativeValid={isAlternativeValid}
            setColor={(brand) => {
              setDefaultColors({ ...defaultTheme.colors, brand });
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
            color={defaultTheme.colors.informational}
            label="Informational"
            setColor={(informational) =>
              setDefaultColors({ ...defaultTheme.colors, informational })
            }
          />

          <ColorPicker
            color={defaultTheme.colors.successful}
            label="Successful"
            setColor={(successful) =>
              setDefaultColors({ ...defaultTheme.colors, successful })
            }
          />

          <ColorPicker
            color={defaultTheme.colors.warning}
            label="Warning"
            setColor={(warning) =>
              setDefaultColors({ ...defaultTheme.colors, warning })
            }
          />

          <ColorPicker
            color={defaultTheme.colors.critical}
            label="Critical"
            setColor={(critical) =>
              setDefaultColors({ ...defaultTheme.colors, critical })
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
          {defaultTheme.customColors &&
            Object.entries(defaultTheme.customColors).map(([name, color]) => (
              <ColorPicker
                key={name}
                color={color}
                label={name}
                setColor={(changedColor) =>
                  setCustomColors({
                    ...defaultTheme.customColors,
                    [name]: changedColor,
                  })
                }
                customColor
                onDelete={() => {
                  const copyCustomColors = { ...defaultTheme.customColors };
                  delete copyCustomColors[name];
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
