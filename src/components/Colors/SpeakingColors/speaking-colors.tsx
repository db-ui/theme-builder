import { useThemeBuilderStore } from "../../../store";
import { DBInput } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { SpeakingName } from "../../../utils/data.ts";

const SpeakingColors = () => {
  const { speakingNames } = useThemeBuilderStore((state) => state);
  const { t } = useTranslation();

  const updateSpeakingName = (speakingName: SpeakingName, index: number) => {
    const copyNames = [...speakingNames];
    copyNames[index] = speakingName;
    useThemeBuilderStore.setState({ speakingNames: copyNames });
  };

  return (
    <div data-tonality="functional" className="grid grid-cols-4 gap-fix-md">
      <h6>{t("colorName")}</h6>
      <h6>{t("dark")}</h6>
      <h6>{t("light")}</h6>
      <h6>{t("transparency")}</h6>
      {speakingNames.map((speakingName: SpeakingName, index: number) => (
        <Fragment key={speakingName.name}>
          <span>{speakingName.name}</span>
          <DBInput
            labelVariant="floating"
            label={t("dark")}
            value={speakingName.dark}
            type="number"
            min="0"
            max="12"
            onChange={(event) =>
              updateSpeakingName(
                { ...speakingName, dark: Number(event.target.value) },
                index,
              )
            }
          />
          <DBInput
            labelVariant="floating"
            label={t("light")}
            value={speakingName.light}
            type="number"
            min="0"
            max="12"
            onChange={(event) =>
              updateSpeakingName(
                { ...speakingName, light: Number(event.target.value) },
                index,
              )
            }
          />
          {speakingName.transparency ? (
            <DBInput
              labelVariant="floating"
              label={t("transparency")}
              value={speakingName.transparency}
              type="number"
              min="0"
              max="100"
              onChange={(event) =>
                updateSpeakingName(
                  { ...speakingName, transparency: Number(event.target.value) },
                  index,
                )
              }
            />
          ) : (
            <div></div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default SpeakingColors;
