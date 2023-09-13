import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { ColorPickerType } from "./data";
import { DBInput } from "@db-ui/react-components";
import "./index.scss";
import { ChromePicker } from "react-color";
import { isValidColor } from "../../../utils";

const ColorPicker = ({
  label,
  color,
  setColor,
  variant,
  title,
  children,
  contrastError,
}: PropsWithChildren<ColorPickerType>) => {
  const [colorPicker, setColorPicker] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    setError(
      contrastError
        ? contrastError
        : isValidColor(color)
        ? undefined
        : "Invalid hex color",
    );
  }, [color, contrastError]);

  return (
    <div className="color-picker-container">
      <div className="color-input-container">
        <button
          className="color"
          style={{ backgroundColor: color }}
          onClick={() => setColorPicker(true)}
          title="Change Color"
        >
          Change Color
        </button>
        {colorPicker && (
          <div>
            <button
              className="close-picker-button"
              onClick={() => setColorPicker(false)}
            />
            <ChromePicker
              className="color-picker"
              color={color}
              onChange={(color) => setColor(color.hex)}
              disableAlpha
            ></ChromePicker>
          </div>
        )}
        <DBInput
          title={title}
          variant={error ? "critical" : variant}
          value={color}
          label={label}
          message={error}
          onFocus={() => setColorPicker(false)}
          onChange={(event) => setColor(event.target.value)}
        />
      </div>

      {children}
    </div>
  );
};

export default ColorPicker;
