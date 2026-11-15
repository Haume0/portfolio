/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import type { List, Root } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { isToggleListItem, notionRemarkPlugins } from "./notion-markdown";

const parse = (markdown: string) => {
  const processor = unified().use(remarkParse).use(notionRemarkPlugins);
  return processor.runSync(processor.parse(markdown)) as Root;
};

describe("callout", () => {
  test("emoji ikonlu aside callout olur", () => {
    const tree = parse("<aside>\n💡\n\nMerhaba\n\n</aside>");

    expect(tree.children).toHaveLength(1);
    expect(tree.children[0]).toMatchObject({
      type: "callout",
      icon: { type: "emoji", value: "💡" },
      children: [{ type: "paragraph" }],
    });
  });

  test("görsel ikonlu aside callout olur", () => {
    const tree = parse(
      '<aside>\n<img src="/a/icon.jpg" alt="ikon" width="40px" />\n\nMerhaba\n\n### Başlık\n\n</aside>',
    );

    expect(tree.children).toHaveLength(1);
    expect(tree.children[0]).toMatchObject({
      type: "callout",
      icon: { type: "image", src: "/a/icon.jpg", alt: "ikon", width: "40px" },
      children: [{ type: "paragraph" }, { type: "heading", depth: 3 }],
    });
  });

  test("ikonsuz aside callout olur", () => {
    const tree = parse("<aside>\n\nMerhaba\n\n</aside>");

    expect(tree.children).toHaveLength(1);
    expect(tree.children[0]).toMatchObject({
      type: "callout",
      icon: null,
      children: [{ type: "paragraph" }],
    });
  });

  test("kapanmayan aside olduğu gibi kalır", () => {
    const tree = parse("<aside>\n💡\n\nMerhaba");

    expect(tree.children.map((node) => node.type)).toEqual([
      "html",
      "paragraph",
    ]);
  });
});

describe("isToggleListItem", () => {
  const firstItem = (markdown: string) => {
    const list = parse(markdown).children[0] as List;
    return isToggleListItem(list.children[0], list);
  };

  test("özet ve altında paragraflar olan madde toggle'dır", () => {
    expect(firstItem("- Özet\n\n    Gövde\n\n    İkinci")).toBe(true);
  });

  test("yalnızca iç içe liste taşıyan madde toggle değildir", () => {
    expect(firstItem("- Üst\n    - Alt")).toBe(false);
  });

  test("içerik taşıyan task maddesi toggle değildir", () => {
    expect(firstItem("- [ ] Görev\n\n    Açıklama")).toBe(false);
  });

  test("içerik taşıyan numaralı liste maddesi toggle değildir", () => {
    expect(firstItem("1. Madde\n\n    Açıklama")).toBe(false);
  });
});
