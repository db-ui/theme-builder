import { DBBrand, DBHeader, DBPage } from "@db-ui/react-components";
import ColorTable from "./components/ColorTable";
import ComponentPreview from "./components/ComponentPreview";
import ColorSelection from "./components/ColorSelection";
import ActionBar from "./components/ActionBar";

const App = () => {
  return (
    <DBPage
      type="fixedHeaderFooter"
      slotHeader={
        <DBHeader slotBrand={<DBBrand anchorChildren>Theme Builder</DBBrand>}>
          <ActionBar />
        </DBHeader>
      }
    >
      <div className="content column-box">
        <div className="upper-container">
          <ColorSelection />
          <ComponentPreview />
        </div>
        <ColorTable />
      </div>
    </DBPage>
  );
};

export default App;
