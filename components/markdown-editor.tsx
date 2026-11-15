"use client";
import type { Editor } from "@tiptap/core";
import FileHandler from "@tiptap/extension-file-handler";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";
import {
  Gapcursor,
  Placeholder,
  TrailingNode,
  UndoRedo,
} from "@tiptap/extensions";
import {
  EditorContent,
  NodeViewWrapper,
  type ReactNodeViewProps,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useEffect, useState } from "react";
import CalloutView from "@/components/editor-callout";
import { SlashCommand } from "@/components/editor-slash-menu";
import EditorToolbar from "@/components/editor-toolbar";
import { markdownClasses } from "@/components/markdown-classes";
import MarkdownRenderer from "@/components/md-renderer";
import { documentToMarkdown, markdownToDocument } from "@/lib/editor-document";
import { Callout, editorExtensions, RawBlock } from "@/lib/editor-schema";

// Ham blok (ör. tablo) sitede nasıl görünüyorsa öyle ve salt okunur gösterilir.
// Neden: [&>div]:p-0, MarkdownRenderer'ın kendi sayfa dolgusunu iç içe kullanımda sıfırlar.
const RawBlockView = ({ node }: ReactNodeViewProps) => (
  <NodeViewWrapper contentEditable={false} className="[&>div]:p-0">
    <MarkdownRenderer content={node.attrs.source} />
  </NodeViewWrapper>
);

// Neden: Şema modülü React'sız ve DOM'suz kalmalı (dönüştürücü ve testler onu kullanıyor);
// node view'lar ve düzenleme davranışları yalnızca burada eklenir.
const baseExtensions = [
  ...editorExtensions.map((extension) =>
    extension === RawBlock
      ? RawBlock.extend({
          addNodeView: () => ReactNodeViewRenderer(RawBlockView),
        })
      : extension === Callout
        ? Callout.extend({
            addNodeView: () => ReactNodeViewRenderer(CalloutView),
          })
        : extension,
  ),
  UndoRedo,
  // Görsel, ayraç ve ham blok gibi metin konumu olmayan blokların önüne/arkasına imleç koyabilmek için.
  Gapcursor,
  // Belge callout veya kod bloğuyla bitiyorsa altına yazılabilsin diye sona boş paragraf eklenir.
  TrailingNode,
  Placeholder.configure({
    placeholder: ({ node }) =>
      node.type.name === "paragraph"
        ? "Yazmaya başla, bloklar için / yaz…"
        : "",
  }),
];

type Upload = (
  formdata: FormData,
) => Promise<{ url: string } | { error: string }>;

const pickImageFiles = (onPick: (files: File[]) => void) => {
  const picker = document.createElement("input");
  picker.type = "file";
  picker.accept = "image/*";
  picker.multiple = true;
  picker.onchange = () => onPick(Array.from(picker.files ?? []));
  picker.click();
};

const findImage = (editor: Editor, src: string) => {
  let found: { pos: number; node: NodeSelection["node"] } | null = null;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "image" && node.attrs.src === src)
      found = { pos, node };
  });
  return found as { pos: number; node: NodeSelection["node"] } | null;
};

// Neden: Bu farklar paylaşılamıyor. Tiptap'te liste maddesi her zaman paragrafla başlar; sitede sıkı maddeler ve
// toggle özeti <p> sınıfı almaz. Task maddesinin markup'ı da Tiptap'in node view'ından geliyor (label > input + div).
// Placeholder ve gap cursor yalnızca editörde var.
const editorOnlyClasses = [
  "outline-none",
  "[&_li>p:first-child]:mb-0 [&_li>p:first-child]:text-[length:inherit] [&_li>p:first-child]:text-inherit",
  "[&_li>div>p:first-child]:mb-0 [&_li>div>p:first-child]:text-[length:inherit] [&_li>div>p:first-child]:text-inherit",
  "[&_ul[data-type=taskList]>li]:flex [&_ul[data-type=taskList]>li]:items-start [&_ul[data-type=taskList]>li]:gap-3",
  "[&_ul[data-type=taskList]_input]:size-5 [&_ul[data-type=taskList]_input]:mt-0.5 [&_ul[data-type=taskList]_input]:accent-works",
  "[&_p.is-empty]:before:content-[attr(data-placeholder)] [&_p.is-empty]:before:text-milk/30 [&_p.is-empty]:before:float-left [&_p.is-empty]:before:h-0 [&_p.is-empty]:before:pointer-events-none",
  "[&_.ProseMirror-gapcursor]:after:border-milk",
  "[&_img[src^='blob:']]:opacity-40 [&_img[src^='blob:']]:animate-pulse",
].join(" ");

