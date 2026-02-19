import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
} from "lucide-react";
import { useEffect } from "react";

const Tiptap = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-2 focus:outline-none min-h-[150px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Handle external value changes (mostly for resetting the form)
  useEffect(() => {
    if (editor && (value === "" || value === "<p></p>")) {
      if (editor.getHTML() !== "<p></p>") {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-md w-full">
      <div className="border-b border-gray-300 p-2 flex gap-2 bg-gray-50 rounded-t-md">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold")
              ? "bg-gray-200 p-1 rounded"
              : "p-1 rounded hover:bg-gray-200"
          }
          type="button"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? "bg-gray-200 p-1 rounded"
              : "p-1 rounded hover:bg-gray-200"
          }
          type="button"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={
            editor.isActive("underline")
              ? "bg-gray-200 p-1 rounded"
              : "p-1 rounded hover:bg-gray-200"
          }
          type="button"
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? "bg-gray-200 p-1 rounded"
              : "p-1 rounded hover:bg-gray-200"
          }
          type="button"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? "bg-gray-200 p-1 rounded"
              : "p-1 rounded hover:bg-gray-200"
          }
          type="button"
        >
          <ListOrdered size={18} />
        </button>
      </div>
      <EditorContent editor={editor} className="p-2" />
    </div>
  );
};

export default Tiptap;
