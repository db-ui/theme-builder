import { DBButton, DBCheckbox } from "@db-ui/react-components";
import "./index.scss";
import { useThemeBuilderStore } from "../../data";
import { downloadTheme } from "../../utils";

const ActionBar = () => {
  const { darkMode, defaultColors, resetDefaultColors } = useThemeBuilderStore(
    (state) => state,
  );

  return (
    <div className="action-bar">
      <DBButton
        variant="text"
        icon="download"
        noText
        onClick={() => downloadTheme(defaultColors)}
        title="Download Theme"
      >
        Download Theme
      </DBButton>
      <DBButton
        variant="text"
        icon="undo"
        noText
        onClick={() => resetDefaultColors()}
        title="Default Colors"
      >
        Default Colors
      </DBButton>
      <div className="checkbox">
        <DBCheckbox
          value={darkMode}
          onChange={() =>
            useThemeBuilderStore.setState({ darkMode: !darkMode })
          }
        >
          Darkmode
        </DBCheckbox>
      </div>
    </div>
  );
};

export default ActionBar;
