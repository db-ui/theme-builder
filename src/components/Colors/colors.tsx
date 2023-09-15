import ColorSelection from "./ColorSelection";
import ComponentPreview from "./ComponentPreview";
import ColorTable from "./ColorTable";

const Colors = () => {
  return (
    <div className="content column-box">
      <div className="upper-container">
        <ColorSelection />
        <ComponentPreview />
      </div>
      <ColorTable />
    </div>
  );
};
export default Colors;
