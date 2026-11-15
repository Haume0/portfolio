"use client";
import {
  NodeViewContent,
  NodeViewWrapper,
  type ReactNodeViewProps,
} from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { markdownClasses } from "@/components/markdown-classes";
import { type CalloutIcon, calloutEmojiPattern } from "@/lib/notion-markdown";

// Sitedeki callout markup'ı (ikon iki kez + içerik); ikona tıklayınca emoji ile değiştirilebilir.
export default function CalloutView({
  node,
  updateAttributes,
}: ReactNodeViewProps) {
  const icon: CalloutIcon | null = node.attrs.icon;
  const [draft, setDraft] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);
  const editorRef = useRef<HTMLSpanElement>(null);
  const { container, iconBackground, content } = markdownClasses.callout;

  const iconElement =
    icon?.type === "image" ? (
      <img
        src={icon.src}
        alt={icon.alt}
        width={icon.width}
        className={markdownClasses.image}
      />
    ) : (
      icon?.value
    );

  const saveIcon = (value: string) => {
    const emoji = value.trim();
    // Neden: Yalnızca okuyucunun tekrar tanıyacağı emoji saklanır; boş değer ikonsuz callout demek.
    if (emoji && !calloutEmojiPattern.test(emoji)) {
      setInvalid(true);
      return;
    }
    updateAttributes({ icon: emoji ? { type: "emoji", value: emoji } : null });
    setDraft(null);
    setInvalid(false);
  };

  // Neden: Alan blur'da kapanmaz; işletim sisteminin emoji seçicisi (Linux'ta ayrı pencere) odağı alınca
  // input blur olur ve önceden kapanıyordu. Kapanma yalnızca Enter, Escape ya da sayfada başka yere tıklamayla olur;
  // pencere odağı geri gelince tarayıcı odağı aynı input'a döndürür ve seçicinin metni oraya düşer.
  useEffect(() => {
    if (draft === null) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!editorRef.current?.contains(event.target as Node)) saveIcon(draft);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  });

  return (
    <NodeViewWrapper as="aside" className={container}>
      {icon && (
        <div className={iconBackground} contentEditable={false}>
          {iconElement}
        </div>
      )}
      <div
        className={`${markdownClasses.callout.icon} ${icon ? "" : "opacity-40"}`}
        contentEditable={false}
      >
        {draft === null ? (
          <button
            type="button"
            title="İkonu değiştir"
            onClick={() => setDraft(icon?.type === "emoji" ? icon.value : "")}
            className="cursor-pointer"
          >
            {iconElement ?? "+"}
          </button>
        ) : (
          <span ref={editorRef} className="flex flex-col gap-1">
            <input
              // biome-ignore lint/a11y/noAutofocus: İkon alanı açıldığında doğrudan emoji yazılabilmeli.
              autoFocus
              value={draft}
              aria-invalid={invalid}
              onChange={(event) => {
                setDraft(event.target.value);
                setInvalid(false);
              }}
              onKeyDown={(event) => {
                // Neden: Enter dıştaki yazı formunu göndermemeli.
                if (event.key === "Enter") {
                  event.preventDefault();
                  saveIcon(draft);
                }
                if (event.key === "Escape") setDraft(null);
              }}
              className={`w-14 h-12 rounded-xl bg-body text-center text-3xl outline-hidden ${
                invalid
                  ? "ring-2 ring-red-400"
                  : "focus:ring-2 focus:ring-white"
              }`}
            />
            {invalid && (
              <span className="text-xs text-red-300 font-sora">
                Yalnızca emoji
              </span>
            )}
          </span>
        )}
      </div>
      {/* Neden: Tiptap içeriği NodeViewContent'in içine ayrı bir div olarak koyuyor; sitedeki *:first/last kuralları bir seviye derine uygulanır. */}
      <NodeViewContent
        className={`${content} [&>div>*:first-child]:mt-0 [&>div>*:last-child]:mb-0 [&>div>p]:leading-relaxed`}
      />
    </NodeViewWrapper>
  );
}
