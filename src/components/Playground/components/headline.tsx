import Setting from "../Sidebar/Customize/Setting";
import { useEditor, useNode } from "@craftjs/core";
import { getDragClassNames } from "./data/utils.ts";
import { ClassNamePropType } from "./data";
import DragButton from "./DragButton";
import { useTranslation } from "react-i18next";
import { forwardRef, PropsWithChildren } from "react";

export type HeadlinePropsType = {
  headline?: string;
  size?: "1" | "2" | "3" | "4" | "5" | "6";
  variant?: "light" | "black";
};

const HeadlineWrapper = forwardRef<
  HTMLHeadingElement,
  PropsWithChildren<HeadlinePropsType & ClassNamePropType>
>((props: PropsWithChildren<HeadlinePropsType & ClassNamePropType>, ref) => {
  if (props.size === "1") {
    return (
      <h1 ref={ref} {...props}>
        {props.children}
      </h1>
    );
  }
  if (props.size === "2") {
    return (
      <h2 ref={ref} {...props}>
        {props.children}
      </h2>
    );
  }
  if (props.size === "3") {
    return (
      <h3 ref={ref} {...props}>
        {props.children}
      </h3>
    );
  }
  if (props.size === "5") {
    return (
      <h5 ref={ref} {...props}>
        {props.children}
      </h5>
    );
  }
  if (props.size === "6") {
    return (
      <h6 ref={ref} {...props}>
        {props.children}
      </h6>
    );
  }

  return (
    <h4 ref={ref} {...props}>
      {props.children}
    </h4>
  );
});

const Headline = ({
  headline,
  size,
  className,
  variant,
}: HeadlinePropsType & ClassNamePropType) => {
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
    <HeadlineWrapper
      className={`${getDragClassNames(selected, hovered, className)}`}
      data-hint={headline ? undefined : t("pgEditMe")}
      data-variant={variant}
      ref={(ref) => {
        if (ref) {
          connect(ref);
        }
      }}
      size={size}
    >
      {headline}
      <DragButton componentName={name} drag={drag} />
    </HeadlineWrapper>
  );
};

const HeadlineSettings = () => (
  <Setting
    settings={[
      {
        key: "headline",
        type: "textarea",
      },
      {
        key: "size",
        type: "select",
        selectOptions: [
          { value: "1" },
          { value: "2" },
          { value: "3" },
          { value: "4" },
          { value: "5" },
          { value: "6" },
        ],
      },
      {
        key: "variant",
        type: "select",
        selectOptions: [{ value: "black" }, { value: "light" }],
      },
    ]}
  />
);

Headline.craft = {
  props: {
    size: "4",
    variant: "black",
  },
  related: {
    settings: HeadlineSettings,
  },
};

export default Headline;
