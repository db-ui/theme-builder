import { DBCard } from "@db-ui/react-components";
import ColorPicker from "./ColorPicker";
import InformationButton from "./InformationButton";
import ContrastChecker from "./ContrastChecker";
import { useThemeBuilderStore } from "../../data";
import { DefaultColorMappingType } from "../../utils/data.ts";
import { useEffect } from "react";
import {
  generateColors,
  getNeutralStrong,
} from "../../utils/generate-colors.ts";
import { getCssProperties } from "../../utils/outputs.ts";

const ColorSelection = () => {
  const { darkMode, defaultColors } = useThemeBuilderStore((state) => state);

  const setDefaultColors = (colorMappingType: DefaultColorMappingType) => {
    useThemeBuilderStore.setState({
      defaultColors: colorMappingType,
    });
  };

  useEffect(() => {
    const generatedColors = generateColors(
      {
        ...defaultColors,
        bgNeutral: darkMode
          ? defaultColors.onBgNeutral
          : defaultColors.bgNeutral,
        bgNeutralStrong: darkMode
          ? getNeutralStrong(defaultColors.onBgNeutral, darkMode)
          : defaultColors.bgNeutralStrong,
        onBgNeutral: darkMode
          ? defaultColors.bgNeutral
          : defaultColors.onBgNeutral,
      },
      darkMode,
    );
    useThemeBuilderStore.setState({ colors: generatedColors });

    const cssProps = getCssProperties(generatedColors);
    Object.keys(cssProps).forEach((key) => {
      document.body.style.setProperty(key, cssProps[key]);
    });
  }, [defaultColors, darkMode]);
  return (
    <div className="column-box">
      <DBCard className="color-inputs" spacing="small">
        <div className="title-container">
          <strong>Neutral</strong>
        </div>

        <div className="color-picker-grid">
          <ColorPicker
            label="Neutral-Background"
            color={defaultColors.bgNeutral}
            setColor={(color) =>
              setDefaultColors({
                ...defaultColors,
                bgNeutral: color,
                bgNeutralStrong: getNeutralStrong(color, darkMode),
              })
            }
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
            onChange={(neutral) =>
              setDefaultColors({ ...defaultColors, neutral })
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
            initColor={defaultColors.informational}
            label="Informational"
            backgroundColor={defaultColors.bgNeutralStrong}
            onChange={(informational) =>
              setDefaultColors({ ...defaultColors, informational })
            }
          />
          <ContrastChecker
            initColor={defaultColors.successful}
            label="Successful"
            backgroundColor={defaultColors.bgNeutralStrong}
            onChange={(successful) =>
              setDefaultColors({ ...defaultColors, successful })
            }
          />
          <ContrastChecker
            initColor={defaultColors.warning}
            label="Warning"
            backgroundColor={defaultColors.bgNeutralStrong}
            onChange={(warning) =>
              setDefaultColors({ ...defaultColors, warning })
            }
          />
          <ContrastChecker
            initColor={defaultColors.critical}
            label="Critical"
            backgroundColor={defaultColors.bgNeutralStrong}
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
