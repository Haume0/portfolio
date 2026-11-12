"use client";

import "@blocknote/shadcn/style.css";

import {
  type Block,
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlockForSlashMenu,
  type PartialBlock,
} from "@blocknote/core";
import { tr } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/shadcn";
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  CreateLinkButton,
  createReactBlockSpec,
  EmbedTab,
  FileCaptionButton,
  FilePanel,
  FilePanelController,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useBlockNoteEditor,
  useCreateBlockNote,
} from "@blocknote/react";
import { useEffect, useRef, useState } from "react";

import { uploadEditorAsset } from "@/app/(default)/editor/upload-action";
import { emojiOnlyPattern } from "@/lib/emoji";

// Notion export'undaki <aside> callout'ları. md-renderer bunları ikonlu kutu
// olarak çiziyor; BlockNote'un markdown dönüştürücüsü <aside>'ı tanımadığı için
// kendi bloğu olarak tutup markdown'a elle çeviriyoruz.
const calloutBlock = createReactBlockSpec(
  {
    type: "callout",
    propSchema: { icon: { default: "💡" } },
    content: "none",
    layoutOnly: true,
    // İç içe callout geri okunamaz: aside regex'i ilk </aside>'da kapanıyor.
    children: { exclude: ["callout"] },
  },
  {
    renderFrame: ({ block, editor, slotRef }) => (
      <div className="my-1 flex items-start rounded-2xl bg-dark p-4">
        <span contentEditable={false} className="shrink-0">
          {isImageIcon(block.props.icon) ? (
            <img
              src={block.props.icon}
              alt=""
              className="size-8 rounded-md object-cover"
            />
          ) : (
            <input
              value={block.props.icon}
              aria-label="Callout ikonu"
              placeholder="💡"
              // Emoji seçiciler emojiyi panoya kopyalıyor; input editörün
              // içinde olduğu için yapıştırma ProseMirror'a ulaşıp emojiyi
              // ikona değil yazının içine ekliyordu. Olay input'ta durdurulur.
              ref={(input) => {
                if (!input) return;
                const stopPaste = (event: Event) => event.stopPropagation();
                input.addEventListener("paste", stopPaste);
                return () => input.removeEventListener("paste", stopPaste);
              }}
              onKeyDown={(event) => {
                // Input dış formun içinde; Enter formu kaydetmesin.
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.currentTarget.blur();
                }
              }}
              onChange={(event) =>
                editor.updateBlock(block, {
                  props: { icon: event.target.value },
                })
              }
              className="w-10 bg-transparent text-center text-2xl outline-hidden"
            />
          )}
        </span>
        {/* İçteki blokların yan menüsü (+ ve tutamaç, 52px) bloğun soluna
            açılıyor; boşluk olmazsa ikonun üstüne binip tıklanmasını engelliyor. */}
        <div ref={slotRef} className="min-w-0 flex-1 pl-[56px]" />
      </div>
    ),
  },
);

const schema = BlockNoteSchema.create({
  blockSpecs: { ...defaultBlockSpecs, callout: calloutBlock() },
});

type EditorBlock = Block<
  typeof schema.blockSchema,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;
type EditorPartialBlock = PartialBlock<
  typeof schema.blockSchema,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;
type Editor = BlockNoteEditor<
  typeof schema.blockSchema,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;

const asidePattern = /<aside>([\s\S]*?)<\/aside>/g;

function isImageIcon(icon: string) {
  return /^(\/|https?:\/\/)/.test(icon);
}

