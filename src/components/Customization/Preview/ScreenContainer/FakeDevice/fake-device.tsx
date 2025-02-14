import { PropsWithChildren, useEffect, useState } from "react";
import { DBIcon } from "@db-ux/react-core-components";

const getLocalTime = (date: Date): string => {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const FakeDevice = ({ children }: PropsWithChildren) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="fake-device rounded-[32px] w-[312px] md:w-[376px] h-[668px]
    flex flex-col db-bg-base"
    >
      <div className="fake-device-bar h-siz-md py-fix-sm flex justify-between  db-density-functional">
        {getLocalTime(currentTime)}
        <div className="flex gap-fix-xs">
          <DBIcon icon="cloud_upload" />
          <DBIcon icon="mail" />
          <DBIcon icon="wifi" />
        </div>
      </div>
      {children}
    </div>
  );
};

export default FakeDevice;
