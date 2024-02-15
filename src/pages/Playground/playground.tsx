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
import { useDragAndDropStore } from "../../store";

export const Playground = () => {
  const { showBorders, showSpacings } = useDragAndDropStore((state) => state);
  const { t } = useTranslation();
  return (
    <DefaultPage name={t("playground")}>
      <Editor
        indicator={{
          success: "var(--db-successful-contrast-high)",
          error: "var(--db-critical-contrast-high)",
        }}
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
        <div
          className={`grid grid-cols-6 h-full w-full${showBorders ? " show-borders" : ""}${showSpacings ? " show-spacings" : ""}`}
        >
          <ComponentTree />
          <div className="flex flex-col col-span-4 h-full overflow-hidden">
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
