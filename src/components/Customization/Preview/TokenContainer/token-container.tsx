import { DBCard, DBInput } from "@db-ui/react-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { tokenComponents, TokenComponentType } from "./data";
import { useThemeBuilderStore } from "../../../../store";
import Colors from "./data/colors.tsx";

const TokenContainer = () => {
  const { theme } = useThemeBuilderStore((state) => state);
  const [search, setSearch] = useState<string>("");
  const [colorToken, setColorToken] = useState<TokenComponentType[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    setColorToken(
      Object.keys({
        ...theme.colors,
        ...theme.additionalColors,
        ...theme.customColors,
      }).map((colorName) => ({
        title: colorName,
        component: <Colors colorName={colorName} />,
        isColor: true,
      })),
    );
  }, [t, theme.additionalColors, theme.colors, theme.customColors]);

  return (
    <div className="flex flex-col gap-fix-md">
      <DBInput
        variant="floating"
        label={t("search")}
        placeholder={t("search")}
        type="search"
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="flex flex-col gap-fix-sm w-full">
        {[...tokenComponents, ...colorToken].map(
          ({ title, component, isColor }) =>
            (isColor ? `${t("color")}: ${title}` : t(title))
              .toLowerCase()
              .includes(search.toLowerCase()) ? (
              <DBCard
                key={`token-card-${title}`}
                spacing="small"
                className="w-full"
              >
                <div className="flex flex-col gap-fix-sm">
                  <h5>{isColor ? `${t("color")}: ${title}` : t(title)}</h5>
                  {component}
                </div>
              </DBCard>
            ) : null,
        )}
      </div>
    </div>
  );
};

export default TokenContainer;
