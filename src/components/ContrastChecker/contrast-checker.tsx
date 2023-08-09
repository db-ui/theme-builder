import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { ContrastCheckerType } from "./data";
import ColorPicker from "../ColorPicker";
import "./index.scss";
import { DBDivider } from "@db-ui/react-components";
import { getContrastSuggestion, getWCA2Variant } from "../../utils";
import ContrastList from "../ContrastList";
import InformationButton from "../InformationButton";
import chroma from "chroma-js";

const ContrastChecker = ({
  label,
  backgroundColor,
  initColor,
  onChange,
}: PropsWithChildren<ContrastCheckerType>) => {
  const [foregroundColor, setFourgroundColor] = useState<string>(initColor);

  useEffect(() => {
    if (foregroundColor) {
      onChange?.(foregroundColor);
    }
  }, [foregroundColor]);

  return (
    <div className="contrast-checker-container">
      <ColorPicker
        variant={getWCA2Variant(
          chroma.contrast(foregroundColor, backgroundColor),
        )}
        label={label}
        color={foregroundColor}
        setColor={setFourgroundColor}
      />
      <InformationButton>
        <>
          <p>Original:</p>
          <ContrastList
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
          />
          <DBDivider />
          <p>Suggestions:</p>

          {getContrastSuggestion(backgroundColor, foregroundColor, 3) && (
            <ContrastList
              backgroundColor={backgroundColor}
              foregroundColor={getContrastSuggestion(
                backgroundColor,
                foregroundColor,
                3,
              )}
            />
          )}

          {getContrastSuggestion(backgroundColor, foregroundColor) && (
            <ContrastList
              backgroundColor={backgroundColor}
              foregroundColor={getContrastSuggestion(
                backgroundColor,
                foregroundColor,
              )}
            />
          )}

          {getContrastSuggestion(backgroundColor, foregroundColor, 7.5) && (
            <ContrastList
              backgroundColor={backgroundColor}
              foregroundColor={getContrastSuggestion(
                backgroundColor,
                foregroundColor,
                7.5,
              )}
            />
          )}
        </>
      </InformationButton>
    </div>
  );
};

export default ContrastChecker;
