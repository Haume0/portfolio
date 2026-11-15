"use client";
import { type Editor, Extension, type Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, {
  type SuggestionKeyDownProps,
  type SuggestionProps,
} from "@tiptap/suggestion";
import { useImperativeHandle, useState } from "react";

type SlashOptions = { pickImage: (editor: Editor) => void };

type SlashItem = {
  title: string;
  aliases: string[];
  run: (editor: Editor, range: Range, options: SlashOptions) => void;
};

// Komutlar "/sorgu" metnini silip bloğu imlecin olduğu paragrafa uygular.
const slashItems: SlashItem[] = [
  {
    title: "Metin",
    aliases: ["text", "paragraf", "paragraph"],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  ...([1, 2, 3] as const).map((level) => ({
    title: `Başlık ${level}`,
    aliases: [`h${level}`, `heading ${level}`, "baslik"],
    run: (editor: Editor, range: Range) =>
      editor.chain().focus().deleteRange(range).setHeading({ level }).run(),
  })),
  {
    title: "Madde listesi",
    aliases: ["bullet list", "liste", "ul"],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numaralı liste",
    aliases: ["numbered list", "ordered list", "ol", "numarali"],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Yapılacaklar",
    aliases: ["to-do", "todo", "task", "checkbox", "yapilacak"],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Toggle",
    aliases: ["toggle list", "açılır", "acilir", "details"],
    // Neden: Lehçede toggle, özet paragrafının altında blok taşıyan bir madde; altına boş paragraf eklenir.
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .command(({ tr, state }) => {
          tr.insert(
            tr.selection.$from.after(),
            state.schema.nodes.paragraph.create(),
          );
          return true;
        })
        .run(),
  },
  {
    title: "Alıntı",
    aliases: ["quote", "blockquote", "alinti"],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setBlockquote().run(),
  },
  {
    title: "Kod bloğu",
    aliases: ["code", "code block", "kod"],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setCodeBlock().run(),
  },
  {
    title: "Ayraç",
    aliases: ["divider", "hr", "çizgi", "cizgi", "ayrac"],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Görsel",
    aliases: ["image", "resim", "fotoğraf", "gorsel", "foto"],
    // Dosya seçimi ve yükleme editörün kendisinde; burada yalnızca "/görsel" metni silinir.
    run: (editor, range, options) => {
      editor.chain().focus().deleteRange(range).run();
      options.pickImage(editor);
    },
  },
  {
    title: "Callout",
    aliases: ["not", "kutu", "aside", "uyarı"],
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .wrapIn("callout", { icon: { type: "emoji", value: "💡" } })
        .run(),
  },
];

// Neden: Türkçe büyük/küçük harf (İ/ı) ve Notion'daki İngilizce adlarla arama aynı sonucu versin.
export function filterSlashItems(query: string) {
  const normalized = query.toLocaleLowerCase("tr").trim();
  return slashItems.filter((item) =>
    [item.title, ...item.aliases].some((name) =>
      name.toLocaleLowerCase("tr").includes(normalized),
    ),
  );
}

type SlashMenuHandle = { onKeyDown: (event: KeyboardEvent) => boolean };

function SlashMenu({
  items,
  command,
  ref,
}: SuggestionProps<SlashItem, SlashItem> & {
  ref: React.Ref<SlashMenuHandle>;
}) {
  const [active, setActive] = useState(0);
  const [lastItems, setLastItems] = useState(items);
  // Filtre değişince seçim başa döner.
  if (lastItems !== items) {
    setLastItems(items);
    setActive(0);
  }

  useImperativeHandle(ref, () => ({
    onKeyDown: (event) => {
      if (!items.length) return false;
      if (event.key === "ArrowDown") {
        setActive((active + 1) % items.length);
        return true;
      }
      if (event.key === "ArrowUp") {
        setActive((active - 1 + items.length) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        command(items[active]);
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="bg-dark rounded-2xl p-2 shadow-2xl border border-body/60 w-60 max-h-80 overflow-y-auto flex flex-col gap-1 font-sora z-50">
      {items.length ? (
        items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => command(item)}
            className={`text-left rounded-xl px-3 py-2 text-base font-medium ease-in-out duration-200 ${
              index === active
                ? "bg-white text-black"
                : "text-white hover:bg-body"
            }`}
          >
            {item.title}
          </button>
        ))
      ) : (
        <span className="px-3 py-2 text-base text-white/60">Sonuç yok</span>
      )}
    </div>
  );
}

export const SlashCommand = Extension.create<SlashOptions>({
  name: "slashCommand",
  addOptions() {
    return { pickImage: () => {} };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        char: "/",
        items: ({ query }) => filterSlashItems(query),
        // Kod bloğunda "/" düz metindir.
        allow: ({ editor }) => !editor.isActive("codeBlock"),
        command: ({ editor, range, props }) =>
          props.run(editor, range, this.options),
        render: () => {
          let menu: ReactRenderer<SlashMenuHandle> | null = null;
          let unmount: (() => void) | undefined;
          return {
            onStart: (props) => {
              menu = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              });
              unmount = props.mount(menu.element);
            },
            onUpdate: (props) => menu?.updateProps(props),
            // Escape'i eklenti kendisi ele alıp onExit'i çağırıyor.
            onKeyDown: ({ event }: SuggestionKeyDownProps) =>
              menu?.ref?.onKeyDown(event) ?? false,
            onExit: () => {
              unmount?.();
              menu?.destroy();
              menu = null;
            },
          };
        },
      }),
    ];
  },
});
