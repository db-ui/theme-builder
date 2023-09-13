import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { ContrastListType } from "./data";
import { DBTag } from "@db-ui/react-components";
import { calcAPCA } from "apca-w3";
import { getAPCAVariant, getContrast, getWCA2Variant } from "../../../utils";
import "./index.scss";

const ContrastList = ({
  foregroundColor,
  backgroundColor,
}: PropsWithChildren<ContrastListType>) => {
  const [contrastWCA2, setContrastWCA2] = useState<number>();
  const [contrastAPCA, setContrastAPCA] = useState<number>();
  const [scoreWCA2, setScoreWCA2] = useState<string>();

  useEffect(() => {
    if (foregroundColor && backgroundColor) {
      const contrastWCA2 = getContrast(foregroundColor, backgroundColor);
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
