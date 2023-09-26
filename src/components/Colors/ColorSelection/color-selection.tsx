import { DBCard } from "@db-ui/react-components";
import ColorPicker from "./ColorPicker";
import InformationButton from "./InformationButton";
import ContrastChecker from "./ContrastChecker";
import { useThemeBuilderStore } from "../../../store";
import { DefaultColorMappingType } from "../../../utils/data.ts";
import { getStrong } from "../../../utils/generate-colors.ts";

const ColorSelection = () => {
  const { darkMode, defaultColors } = useThemeBuilderStore((state) => state);

  const setDefaultColors = (colorMappingType: DefaultColorMappingType) => {
    useThemeBuilderStore.setState({
      defaultColors: colorMappingType,
    });
  };

  return (
    <div className="column-box">
      <DBCard className="color-inputs" spacing="small">
        <div className="title-container">
          <strong>Base</strong>
        </div>

        <div className="color-picker-grid">
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
            onChange={(onBgNeutral) =>
              setDefaultColors({
                ...defaultColors,
                onBgBase: onBgNeutral,
              })
            }
          />
        </div>
      </DBCard>
      <DBCard className="color-inputs" spacing="small">
        <div className="title-container">
          <strong>Brand</strong>
        </div>

        <div className="color-picker-grid">
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
        </div>
      </DBCard>
      <DBCard className="color-inputs" spacing="small">
        <div className="title-container">
          <strong>Semantic</strong>
        </div>

        <div className="color-picker-grid">
          <ContrastChecker
            initColor={defaultColors.neutral}
            label="Neutral"
            backgroundColor={defaultColors.bgBaseStrong}
            backgroundColorDark={getStrong(defaultColors.onBgBase, true)}
            onChange={(neutral) =>
              setDefaultColors({ ...defaultColors, neutral })
            }
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
            onChange={(warning) =>
              setDefaultColors({ ...defaultColors, warning })
            }
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
        </div>
      </DBCard>
    </div>
  );
};

export default ColorSelection;
