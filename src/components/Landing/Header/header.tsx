import { BASE_PATH } from "../../../constants.ts";
import { getThemeImage } from "../../../utils";
import { useThemeBuilderStore } from "../../../store";

const Header = () => {
  const { defaultTheme, darkMode } = useThemeBuilderStore((state) => state);
  return (
    <div className="py-fix-xs px-fix-md md:py-fix-md">
      <div className="flex justify-between min-h-siz-md">
        <img
          className="logo"
          src={getThemeImage(
            darkMode && defaultTheme.branding.image.dark
              ? defaultTheme.branding.image.dark
              : defaultTheme.branding.image.light,
          )}
          alt="brand"
        />
        <a
          href="https://github.com/db-ui/theme-builder"
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
    </div>
  );
};

export default Header;
