import FakeDevice from "../FakeDevice";
import { useTranslation } from "react-i18next";
import {
  DBNotification,
  DBButton,
  DBDivider,
  DBIcon,
  DBInfotext,
  DBInput,
  DBLink,
  DBTag,
} from "@db-ui/react-components";

const NavigationScreen = () => {
  const { t } = useTranslation();
  return (
    <FakeDevice>
      <div className="flex flex-col db-density-functional h-full">
        <div className="flex p-fix-sm relative">
          <DBButton
            variant="ghost"
            icon="arrow_back"
            noText
            className="absolute"
          >
            Back
          </DBButton>
          <h3 className="mx-auto">{t("connections")}</h3>
        </div>
        <div className="db-neutral-bg-basic-transparent-semi px-fix-xl py-fix-md flex flex-col">
          <div className="flex flex-col gap-fix-md mb-fix-md">
            <DBInput
              variant="floating"
              label={t("from")}
              value="Stuttgart Hbf"
            />
            <DBInput
              variant="floating"
              label={t("to")}
              value="Frankfurt (Main) Hbf"
            />
          </div>
          <div className="flex gap-fix-md items-center">
            <span data-icon="schedule">{t("today")}, 00:00</span>
            <span data-icon="user">1 Pers.</span>
            <DBButton variant="ghost" icon="filter" className="ml-auto">
              {t("options")}
            </DBButton>
          </div>
          <DBDivider />
          <div className="flex justify-between items-center">
            <DBButton variant="ghost" icon="walking_fast">
              {t("fastestConnection")}
            </DBButton>
            <DBLink href="">{t("active")}</DBLink>
          </div>
        </div>
        <div className="flex justify-end gap-fix-md p-fix-xl">
          <DBButton>{t("now")}</DBButton>
          <DBButton>{t("later")}</DBButton>
        </div>
        <DBNotification semantic="informational">{t("iceInformation")}</DBNotification>

        <div className="grid grid-cols-12 gap-fix-xs py-fix-sm px-fix-lg h-full items-center">
          <strong className="col-span-2 ml-auto">12:00</strong>
          <DBIcon icon="start" className="col-span-1 opacity-50">
            journeyStart
          </DBIcon>
          <div className="col-span-7 flex items-center">
            <h6>Start (M) Hbf</h6>
          </div>
          <DBTag
            className="col-span-2 mx-auto"
            semantic="informational"
            emphasis="strong"
          >
            GL. 1
          </DBTag>

          <div className="col-span-2 ml-auto my-auto flex flex-col">
            <span className="text-end">1h</span>
            <span>30min</span>
          </div>
          <div className="col-span-1 relative travel-line-container">
            <div className="travel-line absolute" />
          </div>
          <div className="col-span-7 flex flex-col gap-fix-xs">
            <DBTag icon="ice" emphasis="strong">
              ICE 2
            </DBTag>
            <span>{t("to")} End Hbf</span>
            <DBInfotext semantic="critical" icon="aisle_not_available">
              {t("reservationNotPossible")}
            </DBInfotext>
            <DBInfotext icon="chevron_right">10 {t("stops")}</DBInfotext>
          </div>
          <div className="col-span-2" />

          <strong className="col-span-2 ml-auto">12:00</strong>
          <DBIcon icon="destination" className="col-span-1  opacity-50">
            journeyEnd
          </DBIcon>
          <div className="col-span-7 flex items-center">
            <h6>End (M) Hbf</h6>
          </div>
          <DBTag
            className="col-span-2 mx-auto"
            semantic="informational"
            emphasis="strong"
          >
            GL. 1
          </DBTag>
        </div>
      </div>
    </FakeDevice>
  );
};

export default NavigationScreen;
