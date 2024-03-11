import { ELEVATION_SIZES } from "./index.tsx";

const Elevation = () => (
  <div className="grid grid-cols-3 gap-fix-md">
    {ELEVATION_SIZES.map((name) => (
      <div
        className="db-card items-center"
        data-spacing="medium"
        key={`elevation-${name}`}
        style={{
          boxShadow: `var(--db-elevation-${name})`,
        }}
      >
        {name}
      </div>
    ))}
  </div>
);

export default Elevation;
