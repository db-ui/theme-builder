import { useThemeBuilderStore } from "../../../../store";
import { DBButton, DBInput } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { SpeakingName } from "../../../../utils/data.ts";

const SpeakingColors = () => {
  const { speakingNames } = useThemeBuilderStore((state) => state);
  const { t } = useTranslation();

  const updateSpeakingName = (speakingName: SpeakingName, index: number) => {
    const copyNames = [...speakingNames];
    copyNames[index] = speakingName;
    useThemeBuilderStore.setState({ speakingNames: copyNames });
  };

  const updateAll = (light: boolean, increase: boolean) => {
    useThemeBuilderStore.setState({
      speakingNames: speakingNames.map((sName) => {
        const copyName = { ...sName };
        if (light) {
          copyName.light = increase ? copyName.light + 1 : copyName.light - 1;
        } else {
          copyName.dark = increase ? copyName.dark + 1 : copyName.dark - 1;
        }

        return copyName;
      }),
    });
  };

  return (
    <div data-density="functional" className="grid grid-cols-3 gap-fix-md">
      <div className="flex items-center">
        <h6>{t("colorName")}</h6>
      </div>
      <div className="flex items-center">
        <h6 className="mr-auto">{t("dark")}</h6>
        <DBButton
          icon="minus"
          noText
          variant="ghost"
          onClick={() => updateAll(false, false)}
        >
          Decrease
        </DBButton>
        <DBButton
          icon="plus"
          noText
          variant="ghost"
          onClick={() => updateAll(false, true)}
        >
          Increase
        </DBButton>
      </div>
      <div className="flex items-center">
        <h6 className="mr-auto">{t("light")}</h6>
        <DBButton
          icon="minus"
          noText
          variant="ghost"
          onClick={() => updateAll(true, false)}
        >
          Decrease
        </DBButton>
        <DBButton
          icon="plus"
          noText
          variant="ghost"
          onClick={() => updateAll(true, true)}
        >
          Increase
        </DBButton>
      </div>
      {speakingNames.map((speakingName: SpeakingName, index: number) => (
        <Fragment key={speakingName.name}>
          <span>{t(speakingName.name)}</span>
          <div className="flex gap-fix-md">
            <DBInput
              className="w-full"
              variant="floating"
              label={t("dark")}
              value={speakingName.dark}
              type="number"
              min="0"
              onChange={(event) =>
                updateSpeakingName(
                  { ...speakingName, dark: Number(event.target.value) },
                  index,
                )
              }
            />
            {speakingName.transparencyDark !== undefined && (
              <DBInput
                className="w-full"
                variant="floating"
                label={t("transparency")}
                value={speakingName.transparencyDark}
                type="number"
                min="0"
                max="100"
                onChange={(event) =>
                  updateSpeakingName(
                    {
                      ...speakingName,
                      transparencyDark: Number(event.target.value),
                    },
                    index,
                  )
                }
              />
            )}
          </div>
          <div className="flex gap-fix-md">
            <DBInput
              className="w-full"
              variant="floating"
              label={t("light")}
              value={speakingName.light}
              type="number"
              min="0"
              onChange={(event) =>
                updateSpeakingName(
                  { ...speakingName, light: Number(event.target.value) },
                  index,
                )
              }
            />
            {speakingName.transparencyLight !== undefined && (
              <DBInput
                className="w-full"
                variant="floating"
                label={t("transparency")}
                value={speakingName.transparencyLight}
                type="number"
                min="0"
                max="100"
                onChange={(event) =>
                  updateSpeakingName(
                    {
                      ...speakingName,
                      transparencyLight: Number(event.target.value),
                    },
                    index,
                  )
                }
              />
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default SpeakingColors;
