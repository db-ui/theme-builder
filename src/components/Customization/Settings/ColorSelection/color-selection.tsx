import ColorPicker from "./ColorPicker";
import { useThemeBuilderStore } from "../../../../store";
import { useTranslation } from "react-i18next";
import { getAlternativeColor } from "./data.ts";
import { useCallback } from "react";
import { AlternativeColor } from "../../../../utils/data.ts";

const ColorSelection = () => {
  const { t } = useTranslation();

  const {
    setColors,
    theme,
    setAdditionalColors,
    setCustomColors,
    setAlternativeColors,
    luminanceSteps,
  } = useThemeBuilderStore((state) => state);

  const setAltColor = useCallback(
    ({
      name,
      altColor,
      custom,
      currentColor,
    }: {
      name: string;
      currentColor?: string;
      altColor?: string;
      custom?: boolean;
    }) => {
      const allColors: Record<string, string> = {
        ...theme.colors,
        ...theme.additionalColors,
        ...theme.customColors,
      };
      const currentAlt: AlternativeColor | undefined =
        theme?.branding?.alternativeColors?.[name];
      const alternativeColor = getAlternativeColor(
        allColors,
        name,
        luminanceSteps,
        custom ?? currentAlt?.custom ?? false,
        altColor ?? currentAlt?.hex,
        currentColor,
      );

      setAlternativeColors({
        ...theme.branding.alternativeColors,
        [name]: alternativeColor,
      });
    },
    [
      theme.colors,
      theme.additionalColors,
      theme.customColors,
      theme.branding.alternativeColors,
      setAlternativeColors,
      luminanceSteps,
    ],
  );

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
            isOrigin
            color={theme.colors.brand}
            label="brand"
            setAlternativeCustom={(custom) => {
              setAltColor({ name: "brand", custom });
            }}
            setAlternativeColor={(altColor) => {
              setAltColor({ name: "brand", altColor });
            }}
            setColor={(brand) => {
              setColors({ ...theme.colors, brand });
              setAltColor({ name: "brand", currentColor: brand });
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
        <h5>{t("additional-colors")}</h5>
        <div className="flex flex-wrap gap-fix-xs">
          {Object.entries(theme.additionalColors).map(([name, color]) => (
            <ColorPicker
              key={name}
              color={color}
              label={name}
              isOrigin
              setAlternativeCustom={(custom) => {
                setAltColor({ name, custom });
              }}
              setAlternativeColor={(altColor) => {
                setAltColor({ name, altColor });
              }}
              setColor={(changedColor) => {
                setAdditionalColors({
                  ...theme.additionalColors,
                  [name]: changedColor,
                });
                setAltColor({ name, currentColor: changedColor });
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-fix-md">
        <h5>{t("custom")}</h5>
        <div className="flex flex-wrap gap-fix-xs">
          <ColorPicker
            color="#ffffff"
            label={t("addColor")}
            onAddColor={(name, color) => {
              setCustomColors({
                ...theme.customColors,
                [name]: color,
              });
              setAltColor({ name, currentColor: color });
            }}
            customColor
            isAddColor
          />
          {theme.customColors &&
            Object.entries(theme.customColors).map(([name, color]) => (
              <ColorPicker
                key={name}
                color={color}
                label={name}
                isOrigin
                setAlternativeCustom={(custom) => {
                  setAltColor({ name, custom });
                }}
                setAlternativeColor={(altColor) => {
                  setAltColor({ name, altColor });
                }}
                setColor={(changedColor) => {
                  setCustomColors({
                    ...theme.customColors,
                    [name]: changedColor,
                  });
                  setAltColor({ name, currentColor: changedColor });
                }}
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
