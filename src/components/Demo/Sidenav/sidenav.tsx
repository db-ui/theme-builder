import { DBButton } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";

const buttons: string[] = [
  "dashboard",
  "document",
  "account",
  "build",
  "piggybank",
];

const Sidenav = () => {
  const { t } = useTranslation();
  return (
    <div
      className="demo-side-nav min-w-siz-3xl db-neutral-bg-lvl-1
    border-r p-fix-md flex flex-col gap-fix-md h-full overflow-y-auto"
    >
      {buttons.map((button) => (
        <DBButton icon={button} variant="text" width="full">
          {t(button)}
        </DBButton>
      ))}
    </div>
  );
};

export default Sidenav;
