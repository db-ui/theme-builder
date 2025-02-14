import { DBButton } from "@db-ux/react-core-components";
import { useTranslation } from "react-i18next";

const buttons: string[] = [
  "folder_open",
  "document",
  "person",
  "wrench",
  "toys",
];

const Sidenav = () => {
  const { t } = useTranslation();
  return (
    <div
      className="demo-side-nav w-full min-w-auto md:min-w-fit  md:w-auto db-neutral-bg-basic-level-1
      p-fix-md gap-fix-md mx-[1px] md:mx-0
    border-b md:border-b-0 md:border-r
    flex md:flex-col h-auto md:h-full
    overflow-x-auto overflow-y-hidden md:overflow-x-hidden md:overflow-y-auto"
    >
      {buttons.map((button) => (
        <DBButton
          key={`dashboard-sidenav-button-${button}`}
          icon={button}
          variant="ghost"
          width="full"
        >
          {t(button)}
        </DBButton>
      ))}
    </div>
  );
};

export default Sidenav;
