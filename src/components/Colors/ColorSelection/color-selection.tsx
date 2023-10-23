import ColorPicker from "./ColorPicker";
import InformationButton from "./InformationButton";
import ContrastChecker from "./ContrastChecker";
import { useThemeBuilderStore } from "../../../store";
import { DefaultColorMappingType } from "../../../utils/data.ts";
import { getStrong } from "../../../utils/generate-colors.ts";
import { DBButton } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";

const ColorSelection = () => {
  const { t } = useTranslation();
  const { darkMode, defaultColors } = useThemeBuilderStore((state) => state);

  const setDefaultColors = (colorMappingType: DefaultColorMappingType) => {
    useThemeBuilderStore.setState({
      defaultColors: colorMappingType,
    });
  };

  return (
    <div className="flex flex-col gap-fix-sm p-res-xs w-full md:w-2/5 md:h-full md:overflow-auto">
      <h2 data-variant="light">{t("createThemeHeadline")}</h2>

      <span>Base</span>

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
      <span>Brand</span>

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
      <span>Semantic</span>

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

      <DBButton className="mx-auto my-fix-md" icon="add">
        {t("addColor")}
      </DBButton>
    </div>
  );
};

export default ColorSelection;
