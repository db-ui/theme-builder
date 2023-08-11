import { useEffect, useState } from "react";
import {
  DEFAULT_BACKGROUND,
  DEFAULT_BACKGROUND_DARK,
  DEFAULT_BRAND,
  DEFAULT_CRITICAL,
  DEFAULT_INFORMATIONAL,
  DEFAULT_NEUTRAL,
  DEFAULT_ON_BRAND,
  DEFAULT_SUCCESSFUL,
  DEFAULT_WARNING,
} from "./utils/constants.ts";
import {
  DBBrand,
  DBButton,
  DBCard,
  DBCheckbox,
  DBHeader,
  DBPage,
} from "@db-ui/react-components";
import { ColorType, DefaultColorMappingType } from "./utils/data.ts";
import ColorTable from "./components/ColorTable";
import { downloadTheme, getNeutral1 } from "./utils";
import ColorPicker from "./components/ColorPicker";
import ContrastChecker from "./components/ContrastChecker";
import InformationButton from "./components/InformationButton";
import { generateColors } from "./utils/generate-colors.ts";
import { getCssProperties } from "./utils/outputs.ts";

const App = () => {
  const [defaultColors, setDefaultColors] = useState<DefaultColorMappingType>({
    bgNeutral0: DEFAULT_BACKGROUND,
    bgNeutral1: getNeutral1(DEFAULT_BACKGROUND),
    onBgNeutral: DEFAULT_BACKGROUND_DARK,
    neutral: DEFAULT_NEUTRAL,
    brand: DEFAULT_BRAND,
    onBrand: DEFAULT_ON_BRAND,
    informational: DEFAULT_INFORMATIONAL,
    successful: DEFAULT_SUCCESSFUL,
    warning: DEFAULT_WARNING,
    critical: DEFAULT_CRITICAL,
  });

  const [darkMode, setDarkMode] = useState<boolean>();

  const [colors, setColors] = useState<ColorType[]>();

  useEffect(() => {
    const generatedColors = generateColors(
      {
        ...defaultColors,
        bgNeutral0: darkMode
          ? defaultColors.onBgNeutral
          : defaultColors.bgNeutral0,
        bgNeutral1: darkMode
          ? getNeutral1(defaultColors.onBgNeutral)
          : defaultColors.bgNeutral1,
        onBgNeutral: darkMode
          ? defaultColors.bgNeutral0
          : defaultColors.onBgNeutral,
      },
      darkMode,
    );
    setColors(generatedColors);

    const cssProps = getCssProperties(generatedColors);
    Object.keys(cssProps).forEach((key) => {
      document.body.style.setProperty(key, cssProps[key]);
    });
  }, [defaultColors, darkMode]);

  return (
    <DBPage
      type="fixedHeaderFooter"
      slotHeader={
        <DBHeader slotBrand={<DBBrand anchorChildren>Theme Builder</DBBrand>}>
          <div className="checkbox">
            <DBCheckbox
              value={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            >
              Darkmode
            </DBCheckbox>
          </div>
        </DBHeader>
      }
      slotFooter={
        <footer className="db-header">
          <DBButton
            className="download-button"
            variant="primary"
            width="full"
            onClick={() => downloadTheme(defaultColors)}
          >
            Download Theme
          </DBButton>
        </footer>
      }
    >
      <div className="content column-box">
        <div className="upper-container">
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
                      bgNeutral1: getNeutral1(color),
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
                <ContrastChecker
                  initColor={defaultColors.brand}
                  label="Brand"
                  backgroundColor={defaultColors.bgNeutral1}
                  onChange={(brand) =>
                    setDefaultColors({ ...defaultColors, brand })
                  }
                />
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
          <DBCard className="component-container column-box" spacing="small">
            <div className="title-container">
              <strong>Components</strong>
            </div>
            <div
              style={{
                backgroundColor: darkMode
                  ? defaultColors.onBgNeutral
                  : defaultColors.bgNeutral0,
              }}
              className="component-color-container"
            >
              <DBButton>Test</DBButton>
            </div>
          </DBCard>
        </div>
        <ColorTable colors={colors} />
      </div>
    </DBPage>
  );
};

export default App;
