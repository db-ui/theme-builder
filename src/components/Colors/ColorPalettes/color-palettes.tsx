import { useThemeBuilderStore } from "../../../store";
import { useEffect, useState } from "react";
import { getHeissluftColors } from "../../../utils/generate-colors.ts";
import { getLuminance } from "../../../utils";
import "./index.scss";
import { defaultLuminances } from "../../../utils/data.ts";

const ColorPalettes = () => {
  const { defaultColors, customColors, darkMode } = useThemeBuilderStore(
    (state) => state,
  );

  const [allColors, setAllColors] = useState<any>({});

  useEffect(() => {
    setAllColors({ ...defaultColors, ...customColors });
  }, [defaultColors, customColors]);

  return (
    <div className="flex">
      <div className="flex gap-fix-2xs overflow-auto">
        <div className="flex flex-col gap-fix-2xs items-center grid-color-palettes">
          <div className="py-fix-sm">
            <span className="font-bold invisible">Palette</span>
          </div>
          {defaultLuminances.map((luminance, index) => (
            <div
              className="flex items-center"
              key={`luminance-step-${luminance}`}
            >
              <span className="font-bold whitespace-nowrap pr-fix-xs md:pr-fix-lg">
                {index}
              </span>
            </div>
          ))}
        </div>

        {Object.keys(allColors).map((key: any) => {
          const heissluftColors = getHeissluftColors(allColors[key], darkMode);
          return (
            <div
              key={`${key}-header`}
              className="flex flex-col gap-fix-2xs items-center grid-color-palettes"
            >
              <div className="py-fix-sm">
                <span className="font-bold">{key}</span>
              </div>

              {heissluftColors.map(
                ({ hex, hue, saturation, luminance }, index) => (
                  <div
                    key={`${key}-${hex}-${index}`}
                    className="palette-box"
                    style={{
                      backgroundColor: hex,
                      color: getLuminance(hex) < 0.4 ? "#fff" : "#000",
                    }}
                  >
                    <span className="whitespace-nowrap">hex: {hex}</span>
                    <span className="whitespace-nowrap">
                      hsl: {Math.round(hue)}/{Math.round(saturation)}/
                      {Math.round(luminance)}
                    </span>
                  </div>
                ),
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPalettes;