export default function MarkdownEditor({
  name,
  markdown,
  upload,
}: {
  name: string;
  markdown: string;
  upload: Upload;
}) {
  const [content, setContent] = useState(markdown);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [initial] = useState(() => {
    const document = markdownToDocument(markdown);
    return { document, written: documentToMarkdown(document) };
  });

  // Yükleme sürerken görsel, dosyanın blob: önizlemesiyle belgede durur (yazıcı bunu dosyaya hiç yazmaz).
  // Sunucu kalıcı URL'yi dönünce kaynak değiştirilir; hata olursa önizleme kalkar ya da eski görsel geri gelir.
  const sendImage = async (
    editor: Editor,
    file: File,
    preview: string,
    previousSrc?: string,
  ) => {
    const formdata = new FormData();
    formdata.append("file", file);
    const result = await upload(formdata).catch(() => ({
      error: `"${file.name}" yüklenemedi.`,
    }));
    const image = findImage(editor, preview);
    if ("error" in result) setUploadError(result.error);
    // Önizleme bu arada silindiyse yapılacak bir şey yok.
    if (!image) return;
    const tr = editor.state.tr;
    if ("url" in result || previousSrc) {
      tr.setNodeMarkup(image.pos, undefined, {
        ...image.node.attrs,
        src: "url" in result ? result.url : previousSrc,
      });
    } else {
      tr.delete(image.pos, image.pos + image.node.nodeSize);
    }
    // Neden: Kaynak değişimi geri alma geçmişine girmez; tek geri alma görselin eklenmesini/değişmesini geri alır.
    editor.view.dispatch(tr.setMeta("addToHistory", false));
  };

  const insertImages = (editor: Editor, files: File[], position: number) => {
    setUploadError(null);
    const images = files.filter((file) => file.type.startsWith("image/"));
    // Neden: Görsel olmayan dosya için önizleme konmaz; neden reddedildiğini sunucu tek yerden söyler.
    for (const file of files.filter((file) => !images.includes(file))) {
      const formdata = new FormData();
      formdata.append("file", file);
      upload(formdata).then(
        (result) => "error" in result && setUploadError(result.error),
      );
    }
    if (!images.length) return;
    // Neden: Görsel bir blok; metnin ortasına bırakılırsa paragrafı bölmek yerine o paragrafın arkasına eklenir.
    const $position = editor.state.doc.resolve(position);
    const at =
      $position.parent.isTextblock && $position.parent.content.size
        ? $position.after()
        : position;
    const previews = images.map((file) => URL.createObjectURL(file));
    editor
      .chain()
      .focus()
      .insertContentAt(
        at,
        previews.map((src, index) => ({
          type: "image",
          attrs: { src, alt: images[index].name },
        })),
      )
      .run();
    images.forEach((file, index) => {
      sendImage(editor, file, previews[index]);
    });
  };

  const replaceImage = (editor: Editor, file: File) => {
    const { selection } = editor.state;
    if (!(selection instanceof NodeSelection)) return;
    setUploadError(null);
    const preview = URL.createObjectURL(file);
    const previousSrc = selection.node.attrs.src;
    editor
      .chain()
      .focus()
      .updateAttributes("image", { src: preview, alt: file.name })
      .run();
    sendImage(editor, file, preview, previousSrc);
  };

  const [extensions] = useState(() => [
    ...baseExtensions,
    SlashCommand.configure({
      pickImage: (editor) =>
        pickImageFiles((files) =>
          insertImages(editor, files, editor.state.selection.from),
        ),
    }),
    FileHandler.configure({
      onDrop: (editor, files, position) =>
        insertImages(editor, files, position),
      onPaste: (editor, files) =>
        insertImages(editor, files, editor.state.selection.from),
    }),
  ]);

  // Neden: Editör dışına bırakılan dosya tarayıcıyı o dosyaya götürüp kaydedilmemiş yazıyı kaybettirmesin.
  useEffect(() => {
    const preventFileDrop = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) event.preventDefault();
    };
    window.addEventListener("dragover", preventFileDrop);
    window.addEventListener("drop", preventFileDrop);
    return () => {
      window.removeEventListener("dragover", preventFileDrop);
      window.removeEventListener("drop", preventFileDrop);
    };
  }, []);

  const editor = useEditor({
    extensions,
    content: initial.document,
    // Neden: Next bileşeni önce sunucuda render ediyor; editör yalnızca istemcide oluşturulmalı.
    immediatelyRender: false,
    editorProps: {
      attributes: { class: `${markdownClasses.root} ${editorOnlyClasses}` },
    },
    // Neden: ProseMirror başlangıç seçimini belgenin başına koyar; yazı görselle başlıyorsa bu görselin
    // node seçimi olur ve ilk tuş görseli siler. Başlangıç seçimi ilk metin konumuna alınır.
    onCreate: ({ editor }) => {
      const selection = TextSelection.findFrom(
        editor.state.doc.resolve(0),
        1,
        true,
      );
      if (selection)
        editor.view.dispatch(editor.state.tr.setSelection(selection));
    },
    // Neden: Yazılan markdown başlangıçtakiyle aynıysa (ör. değişiklik geri alındıysa ya da yalnızca sona
    // boş paragraf eklendiyse) orijinal metin gönderilir; böylece başlık değişikliği gövdeyi yeniden biçimlendirmez.
    onUpdate: ({ editor }) => {
      const written = documentToMarkdown(editor.getJSON());
      setContent(written === initial.written ? markdown : written);
    },
  });

  return (
    <>
      {editor && <EditorToolbar editor={editor} />}
      {editor && (
        <BubbleMenu
          editor={editor}
          pluginKey="imageMenu"
          shouldShow={({ state }) =>
            state.selection instanceof NodeSelection &&
            state.selection.node.type.name === "image"
          }
          options={{ placement: "top" }}
          className="bg-dark rounded-2xl p-1.5 shadow-2xl border border-body/60 z-50"
        >
          <button
            type="button"
            onClick={() =>
              pickImageFiles(([file]) => file && replaceImage(editor, file))
            }
            className="h-10 px-3 rounded-xl font-sora text-base font-medium text-white hover:bg-body ease-in-out duration-200"
          >
            Görseli değiştir
          </button>
        </BubbleMenu>
      )}
      {/* Neden: Editör, formdaki diğer alanlar gibi açık bir yüzeyde durur; boşken de büyük bir tıklama alanı
          kalsın diye yükseklik ProseMirror kökünün kendisine verilir, böylece boş alana tıklamak imleci içeri koyar.
          İç boşluğu kökün sitedeki p-6'sı sağlar; bu yüzden kutunun kendi dolgusu yok ve yazı genişliği değişmiyor. */}
      <EditorContent
        editor={editor}
        className="rounded-3xl bg-body [&_.ProseMirror]:min-h-80"
      />
      {uploadError && (
        <div
          role="alert"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-dark rounded-2xl border border-body/60 shadow-2xl py-3 pl-4 pr-2 flex items-center gap-3 font-sora"
        >
          <span className="text-red-300 text-base">{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="h-10 px-3 rounded-xl text-white hover:bg-body ease-in-out duration-200"
          >
            Kapat
          </button>
        </div>
      )}
      {/* Neden: Kontrollü alan; gizli input'ta defaultValue her render'da değeri sıfırlıyor (React hidden input'un value attribute'unu yazıyor). */}
      <input type="hidden" name={name} value={content} />
    </>
  );
}
