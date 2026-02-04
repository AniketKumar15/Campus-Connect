import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatListBulleted,
    MdFormatListNumbered,
} from "react-icons/md";
import { useEffect, useState } from "react";

const RichTextEditor = ({ value, onChange }) => {
    const [marks, setMarks] = useState({
        bold: false,
        italic: false,
    });

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
        ],
        content: value,

        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },

        onTransaction({ editor }) {
            const { state } = editor;

            const stored =
                state.storedMarks ||
                state.selection.$from.marks();

            setMarks({
                bold: stored.some(m => m.type.name === "bold"),
                italic: stored.some(m => m.type.name === "italic"),
            });
        },
    });

    if (!editor) return null;

    const btn = (active) =>
        `px-3 py-1 rounded-md transition
        ${active ? "bg-indigo-500 text-white" : "bg-white/10 hover:bg-white/20"}`;

    return (
        <div className="rounded-xl border border-white/10 bg-[#0b0f1a]">
            <div className="flex gap-2 p-3 border-b border-white/10">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={btn(marks.bold)}
                >
                    <MdFormatBold size={20} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={btn(marks.italic)}
                >
                    <MdFormatItalic size={20} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={btn(editor.isActive("heading", { level: 2 }))}
                >
                    <b>H</b>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={btn(editor.isActive("bulletList"))}
                >
                    <MdFormatListBulleted size={20} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={btn(editor.isActive("orderedList"))}
                >
                    <MdFormatListNumbered size={20} />
                </button>
            </div>

            <EditorContent
                editor={editor}
                className="tiptap p-4 min-h-55"
            />
        </div>
    );
};

export default RichTextEditor;
