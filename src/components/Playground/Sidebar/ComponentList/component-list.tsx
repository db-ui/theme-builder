import { DBInput } from "@db-ux/react-core-components";
import { useTranslation } from "react-i18next";
import { Components } from "./data.tsx";
import { Fragment, useState } from "react";
import ComponentCard from "./ComponentCard";

const ComponentList = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");

  return (
    <div
      className="flex flex-col gap-fix-md p-fix-md h-full overflow-y-auto"
      data-density="functional"
    >
      <DBInput
        type="search"
        variant="floating"
        label={t("search")}
        placeholder={t("search")}
        onChange={(event) => setSearch(event.target.value)}
      />
      {Components.filter(({ components }) =>
        components.some(({ name }) => t(name).includes(search)),
      ).map(({ headline, components }) => (
        <Fragment key={headline}>
          <h6>{t(headline)}</h6>
          <div className="grid grid-cols-2 gap-fix-sm">
            {components
              .filter(({ name }) => t(name).includes(search))
              .map(({ name, component, assetPath }) => (
                <Fragment key={`${headline}-${name}`}>
                  <ComponentCard
                    name={t(name)}
                    component={component}
                    assetPath={assetPath}
                  />
                </Fragment>
              ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default ComponentList;
