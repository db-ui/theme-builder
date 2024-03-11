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
  const { theme } = useThemeBuilderStore((state) => state);

  const setDetfaultTheme = (scale: string) => {
    const path = [...params];
    let copyTheme = { ...theme };
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
      theme: copyTheme,
    });
  };

  return (
    <div className="flex flex-col gap-fix-md">
      <h5>{t(label)}</h5>
      <DBSelect
        label={`${t(label)} ${t("scale")}`}
        variant="floating"
        type="number"
        value={getFromJsonByArray([...params, "_scale"], theme)}
        onChange={(event) => {
          setDetfaultTheme(event.target.value);
        }}
      >
        {params.includes("sizing") && (
          <>
            <option>90%</option>
            <option>100%</option>
            <option>110%</option>
            <option>120%</option>
          </>
        )}
        {params.includes("spacing") && (
          <>
            <option>90%</option>
            <option>100%</option>
            <option>110%</option>
            <option>120%</option>
          </>
        )}
        {params.includes("height") && (
          <>
            <option>90%</option>
            <option>100%</option>
            <option>110%</option>
            <option>120%</option>
          </>
        )}
        {(params.includes("elevation") || params.includes("radius")) && (
          <>
            <option>none</option>
            <option>50%</option>
            <option>100%</option>
            <option>150%</option>
            <option>200%</option>
          </>
        )}
        {params.includes("radius") && <option>full</option>}
      </DBSelect>
    </div>
  );
};

export default Scaling;
