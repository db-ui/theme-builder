import { DBLink } from "@db-ux/react-core-components";
import { DBLinkProps } from "@db-ux/react-core-components/dist/components/link/model";
import { getDragClassNames } from "./data/utils.ts";
import { useEditor, useNode } from "@craftjs/core";
import Setting from "../Sidebar/Customize/Setting";
import DragButton from "./DragButton";

const Link = (props: DBLinkProps) => {
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
    <DBLink
      className={`${getDragClassNames(selected, hovered, props.className)}`}
      ref={(ref) => {
        if (ref) {
          connect(ref);
        }
      }}
      {...props}
    >
      {props.children}
      <DragButton componentName={name} drag={drag} />
    </DBLink>
  );
};

const LinkSettings = () => (
  <Setting
    settings={[
      {
        key: "href",
        type: "text",
      },
      {
        key: "children",
        type: "text",
      },
      {
        key: "content",
        type: "select",
        selectOptions: [{ value: "internal" }, { value: "external" }],
      },
      {
        key: "variant",
        type: "select",
        selectOptions: [
          { value: "adaptive" },
          { value: "brand" },
          { value: "inline" },
        ],
      },
      {
        key: "size",
        type: "select",
        selectOptions: [{ value: "medium" }, { value: "small" }],
      },
    ]}
  />
);

Link.craft = {
  props: {
    children: "Link",
    content: "internal",
    variant: "adaptive",
    size: "medium",
  },
  related: {
    settings: LinkSettings,
  },
};

export default Link;
