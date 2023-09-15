import components from "../src/components/Editor/components.json" assert { type: "json" };

import { writeFileSync } from "node:fs";

const generateParseOptions = () => {
  let file =
    'import { domToReact, HTMLReactParserOptions } from "html-react-parser";' +
    `import{${components.join(",")}} from "@db-ui/react-components";` +
    `export const PARSER_OPTIONS: HTMLReactParserOptions = {
      transform: (reactNode: any) => {
        if (
          reactNode.type &&
          reactNode.type.endsWith &&
          reactNode.type.endsWith("<")
        ) {
          return reactNode.type;
        }
    
        return reactNode;
      },
      replace: ({ name, attribs, children }: any) => {      
      const attributes: any = {};
      if (attribs) {
        const attributeKeys = Object.keys(attribs);
        attributeKeys.forEach((key) => {
          if (key.startsWith("on")) {
            try {
              const event = key.slice(2);
              attributes["on" + event.charAt(0).toUpperCase() + event.slice(1)] =
                Function(attribs[key].replace(/"/g, ""));
            } catch (e) {
              /* empty */
            }
          } else {
            attributes[key] = attribs[key];
          }
        });
      }
  `;

  components.forEach((component) => {
    file += `
    if (name === "${component.toLowerCase()}") {
      return (
        <${component} {...attributes}>
          {domToReact(children, PARSER_OPTIONS)}
        </${component}>
      );
    }`;
  });

  file += "}};";

  writeFileSync("./src/components/Editor/options.tsx", file);
};

generateParseOptions();
