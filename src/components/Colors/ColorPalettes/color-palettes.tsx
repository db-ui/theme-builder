import { useThemeBuilderStore } from "../../../store";
import { Fragment, useEffect, useState } from "react";
import { getHeissluftColors } from "../../../utils/generate-colors.ts";
import "./index.scss";
import { DBInput, DBPopover } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import PaletteBox from "./PaletteBox";
import chroma from "chroma-js";

const ColorPalettes = () => {
  const { defaultColors, customColors, luminanceSteps, developerMode } =
    useThemeBuilderStore((state) => state);
  const { t } = useTranslation();

  const [allColors, setAllColors] = useState<any>({});

  useEffect(() => {
    setAllColors({ ...defaultColors, ...customColors });
  }, [defaultColors, customColors]);

  return (
    <div className="flex flex-col">
      {developerMode && (
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
      )}
      <div className="flex gap-fix-2xs">
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

        {Object.keys(allColors).map((key: any, colorIndex: number) => {
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
                  <Fragment key={`${key}-${hex}-${index}`}>
                    <PaletteBox
                      hex={hex}
                      hue={hue}
                      saturation={saturation}
                      luminance={luminance}
                      index={index}
                    >
                      <DBPopover
                        placement={
                          colorIndex > 3 ? "left-start" : "right-start"
                        }
                      >
                        <div className="flex flex-col gap-fix-2xs items-center grid-color-palettes">
                          {heissluftColors.map((popoverColor, tooltipIndex) => (
                            <Fragment
                              key={`popover-${key}-${popoverColor.hex}-${tooltipIndex}`}
                            >
                              <PaletteBox
                                hex={popoverColor.hex}
                                hue={popoverColor.hue}
                                saturation={popoverColor.saturation}
                                luminance={popoverColor.luminance}
                                hideText
                              >
                                <span className="m-auto">
                                  {chroma
                                    .contrast(
                                      chroma.hex(hex),
                                      chroma.hex(popoverColor.hex),
                                    )
                                    .toFixed(2)}
                                </span>
                              </PaletteBox>
                            </Fragment>
                          ))}
                        </div>
                      </DBPopover>
                    </PaletteBox>
                  </Fragment>
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
