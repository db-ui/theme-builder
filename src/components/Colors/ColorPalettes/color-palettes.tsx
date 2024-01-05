import { useThemeBuilderStore } from "../../../store";
import { useEffect, useState } from "react";
import { getHeissluftColors } from "../../../utils/generate-colors.ts";
import { getLuminance } from "../../../utils";
import "./index.scss";
import { DBInput } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";

const ColorPalettes = () => {
  const { defaultColors, customColors, luminanceSteps } = useThemeBuilderStore(
    (state) => state,
  );
  const { t } = useTranslation();

  const [allColors, setAllColors] = useState<any>({});

  useEffect(() => {
    setAllColors({ ...defaultColors, ...customColors });
  }, [defaultColors, customColors]);

  return (
    <div className="flex flex-col">
      <DBInput
        label={t("luminanceSteps")}
        value={luminanceSteps}
        onChange={(event) => {
          const luminanceSteps = event.target.value
            .split(",")
            .map((step) => Number(step || 0));
          useThemeBuilderStore.setState({
            luminanceSteps,
          });
        }}
      />
      <div className="flex gap-fix-2xs overflow-auto">
        <div className="flex flex-col gap-fix-2xs items-center grid-color-palettes">
          <div className="py-fix-sm">
            <span className="font-bold invisible">Palette</span>
          </div>
          {luminanceSteps.map((luminance, index) => (
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
          const heissluftColors = getHeissluftColors(
            allColors[key],
            luminanceSteps,
          );
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
