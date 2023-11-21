import { defaultLuminances } from "../../../utils/data.ts";
import { useThemeBuilderStore } from "../../../store";
import { Fragment } from "react";
import { getHeissluftColors } from "../../../utils/generate-colors.ts";
import { getLuminance } from "../../../utils";
import "./index.scss";

const ColorPalettes = () => {
  const { defaultColors } = useThemeBuilderStore((state) => state);

  return (
    <div className="flex gap-fix-2xs">
      <div className="grid grid-color-palettes grid-flow-col gap-fix-2xs items-center">
        <span></span>
        {defaultLuminances.map(({ name }) => (
          <span
            key={name}
            className="font-bold whitespace-nowrap text-end pr-fix-xs md:pr-fix-lg"
          >
            {name}
          </span>
        ))}
      </div>

      <div
        className="grid grid-color-palettes grid-flow-col gap-fix-2xs text-center 
      overflow-x-auto md:overflow-x-hidden w-full h-full overflow-y-hidden"
      >
        {defaultColors &&
          Object.keys(defaultColors)
            .filter((key) => !key.startsWith("on") && !key.startsWith("bg"))
            .map((key: any) => (
              <Fragment key={`${key}-header`}>
                <span className="font-bold pb-fix-sm">{key}</span>

                {getHeissluftColors(defaultColors[key]).map(({ hex }) => (
                  <div
                    className="palette-box"
                    style={{
                      backgroundColor: hex,
                      color: getLuminance(hex) < 0.4 ? "#fff" : "#000",
                    }}
                  >
                    {hex}
                  </div>
                ))}
              </Fragment>
            ))}
      </div>
    </div>
  );
};

export default ColorPalettes;
