import ColorPicker from "./ColorPicker";
import { useThemeBuilderStore } from "../../../store";
import {
  CustomColorMappingType,
  DefaultColorMappingType,
} from "../../../utils/data.ts";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import AddColorButton from "./AddColorButton";
import CustomColorPicker from "./CustomColorPicker";

const ColorSelection = () => {
  const { t } = useTranslation();
  const [customColorArray, setCustomColorArray] = useState<string[]>([]);

  const { defaultColors, customColors } = useThemeBuilderStore(
    (state) => state,
  );

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

  const setDefaultColors = (colorMappingType: DefaultColorMappingType) => {
    useThemeBuilderStore.setState({
      defaultColors: colorMappingType,
    });
  };

  const setCustomColors = (colorMappingType: CustomColorMappingType) => {
    useThemeBuilderStore.setState({
      customColors: colorMappingType,
    });
  };

  return (
    <div className="flex flex-col gap-fix-sm ">
      <ColorPicker
        color={defaultColors.neutral}
        label="Neutral"
        setColor={(neutral) => setDefaultColors({ ...defaultColors, neutral })}
      />

      <ColorPicker
        color={defaultColors.brand}
        label="Brand"
        setColor={(brand) => setDefaultColors({ ...defaultColors, brand })}
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
        setColor={(warning) => setDefaultColors({ ...defaultColors, warning })}
      />

      <ColorPicker
        color={defaultColors.critical}
        label="Critical"
        setColor={(critical) =>
          setDefaultColors({ ...defaultColors, critical })
        }
      />

      {customColorArray?.length > 0 && (
        <>
          <span>{t("custom")}</span>
          {customColorArray.map((color) => (
            <CustomColorPicker
              key={color}
              color={customColors[color]}
              label={color}
              setColor={(changedColor) =>
                setCustomColors({ ...customColors, [color]: changedColor })
              }
            />
          ))}
        </>
      )}

      <AddColorButton />
    </div>
  );
};

export default ColorSelection;
