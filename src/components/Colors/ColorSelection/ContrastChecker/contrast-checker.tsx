import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { ContrastCheckerType } from "./data";
import ColorPicker from "../ColorPicker";
import "./index.scss";
import { DBDivider } from "@db-ui/react-components";
import { getContrastSuggestion, isValidColor } from "../../../../utils";
import ContrastList from "../ContrastList";
import InformationButton from "../InformationButton";

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
}: PropsWithChildren<ContrastCheckerType>) => {
  const [foregroundColor, setFourgroundColor] = useState<string>(initColor);
  const [validLight, setValidLight] = useState<string | undefined>();
  const [validDark, setValidDark] = useState<string | undefined>();

  const [changedLightColor, setChangedLightColor] = useState<boolean>(false);
  const [changedDarkColor, setChangedDarkColor] = useState<boolean>(false);

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
        <>
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
          {validDark &&
            backgroundColorDark &&
            validDark !== foregroundColor && (
              <>
                <DBDivider />
                <p>Dark-Mode:</p>{" "}
                <ContrastList
                  backgroundColor={backgroundColorDark}
                  foregroundColor={validDark}
                />
              </>
            )}
        </>
      </InformationButton>
    </div>
  );
};

export default ContrastChecker;
