import { DBInfotext, DBTooltip } from "@db-ui/react-components";
import { DEFAULT_SIZES } from "./index.tsx";

const Sizing = () => (
  <div className="flex flex-wrap gap-fix-md">
    {DEFAULT_SIZES.map((name) => (
      <div
        className="flex flex-col justify-between items-center gap-fix-md"
        key={`spacing-${name}`}
      >
        <div
          className="flex db-warning-bg-lvl-1 items-center justify-center"
          style={{
            width: `var(--db-spacing-fixed-${name})`,
            height: `var(--db-spacing-fixed-${name})`,
            border: `var(--db-border-height-3xs) solid var(--db-current-color-border)`,
          }}
        >
          <DBTooltip>{name}</DBTooltip>
        </div>
        <DBInfotext semantic="informational" icon="none">
          {name}
        </DBInfotext>
      </div>
    ))}
  </div>
);
export default Sizing;
