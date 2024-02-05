import Toolbar from "./Toolbar";
import Preview from "./Preview";
import Sidebar from "./Sidebar";
import Button from "./components/button.tsx";
import Card from "./components/card.tsx";
import Flex from "./components/flex.tsx";
import Text from "./components/text.tsx";
import { Editor } from "@craftjs/core";
import DropContainer from "./components/drop-container.tsx";
import "./index.scss";
import Canvas from "./components/canvas.tsx";
import ComponentTree from "./ComponentTree";
import {DBDivider} from "@db-ui/react-components";

export const DragAndDropBuilder = () => {
  return (
    <Editor resolver={{ Button, Card, Flex, DropContainer, Text, Canvas }}>
      <div className="p-fix-xs grid grid-cols-6 h-full w-full">
        <ComponentTree />
        <div className="flex flex-col col-span-4 h-full">
          <Toolbar />
          <DBDivider margin="none" />
          <Preview />
        </div>

        <Sidebar />
      </div>
    </Editor>
  );
};

export default DragAndDropBuilder;
