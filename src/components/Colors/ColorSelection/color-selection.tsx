import ColorPicker from "./ColorPicker";
import ContrastChecker from "./ContrastChecker";
import { useThemeBuilderStore } from "../../../store";
import {
  CustomColorMappingType,
  DefaultColorMappingType,
} from "../../../utils/data.ts";
import { getStrong } from "../../../utils/generate-colors.ts";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import AddColorButton from "./AddColorButton";
import InformationButton from "./InformationButton";

const ColorSelection = () => {
  const { t } = useTranslation();
  const [customColorArray, setCustomColorArray] = useState<string[]>([]);

  const { darkMode, defaultColors, customColors } = useThemeBuilderStore(
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
    <div className="flex flex-col gap-fix-sm p-res-xs w-full md:w-2/5 md:h-full md:overflow-auto">
      <h2 data-variant="light">{t("createThemeHeadline")}</h2>

      <span>{t("base")}</span>

      <ColorPicker
        label="Base"
        color={defaultColors.bgBase}
        setColor={(color) => {
          setDefaultColors({
            ...defaultColors,
            bgBase: color,
            bgBaseStrong: getStrong(color, darkMode),
          });
        }}
      >
        <InformationButton>TODO</InformationButton>
      </ColorPicker>
      <ContrastChecker
        label="On-Base"
        backgroundColor={defaultColors.bgBaseStrong}
        initColor={defaultColors.onBgBase}
        onChange={(onBgBase) =>
          setDefaultColors({
            ...defaultColors,
            onBgBase,
          })
        }
      />
      <span>{t("brand")}</span>

      <ColorPicker
        color={defaultColors.brand}
        label="Brand"
        setColor={(brand) => setDefaultColors({ ...defaultColors, brand })}
      >
        <InformationButton>TODO</InformationButton>
      </ColorPicker>
      <ContrastChecker
        label="On-Brand"
        initColor={defaultColors.onBrand}
        backgroundColor={defaultColors.brand}
        onChange={(onBrand) =>
          setDefaultColors({
            ...defaultColors,
            onBrand,
          })
        }
      />
      <span>{t("semantic")}</span>

      <ContrastChecker
        initColor={defaultColors.neutral}
        label="Neutral"
        backgroundColor={defaultColors.bgBaseStrong}
        backgroundColorDark={getStrong(defaultColors.onBgBase, true)}
        onChange={(neutral) => setDefaultColors({ ...defaultColors, neutral })}
      />
      <ContrastChecker
        initColor={defaultColors.informational}
        label="Informational"
        backgroundColor={defaultColors.bgBaseStrong}
        backgroundColorDark={getStrong(defaultColors.onBgBase, true)}
        onChange={(informational) =>
          setDefaultColors({ ...defaultColors, informational })
        }
      />
      <ContrastChecker
        initColor={defaultColors.successful}
        label="Successful"
        backgroundColor={defaultColors.bgBaseStrong}
        backgroundColorDark={getStrong(defaultColors.onBgBase, true)}
        onChange={(successful) =>
          setDefaultColors({ ...defaultColors, successful })
        }
      />
      <ContrastChecker
        initColor={defaultColors.warning}
        label="Warning"
        backgroundColor={defaultColors.bgBaseStrong}
        backgroundColorDark={getStrong(defaultColors.onBgBase, true)}
        onChange={(warning) => setDefaultColors({ ...defaultColors, warning })}
      />
      <ContrastChecker
        initColor={defaultColors.critical}
        label="Critical"
        backgroundColor={defaultColors.bgBaseStrong}
        backgroundColorDark={getStrong(defaultColors.onBgBase, true)}
        onChange={(critical) =>
          setDefaultColors({ ...defaultColors, critical })
        }
      />

      {customColorArray?.length > 0 && (
        <>
          <span>{t("custom")}</span>
          {customColorArray.map((color) => (
            <ContrastChecker
              key={color}
              isCustom
              initColor={customColors[color]}
              label={color}
              backgroundColor={defaultColors.bgBaseStrong}
              backgroundColorDark={getStrong(defaultColors.onBgBase, true)}
              onChange={(changedColor) =>
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
