import { ALL_VARIABLES } from "../../../utils/data.ts";
import "./index.scss";
import { useThemeBuilderStore } from "../../../store";
import { useTranslation } from "react-i18next";
import {
  DBButton,
  DBDivider,
  DBIcon,
  DBPopover,
} from "@db-ui/react-components";
import { prefix } from "../../../utils/outputs.ts";
import { Fragment } from "react";

const hasInvertedTextColor = (key: string, darkMode: boolean): boolean => {
  if (darkMode) {
    return (
      key.includes("origin") || key.includes("text") || key === "on-bg-enabled"
    );
  }
  return (
    key.includes("origin") ||
    key.includes("text") ||
    key.includes("element") ||
    key.includes("border") ||
    key.includes("on-bg")
  );
};

const ColorTable = () => {
  const { t } = useTranslation();
  const { colors, darkMode } = useThemeBuilderStore((state) => state);

  const enabledVariables = ALL_VARIABLES.filter((varKey) =>
    varKey.endsWith("enabled"),
  );

  const copy = (notification: string, text: string) => {
    navigator.clipboard.writeText(text || "");
    useThemeBuilderStore.setState({
      notification: `${notification} ${t("copied")}`,
    });
  };

  return (
    <div className="flex gap-fix-2xs">
      <div className="grid grid-rows grid-flow-col gap-fix-2xs items-center">
        <span></span>
        {enabledVariables.map((varKey) => (
          <span
            key={varKey}
            className="font-bold whitespace-nowrap text-end pr-fix-xs md:pr-fix-lg"
          >
            {t(varKey)}
          </span>
        ))}
      </div>

      <div
        className="grid grid-rows grid-flow-col gap-fix-2xs text-center 
      overflow-x-auto md:overflow-x-hidden w-full h-full overflow-y-hidden"
      >
        {colors &&
          colors.length > 0 &&
          colors.map((color: any, colorIndex: number) => (
            <Fragment key={`${color.name}-header`}>
              <span className="font-bold pb-fix-sm">{color.name}</span>

              {enabledVariables.map((varKey) => {
                const style: any = {
                  "--color": color[varKey],
                };
                const name = color.name;
                const enabled = varKey;
                const hover = varKey.replace("enabled", "hover");
                const pressed = varKey.replace("enabled", "pressed");
                const states = [enabled, hover, pressed];
                const hoverColor = color[hover];
                const pressedColor = color[pressed];
                style["--color-hover"] = hoverColor;
                style["--color-pressed"] = pressedColor;

                return (
                  <div
                    key={`${varKey}-${color.name}-cell`}
                    className="color-box"
                    style={style}
                  >
                    <DBIcon
                      icon="info"
                      className={`my-auto ml-auto mr-fix-sm ${
                        hasInvertedTextColor(varKey, darkMode) && "inverted"
                      }`}
                    >
                      Info
                      <DBPopover
                        className="db-ui-functional"
                        spacing="small"
                        delay="slow"
                        animation="disabled"
                        gap
                        placement={colorIndex < 3 ? "right" : "left"}
                      >
                        {states.map((state, index) => (
                          <div
                            key={`${name}-${state}`}
                            className="flex flex-col w-[368px]"
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="font-bold col-span-4 whitespace-nowrap">{`--${prefix}-${name}-${state}`}</span>
                              <DBButton
                                icon="copy"
                                variant="text"
                                noText
                                onClick={() => {
                                  copy("Token", `--${prefix}-${name}-${state}`);
                                }}
                              >
                                Copy
                              </DBButton>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <div className="flex gap-fix-sm items-center">
                                <div
                                  className="color-preview"
                                  style={{ backgroundColor: color[state] }}
                                />
                                <span>HEX: {color[state]}</span>
                              </div>
                              <DBButton
                                icon="copy"
                                variant="text"
                                noText
                                onClick={() => {
                                  copy(t("color"), color[state]);
                                }}
                              >
                                Copy
                              </DBButton>
                            </div>
                            {index !== states.length - 1 && <DBDivider />}
                          </div>
                        ))}
                      </DBPopover>
                    </DBIcon>
                  </div>
                );
              })}
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default ColorTable;
