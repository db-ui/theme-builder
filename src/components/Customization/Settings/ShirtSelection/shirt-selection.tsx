import { getShirtValue, ShirtSelectionType } from "./data.ts";
import { useThemeBuilderStore } from "../../../../store";
import { DBInput } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import traverse from "traverse";

const getFromJsonByArray = (params: string[], json: any): any => {
  try {
    let currentObject = json;
    params.forEach((param) => {
      currentObject = currentObject[param];
    });

    return currentObject;
  } catch (error) {
    console.error(error);
  }
  return 1;
};

const ShirtSelection = ({ label, params }: ShirtSelectionType) => {
  const { t } = useTranslation();
  const { defaultTheme } = useThemeBuilderStore((state) => state);

  const setDetfaultTheme = (scale: string) => {
    const path = [...params];
    let copyTheme = { ...defaultTheme };
    copyTheme = traverse(copyTheme).map(function (value) {
      if (
        this.isLeaf &&
        this.path.length > 0 &&
        path.every((value, index) => value === this.path[index])
      ) {
        this.update(getShirtValue(scale, this.path) || value);
      }
    });

    useThemeBuilderStore.setState({
      defaultTheme: copyTheme,
    });
  };

  return (
    <DBInput
      label={`${t(label)} ${t("scale")}`}
      labelVariant="floating"
      type="number"
      min={1}
      max={5}
      value={getFromJsonByArray([...params, "_scale"], defaultTheme)}
      onChange={(event) => {
        setDetfaultTheme(event.target.value);
      }}
    />
  );
};

export default ShirtSelection;
