import { DBButton, DBInfotext, DBInput } from "@db-ui/react-components";
import { createElement, useEffect, useState } from "react";
import { useEditor } from "@craftjs/core";

const Customize = () => {
  const { selected, actions } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      const node = state.nodes[currentNodeId];
      selected = {
        id: currentNodeId,
        data: node.data,
        settings: node.related && node.related.settings,
      };
    }

    return {
      selected,
    };
  });

  const [currentSelected, setCurrentSelected] = useState<string | undefined>();
  const [displayName, setDisplayName] = useState<string>();

  useEffect(() => {
    if (
      selected &&
      selected.data.name === "DropContainer" &&
      selected.data.parent &&
      actions
    ) {
      const parent: string = selected.data.parent as string;
      actions.selectNode(parent);
    } else {
      if (selected && currentSelected !== selected.id) {
        setCurrentSelected(selected.id);
        setDisplayName(selected.data.custom.displayName || selected.data.name);
      } else if (!selected) {
        setDisplayName("");
        setCurrentSelected(undefined);
      }
    }
  }, [currentSelected, selected, actions]);

  if (!selected) {
    return null;
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col p-fix-sm gap-fix-md h-full">
        <DBInput
          variant="floating"
          label="Displayname"
          value={displayName}
          onChange={(event) => {
            const name = event.target.value;
            setDisplayName(name);
            actions.setCustom(selected.id, (custom) => {
              custom.displayName = name;
            });
          }}
        />
        {selected.settings ? (
          createElement(selected.settings)
        ) : (
          <DBInfotext semantic="warning">No settings</DBInfotext>
        )}

        <DBButton
          variant="brand"
          icon="bin"
          width="full"
          disabled={!selected || selected.data.name === "Root"}
          onClick={() => {
            if (selected) {
              actions.delete(selected.id);
            }
          }}
        >
          Delete
        </DBButton>
      </div>
    </div>
  );
};

export default Customize;
