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
        `p-2 rounded-lg font-extrabold transition-all outline-none flex items-center justify-center ${active
            ? "bg-slate-300 border border-slate-400 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.15)] text-slate-800 translate-y-[1px]"
            : "bg-slate-200 border border-t-white border-l-white border-b-slate-400 border-r-slate-400 hover:bg-slate-100 shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-slate-600 active:translate-y-[1px] active:shadow-none"
        }`;

    return (
        <div className="bg-slate-100 flex flex-col h-full font-sans w-full">
            <div className="flex flex-wrap gap-2 p-3 bg-slate-200 border-b-2 border-slate-300 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={btn(marks.bold)}
                    type="button"
                >
                    <MdFormatBold size={20} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={btn(marks.italic)}
                    type="button"
                >
                    <MdFormatItalic size={20} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={btn(editor.isActive("heading", { level: 2 }))}
                    type="button"
                >
                    <b className="px-1 text-sm">H</b>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={btn(editor.isActive("bulletList"))}
                    type="button"
                >
                    <MdFormatListBulleted size={20} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={btn(editor.isActive("orderedList"))}
                    type="button"
                >
                    <MdFormatListNumbered size={20} />
                </button>
            </div>

            <div className="p-4 flex-grow lg:min-h-[200px] text-slate-800 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-400 outline-none">
                <EditorContent
                    editor={editor}
                    className="prose prose-slate max-w-none focus:outline-none h-full outline-none"
                />
            </div>
        </div>
    );
};

export default RichTextEditor;
