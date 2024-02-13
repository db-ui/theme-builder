import Toolbar from "./Toolbar";
import Preview from "./Preview";
import Sidebar from "./Sidebar";
import Button from "./components/button.tsx";
import Card from "./components/card.tsx";
import Text from "./components/text.tsx";
import { Editor } from "@craftjs/core";
import "./index.scss";
import Root from "./components/root.tsx";
import ComponentTree from "./ComponentTree";
import { DBDivider } from "@db-ui/react-components";
import Link from "./components/link.tsx";
import Container from "./components/container.tsx";
import DropContainer from "./components/drop-container.tsx";
import DefaultPage from "../../components/DefaultPage";
import { useTranslation } from "react-i18next";

export const DragAndDropBuilder = () => {
  const { t } = useTranslation();
  return (
    <DefaultPage name={t("playground")}>
      <Editor
        resolver={{
          Button,
          Card,
          Container,
          DropContainer,
          Text,
          Root,
          Link,
        }}
      >
        <div className="grid grid-cols-6 h-full w-full">
          <ComponentTree />
          <div className="flex flex-col col-span-4 h-full">
            <Toolbar />
            <DBDivider margin="none" />
            <Preview />
          </div>

          <Sidebar />
        </div>
      </Editor>
    </DefaultPage>
  );
};

export default DragAndDropBuilder;
