import ColorPicker from "./ColorPicker";
import { useThemeBuilderStore } from "../../../../store";
import { useTranslation } from "react-i18next";
import { getAlternativeBrand } from "./data.ts";
import { useEffect, useState } from "react";

const ColorSelection = () => {
  const { t } = useTranslation();

  const {
    setColors,
    theme,
    setCustomColors,
    setAlternativeColor,
    luminanceSteps,
  } = useThemeBuilderStore((state) => state);

  const [custom, setCustom] = useState<boolean>(
    !!theme.branding.alternativeColor.custom,
  );

  const [altColor, setAltColor] = useState<string>(
    theme.branding.alternativeColor.hex || theme.colors.brand,
  );

  useEffect(() => {
    setAlternativeColor(
      getAlternativeBrand(theme.colors, luminanceSteps, custom, altColor),
    );
  }, [
    theme.colors,
    luminanceSteps,
    theme.branding.alternativeColor.custom,
    setAlternativeColor,
    custom,
    altColor,
  ]);

  return (
    <>
      <div className="flex flex-col gap-fix-md">
        <h5>{t("colors")}</h5>
        <div className="flex flex-wrap gap-fix-xs">
          <ColorPicker
            color={theme.colors.neutral}
            label="Neutral"
            setColor={(neutral) => setColors({ ...theme.colors, neutral })}
          />

          <ColorPicker
            isBrand
            color={theme.colors.brand}
            label="Brand"
            setAlternativeCustom={setCustom}
            setAlternativeColor={setAltColor}
            setColor={(brand) => {
              setColors({ ...theme.colors, brand });
            }}
          />

          <ColorPicker
            color={theme.colors.informational}
            label="Informational"
            setColor={(informational) =>
              setColors({ ...theme.colors, informational })
            }
          />

          <ColorPicker
            color={theme.colors.successful}
            label="Successful"
            setColor={(successful) =>
              setColors({ ...theme.colors, successful })
            }
          />

          <ColorPicker
            color={theme.colors.warning}
            label="Warning"
            setColor={(warning) => setColors({ ...theme.colors, warning })}
          />

          <ColorPicker
            color={theme.colors.critical}
            label="Critical"
            setColor={(critical) => setColors({ ...theme.colors, critical })}
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
          {theme.customColors &&
            Object.entries(theme.customColors).map(([name, color]) => (
              <ColorPicker
                key={name}
                color={color}
                label={name}
                setColor={(changedColor) =>
                  setCustomColors({
                    ...theme.customColors,
                    [name]: changedColor,
                  })
                }
                customColor
                onDelete={() => {
                  const copyCustomColors = { ...theme.customColors };
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
