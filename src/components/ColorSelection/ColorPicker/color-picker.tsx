import type { PropsWithChildren } from "react";
import { useState } from "react";
import { ColorPickerType } from "./data";
import { DBInput } from "@db-ui/react-components";
import "./index.scss";
import { ChromePicker } from "react-color";

const ColorPicker = ({
  label,
  color,
  setColor,
  variant,
  title,
  children,
}: PropsWithChildren<ColorPickerType>) => {
  const [colorPicker, setColorPicker] = useState<boolean>();

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
          variant={variant}
          value={color}
          label={label}
          onFocus={() => setColorPicker(false)}
          onChange={(event) => {
            setColor(event.target.value);
          }}
        />
      </div>

      {children}
    </div>
  );
};

export default ColorPicker;
