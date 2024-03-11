import { SettingPropsType } from "./data.ts";
import { Fragment } from "react";
import {
  DBCheckbox,
  DBIcon,
  DBInfotext,
  DBInput,
  DBSelect,
  DBTextarea,
} from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import { useNode } from "@craftjs/core";
import SelectIconDialog from "./SelectIconDialog";

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
    <div className="flex flex-col gap-fix-md">
      {settings
        .filter((setting) => !setting.isHidden || !setting.isHidden(props))
        .map((setting) => (
          <Fragment key={`setting-${setting.key}`}>
            {(setting.type === "text" || setting.type === "number") && (
              <DBInput
                type={setting.type}
                min={
                  (setting.type === "number" && setting.numberOptions?.min) ||
                  undefined
                }
                max={
                  (setting.type === "number" && setting.numberOptions?.max) ||
                  undefined
                }
                step={
                  (setting.type === "number" && setting.numberOptions?.step) ||
                  undefined
                }
                dataList={setting.dataList}
                label={t(setting.key)}
                variant="floating"
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
                variant="floating"
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
                variant="floating"
                defaultValue={props[setting.key]}
                onChange={(event) =>
                  changeValue(
                    setting.key,
                    event.target.value,
                    setting.changeType,
                  )
                }
              >
                {setting.selectOptions?.map((option) => (
                  <option
                    value={option.value}
                    key={`select-${setting.key}-${option.label || option.value}`}
                  >
                    {t(option.label || option.value || "")}
                  </option>
                ))}
              </DBSelect>
            )}
            {setting.type === "switch" && (
              <DBCheckbox
                type={setting.type}
                label={t(setting.key)}
                checked={props[setting.key]}
                onChange={(event) =>
                  changeValue(
                    setting.key,
                    event.target.checked,
                    setting.changeType,
                  )
                }
              />
            )}
            {setting.type === "icon" && (
              <div className="flex gap-fix-md items-center">
                <div className="flex flex-col">
                  <DBInfotext size="small" icon="none">
                    {t(setting.key)}
                  </DBInfotext>
                  <span>{props[setting.key]}</span>
                </div>
                <DBIcon icon={props[setting.key]} />
                <SelectIconDialog
                  className="ml-auto"
                  selectedIcon={props[setting.key]}
                  onIconPick={(icon: string) => {
                    changeValue(setting.key, icon, setting.changeType);
                  }}
                />
              </div>
            )}
          </Fragment>
        ))}
    </div>
  );
};

export default Setting;
