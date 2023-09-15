import { Ace } from "ace-builds";
import components from "./components.json";
import { properties } from "./properties.ts";

export const getAceAutocomplete = () => {
  const componentsCompletion: Ace.Completion[] = components.map((comp) => ({
    caption: comp,
    value: comp,
  }));
  const propertiesCompletion: Ace.Completion[] = properties.map((prop) => ({
    ...prop,
    caption: prop.value,
  }));

  return {
    getCompletions: (
      _editor: Ace.Editor,
      _session: Ace.EditSession,
      _pos: Ace.Point,
      _prefix: string,
      callback: Ace.CompleterCallback,
    ): void => {
      callback(
        null,
        [...componentsCompletion, ...propertiesCompletion].map((comp) => ({
          ...comp,
          meta: comp.meta || "dbux",
        })),
      );
    },
  };
};
