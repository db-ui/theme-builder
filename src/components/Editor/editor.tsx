import { useEffect } from "react";
import parse from "html-react-parser";

import "@db-ui/foundations/build/css/color-classes.css";
import "./tailwind.generated.css";

import ace from "ace-builds";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";

import { format } from "prettier/standalone";
import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";
import html from "prettier/plugins/html";

import { getAceAutocomplete } from "./autocomplete";
import { PARSER_OPTIONS } from "./options.tsx";
import { useThemeBuilderStore } from "../../store";
import { TEMPLATES } from "./templates.ts";
import { DBButton, DBCard, DBDivider } from "@db-ui/react-components";

const Editor = () => {
  const { editorMarkup } = useThemeBuilderStore((state) => state);

  useEffect(() => {
    const langTools = ace.require("ace/ext/language_tools");
    langTools.addCompleter(getAceAutocomplete());
  }, []);

  const onFormat = async () => {
    const formatted = await format(editorMarkup, {
      parser: "babel",
      plugins: [babel, estree, html],
      semi: false,
    });

    useThemeBuilderStore.setState({
      editorMarkup: formatted.replace(/\n$/, "").replace(";", ""),
    });
  };

  return (
    <div className="editor w-full h-full grid grid-cols-2 gap-fix-xs p-fix-xs">
      <div className="flex flex-col gap-fix-xs">
        <AceEditor
          mode="html"
          theme="dracula"
          onChange={(value) =>
            useThemeBuilderStore.setState({
              editorMarkup: value,
            })
          }
          name="ace-editor"
          value={editorMarkup || ""}
          fontSize={16}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          height={"100%"}
          width={"100%"}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            useWorker: false,
          }}
        />
        <div className="flex flex-wrap db-ui-functional gap-fix-xs">
          <DBButton icon="grid_view" onClick={() => onFormat()}>
            Format Code
          </DBButton>
          <DBDivider variant="vertical" />
          {TEMPLATES.map((template) => (
            <DBButton
              icon="copy"
              key={template.key}
              onClick={() => {
                navigator.clipboard.writeText(template.content || "");
                useThemeBuilderStore.setState({
                  notification: `${template.label} Template copied`,
                });
              }}
            >
              {template.label} Template
            </DBButton>
          ))}
        </div>
      </div>
      <DBCard className="rounded-none h-full overflow-auto">
        {parse(editorMarkup, PARSER_OPTIONS)}
      </DBCard>
    </div>
  );
};

export default Editor;
