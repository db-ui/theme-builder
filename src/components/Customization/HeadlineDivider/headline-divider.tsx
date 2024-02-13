import { HeadlineDividerPropsType } from "./data.ts";
import { DBDivider } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";

const HeadlineDivider = ({ headline }: HeadlineDividerPropsType) => {
  const { t } = useTranslation();
  return (
    <>
      <DBDivider margin="none" />

      <h5>{t(headline)}</h5>
    </>
  );
};

export default HeadlineDivider;
