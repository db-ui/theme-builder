import { useEffect } from "react";
import parse from "html-react-parser";

import "./index.scss";
import "@db-ui/foundations/build/css/color-classes.css";
import "./tailwind.generated.css";

import ace from "ace-builds";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import { getAceAutocomplete } from "./autocomplete";
import { PARSER_OPTIONS } from "./options.tsx";
import { useThemeBuilderStore } from "../../store";

const Editor = () => {
  const { darkMode } = useThemeBuilderStore((state) => state);
  const { editorMarkup } = useThemeBuilderStore((state) => state);

  useEffect(() => {
    const langTools = ace.require("ace/ext/language_tools");
    langTools.addCompleter(getAceAutocomplete());
  }, []);

  return (
    <div className="split-view-container">
      {/* TODO: Add templates here */}
      <AceEditor
        mode="html"
        theme={darkMode ? "xcode" : "dracula"}
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
      <div className="preview">{parse(editorMarkup, PARSER_OPTIONS)}</div>
    </div>
  );
};

export default Editor;
