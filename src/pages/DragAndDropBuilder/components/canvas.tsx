import { PropsWithChildren } from "react";
import DropContainer from "./drop-container.tsx";

const Canvas = (props: PropsWithChildren) => {
  return (
    <DropContainer className="w-full h-full">
      <div className="flex flex-col" {...props}>
        {props.children}
      </div>
    </DropContainer>
  );
};

export default Canvas;
