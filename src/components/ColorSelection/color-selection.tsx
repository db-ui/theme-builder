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
        bgNeutral0: darkMode
          ? defaultColors.onBgNeutral
          : defaultColors.bgNeutral0,
        bgNeutral1: darkMode
          ? getNeutralStrong(defaultColors.onBgNeutral, darkMode)
          : defaultColors.bgNeutral1,
        onBgNeutral: darkMode
          ? defaultColors.bgNeutral0
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
            color={defaultColors.bgNeutral0}
            setColor={(color) =>
              setDefaultColors({
                ...defaultColors,
                bgNeutral0: color,
                bgNeutral1: getNeutralStrong(color, darkMode),
              })
            }
          >
            <InformationButton>TODO</InformationButton>
          </ColorPicker>
          <ContrastChecker
            label="On-Neutral-Background"
            backgroundColor={defaultColors.bgNeutral1}
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
            backgroundColor={defaultColors.bgNeutral1}
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
            backgroundColor={defaultColors.bgNeutral1}
            onChange={(informational) =>
              setDefaultColors({ ...defaultColors, informational })
            }
          />
          <ContrastChecker
            initColor={defaultColors.successful}
            label="Successful"
            backgroundColor={defaultColors.bgNeutral1}
            onChange={(successful) =>
              setDefaultColors({ ...defaultColors, successful })
            }
          />
          <ContrastChecker
            initColor={defaultColors.warning}
            label="Warning"
            backgroundColor={defaultColors.bgNeutral1}
            onChange={(warning) =>
              setDefaultColors({ ...defaultColors, warning })
            }
          />
          <ContrastChecker
            initColor={defaultColors.critical}
            label="Critical"
            backgroundColor={defaultColors.bgNeutral1}
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
