import { useTranslation } from "react-i18next";
import FakeDevice from "../FakeDevice";
import navigatorHeader from "../theme-builder-preview-navigator-header.jpeg";
import {
  DBButton,
  DBCheckbox,
  DBIcon,
  DBInput,
  DBLink,
} from "@db-ui/react-components";

const LoginScreen = () => {
  const { t } = useTranslation();

  return (
    <FakeDevice>
      <div
        data-color-scheme="light"
        className="navigator-image-container min-h-[218px]  md:min-h-[282px] relative flex flex-col
        justify-between items-center p-fix-md border-none"
      >
        <img
          className="absolute inset-0"
          src={navigatorHeader}
          alt="Preview Image"
        />
        <DBIcon icon="logo" className="z-10 h-siz-lg mx-auto" />
        <DBButton
          icon="menu"
          noText
          variant="ghost"
          className="absolute z-10 right-fix-xl"
        >
          Menu
        </DBButton>
        <h2 className="z-10 mx-auto relative mb-fix-xl">{t("login")}</h2>
      </div>
      <div className="flex flex-col p-fix-2xl justify-between h-full">
        <div className="flex flex-col gap-fix-md">
          <DBInput variant="floating" label={t("username")} />
          <DBInput
            variant="floating"
            label={t("password")}
            type="password"
          />
          <DBLink href="">{t("forgotPassword")}</DBLink>
        </div>
        <div className="flex flex-col gap-fix-md">
          <div className="checkbox">
            <DBCheckbox>{t("keepLogin")}</DBCheckbox>
          </div>
          <DBButton variant="brand" width="full">
            {t("login")}
          </DBButton>
        </div>
      </div>
    </FakeDevice>
  );
};

export default LoginScreen;
