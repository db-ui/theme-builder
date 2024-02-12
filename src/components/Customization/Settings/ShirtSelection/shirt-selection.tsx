import { ShirtSelectionType } from "./data.ts";
import { useThemeBuilderStore } from "../../../../store";
import { DBInput, DBTextarea } from "@db-ui/react-components";
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
  return undefined;
};
const ShirtSelection = ({
  label,
  params,
  shirtSizes,
  isTextArea,
}: ShirtSelectionType) => {
  const { t } = useTranslation();
  const { defaultTheme } = useThemeBuilderStore((state) => state);

  const setDetfaultTheme = (value: string, size: string) => {
    const path = [...params, size];
    let copyTheme = { ...defaultTheme };
    copyTheme = traverse(copyTheme).map(function () {
      if (
        this.isLeaf &&
        this.path.length > 0 &&
        this.path.length === path.length &&
        this.path.every((value, index) => value === path[index])
      ) {
        this.update(value, true);
      }
    });

    useThemeBuilderStore.setState({
      defaultTheme: copyTheme,
    });
  };

  return (
    <div className="flex flex-col gap-fix-sm">
      {shirtSizes.map((size) => (
        <div key={`${params.join("-")}-${size}`}>
          {isTextArea ? (
            <DBTextarea
              label={`${t(label)}-${size}`}
              labelVariant="floating"
              value={getFromJsonByArray([...params, size], defaultTheme)}
              onChange={(event) => {
                setDetfaultTheme(event.target.value, size);
              }}
            />
          ) : (
            <DBInput
              label={`${t(label)}-${size} ${t("shirtSizeDescription")}`}
              labelVariant="floating"
              type="number"
              step={0.05}
              value={getFromJsonByArray([...params, size], defaultTheme)}
              onChange={(event) => {
                setDetfaultTheme(event.target.value, size);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ShirtSelection;
