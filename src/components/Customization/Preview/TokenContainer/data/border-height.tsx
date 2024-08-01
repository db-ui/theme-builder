import { DBInfotext } from "@db-ui/react-components";
import { DEFAULT_SIZES } from "./index.tsx";

const BorderHeight = () => (
  <div className="grid grid-cols-3 md:grid-cols-9 gap-fix-md">
    {DEFAULT_SIZES.map((name) => (
      <div
        className="flex flex-col h-full justify-between items-center"
        key={`border-height-${name}`}
      >
        <div
          className="rounded w-siz-xl"
          style={{
            height: `var(--db-border-height-${name})`,
            border: `var(--db-border-height-${name}) solid var(--db-brand-on-bg-basic-emphasis-60-default)`,
          }}
        />
        <DBInfotext semantic="informational" icon="none">
          {name}
        </DBInfotext>
      </div>
    ))}
  </div>
);

export default BorderHeight;
