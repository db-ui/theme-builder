import { DBBrand, DBButton, DBHeader, DBPage } from "@db-ui/react-components";
import ColorTable from "./components/ColorTable";
import ComponentPreview from "./components/ComponentPreview";
import ColorSelection from "./components/ColorSelection";
import { useState } from "react";
import { useThemeBuilderStore } from "./store";
import ActionBar from "./components/ActionBar";

const App = () => {
  const { darkMode } = useThemeBuilderStore((state) => state);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  return (
    <DBPage
      type="fixedHeaderFooter"
      slotHeader={
        <DBHeader
          drawerOpen={drawerOpen}
          onToggle={setDrawerOpen}
          slotBrand={<DBBrand anchorChildren>Theme Builder</DBBrand>}
          slotActionBar={<ActionBar />}
          slotCallToAction={
            <DBButton
              variant="text"
              className="dark-mode-button"
              title={darkMode ? "Enable Light-Mode" : "Enable Dark-Mode"}
              onClick={() =>
                useThemeBuilderStore.setState({ darkMode: !darkMode })
              }
            >
              {darkMode ? "🌞" : "🌛"}
            </DBButton>
          }
        ></DBHeader>
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
