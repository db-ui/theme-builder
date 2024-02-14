import Setting from "../Sidebar/Customize/Setting";
import { Fragment, useEffect, useState } from "react";
import { useEditor, useNode } from "@craftjs/core";
import { getDragClassNames } from "./data/utils.ts";
import { ClassNamePropType } from "./data";
import DragButton from "./DragButton";

export type TextPropsType = {
  text: string;
  inline?: boolean;
};
const Text = ({
  text,
  inline,
  className,
}: TextPropsType & ClassNamePropType) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    return { selected: id === currentNodeId };
  });
  const [renderedText, setRenderedText] = useState<any>();
  useEffect(() => {
    if (inline || !text || !text.includes("\n")) {
      setRenderedText(text);
    } else {
      setRenderedText(
        text.split("\n").map((line) => (
          <Fragment>
            {line}
            <br />
          </Fragment>
        )),
      );
    }
  }, [inline, text]);
  return (
    <p
      className={`${getDragClassNames(selected, className)}`}
      ref={(ref) => {
        if (ref) {
          connect(ref);
        }
      }}
    >
      {renderedText}
      <DragButton drag={drag} />
    </p>
  );
};

const TextSettings = () => (
  <Setting
    settings={[
      {
        key: "text",
        type: "textarea",
      },
      {
        key: "inline",
        type: "switch",
      },
    ]}
  />
);

Text.craft = {
  props: {
    text: "Edit me",
    inline: false,
  },
  related: {
    settings: TextSettings,
  },
};

export default Text;
