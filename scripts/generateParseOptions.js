import components from "../src/components/Editor/components.json" assert { type: "json" };

import { writeFileSync } from "node:fs";

const generateParseOptions = () => {
  let file =
    'import { domToReact, HTMLReactParserOptions } from "html-react-parser";' +
    'import getAttributes from "./get-attributes.ts";' +
    `import{${components.join(",")}} from "@db-ux/react-core-components";` +
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
      const attributes: any = getAttributes(attribs, PARSER_OPTIONS);
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
