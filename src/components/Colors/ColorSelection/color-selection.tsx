import ColorPicker from "./ColorPicker";
import InformationButton from "./InformationButton";
import ContrastChecker from "./ContrastChecker";
import { useThemeBuilderStore } from "../../../store";
import { DefaultColorMappingType } from "../../../utils/data.ts";
import { getNeutralStrong } from "../../../utils/generate-colors.ts";
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
    <div className="flex flex-col gap-fix-sm p-res-xs w-full m:w-2/5 m:h-full m:overflow-auto">
      <h2 data-variant="light">{t("createThemeHeadline")}</h2>

      <span>Neutral</span>

      <ColorPicker
        label="Neutral-Background"
        color={defaultColors.bgNeutral}
        setColor={(color) => {
          setDefaultColors({
            ...defaultColors,
            bgNeutral: color,
            bgNeutralStrong: getNeutralStrong(color, darkMode),
          });
        }}
      >
        <InformationButton>TODO</InformationButton>
      </ColorPicker>
      <ContrastChecker
        label="On-Neutral-Background"
        backgroundColor={defaultColors.bgNeutralStrong}
        initColor={defaultColors.onBgNeutral}
        onChange={(onBgNeutral) =>
          setDefaultColors({
            ...defaultColors,
            onBgNeutral,
          })
        }
      />
      <ContrastChecker
        initColor={defaultColors.neutral}
        label="Neutral"
        backgroundColor={defaultColors.bgNeutralStrong}
        backgroundColorDark={getNeutralStrong(defaultColors.onBgNeutral, true)}
        onChange={(neutral) => setDefaultColors({ ...defaultColors, neutral })}
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
        initColor={defaultColors.informational}
        label="Informational"
        backgroundColor={defaultColors.bgNeutralStrong}
        backgroundColorDark={getNeutralStrong(defaultColors.onBgNeutral, true)}
        onChange={(informational) =>
          setDefaultColors({ ...defaultColors, informational })
        }
      />
      <ContrastChecker
        initColor={defaultColors.successful}
        label="Successful"
        backgroundColor={defaultColors.bgNeutralStrong}
        backgroundColorDark={getNeutralStrong(defaultColors.onBgNeutral, true)}
        onChange={(successful) =>
          setDefaultColors({ ...defaultColors, successful })
        }
      />
      <ContrastChecker
        initColor={defaultColors.warning}
        label="Warning"
        backgroundColor={defaultColors.bgNeutralStrong}
        backgroundColorDark={getNeutralStrong(defaultColors.onBgNeutral, true)}
        onChange={(warning) => setDefaultColors({ ...defaultColors, warning })}
      />
      <ContrastChecker
        initColor={defaultColors.critical}
        label="Critical"
        backgroundColor={defaultColors.bgNeutralStrong}
        backgroundColorDark={getNeutralStrong(defaultColors.onBgNeutral, true)}
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
