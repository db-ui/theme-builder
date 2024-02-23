import { components } from "./data.tsx";
import { DBCard, DBInput } from "@db-ui/react-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ComponentContainer = () => {
  const [search, setSearch] = useState<string>("");
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-fix-md">
      <DBInput
        variant="floating"
        className="md:w-1/2"
        label={t("search")}
        placeholder={t("search")}
        type="search"
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="grid gap-fix-sm">
        {components.map((list) => {
          if (list.title.toLowerCase().includes(search.toLowerCase())) {
            return (
              <DBCard key={`component-list-${list.title}`} spacing="small">
                <div className="flex flex-col gap-fix-sm">
                  <h5>{list.title}</h5>
                  <div className="flex flex-wrap gap-fix-sm items-center">
                    {list.component}
                  </div>
                </div>
              </DBCard>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default ComponentContainer;
