import { DBButton } from "@db-ui/react-components";
import { useInternalStore, useThemeBuilderStore } from "../../store";
import { downloadTheme } from "../../utils";
import { useEffect, useState } from "react";

const ActionBar = () => {
  const { defaultColors, resetDefaultColors } = useThemeBuilderStore(
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
        disabled={disableDownload}
        onClick={() => downloadTheme(defaultColors)}
        title="Download Theme"
      >
        Download
      </DBButton>
    </>
  );
};

export default ActionBar;
