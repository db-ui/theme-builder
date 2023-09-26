import { DBButton } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../store";
import { downloadTheme } from "../../utils";

const ActionBar = () => {
  const { defaultColors, resetDefaultColors, defaultTheme } =
    useThemeBuilderStore((state) => state);

  return (
    <>
      <DBButton
        icon="undo"
        onClick={() => resetDefaultColors()}
        title=" Reset Defaults"
      >
        Reset
      </DBButton>
      <DBButton
        variant="primary"
        icon="download"
        onClick={() => downloadTheme(defaultTheme, defaultColors)}
        title="Download Theme"
      >
        Download
      </DBButton>
    </>
  );
};

export default ActionBar;
