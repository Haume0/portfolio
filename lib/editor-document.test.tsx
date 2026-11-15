/// <reference types="bun" />
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { describe, expect, test } from "bun:test";
import { getSchema, type JSONContent } from "@tiptap/core";
import matter from "gray-matter";
import { renderToStaticMarkup } from "react-dom/server";
import MarkdownRenderer from "@/components/md-renderer";
import { documentToMarkdown, markdownToDocument } from "./editor-document";
import { editorExtensions } from "./editor-schema";

const schema = getSchema(editorExtensions);

const contentFiles = execFileSync(
  "git",
  ["ls-files", "public/blogs/*/index.md", "public/works/*/index.md"],
  { encoding: "utf8" },
)
  .split("\n")
  .filter(Boolean);

const render = (markdown: string) =>
  renderToStaticMarkup(<MarkdownRenderer content={markdown} />);

describe("içerik round-trip", () => {
  test.each(contentFiles)("%s", (file) => {
    const { content } = matter(fs.readFileSync(file, "utf8"));
    const doc = markdownToDocument(content);
    const written = documentToMarkdown(doc);

    // Neden: Editörde açılıp kaydedilen bir yazının dokunulmamış kısımları sitede aynı görünmeli.
    expect(render(written)).toBe(render(content));
    expect(() => schema.nodeFromJSON(doc).check()).not.toThrow();
    expect(documentToMarkdown(markdownToDocument(written))).toBe(written);
  });
});

const roundTrip = (markdown: string) =>
  documentToMarkdown(markdownToDocument(markdown));

const firstBlock = (markdown: string): JSONContent =>
  markdownToDocument(markdown).content?.[0] ?? {};

describe("odak durumları", () => {
  test("paragraf çocuklu toggle maddesi içeriğini korur", () => {
    const toggle = firstBlock("- Naber?\n\n    İyidir senden?\n\n    e1edwf\n");

    expect(toggle.type).toBe("bulletList");
    expect(toggle.content?.[0].content?.map((child) => child.type)).toEqual([
      "paragraph",
      "paragraph",
      "paragraph",
    ]);
    expect(roundTrip("- Naber?\n\n    İyidir senden?\n\n    e1edwf\n")).toBe(
      "- Naber?\n\n  İyidir senden?\n\n  e1edwf\n",
    );
  });

  test("aynı paragraftaki devam satırları satır sonu olarak kalır", () => {
    const markdown =
      "1. **Behance**\nDünyanın portföyleri.\nBağlantı: [behance.net](http://behance.net)\n2. **Awwwards**\n";
    const item = firstBlock(markdown).content?.[0].content?.[0];

    expect(item?.content?.map((node) => node.type)).toEqual([
      "text",
      "hardBreak",
      "text",
      "hardBreak",
      "text",
      "text",
    ]);
    expect(roundTrip(markdown)).toBe(
      "1. **Behance**\n   Dünyanın portföyleri.\n   Bağlantı: [behance.net](http://behance.net)\n2. **Awwwards**\n",
    );
  });

  test("iç içe bullet, numaralı ve task listeleri", () => {
    const markdown =
      "- a\n  - b\n    - c\n\n---\n\n1. a\n   1. b\n\n---\n\n- [ ] a\n  - [x] b\n";
    const doc = markdownToDocument(markdown);

    expect(doc.content?.map((node) => node.type)).toEqual([
      "bulletList",
      "horizontalRule",
      "orderedList",
      "horizontalRule",
      "taskList",
    ]);
    expect(doc.content?.[4].content?.[0].content?.[1]).toMatchObject({
      type: "taskList",
      content: [{ type: "taskItem", attrs: { checked: true } }],
    });
    expect(roundTrip(markdown)).toBe(markdown);
  });

  test("emoji ikonlu callout", () => {
    const markdown = "<aside>\n💡\n\nMerhaba\n\n</aside>\n";

    expect(firstBlock(markdown)).toMatchObject({
      type: "callout",
      attrs: { icon: { type: "emoji", value: "💡" } },
      content: [{ type: "paragraph" }],
    });
    expect(roundTrip(markdown)).toBe(markdown);
  });

  test("görsel ikonlu callout", () => {
    const markdown =
      '<aside>\n<img src="/a/icon.jpg" alt="ikon" width="40px" />\n\nMerhaba\n\n</aside>\n';

    expect(firstBlock(markdown)).toMatchObject({
      type: "callout",
      attrs: { icon: { type: "image", src: "/a/icon.jpg", width: "40px" } },
    });
    expect(roundTrip(markdown)).toBe(markdown);
  });

  test("özel karakterler dokümanda çıplak, dosyada kaçışlı", () => {
    const doc: JSONContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "a * b _ c [d]" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "# başlık değil" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "1. liste değil" }],
        },
      ],
    };
    const written = documentToMarkdown(doc);

    expect(written).toBe(
      "a \\* b \\_ c \\[d]\n\n\\# başlık değil\n\n1\\. liste değil\n",
    );
    expect(markdownToDocument(written)).toEqual(doc);
  });

  test("içeriksiz callout kaydedilip açılınca callout kalır", () => {
    const doc: JSONContent = {
      type: "doc",
      content: [
        {
          type: "callout",
          attrs: { icon: { type: "emoji", value: "💡" } },
          content: [{ type: "paragraph" }],
        },
      ],
    };
    const written = documentToMarkdown(doc);

    expect(written).toBe("<aside>\n💡\n\n</aside>\n");
    expect(markdownToDocument(written)).toEqual(doc);
    expect(() => schema.nodeFromJSON(doc).check()).not.toThrow();
  });

  test("yüklemesi süren görsel dosyaya yazılmaz", () => {
    const doc: JSONContent = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "önce" }] },
        {
          type: "image",
          attrs: { src: "blob:http://localhost/abc", alt: "x" },
        },
        { type: "image", attrs: { src: "/blogs/hi/assets/a.png", alt: "a" } },
      ],
    };

    expect(documentToMarkdown(doc)).toBe(
      "önce\n\n![a](/blogs/hi/assets/a.png)\n",
    );
  });
});
