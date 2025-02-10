import { useThemeBuilderStore } from "../../../../store";
import { useEffect, useState } from "react";
import { getHeissluftColors } from "../../../../utils/generate-colors.ts";
import "./index.scss";
import { DBInput } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import chroma from "chroma-js";
import PaletteBox from "./PaletteBox";
import { isValidColor } from "../../../../utils";
import { DefaultColorType } from "../../../../utils/data.ts";
import { Hsluv } from "hsluv";

const ColorPalettes = () => {
  const { luminanceSteps, developerMode, theme } = useThemeBuilderStore(
    (state) => state,
  );
  const { t } = useTranslation();

  const [allColors, setAllColors] = useState<Record<string, DefaultColorType>>(
    {},
  );

  const [selectedColor, setSelectedColor] = useState<{
    colorIndex: number;
    index: number;
  }>({ colorIndex: -1, index: -1 });

  useEffect(() => {
    setAllColors({
      ...theme.colors,
      ...theme.additionalColors,
      ...theme.customColors,
    });
  }, [theme]);

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

          <div className="flex items-center">
            <span className="font-bold whitespace-nowrap pr-fix-xs md:pr-fix-lg">
              origin-light
            </span>
          </div>

          <div className="flex items-center">
            <span className="font-bold whitespace-nowrap pr-fix-xs md:pr-fix-lg">
              origin-dark
            </span>
          </div>
        </div>

        {Object.entries(allColors)
          .filter(([, value]) => isValidColor(value.origin))
          .map(([key, value], colorIndex) => {
            const heissluftColors = getHeissluftColors(
              key,
              value.origin,
              luminanceSteps,
            );

            const originLight = new Hsluv();
            originLight.hex = value.originLightDefault || "";
            originLight.hexToHsluv();

            const originDark = new Hsluv();
            originDark.hex = value.originDarkDefault || "";
            originDark.hexToHsluv();

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
                      className="flex gap-fix-sm items-center justify-center"
                      key={`${key}-${hex}-${index}`}
                    >
                      {developerMode ? (
                        <>
                          <button
                            className="relative"
                            data-focus={
                              colorIndex === selectedColor.colorIndex &&
                              index === selectedColor.index
                            }
                            onClick={() => {
                              if (
                                selectedColor.index === index &&
                                selectedColor.colorIndex === colorIndex
                              ) {
                                setSelectedColor({ colorIndex: -1, index: -1 });
                              } else {
                                setSelectedColor({ colorIndex, index });
                              }
                            }}
                          >
                            <PaletteBox
                              hex={hex}
                              hue={hue}
                              saturation={saturation}
                              luminance={luminance}
                              index={index}
                            />
                          </button>
                          {colorIndex === selectedColor.colorIndex && (
                            <PaletteBox
                              hex={hex}
                              hue={hue}
                              saturation={saturation}
                              luminance={luminance}
                              hideText
                            >
                              <span className="m-auto">
                                {chroma
                                  .contrast(
                                    chroma.hex(hex),
                                    chroma.hex(
                                      heissluftColors[selectedColor.index].hex,
                                    ),
                                  )
                                  .toFixed(2)}
                              </span>
                            </PaletteBox>
                          )}
                        </>
                      ) : (
                        <PaletteBox
                          hex={hex}
                          hue={hue}
                          saturation={saturation}
                          luminance={luminance}
                          index={index}
                        />
                      )}
                    </div>
                  ),
                )}

                {value.originLightDefault && (
                  <PaletteBox
                    hex={originLight.hex}
                    hue={originLight.hsluv_h}
                    saturation={originLight.hsluv_s}
                    luminance={originLight.hsluv_l}
                  />
                )}

                {value.originDarkDefault && (
                  <PaletteBox
                    hex={originDark.hex}
                    hue={originDark.hsluv_h}
                    saturation={originDark.hsluv_s}
                    luminance={originDark.hsluv_l}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ColorPalettes;
