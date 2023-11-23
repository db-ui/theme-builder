import { useThemeBuilderStore } from "../../../store";
import { useEffect, useState } from "react";
import { getHeissluftColors } from "../../../utils/generate-colors.ts";
import { getLuminance } from "../../../utils";
import "./index.scss";
import { DBInfotext, DBInput, DBLink } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";

const ColorPalettes = () => {
  const { t } = useTranslation();
  const { defaultColors, customColors, luminanceSteps } = useThemeBuilderStore(
    (state) => state,
  );
  const [stepsInput, setStepsInput] = useState<string>(
    luminanceSteps.join(", "),
  );
  const [invalidSteps, setInvalidSteps] = useState<boolean>();
  const [allColors, setAllColors] = useState<any>({});

  const setLuminanceSteps = (changedLuminanceSteps: number[]) => {
    useThemeBuilderStore.setState({
      luminanceSteps: changedLuminanceSteps,
    });
  };

  useEffect(() => {
    setAllColors({ ...defaultColors, ...customColors });
  }, [defaultColors, customColors]);

  useEffect(() => {
    const isValid = /^[0-9,\s]*$/.test(stepsInput);
    if (isValid) {
      setLuminanceSteps(
        stepsInput
          .split(",")
          .map((v: string) => v.trim())
          .filter((v: string) => v.length > 0)
          .map((v: string) => Number(v)),
      );
    }
    setInvalidSteps(!isValid);
  }, [stepsInput]);

  return (
    <div className="flex flex-col gap-fix-2xs">
      <DBInfotext variant="informational">
        {t("powerLawLabelStart")}
        <DBLink
          className="mx-fix-2xs"
          target="_blank"
          referrerpolicy="no-referrer"
          content="external"
          variant="inline"
          href="https://en.wikipedia.org/wiki/Stevens%27s_power_law"
        >
          {t("powerLawLinkLabel")}
        </DBLink>
        {t("powerLawLabelEnd")}
      </DBInfotext>
      <DBInput
        className="w-full"
        value={stepsInput}
        label={t("luminanceSteps")}
        message={t("luminanceMessage")}
        invalid={invalidSteps}
        onChange={(event) => {
          setStepsInput(event.target.value);
        }}
      />
      <div className="flex gap-fix-2xs overflow-auto">
        <div className="flex flex-col gap-fix-2xs items-center grid-color-palettes">
          <div className="py-fix-sm">
            <span className="font-bold invisible">Palette</span>
          </div>
          {[...luminanceSteps, "white"].map((luminance) => (
            <div
              className="flex items-center"
              key={`luminance-step-${luminance}`}
            >
              <span className="font-bold whitespace-nowrap pr-fix-xs md:pr-fix-lg">
                {luminance}
              </span>
            </div>
          ))}
          <div className="flex items-center mt-fix-xl">
            <span className="font-bold whitespace-nowrap pr-fix-xs md:pr-fix-lg">
              origin
            </span>
          </div>
        </div>

        {Object.keys(allColors)
          .filter((key) => !key.startsWith("onBrand") && !key.startsWith("bg"))
          .map((key: any) => {
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
                      className={`palette-box${
                        index === heissluftColors.length - 1 ? " mt-fix-xl" : ""
                      }`}
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
