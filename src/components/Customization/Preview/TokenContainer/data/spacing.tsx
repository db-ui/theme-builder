import { DBInfotext } from "@db-ux/react-core-components";
import { DEFAULT_SIZES } from "./index.tsx";

const Sizing = () => (
  <div className="flex flex-wrap gap-fix-md">
    {DEFAULT_SIZES.map((name) => (
      <div
        className="flex flex-col h-full justify-between items-center gap-fix-md"
        key={`spacing-${name}`}
      >
        <div
          className="flex db-warning-bg-basic-level-1 items-center justify-center"
          style={{
            width: `var(--db-spacing-fixed-${name})`,
            height: `var(--db-spacing-fixed-${name})`,
            border: `var(--db-border-height-3xs) solid var(--db-adaptive-on-bg-basic-emphasis-60-default)`,
          }}
        >
          <span className="hidden">{name}</span>
        </div>
        <DBInfotext semantic="informational" icon="none">
          {name}
        </DBInfotext>
      </div>
    ))}
  </div>
);
export default Sizing;
