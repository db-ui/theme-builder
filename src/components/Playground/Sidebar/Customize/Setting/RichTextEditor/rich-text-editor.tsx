import "./index.scss";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import DOMPurify from "dompurify";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { DBButton } from "@db-ui/react-components";

type MenuBarType = {
  editor: Editor | null;
};

type RichTextEditorType = {
  label?: string;
  richTextValue?: string;
  maxChars?: number;
  minChars?: number;
  required?: boolean;
  handleRichTextChange: Dispatch<SetStateAction<string>>;
};

const MenuBar: FC<MenuBarType> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <ul className="menu-bar">
      <li>
        <DBButton
          variant={editor.isActive("bold") ? "filled" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          type="button"
        >
          <b>B</b>
        </DBButton>
      </li>
      <li>
        <DBButton
          variant={editor.isActive("italic") ? "filled" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          type="button"
        >
          <i>I</i>
        </DBButton>
      </li>
      <li>
        <DBButton
          variant={editor.isActive("underline") ? "filled" : "ghost"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          type="button"
        >
          <u>U</u>
        </DBButton>
      </li>
      <li>
        <DBButton
          variant={editor.isActive("strike") ? "filled" : "ghost"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          type="button"
        >
          <s>S</s>
        </DBButton>
      </li>
    </ul>
  );
};

const RichTextEditor: FC<RichTextEditorType> = ({
  label,
  richTextValue,
  handleRichTextChange,
}) => {
  const editor = useEditor({
    extensions: [
      TextStyle, // .configure({ types: [ListItem.name] }),
      Document,
      Paragraph,
      Text,
      Bold,
      Strike,
      Italic,
      Underline,
    ],
    editorProps: {
      attributes: {
        class: "text-editor",
      },
    },
    content: richTextValue,
    injectCSS: false, // remove later
    parseOptions: {
      preserveWhitespace: false,
    },
    onUpdate(props) {
      const content = DOMPurify.sanitize(
        props.editor.getHTML().replaceAll("&nbsp;", ""),
      );
      handleRichTextChange(content === "<p></p>" ? "" : content);
    },
  });

  useEffect(() => {
    // update content with empty string
    richTextValue == "" && editor?.commands.setContent(richTextValue, true);
  }, [richTextValue]);

  return (
    <div className="editor-container">
      {label && <label>{label}</label>}
      <div className="text-container">
        <EditorContent editor={editor} />
        <MenuBar editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
