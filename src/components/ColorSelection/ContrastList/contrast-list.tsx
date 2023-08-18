import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { ContrastListType } from "./data";
import { DBButton, DBTag } from "@db-ui/react-components";
import { calcAPCA } from "apca-w3";
import { getAPCAVariant, getWCA2Variant } from "../../../utils";
import chroma from "chroma-js";
import "./index.scss";

const ContrastList = ({
  foregroundColor,
  backgroundColor,
}: PropsWithChildren<ContrastListType>) => {
  const [contrastWCA2, setContrastWCA2] = useState<number>();
  const [contrastAPCA, setContrastAPCA] = useState<number>();
  const [scoreWCA2, setScoreWCA2] = useState<string>();

  const [copyClicked, setCopyClicked] = useState<boolean>();

  useEffect(() => {
    if (foregroundColor && backgroundColor) {
      const contrastWCA2 = chroma.contrast(foregroundColor, backgroundColor);
      setContrastWCA2(contrastWCA2);
      setContrastAPCA(Number(calcAPCA(foregroundColor, backgroundColor)));

      if (contrastWCA2 < 3) {
        setScoreWCA2("Fail");
      } else if (contrastWCA2 < 4.5) {
        setScoreWCA2("AA Large");
      } else if (contrastWCA2 < 7.5) {
        setScoreWCA2("AA");
      } else {
        setScoreWCA2("AAA");
      }
    }
  }, [foregroundColor, backgroundColor]);

  useEffect(() => {
    if (copyClicked) {
      setTimeout(() => setCopyClicked(false), 2000);
    }
  }, [copyClicked]);

  return (
    <>
      <div className="copy-color-container">
        <span
          className="color"
          style={{
            backgroundColor: foregroundColor,
          }}
        >
          {foregroundColor}
        </span>
        <DBButton
          variant="solid"
          icon="copy"
          onClick={() => {
            navigator.clipboard.writeText(foregroundColor || "");
            setCopyClicked(true);
          }}
        >
          {copyClicked ? "Copied" : "Copy"}
        </DBButton>
      </div>
      <div className="contrast-checker-values">
        <DBTag variant={getWCA2Variant(contrastWCA2)}>
          {contrastWCA2?.toFixed(2)} : 1
        </DBTag>
        <DBTag variant={getWCA2Variant(contrastWCA2)}>{scoreWCA2}</DBTag>
        <DBTag variant={getAPCAVariant(contrastAPCA)}>
          {contrastAPCA?.toFixed(1)}
        </DBTag>
      </div>
    </>
  );
};

export default ContrastList;
