import { PreviewType } from "./data.ts";
import Button from "../components/button.tsx";
import { Element, Frame } from "@craftjs/core";
import Canvas from "../components/canvas.tsx";

const Preview = ({ className }: PreviewType) => {
  return (
    <div className={`${className || ""} p-fix-xs`}>
      <Frame>
        <Element is={Canvas} canvas>
          <Button>Test1</Button>
          <Button>Test2</Button>
          <Button>Test3</Button>
          <Button>Test4</Button>
        </Element>
      </Frame>
    </div>
  );
};

export default Preview;
