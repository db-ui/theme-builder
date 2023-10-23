import { DBCard } from "@db-ui/react-components";
import { ALL_VARIABLES } from "../../../utils/data.ts";
import "./index.scss";
import { useThemeBuilderStore } from "../../../store";

const ColorTable = () => {
  const { colors } = useThemeBuilderStore((state) => state);
  return (
    <DBCard className="color-table-container" spacing="small">
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
              {ALL_VARIABLES.filter((varKey) => varKey.endsWith("enabled")).map(
                (varKey) => (
                  <tr key={`${varKey}-row`}>
                    <td>{varKey}</td>
                    {colors.map((color: any) => {
                      const style: any = { "--color": color[varKey] };
                      let title = color[varKey];
                      const hoverColor =
                        color[varKey.replace("enabled", "hover")];
                      const pressedColor =
                        color[varKey.replace("enabled", "pressed")];
                      style["--color-hover"] = hoverColor;
                      style["--color-pressed"] = pressedColor;

                    title += `, ${hoverColor}, ${pressedColor}`;
                    return (
                      <td
                        data-text-align="center"
                        data-size="small"
                        key={`${varKey}-${color.name}-cell`}
                      >
                        {color[varKey] ? (
                          <div
                            className="color-box"
                            style={style}
                            title={title}
                          />
                        ) : (
                          "---"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ),
              )}
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
