import { ColorsPropsType } from "./index.tsx";
import { kebabCase } from "../../../../../utils";
import { Fragment } from "react";

const ColorPreview = ({
  colorName,
  type,
  isBorder,
  bgTransparent,
}: ColorsPropsType & {
  type: string;
  isBorder?: boolean;
  bgTransparent?: string;
}) => {
  return (
    <div className="flex flex-col gap-fix-md text-center">
      <p className="font-bold">
        {kebabCase(
          `${type}${bgTransparent ? `-${bgTransparent}` : ""}`,
          false,
          " ",
        )}
      </p>
      {(isBorder ? ["enabled"] : ["enabled", "hover", "pressed"]).map(
        (state) => {
          const bgColor =
            `var(--db-${colorName}-${type}` +
            `${bgTransparent && state === "enabled" ? `-${bgTransparent}` : ""}` +
            `${isBorder ? "" : `-${state}`})`;
          const borderColor: string = `var(--db-${colorName}-border)`;
          return (
            <Fragment key={`color-preview-${colorName}-${type}-${state}`}>
              <div
                className="w-full md:min-w-siz-2xl h-siz-md mx-auto rounded-sm"
                style={{
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                }}
              ></div>
              <span>{state}</span>
            </Fragment>
          );
        },
      )}
    </div>
  );
};

const Colors = ({ colorName }: ColorsPropsType) => (
  <div className="flex flex-col gap-fix-md">
    {/* Brand origin */}
    {colorName === "brand" && (
      <div className="flex flex-col md:flex-row gap-fix-md">
        <ColorPreview colorName={colorName} type="on" />
        <ColorPreview colorName={colorName} type="origin" />
      </div>
    )}
    {/* On Colors */}
    <div className="flex flex-col md:flex-row gap-fix-md">
      <div className="flex flex-col gap-fix-md md:gap-0 md:flex-row">
        <ColorPreview colorName={colorName} type="on-bg" />
        <ColorPreview colorName={colorName} type="on-bg-weak" />
      </div>
      <ColorPreview colorName={colorName} type="on-contrast" />
    </div>
    {/* Contrast Colors */}
    <div className="flex flex-col md:flex-row gap-fix-md">
      <ColorPreview colorName={colorName} type="contrast-high" />
      <ColorPreview colorName={colorName} type="contrast-low" />
      <ColorPreview colorName={colorName} type="border" isBorder />
    </div>
    {/* BAckgrounds */}
    <div className="flex flex-col md:flex-row gap-fix-md">
      <div className="flex flex-col gap-fix-md md:gap-0 md:flex-row">
        <ColorPreview colorName={colorName} type="bg-lvl-1" />
        <ColorPreview colorName={colorName} type="bg-lvl-2" />
        <ColorPreview colorName={colorName} type="bg-lvl-3" />
      </div>
      <div className="flex flex-col gap-fix-md md:gap-0 md:flex-row">
        <ColorPreview
          colorName={colorName}
          type="bg-transparent"
          bgTransparent="full"
        />
        <ColorPreview
          colorName={colorName}
          type="bg-transparent"
          bgTransparent="semi"
        />
      </div>
    </div>
  </div>
);

export default Colors;
