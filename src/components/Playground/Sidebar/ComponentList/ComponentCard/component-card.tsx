import { DBCard } from "@db-ui/react-components";
import { useEditor } from "@craftjs/core";
import { ComponentCardPropsType } from "./data.ts";

const ComponentCard = ({
  component,
  assetPath,
  name,
}: ComponentCardPropsType) => {
  const { connectors } = useEditor();
  return (
    <div
      ref={(ref) => {
        if (ref) {
          connectors.create(ref, component);
        }
      }}
    >
      <DBCard className="items-center cursor-grab p-fix-xs" spacing="small">
        <img
          className="max-h-siz-md"
          alt={name}
          src={assetPath || "assets/components/component.svg"}
        />
        <span className="break-all">{name}</span>
      </DBCard>
    </div>
  );
};

export default ComponentCard;
