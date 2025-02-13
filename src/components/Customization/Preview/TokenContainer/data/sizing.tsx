import { DEFAULT_SIZES } from "./index.tsx";
import { DBInfotext } from "@db-ux/react-core-components";

const Sizing = () => (
  <div className="flex flex-wrap gap-fix-md">
    {DEFAULT_SIZES.map((name) => (
      <div
        className="flex flex-col h-full justify-between items-center gap-fix-md"
        key={`sizing-${name}`}
      >
        <div
          className="flex db-informational-bg-basic-level-1 items-center justify-center"
          style={{
            width: `var(--db-sizing-${name})`,
            height: `var(--db-sizing-${name})`,
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
