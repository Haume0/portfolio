import { mergeAttributes, Node } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import {
  BulletList,
  ListItem,
  OrderedList,
  TaskItem,
  TaskList,
} from "@tiptap/extension-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import { markdownClasses } from "@/components/markdown-classes";
import type { CalloutIcon } from "./notion-markdown";

// İkon lib/notion-markdown'daki CalloutIcon nesnesidir; içerik normal bloklardır.
export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return { icon: { default: null, rendered: false } };
  },
  // Sitedeki callout'un markup'ı: ikon iki kez (bulanık arka plan + kendisi), sonra içerik.
  renderHTML({ node }) {
    const icon: CalloutIcon | null = node.attrs.icon;
    const iconSpec =
      icon?.type === "image"
        ? [
            "img",
            {
              src: icon.src,
              alt: icon.alt,
              width: icon.width ?? null,
              class: markdownClasses.image,
            },
          ]
        : (icon?.value ?? "");
    const {
      container,
      iconBackground,
      icon: iconClass,
      content,
    } = markdownClasses.callout;
    // Neden: İkon bu adımda düzenlenemez; contenteditable=false imlecin ikon alanına girmesini engeller.
    return icon
      ? [
          "aside",
          { class: container },
          [
            "div",
            { class: iconBackground, contenteditable: "false" },
            iconSpec,
          ],
          ["div", { class: iconClass, contenteditable: "false" }, iconSpec],
          ["div", { class: content }, 0],
        ]
      : ["aside", { class: container }, ["div", { class: content }, 0]];
  },
});

// Neden: Şemada karşılığı olmayan markdown (tablo, ham HTML, modellenmeyen inline yapılar) kaybolmasın diye
// kaynak metniyle birlikte düzenlenemez bir blok olarak taşınır ve aynen geri yazılır.
export const RawBlock = Node.create({
  name: "rawBlock",
  group: "block",
  atom: true,
  addAttributes() {
    return { source: { default: "", rendered: false } };
  },
  renderHTML({ node }) {
    return ["pre", { "data-type": "raw-block" }, node.attrs.source];
  },
});

// Notion markdown lehçesinin kapalı kümesi: markdown'ın saklayamadığı şeyler (altı çizili, renk, hizalama) bilerek yok.
export const editorExtensions = [
  Document,
  Paragraph.configure({ HTMLAttributes: { class: markdownClasses.paragraph } }),
  Text,
  Heading.extend({
    // Neden: Sitede her seviyenin kendi sınıfı var; Heading tek HTMLAttributes kabul ettiği için seviyeye göre seçilir.
    renderHTML({ node, HTMLAttributes }) {
      const level = node.attrs.level as keyof typeof markdownClasses.heading;
      return [
        `h${level}`,
        mergeAttributes(HTMLAttributes, {
          class: markdownClasses.heading[level],
        }),
        0,
      ];
    },
  }),
  BulletList.configure({
    HTMLAttributes: { class: markdownClasses.bulletList },
  }),
  OrderedList.configure({
    HTMLAttributes: { class: markdownClasses.orderedList },
  }),
  ListItem.configure({ HTMLAttributes: { class: markdownClasses.listItem } }),
  TaskList,
  TaskItem.configure({
    nested: true,
    HTMLAttributes: { class: markdownClasses.taskItem },
  }),
  Blockquote.configure({
    HTMLAttributes: { class: markdownClasses.blockquote },
  }),
  CodeBlock.extend({
    // Neden: Sitedeki highlight.js teması .hljs sınıfına bağlı; editörde de kod rengi ve zemini aynı olsun.
    renderHTML({ node, HTMLAttributes }) {
      const language = node.attrs.language
        ? ` language-${node.attrs.language}`
        : "";
      return [
        "pre",
        mergeAttributes(HTMLAttributes, { class: markdownClasses.codeBlock }),
        ["code", { class: `hljs${language}` }, 0],
      ];
    },
  }),
  HorizontalRule.configure({
    HTMLAttributes: { class: markdownClasses.horizontalRule },
  }),
  Image.extend({
    // Neden: Sitede tek başına görsel bir paragrafın içinde render ediliyor; boşluklar aynı kalsın diye aynı sarmalayıcı kullanılır.
    renderHTML({ HTMLAttributes }) {
      return [
        "p",
        { class: markdownClasses.paragraph },
        [
          "img",
          mergeAttributes(HTMLAttributes, { class: markdownClasses.image }),
        ],
      ];
    },
  }),
  Callout,
  RawBlock,
  HardBreak,
  Bold.configure({ HTMLAttributes: { class: markdownClasses.bold } }),
  Italic.configure({ HTMLAttributes: { class: markdownClasses.italic } }),
  Strike.configure({ HTMLAttributes: { class: markdownClasses.strike } }),
  Code.configure({ HTMLAttributes: { class: markdownClasses.code } }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { class: markdownClasses.link },
  }),
];
