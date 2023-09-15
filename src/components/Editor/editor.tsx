import { useEffect } from "react";
import parse from "html-react-parser";

import "@db-ui/foundations/build/css/color-classes.css";
import "./tailwind.generated.css";

import ace from "ace-builds";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import { getAceAutocomplete } from "./autocomplete";
import { PARSER_OPTIONS } from "./options.tsx";
import { useThemeBuilderStore } from "../../store";
import { TEMPLATES } from "./templates.ts";
import { DBButton, DBCard } from "@db-ui/react-components";

const Editor = () => {
  const { editorMarkup } = useThemeBuilderStore((state) => state);

  useEffect(() => {
    const langTools = ace.require("ace/ext/language_tools");
    langTools.addCompleter(getAceAutocomplete());
  }, []);

  return (
    <div className="w-full h-full grid grid-cols-2 gap-fix-xs p-fix-xs">
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
