"use client";
import { type Editor, isNodeSelection } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";

const buttonClass =
  "h-10 min-w-10 px-3 rounded-xl font-sora text-base font-medium ease-in-out duration-200";

export default function EditorToolbar({ editor }: { editor: Editor }) {
  const [linkDraft, setLinkDraft] = useState<string | null>(null);
  const active = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      link: editor.isActive("link"),
    }),
  });

  const marks = [
    { name: "bold", label: "B", title: "Kalın", className: "font-extrabold" },
    { name: "italic", label: "I", title: "İtalik", className: "italic" },
    {
      name: "strike",
      label: "S",
      title: "Üstü çizili",
      className: "line-through",
    },
    { name: "code", label: "</>", title: "Kod", className: "font-mono" },
  ] as const;

  const saveLink = (href: string) => {
    const chain = editor.chain().focus().extendMarkRange("link");
    if (href.trim()) chain.setLink({ href: href.trim() }).run();
    else chain.unsetLink().run();
    setLinkDraft(null);
  };

  return (
    <BubbleMenu
      editor={editor}
      // Neden: Kod bloğunda mark yok; görsel/ham blok gibi node seçimlerinde biçimlendirilecek metin yok.
      shouldShow={({ editor, state, from, to }) =>
        from !== to &&
        !isNodeSelection(state.selection) &&
        !editor.isActive("codeBlock")
      }
      options={{ placement: "top" }}
      className="bg-dark rounded-2xl p-1.5 shadow-2xl border border-body/60 flex items-center gap-1 z-50"
    >
      {linkDraft === null ? (
        <>
          {marks.map((mark) => (
            <button
              key={mark.name}
              type="button"
              title={mark.title}
              onClick={() => editor.chain().focus().toggleMark(mark.name).run()}
              className={`${buttonClass} ${mark.className} ${
                active[mark.name]
                  ? "bg-white text-black"
                  : "text-white hover:bg-body"
              }`}
            >
              {mark.label}
            </button>
          ))}
          <button
            type="button"
            title="Bağlantı"
            onClick={() =>
              setLinkDraft(editor.getAttributes("link").href ?? "")
            }
            className={`${buttonClass} ${
              active.link ? "bg-white text-black" : "text-white hover:bg-body"
            }`}
          >
            Link
          </button>
        </>
      ) : (
        <>
          <input
            // biome-ignore lint/a11y/noAutofocus: Link alanı açıldığında doğrudan yazılabilmeli.
            autoFocus
            value={linkDraft}
            placeholder="https://..."
            onChange={(event) => setLinkDraft(event.target.value)}
            onKeyDown={(event) => {
              // Neden: Enter dıştaki yazı formunu göndermemeli.
              if (event.key === "Enter") {
                event.preventDefault();
                saveLink(linkDraft);
              }
              if (event.key === "Escape") setLinkDraft(null);
            }}
            className="h-10 w-64 px-3 rounded-xl bg-body text-white font-sora text-base outline-hidden focus:bg-white focus:text-body"
          />
          <button
            type="button"
            onClick={() => saveLink(linkDraft)}
            className={`${buttonClass} text-white hover:bg-body`}
          >
            Kaydet
          </button>
          {active.link && (
            <button
              type="button"
              onClick={() => saveLink("")}
              className={`${buttonClass} text-white hover:bg-body`}
            >
              Kaldır
            </button>
          )}
        </>
      )}
    </BubbleMenu>
  );
}
