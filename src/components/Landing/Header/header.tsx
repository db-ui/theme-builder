import { BASE_PATH } from "../../../constants.ts";
import { getThemeImage } from "../../../utils";
import { useThemeBuilderStore } from "../../../store";
import { DBSection } from "@db-ux/react-core-components";

const Header = () => {
  const { theme, darkMode } = useThemeBuilderStore((state) => state);
  return (
    <DBSection spacing="none" width="large">
      <div className="flex justify-between min-h-siz-md py-fix-xs md:py-fix-md">
        <img
          className="logo"
          src={getThemeImage(
            darkMode && theme.branding.image.dark
              ? theme.branding.image.dark
              : theme.branding.image.light,
          )}
          alt="brand"
        />
        <a
          href="https://github.com/db-ux-design-system/theme-builder"
          target="_blank"
          referrerPolicy="no-referrer"
        >
          <img
            className="my-auto logo"
            src={`${BASE_PATH}/assets/images/github-mark${darkMode ? "-white" : ""}.svg`}
            alt="GitHub Mark"
          />
        </a>
      </div>
    </DBSection>
  );
};

export default Header;
