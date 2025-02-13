import { DBSection } from "@db-ux/react-core-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <DBSection
      spacing="medium"
      width="large"
      className="flex items-center db-brand-bg-basic-level-3"
    >
      <div className="flex flex-col gap-fix-xl items-center text-center text-balance">
        <h2 data-icon-after="heart">{t("landingMoreTitle")}</h2>
        <div className="flex flex-col md:flex-row gap-fix-md mx-auto items-center">
          <Link
            to="/playground"
            className="db-button capitalize hidden md:block"
            target="_blank"
            data-variant="filled"
            data-width="full"
          >
            {t("tryIt")}
          </Link>
          <a
            className="db-button capitalize"
            data-variant="brand"
            href="https://marketingportal.extranet.deutschebahn.com/marketingportal"
            target="_blank"
            data-width="full"
          >
            {t("gettingStarted")}
          </a>
        </div>
      </div>
    </DBSection>
  );
};

export default Footer;
