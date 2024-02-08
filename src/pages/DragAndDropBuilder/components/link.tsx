import { DBLink } from "@db-ui/react-components";
import { DBLinkProps } from "@db-ui/react-components/dist/components/link/model";
import Setting from "../Sidebar/Customize/Setting";
import { getDragClassNames } from "./data/utils.ts";
import { useEditor, useNode } from "@craftjs/core";

const Link = (props: DBLinkProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    return { selected: id === currentNodeId };
  });
  return (
    <DBLink
      className={`${getDragClassNames(selected, props.className)}`}
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      {...props}
    >
      {props.children}
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
    ]}
  />
);

Link.craft = {
  props: {
    children: "Link",
  },
  related: {
    settings: LinkSettings,
  },
};

export default Link;
