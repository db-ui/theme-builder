import { ColorsPropsType } from "./index.tsx";
import { kebabCase } from "../../../../../utils";

const ColorPreview = ({
  colorName,
  type,
  bgTransparent,
}: ColorsPropsType & {
  type: string;
  bgTransparent?: string;
}) => {
  return (
    <div className="flex flex-col gap-fix-md text-center h-full">
      <p className="font-bold">
        {kebabCase(
          `${type}${bgTransparent ? `-${bgTransparent}` : ""}`,
          false,
          " ",
        )}
      </p>
      <div className="flex flex-col mt-auto">
        {["default", "hovered", "pressed"].map((state) => {
          const bgColor =
            `var(--db-${colorName}-${type}` +
            `${bgTransparent && state === "default" ? `-${bgTransparent}` : ""}-${state}`;
          const borderColor: string = `var(--db-${colorName}-on-bg-basic-emphasis-60-default)`;
          let color = `var(--db-${colorName}-on-bg-basic-emphasis-100-default)`;
          if (type.startsWith("on-bg")) {
            color = `var(--db-${colorName}-bg-basic-level-1-default)`;
          } else if (type === "origin") {
            color = `var(--db-${colorName}-on-origin-default)`;
          } else if (type === "on-origin") {
            color = `var(--db-${colorName}-origin-default)`;
          } else if (
            type === "bg-inverted-contrast-high" ||
            type === "bg-inverted-contrast-low" ||
            type === "bg-inverted-contrast-max"
          ) {
            color = `var(--db-${colorName}-on-bg-inverted-default)`;
          }
          return (
            <div
              key={`color-preview-${colorName}-${type}-${state}`}
              className="flex w-full md:min-w-siz-2xl h-siz-md mx-auto rounded-sm"
              style={{
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                color,
              }}
            >
              <span className="m-auto">{state}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Colors = ({ colorName }: ColorsPropsType) => (
  <div className="flex flex-col gap-fix-md">
    {/* origin */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-fix-md">
      <ColorPreview colorName={colorName} type="on-origin" />
      <ColorPreview colorName={colorName} type="origin" />
    </div>
    {/* Inverted Colors */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-fix-md">
      <ColorPreview colorName={colorName} type="bg-inverted-contrast-max" />
      <ColorPreview colorName={colorName} type="bg-inverted-contrast-high" />
      <ColorPreview colorName={colorName} type="bg-inverted-contrast-low" />
    </div>
    {/* Basic backgrounds */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-fix-md">
      <ColorPreview colorName={colorName} type="bg-basic-level-1" />
      <ColorPreview colorName={colorName} type="bg-basic-level-2" />
      <ColorPreview colorName={colorName} type="bg-basic-level-3" />
      <ColorPreview
        colorName={colorName}
        type="bg-basic-transparent"
        bgTransparent="full"
      />
      <ColorPreview
        colorName={colorName}
        type="bg-basic-transparent"
        bgTransparent="semi"
      />
    </div>
    {/* On Basic Colors */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-fix-md">
      <ColorPreview colorName={colorName} type="on-bg-basic-emphasis-100" />
      <ColorPreview colorName={colorName} type="on-bg-basic-emphasis-90" />
      <ColorPreview colorName={colorName} type="on-bg-basic-emphasis-80" />
      <ColorPreview colorName={colorName} type="on-bg-basic-emphasis-70" />
      <ColorPreview colorName={colorName} type="on-bg-basic-emphasis-60" />
      <ColorPreview colorName={colorName} type="on-bg-basic-emphasis-50" />
    </div>
  </div>
);

export default Colors;
