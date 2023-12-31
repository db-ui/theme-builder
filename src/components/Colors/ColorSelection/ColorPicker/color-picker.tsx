import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { ColorPickerType } from "./data";
import { DBInput } from "@db-ui/react-components";
import "./index.scss";
import { ChromePicker } from "react-color";
import { isValidColor } from "../../../../utils";

const ColorPicker = ({
  label,
  color,
  setColor,
  variant,
  title,
  children,
  info,
}: PropsWithChildren<ColorPickerType>) => {
  const [colorPicker, setColorPicker] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    setError(isValidColor(color) ? undefined : "Invalid hex color");
  }, [color]);

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
          variant={info ? "informational" : error ? "critical" : variant}
          value={color}
          label={label}
          labelVariant="floating"
          message={error || info}
          onFocus={() => setColorPicker(false)}
          onChange={(event: any) => setColor(event.target.value)}
        />
      </div>

      {children}
    </div>
  );
};

export default ColorPicker;
