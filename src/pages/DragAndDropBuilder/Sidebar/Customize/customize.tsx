import {
  DBButton,
  DBDivider,
  DBInfotext,
  DBInput,
} from "@db-ui/react-components";
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
    if (selected && currentSelected !== selected.id) {
      setCurrentSelected(selected.id);
      setDisplayName(selected.data.displayName);
    } else if (!selected) {
      setDisplayName("");
      setCurrentSelected(undefined);
    }
  }, [currentSelected, selected]);

  if (!selected) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <DBDivider margin="none" />
      <div className="flex flex-col p-fix-xs gap-fix-xs h-full">
        <DBInput
          labelVariant="floating"
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
        <DBDivider margin="none"></DBDivider>
        {selected.settings ? (
          createElement(selected.settings)
        ) : (
          <DBInfotext variant="warning">No settings</DBInfotext>
        )}

        <DBDivider className="mt-auto" margin="none"></DBDivider>
        <DBButton
          variant="primary"
          icon="delete"
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
