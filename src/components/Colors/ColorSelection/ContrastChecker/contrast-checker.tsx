import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { ContrastCheckerType } from "./data";
import ColorPicker from "../ColorPicker";
import "./index.scss";
import { DBButton, DBDivider, DBInput } from "@db-ui/react-components";
import { getContrastSuggestion, isValidColor } from "../../../../utils";
import ContrastList from "../ContrastList";
import InformationButton from "../InformationButton";
import { useTranslation } from "react-i18next";
import { useThemeBuilderStore } from "../../../../store";
import { CustomColorMappingType } from "../../../../utils/data.ts";

const colorChangedMessage = "Color changed for";
const darkModeMessage = "dark-mode";
const lightModeMessage = "light-mode";
const getInfoMessage = (
  changedLightColor: boolean,
  changedDarkColor: boolean,
): string | undefined => {
  if (changedLightColor && changedDarkColor) {
    return `${colorChangedMessage} ${lightModeMessage} & ${darkModeMessage}.`;
  }

  if (changedLightColor) {
    return `${colorChangedMessage} ${lightModeMessage}.`;
  }

  if (changedDarkColor) {
    return `${colorChangedMessage} ${darkModeMessage}.`;
  }

  return undefined;
};

const ContrastChecker = ({
  label,
  backgroundColor,
  backgroundColorDark,
  initColor,
  onChange,
  isCustom,
}: PropsWithChildren<ContrastCheckerType>) => {
  const { t } = useTranslation();
  const [foregroundColor, setFourgroundColor] = useState<string>(initColor);
  const [validLight, setValidLight] = useState<string | undefined>();
  const [validDark, setValidDark] = useState<string | undefined>();

  const [changedLightColor, setChangedLightColor] = useState<boolean>(false);
  const [changedDarkColor, setChangedDarkColor] = useState<boolean>(false);

  const { customColors } = useThemeBuilderStore((state) => state);
  const [colorName, setColorName] = useState<string>(label);

  const setCustomColors = (colorMappingType: CustomColorMappingType) => {
    useThemeBuilderStore.setState({
      customColors: colorMappingType,
    });
  };

  useEffect(() => {
    if (foregroundColor) {
      onChange?.(foregroundColor);
    }
  }, [foregroundColor]);

  useEffect(() => {
    if (initColor !== foregroundColor) {
      setFourgroundColor(initColor);
    }
  }, [initColor]);

  useEffect(() => {
    if (
      foregroundColor &&
      backgroundColor &&
      isValidColor(foregroundColor) &&
      isValidColor(backgroundColor)
    ) {
      const validLightColor =
        getContrastSuggestion(backgroundColor, foregroundColor) ||
        foregroundColor;
      setValidLight(validLightColor);
      setChangedLightColor(validLightColor !== foregroundColor);
    }
  }, [foregroundColor, backgroundColor]);

  useEffect(() => {
    if (
      foregroundColor &&
      backgroundColorDark &&
      isValidColor(foregroundColor) &&
      isValidColor(backgroundColorDark)
    ) {
      const validDarkColor =
        getContrastSuggestion(
          backgroundColorDark,
          foregroundColor,
          4.5,
          true,
        ) || foregroundColor;
      setValidDark(validDarkColor);
      setChangedDarkColor(validDarkColor !== foregroundColor);
    }
  }, [foregroundColor, backgroundColorDark]);

  return (
    <div className="contrast-checker-container">
      <ColorPicker
        label={label}
        color={foregroundColor}
        setColor={setFourgroundColor}
        info={getInfoMessage(changedLightColor, changedDarkColor)}
      />
      <InformationButton>
        {isCustom && (
          <>
            <DBInput
              id={`input-${colorName}`}
              labelVariant="floating"
              label={t("colorName")}
              required
              value={colorName}
              variant={
                customColors[colorName] && label !== colorName
                  ? "critical"
                  : "adaptive"
              }
              message={
                customColors[colorName] && label !== colorName
                  ? t("customColorExists")
                  : undefined
              }
              onChange={(event) => setColorName(event.target.value)}
            />
            <DBDivider />
          </>
        )}

        <p>Original:</p>
        <ContrastList
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
        />
        {validLight && validLight !== foregroundColor && (
          <>
            <DBDivider />
            <p>Light-Mode:</p>
            <ContrastList
              backgroundColor={backgroundColor}
              foregroundColor={validLight}
            />
          </>
        )}
        {validDark && backgroundColorDark && validDark !== foregroundColor && (
          <>
            <DBDivider />
            <p>Dark-Mode:</p>{" "}
            <ContrastList
              backgroundColor={backgroundColorDark}
              foregroundColor={validDark}
            />
          </>
        )}
        {isCustom && (
          <>
            <DBDivider />
            <div className="ml-auto flex gap-fix-md">
              <DBButton
                icon="delete"
                onClick={() => {
                  const copyCustomColors = { ...customColors };
                  delete copyCustomColors[label];
                  setCustomColors(copyCustomColors);
                }}
              >
                {t("deleteColor")}
              </DBButton>

              <DBButton
                className="ml-auto"
                variant="primary"
                disabled={
                  colorName.length === 0 ||
                  (!!customColors[colorName] && label !== colorName)
                }
                onClick={() => {
                  const newCustomColors: CustomColorMappingType = {};
                  Object.keys(customColors).forEach((cName) => {
                    if (cName === label) {
                      newCustomColors[colorName] = customColors[cName];
                    } else {
                      newCustomColors[cName] = customColors[cName];
                    }
                  });
                  setCustomColors(newCustomColors);
                }}
              >
                {t("changeColor")}
              </DBButton>
            </div>
          </>
        )}
      </InformationButton>
    </div>
  );
};

export default ContrastChecker;
