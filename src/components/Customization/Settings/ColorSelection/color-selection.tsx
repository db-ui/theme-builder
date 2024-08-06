import ColorPicker from "./ColorPicker";
import { useThemeBuilderStore } from "../../../../store";
import { useTranslation } from "react-i18next";

const ColorSelection = () => {
  const { t } = useTranslation();

  const { setColors, theme, setAdditionalColors, setCustomColors } =
    useThemeBuilderStore((state) => state);

  return (
    <>
      <div className="flex flex-col gap-fix-md">
        <h5>{t("colors")}</h5>
        <div className="flex flex-wrap gap-fix-xs">
          <ColorPicker
            color={theme.colors.neutral}
            label="Neutral"
            setOriginColor={(neutral) =>
              setColors({ ...theme.colors, neutral })
            }
          />

          <ColorPicker
            color={theme.colors.brand}
            label="brand"
            setOriginColor={(brand) => {
              setColors({ ...theme.colors, brand });
            }}
          />

          <ColorPicker
            color={theme.colors.informational}
            label="Informational"
            setOriginColor={(informational) =>
              setColors({ ...theme.colors, informational })
            }
          />

          <ColorPicker
            color={theme.colors.successful}
            label="Successful"
            setOriginColor={(successful) =>
              setColors({ ...theme.colors, successful })
            }
          />

          <ColorPicker
            color={theme.colors.warning}
            label="Warning"
            setOriginColor={(warning) =>
              setColors({ ...theme.colors, warning })
            }
          />

          <ColorPicker
            color={theme.colors.critical}
            label="Critical"
            setOriginColor={(critical) =>
              setColors({ ...theme.colors, critical })
            }
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
              setOriginColor={(changedColor) => {
                setAdditionalColors({
                  ...theme.additionalColors,
                  [name]: changedColor,
                });
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-fix-md">
        <h5>{t("custom")}</h5>
        <div className="flex flex-wrap gap-fix-xs">
          <ColorPicker
            color={{ origin: "#ffffff" }}
            label={t("addColor")}
            onAddColor={(name, color) => {
              setCustomColors({
                ...theme.customColors,
                [name]: color,
              });
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
                setOriginColor={(changedColor) => {
                  setCustomColors({
                    ...theme.customColors,
                    [name]: changedColor,
                  });
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
