import { DBButton } from "@db-ui/react-components";
import "./index.scss";
import { useInternalStore, useThemeBuilderStore } from "../../data";
import { downloadTheme } from "../../utils";
import { useEffect, useState } from "react";

const ActionBar = () => {
  const { darkMode, defaultColors, resetDefaultColors } = useThemeBuilderStore(
    (state) => state,
  );
  const { validColors } = useInternalStore((state) => state);

  const [disableDownload, setDisableDownload] = useState<boolean>(false);

  useEffect(() => {
    if (validColors) {
      const foundInvalid = Object.values(validColors).filter((value) => !value);
      setDisableDownload(foundInvalid.length > 0);
    }
  }, [validColors]);

  return (
    <div className="action-bar">
      <DBButton
        className="dark-mode-button"
        title={darkMode ? "Enable Light-Mode" : "Enable Dark-Mode"}
        onClick={() => useThemeBuilderStore.setState({ darkMode: !darkMode })}
      >
        {darkMode ? "🌞" : "🌛"}
      </DBButton>
      <DBButton
        icon="undo"
        noText
        onClick={() => resetDefaultColors()}
        title="Default Colors"
      >
        Default Colors
      </DBButton>
      <DBButton
        variant="primary"
        icon="download"
        disabled={disableDownload}
        noText
        onClick={() => downloadTheme(defaultColors)}
        title="Download Theme"
      >
        Download Theme
      </DBButton>
    </div>
  );
};

export default ActionBar;