function markdownToBlocks(editor: Editor, markdown: string) {
  const blocks: EditorPartialBlock[] = [];
  let lastIndex = 0;

  for (const match of markdown.matchAll(asidePattern)) {
    blocks.push(
      ...editor.tryParseMarkdownToBlocks(
        markdown.slice(lastIndex, match.index),
      ),
    );
    lastIndex = match.index + match[0].length;

    // Notion callout'un ilk satırı ikon: emoji ya da <img src="...">.
    const [firstLine, ...rest] = match[1].trim().split("\n");
    const imageSrc = firstLine.match(/^<img[^>]*\ssrc="([^"]+)"/)?.[1];
    const emoji = emojiOnlyPattern.test(firstLine.trim()) ? firstLine.trim() : null;
    const icon = imageSrc ?? emoji ?? "";
    const children = editor.tryParseMarkdownToBlocks(
      icon ? rest.join("\n") : match[1],
    );

    blocks.push({
      type: "callout",
      props: { icon },
      // Layout bloğu en az bir çocuk ister, boş callout'ta paragraf açılır.
      children: children.length > 0 ? children : [{ type: "paragraph" }],
    });
  }

  blocks.push(...editor.tryParseMarkdownToBlocks(markdown.slice(lastIndex)));
  return blocks;
}

function blocksToMarkdown(editor: Editor, blocks: EditorBlock[]) {
  const parts: string[] = [];
  let group: EditorBlock[] = [];

  // Ardışık bloklar birlikte çevrilir; tek tek çevrilince liste maddeleri
  // ayrı listelere bölünüyor.
  const flushGroup = () => {
    if (group.length > 0) {
      parts.push(editor.blocksToMarkdownLossy(group).trim());
      group = [];
    }
  };

  for (const block of blocks) {
    if (block.type !== "callout") {
      group.push(block);
      continue;
    }

    flushGroup();
    const icon = block.props.icon;
    parts.push(
      [
        "<aside>",
        isImageIcon(icon) ? `<img src="${icon}" alt="" width="40px" />` : icon,
        "",
        editor.blocksToMarkdownLossy(block.children).trim(),
        "",
        "</aside>",
      ].join("\n"),
    );
  }

  flushGroup();
  return `${parts.filter(Boolean).join("\n\n")}\n`;
}

// /görsel panelinin "Yükle" sekmesi. BlockNote'un varsayılanı küçük bir dosya
// butonu; panelin geri kalanına bırakılan görsel tarayıcıda açılıyordu.
function UploadDropZone(props: { blockId: string }) {
  const editor = useBlockNoteEditor();
  const [status, setStatus] = useState<string | null>(null);
  const isImage = editor.getBlock(props.blockId)?.type === "image";

  return (
    <label className="relative flex h-32 w-80 max-w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-input px-4 text-center text-sm text-muted-foreground hover:border-primary hover:text-foreground">
      {status ??
        (isImage ? "Görseli sürükle veya seç" : "Dosyayı sürükle veya seç")}
      {/* Input alanı kaplar; tıklama ve sürükle-bırak doğrudan ona düşer. */}
      <input
        type="file"
        accept={isImage ? "image/*" : undefined}
        disabled={status === "Yükleniyor…"}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file || !editor.uploadFile) return;

          setStatus("Yükleniyor…");
          try {
            const url = await editor.uploadFile(file, props.blockId);
            editor.updateBlock(props.blockId, {
              props: { name: file.name, url: String(url) },
            });
          } catch (error) {
            setStatus(`Yüklenemedi: ${(error as Error).message}`);
          }
        }}
      />
    </label>
  );
}

