import { PropsWithChildren } from "react";
import DropContainer from "./drop-container.tsx";

const Root = (props: PropsWithChildren) => {
  return (
    <DropContainer className=" w-full h-full flex flex-col" {...props}>
      {props.children}
    </DropContainer>
  );
};

export default Root;
