import { DEFAULT_SIZES } from "./index.tsx";
import { DBInfotext, DBTooltip } from "@db-ui/react-components";

const Sizing = () => (
  <div className="flex flex-wrap gap-fix-md">
    {DEFAULT_SIZES.map((name) => (
      <div
        className="flex flex-col h-full justify-between items-center gap-fix-md"
        key={`sizing-${name}`}
      >
        <div
          className="flex db-informational-bg-lvl-1 items-center justify-center"
          style={{
            width: `var(--db-sizing-${name})`,
            height: `var(--db-sizing-${name})`,
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