export default function NotionEditor(props: {
  name: string;
  defaultValue: string;
}) {
  // Kullanıcı düzenleme yapana kadar orijinal markdown gönderilir; böylece
  // yalnızca başlık/kapak değişen kayıtlarda kayıplı dönüşüm içeriğe dokunmaz.
  const editedRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Yüklenen görseller kayda kadar bu oturumun temp klasöründe bekler.
  const [uploadSession] = useState(() => crypto.randomUUID());
  const [initialContent] = useState(() => {
    const blocks = markdownToBlocks(
      BlockNoteEditor.create({ schema }),
      props.defaultValue,
    );
    return blocks.length > 0 ? blocks : undefined;
  });
  const editor = useCreateBlockNote({
    schema,
    dictionary: tr,
    initialContent,
    uploadFile: (file) => {
      const formdata = new FormData();
      formdata.set("session", uploadSession);
      formdata.set("file", file);
      return uploadEditorAsset(formdata);
    },
  });
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    // Editörü ıskalayan dosya bırakmaları görseli yeni sekmede açıp sayfadan
    // çıkarıyor. Dosya input'larına bırakma tarayıcının kendi işi, dokunulmaz.
    const preventFileOpen = (event: DragEvent) => {
      const target = event.target;
      if (!event.dataTransfer?.types.includes("Files")) return;
      if (target instanceof HTMLInputElement && target.type === "file") return;
      event.preventDefault();
    };

    window.addEventListener("dragover", preventFileOpen);
    window.addEventListener("drop", preventFileOpen);
    return () => {
      window.removeEventListener("dragover", preventFileOpen);
      window.removeEventListener("drop", preventFileOpen);
    };
  }, []);

  useEffect(() => {
    const form = wrapperRef.current?.closest("form");
    if (!form) return;

    // Markdown'a çevirmek tüm belgeyi dolaşıyor; her tuşta değil yalnızca form
    // gönderilirken yapılır. Editör ekranı zaten önizleme olduğu için etkilenmez.
    const appendContent = (event: FormDataEvent) => {
      event.formData.set(
        props.name,
        editedRef.current
          ? blocksToMarkdown(editor, editor.document)
          : props.defaultValue,
      );
      event.formData.set("uploadSession", uploadSession);
    };

    form.addEventListener("formdata", appendContent);
    return () => form.removeEventListener("formdata", appendContent);
  }, [editor, props.name, props.defaultValue, uploadSession]);

  // BlockNote dosyayı yalnızca sürüklenen/yapıştırılan veride metin yoksa
  // yüklüyor; dosya yöneticileri yolu, tarayıcılar HTML'i de eklediği için
  // görsel metin sanılıp yüklenmiyordu. Dosya içeren olayları burada yakalarız.
  function insertFiles(
    event: React.DragEvent | React.ClipboardEvent,
    files: File[],
    referenceId: string | undefined,
  ) {
    if (files.length === 0 || !referenceId) return;

    event.preventDefault();
    event.stopPropagation();
    setUploadError(null);

    let previousId = referenceId;
    for (const file of files) {
      const [block] = editor.insertBlocks(
        [
          {
            type: file.type.startsWith("image/") ? "image" : "file",
            props: { name: file.name },
          },
        ],
        previousId,
        "after",
      );
      previousId = block.id;

      editor
        .uploadFile?.(file, block.id)
        .then((url) => {
          // Yükleme sürerken blok silindiyse güncellenecek bir şey yok;
          // kullanılmayan temp dosya kayıtta temizlenir.
          if (editor.getBlock(block.id)) {
            editor.updateBlock(block.id, { props: { url: String(url) } });
          }
        })
        .catch((error: Error) => {
          if (editor.getBlock(block.id)) editor.removeBlocks([block.id]);
          setUploadError(`${file.name} yüklenemedi: ${error.message}`);
        });
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="notion-editor rounded-xl bg-body"
      // Tarayıcı drop olayını yalnızca dragover'ı iptal edilen yerde verir;
      // editör dışındaki kenar boşluklarında da dosya bırakılabilsin.
      onDragOverCapture={(event) => {
        if (event.dataTransfer.types.includes("Files")) {
          event.preventDefault();
        }
      }}
      onDropCapture={(event) => {
        // /görsel paneli React ağacında editörün içinde; oraya bırakılan
        // dosyayı panelin kendi input'u yükler.
        if ((event.target as HTMLElement).closest(".bn-panel")) return;

        // BlockNote içerik dışına bırakılan olayın "synthetic" bir kopyasını
        // editöre yeniden gönderiyor; kopya yutulur, yalnızca asıl olay işlenir.
        if (
          (event.nativeEvent as DragEvent & { synthetic?: boolean }).synthetic
        ) {
          if (event.dataTransfer.files.length > 0) {
            event.preventDefault();
            event.stopPropagation();
          }
          return;
        }

        const blockId = document
          .elementFromPoint(event.clientX, event.clientY)
          ?.closest("[data-id]")
          ?.getAttribute("data-id");

        insertFiles(
          event,
          Array.from(event.dataTransfer.files),
          blockId ?? editor.document.at(-1)?.id,
        );

        // Drop editöre ulaşmadığı için bırakma imleci ekranda kalıyor;
        // BlockNote'un kendi kullandığı sentetik dragleave ile kapatılır.
        if (event.defaultPrevented) {
          const dragleave = Object.assign(new Event("dragleave"), {
            synthetic: true,
          });
          editor.prosemirrorView?.dom.dispatchEvent(dragleave);
        }
      }}
      onPasteCapture={(event) =>
        insertFiles(
          event,
          Array.from(event.clipboardData.files),
          editor.getTextCursorPosition().block.id,
        )
      }
    >
      {uploadError && (
        <p className="mx-4 mt-4 rounded-xl bg-dark px-4 py-2 text-white/80">
          {uploadError}
        </p>
      )}
      <BlockNoteView
        editor={editor}
        theme="dark"
        slashMenu={false}
        formattingToolbar={false}
        filePanel={false}
        onChange={() => {
          editedRef.current = true;
        }}
      >
        {/* Yalnızca markdown'a yazılabilen biçimler; altı çizili, renk ve
            hizalama md dosyasına kaydedilemediği için gösterilmiyor. */}
        <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar>
              <BlockTypeSelect key="blockTypeSelect" />
              <FileCaptionButton key="fileCaptionButton" />
              <FileReplaceButton key="replaceFileButton" />
              <BasicTextStyleButton basicTextStyle="bold" key="bold" />
              <BasicTextStyleButton basicTextStyle="italic" key="italic" />
              <BasicTextStyleButton basicTextStyle="strike" key="strike" />
              <BasicTextStyleButton basicTextStyle="code" key="code" />
              <CreateLinkButton key="createLinkButton" />
            </FormattingToolbar>
          )}
        />
        <FilePanelController
          filePanel={(panel) => (
            <FilePanel
              blockId={panel.blockId}
              tabs={[
                {
                  name: editor.dictionary.file_panel.upload.title,
                  tabPanel: <UploadDropZone blockId={panel.blockId} />,
                },
                {
                  name: editor.dictionary.file_panel.embed.title,
                  tabPanel: <EmbedTab blockId={panel.blockId} />,
                },
              ]}
            />
          )}
        />
        <SuggestionMenuController
          triggerCharacter="/"
          getItems={async (query) => {
            // Video/ses markdown'a resim sözdizimiyle yazılıp kırık görsel
            // olarak render ediliyor.
            const items = getDefaultReactSlashMenuItems(editor).filter(
              (item) =>
                !["video", "audio"].includes(
                  (item as { key?: string }).key ?? "",
                ),
            );
            // Menü grupları ardışık olmalı; callout temel blokların sonuna girer.
            const group = editor.dictionary.slash_menu.paragraph.group;
            const index = items.findLastIndex((item) => item.group === group);

            items.splice(index + 1, 0, {
              title: "Callout",
              subtext: "İkonlu vurgu kutusu",
              aliases: ["aside", "callout", "not"],
              group,
              icon: <span className="text-lg leading-none">💡</span>,
              onItemClick: () =>
                insertOrUpdateBlockForSlashMenu(editor, {
                  type: "callout",
                  children: [{ type: "paragraph" }],
                }),
            });

            return filterSuggestionItems(items, query);
          }}
        />
      </BlockNoteView>
    </div>
  );
}
