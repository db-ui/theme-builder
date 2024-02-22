import { SelectIconDialogPropsType } from "./data.ts";
import { useState } from "react";
import {
  DBButton,
  DBCard,
  DBDrawer,
  DBIcon,
  DBInput,
  DBTooltip,
} from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import { ALL_ICONS } from "@db-ui/react-components/dist/shared/all-icons";

const SelectIconDialog = ({
  className,
  onIconPick,
  selectedIcon,
}: SelectIconDialogPropsType) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  return (
    <>
      <DBButton
        className={className}
        icon="push_button"
        noText
        onClick={() => setOpen(true)}
      >
        {t("playgroundSelectIcon")}
        <DBTooltip placement="left">{t("playgroundSelectIcon")}</DBTooltip>
      </DBButton>
      <DBDrawer
        backdrop="weak"
        direction="up"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        withCloseButton
        slotDrawerHeader={
          <div className="flex gap-fix-3xl">
            <span className="my-auto">{t("playgroundSelectIcon")}</span>
            <DBInput
              type="search"
              variant="floating"
              label={t("search")}
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          </div>
        }
        className="select-icon-dialog"
      >
        <div className="grid-cols-3 md:grid-cols-6 grid gap-fix-md p-fix-2xs overflow-y-auto h-full">
          {["none", ...ALL_ICONS]
            .filter((icon) => icon.includes(filter))
            .map((icon) => (
              <button
                className={icon === "none" ? "h-full" : "h-fit"}
                onClick={() => onIconPick(icon)}
              >
                <DBCard
                  data-interactive="elevation"
                  className={`items-center ${icon === "none" ? " h-full" : ""}${icon === selectedIcon ? " db-successful-bg-lvl-3" : ""}`}
                  spacing="small"
                >
                  {icon !== "none" && <DBIcon icon={icon} />}
                  <span className="break-all m-auto">{icon}</span>
                </DBCard>
              </button>
            ))}
        </div>
      </DBDrawer>
    </>
  );
};

export default SelectIconDialog;
