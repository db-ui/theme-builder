import { Editor } from "@craftjs/core";
import "./index.scss";
import { DBDivider } from "@db-ui/react-components";
import { useTranslation } from "react-i18next";
import DefaultPage from "../../components/DefaultPage";
import Button from "../../components/Playground/components/button.tsx";
import Card from "../../components/Playground/components/card.tsx";
import Container from "../../components/Playground/components/container.tsx";
import DropContainer from "../../components/Playground/components/drop-container.tsx";
import Text from "../../components/Playground/components/text.tsx";
import Root from "../../components/Playground/components/root.tsx";
import Link from "../../components/Playground/components/link.tsx";
import ComponentTree from "../../components/Playground/ComponentTree";
import Toolbar from "../../components/Playground/Toolbar";
import Preview from "../../components/Playground/Preview";
import Sidebar from "../../components/Playground/Sidebar";

export const Playground = () => {
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

export default Playground;
