import { DEFAULT_SIZES } from "./index.tsx";

const BorderRadius = () => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-fix-md">
    {[...DEFAULT_SIZES, "full"].map((name) => (
      <div
        key={`border-radius-${name}`}
        className="flex w-siz-xl h-siz-xl md:w-siz-2xl md:h-siz-2xl db-successful-bg-basic-level-1 items-center justify-center"
        style={{
          borderRadius: `var(--db-border-radius-${name})`,
          border: `var(--db-border-height-3xs) solid var(--db-adaptive-on-bg-basic-emphasis-60-default)`,
        }}
      >
        {name}
      </div>
    ))}
  </div>
);

export default BorderRadius;
