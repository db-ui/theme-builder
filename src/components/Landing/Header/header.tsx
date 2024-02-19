import { BASE_PATH } from "../../../constants.ts";
import { useDarkMode } from "usehooks-ts";
import { DBIcon } from "@db-ui/react-components";

const Header = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="py-fix-xs px-fix-md md:py-fix-md">
      <div className="flex justify-between min-h-siz-md">
        <DBIcon
          icon="peace-in-a-box"
          data-icon-family="piab"
          className="brand-icon"
        >
          Brand Icon
        </DBIcon>
        <a
          href="https://github.com/db-ui/theme-builder"
          target="_blank"
          referrerPolicy="no-referrer"
        >
          <img
            className="my-auto"
            src={`${BASE_PATH}/assets/images/github-mark${isDarkMode ? "-white" : ""}.svg`}
            alt="GitHub Mark"
            height={24}
            width={34}
          />
        </a>
      </div>
    </div>
  );
};

export default Header;
