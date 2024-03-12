import Setting from "../Sidebar/Customize/Setting";
import { useEditor, useNode } from "@craftjs/core";
import { getDragClassNames } from "./data/utils.ts";
import { ClassNamePropType } from "./data";
import DragButton from "./DragButton";
import { useTranslation } from "react-i18next";

export type TextPropsType = {
  text?: string;
};
const Text = ({ text, className }: TextPropsType & ClassNamePropType) => {
  const { t } = useTranslation();
  const {
    connectors: { connect, drag },
    id,
    hovered,
    name,
  } = useNode((node) => {
    return {
      name: node.data.custom.displayName || node.data.name,
      hovered: node.data.custom.hover,
    };
  });

  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    return { selected: id === currentNodeId };
  });

  return (
    <div
      className={`${getDragClassNames(selected, hovered, className)}`}
      data-hint={text && text?.length > 0 ? undefined : t("pgEditMe")}
      ref={(ref) => {
        if (ref) {
          connect(ref);
        }
      }}
    >
      {text && <div dangerouslySetInnerHTML={{ __html: text || "" }} />}
      <DragButton componentName={name} drag={drag} />
    </div>
  );
};

const TextSettings = () => (
  <Setting
    settings={[
      {
        key: "text",
        type: "richtext",
      },
    ]}
  />
);

Text.craft = {
  props: {},
  related: {
    settings: TextSettings,
  },
};

export default Text;
