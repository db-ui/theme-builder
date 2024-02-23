import { getLuminance } from "../../../../utils";
import { HeisslufType } from "../../../../utils/data.ts";
import { ReactNode } from "react";

const PaletteBox = ({
  hue,
  hex,
  saturation,
  luminance,
  children,
  index,
  hideText,
}: HeisslufType & {
  children?: ReactNode;
  index?: number;
  hideText?: boolean;
}) => {
  return (
    <div
      className="palette-box gap-fix-md"
      style={{
        backgroundColor: hex,
        color: getLuminance(hex) < 0.4 ? "#fff" : "#000",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /* @ts-expect-error */
        "--color-index": index,
      }}
    >
      {children}
      {!hideText && (
        <div className="flex flex-col">
          <span className="whitespace-nowrap">hex: {hex}</span>
          <span className="whitespace-nowrap">
            hsl: {Math.round(hue)}/{Math.round(saturation)}/
            {Math.round(luminance)}
          </span>
        </div>
      )}
    </div>
  );
};

export default PaletteBox;
