import type { PropsWithChildren } from "react";
import { ColorTableType } from "./data";
import { DBCard } from "@db-ui/react-components";
import { ALL_VARIABLES } from "../../utils/data.ts";
import "./index.scss";

const ColorTable = ({ colors }: PropsWithChildren<ColorTableType>) => {
  return (
    <DBCard spacing="small">
      {colors && colors.length > 0 ? (
        <div className="table-scroll-container">
          <table className="color-table">
            <thead>
              <tr>
                <th className="variable-header">Variable</th>
                {colors.map((color) => (
                  <th key={`${color.name}-header`}>{color.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_VARIABLES.map((varKey) => (
                <tr key={`${varKey}-row`}>
                  <td>{varKey}</td>
                  {colors.map((color: any) => (
                    <td
                      data-text-align="center"
                      data-size="small"
                      key={`${varKey}-${color.name}-cell`}
                    >
                      {color[varKey] ? (
                        <div
                          className="color-box"
                          style={{
                            backgroundColor: color[varKey],
                          }}
                          title={color[varKey]}
                        />
                      ) : (
                        "---"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <span>No Colors found</span>
      )}
    </DBCard>
  );
};

export default ColorTable;
