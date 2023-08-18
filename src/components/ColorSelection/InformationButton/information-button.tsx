import type { PropsWithChildren } from "react";
import { useState } from "react";
import { InformationButtonType } from "./data";
import { DBButton, DBDrawer } from "@db-ui/react-components";

const InformationButton = ({
  title,
  children,
}: PropsWithChildren<InformationButtonType>) => {
  const [open, setOpen] = useState<boolean>();

  return (
    <>
      <DBButton variant="text" icon="info" noText onClick={() => setOpen(true)}>
        {title || "Additonal Information"}
      </DBButton>
      <DBDrawer
        backdrop="weak"
        open={open}
        onClose={() => setOpen(false)}
        slotDrawerHeader={title || "Additonal Information"}
        withCloseButton
      >
        {children}
      </DBDrawer>
    </>
  );
};

export default InformationButton;
