import { SelectColorDialogPropsType } from "./data.ts";
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
import { COLORS } from "@db-ui/react-components/dist/shared/constants";

const SelectColorDialog = ({
  className,
  onColorPick,
  selectedColor,
}: SelectColorDialogPropsType) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  return (
    <>
      <DBButton
        className={className}
        icon="magnifying_glass"
        noText
        onClick={() => setOpen(true)}
      >
        {t("playgroundSelectColor")}
        <DBTooltip placement="left">{t("playgroundSelectColor")}</DBTooltip>
      </DBButton>
      <DBDrawer
        backdrop="weak"
        direction="up"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        withCloseButton
        drawerHeader={
          <div className="flex gap-fix-3xl">
            <span className="my-auto">{t("playgroundSelectColor")}</span>
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
        <div className="grid-cols-3 md:grid-cols-5 grid gap-fix-md p-fix-sm overflow-y-auto h-full">
          {[...COLORS, "none"]
            .filter((color) => color.includes(filter))
            .map((color) => (
              <button
                key={`color-button-${color}`}
                onClick={() => onColorPick(color)}
              >
                <DBCard
                  data-interactive="elevation"
                  style={{backgroundColor: "var(--db-current-color-bg-enabled)"}}
                  className={`flex-row min-h-siz-lg gap-fix-md justify-between items-center db-${color}`}
                  spacing="small"
                >
                  {color}
                  {selectedColor === color && (
                    <DBIcon icon="done">Selected color</DBIcon>
                  )}
                </DBCard>
              </button>
            ))}
        </div>
      </DBDrawer>
    </>
  );
};

export default SelectColorDialog;
