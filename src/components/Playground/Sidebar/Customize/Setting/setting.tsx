import { SettingPropsType } from "./data.ts";
import { Fragment } from "react";
import {
  DBCheckbox,
  DBInput,
  DBSelect,
  DBTextarea,
} from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import { useNode } from "@craftjs/core";

const Setting = ({ settings }: SettingPropsType) => {
  const { t } = useTranslation();

  const {
    actions: { setProp, setCustom, setHidden },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  const changeValue = (
    key: string,
    value: any,
    changeType?: "props" | "custom" | "hidden",
  ) => {
    if (changeType === "custom") {
      setCustom((props: any) => (props[key] = value));
    } else if (changeType === "hidden") {
      setHidden(value);
    } else {
      setProp((props: any) => (props[key] = value));
    }
  };

  return (
    <div className="flex flex-col gap-fix-sm">
      {settings
        .filter((setting) => !setting.isHidden || !setting.isHidden(props))
        .map((setting) => (
          <Fragment key={`setting-${setting.key}`}>
            {(setting.type === "text" || setting.type === "number") && (
              <DBInput
                type={setting.type}
                label={t(setting.key)}
                defaultValue={props[setting.key]}
                onChange={(event) =>
                  changeValue(
                    setting.key,
                    event.target.value,
                    setting.changeType,
                  )
                }
              />
            )}
            {setting.type === "textarea" && (
              <DBTextarea
                type={setting.type}
                label={t(setting.key)}
                defaultValue={props[setting.key]}
                onChange={(event) =>
                  changeValue(
                    setting.key,
                    event.target.value,
                    setting.changeType,
                  )
                }
              />
            )}
            {setting.type === "select" && (
              <DBSelect
                type={setting.type}
                label={t(setting.key)}
                defaultValue={props[setting.key]}
                onChange={(event) =>
                  changeValue(
                    setting.key,
                    event.target.value,
                    setting.changeType,
                  )
                }
              >
                {setting.options?.map((option) => (
                  <option
                    value={option.value}
                    key={`select-${setting.key}-${option.label}`}
                  >
                    {t(option.label || "")}
                  </option>
                ))}
              </DBSelect>
            )}
            {setting.type === "switch" && (
              <DBCheckbox
                type={setting.type}
                label={t(setting.key)}
                defaultValue={props[setting.key]}
                onChange={(event) =>
                  changeValue(
                    setting.key,
                    event.target.checked,
                    setting.changeType,
                  )
                }
              />
            )}
          </Fragment>
        ))}
    </div>
  );
};

export default Setting;
