import { BASE_PATH } from "../../../constants.ts";
import { useDarkMode } from "usehooks-ts";
import { getThemeImage } from "../../../utils";
import { useThemeBuilderStore } from "../../../store";

const Header = () => {
  const { defaultTheme } = useThemeBuilderStore((state) => state);
  const { isDarkMode } = useDarkMode();
  return (
    <div className="py-fix-xs px-fix-md md:py-fix-md">
      <div className="flex justify-between min-h-siz-md">
        <img className="logo" src={getThemeImage(defaultTheme.image)} alt="brand" />
        <a
          href="https://github.com/db-ui/theme-builder"
          target="_blank"
          referrerPolicy="no-referrer"
        >
          <img
            className="my-auto logo"
            src={`${BASE_PATH}/assets/images/github-mark${isDarkMode ? "-white" : ""}.svg`}
            alt="GitHub Mark"
          />
        </a>
      </div>
    </div>
  );
};

export default Header;
