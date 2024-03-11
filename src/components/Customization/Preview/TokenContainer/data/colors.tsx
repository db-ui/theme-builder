import { ColorsPropsType } from "./index.tsx";
import { kebabCase } from "../../../../../utils";

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
      <div className="flex flex-col">
        {(isBorder ? ["enabled"] : ["enabled", "hover", "pressed"]).map(
          (state) => {
            const bgColor =
              `var(--db-${colorName}-${type}` +
              `${bgTransparent && state === "enabled" ? `-${bgTransparent}` : ""}` +
              `${isBorder ? "" : `-${state}`})`;
            const borderColor: string = `var(--db-${colorName}-border)`;
            let color = `var(--db-${colorName}-on-bg-enabled)`;
            if (type.startsWith("on-bg")) {
              color = `var(--db-${colorName}-bg-lvl-1-enabled)`;
            } else if (type === "origin") {
              color = `var(--db-${colorName}-on-enabled)`;
            }  else if (type === "on") {
              color = `var(--db-${colorName}-origin-enabled)`;
            } else if (
              type === "contrast-high" ||
              type === "contrast-low" ||
              type === "border"
            ) {
              color = `var(--db-${colorName}-on-contrast-enabled)`;
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
          },
        )}
      </div>
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
      <ColorPreview colorName={colorName} type="on-bg" />
      <ColorPreview colorName={colorName} type="on-bg-weak" />
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
      <ColorPreview colorName={colorName} type="bg-lvl-1" />
      <ColorPreview colorName={colorName} type="bg-lvl-2" />
      <ColorPreview colorName={colorName} type="bg-lvl-3" />
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
);

export default Colors;
