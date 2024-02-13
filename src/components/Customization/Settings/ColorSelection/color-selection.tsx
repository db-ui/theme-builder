import ColorPicker from "./ColorPicker";
import { useThemeBuilderStore } from "../../../../store";
import {
  CustomColorMappingType,
  DefaultColorMappingType,
} from "../../../../utils/data.ts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeadlineDivider from "../../HeadlineDivider";

const ColorSelection = () => {
  const { t } = useTranslation();
  const [customColorArray, setCustomColorArray] = useState<string[]>([]);

  const { defaultColors, customColors } = useThemeBuilderStore(
    (state) => state,
  );

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

  const setDefaultColors = (colorMappingType: DefaultColorMappingType) => {
    useThemeBuilderStore.setState({
      defaultColors: colorMappingType,
    });
  };

  return (
    <div className="flex flex-col gap-fix-md">
      <div className="flex flex-wrap gap-fix-xs">
        <ColorPicker
          color={defaultColors.neutral}
          label="Neutral"
          setColor={(neutral) =>
            setDefaultColors({ ...defaultColors, neutral })
          }
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
      <HeadlineDivider headline="custom" />

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
  );
};

export default ColorSelection;
