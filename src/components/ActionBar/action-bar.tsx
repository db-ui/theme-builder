import { DBButton } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../store";
import { downloadTheme } from "../../utils";

const ActionBar = () => {
  const { defaultColors, resetDefaultColors } = useThemeBuilderStore(
    (state) => state,
  );

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
        onClick={() => downloadTheme(defaultColors)}
        title="Download Theme"
      >
        Download
      </DBButton>
    </>
  );
};

export default ActionBar;
