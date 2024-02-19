import { getShirtValue, ShirtSelectionType } from "./data.ts";
import { useThemeBuilderStore } from "../../../../store";
import { DBSelect } from "@db-ui/react-components";
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

const Scaling = ({ label, params }: ShirtSelectionType) => {
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
    <DBSelect
      label={`${t(label)} ${t("scale")}`}
      labelVariant="floating"
      type="number"
      value={getFromJsonByArray([...params, "_scale"], defaultTheme)}
      onChange={(event) => {
        setDetfaultTheme(event.target.value);
      }}
    >
      <option>3xs</option>
      <option>2xs</option>
      <option>xs</option>
      <option>sm</option>
      <option>md</option>
      <option>lg</option>
      <option>xl</option>
      <option>2xl</option>
      <option>3xl</option>
    </DBSelect>
  );
};

export default Scaling;
