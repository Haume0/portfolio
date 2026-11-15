import type { JSONContent } from "@tiptap/core";
import type {
  BlockContent,
  List,
  ListItem,
  Nodes,
  PhrasingContent,
  Root,
  RootContent,
} from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { type Callout, notionRemarkPlugins } from "./notion-markdown";

type Mark = NonNullable<JSONContent["marks"]>[number];

const reader = unified().use(remarkParse).use(notionRemarkPlugins);

const writer = unified()
  .use(remarkGfm)
  .use(remarkStringify, {
    bullet: "-",
    rule: "-",
    fences: true,
    handlers: {
      // Neden: Lehçe remark-breaks kullanıyor; tek satır sonu zaten <br> olduğu için "\" veya iki boşluk yazılmaz.
      break: () => "\n",
      callout: (node: Callout, _parent, state, info) => {
        const icon =
          node.icon?.type === "emoji"
            ? node.icon.value
            : node.icon
              ? `<img src="${node.icon.src}" alt="${node.icon.alt}"${node.icon.width ? ` width="${node.icon.width}"` : ""} />`
              : "";
        // Notion export'u: <aside>, ikon satırı, boş satır, içerik, boş satır, </aside>.
        const content = state.containerFlow(node, info);
        return content
          ? `<aside>${icon && `\n${icon}`}\n\n${content}\n\n</aside>`
          : `<aside>${icon && `\n${icon}`}\n\n</aside>`;
      },
    },
  });

// Neden: Liste girintisi Notion'daki gibi türetilir: ilk paragraftan sonra liste dışı blok taşıyan madde gevşektir
// (bullet listede bu tam olarak isToggleListItem'ın toggle dediği maddedir), diğerleri sıkıdır.
const isSpreadItem = (item: JSONContent) =>
  (item.content ?? []).slice(1).some((child) => !child.type?.endsWith("List"));

export function markdownToDocument(markdown: string): JSONContent {
  const tree = reader.runSync(reader.parse(markdown)) as Root;

  const raw = (node: Nodes): JSONContent => {
    const { start, end } = node.position ?? {};
    const lines = markdown.slice(start?.offset, end?.offset).split("\n");
    // Neden: Liste ve alıntı içindeki node'ların devam satırlarında container öneki var; yazarken container onu yeniden ekler.
    const prefix = new RegExp(`^[ \\t>]{0,${(start?.column ?? 1) - 1}}`);
    const source = lines
      .map((line, i) => (i === 0 ? line : line.replace(prefix, "")))
      .join("\n");
    return { type: "rawBlock", attrs: { source } };
  };

  // Desteklenmeyen bir inline yapı varsa null döner; paragrafın tamamı ham kalır.
  const inline = (
    nodes: PhrasingContent[],
    marks: Mark[] = [],
  ): JSONContent[] | null => {
    const result: JSONContent[] = [];
    for (const node of nodes) {
      const withMarks = marks.length ? { marks } : {};
      if (node.type === "text") {
        if (node.value)
          result.push({ type: "text", text: node.value, ...withMarks });
        continue;
      }
      if (node.type === "break") {
        result.push({ type: "hardBreak", ...withMarks });
        continue;
      }
      if (node.type === "inlineCode") {
        // Neden: Tiptap'in code mark'ı diğer mark'ları dışlıyor; kalın/link içindeki kod şemada ifade edilemez.
        if (marks.length) return null;
        result.push({
          type: "text",
          text: node.value,
          marks: [{ type: "code" }],
        });
        continue;
      }
      const mark: Mark | null =
        node.type === "strong"
          ? { type: "bold" }
          : node.type === "emphasis"
            ? { type: "italic" }
            : node.type === "delete"
              ? { type: "strike" }
              : node.type === "link"
                ? {
                    type: "link",
                    attrs: { href: node.url, title: node.title ?? null },
                  }
                : null;
      if (!mark || marks.some((m) => m.type === mark.type)) return null;
      const children = inline(
        (node as { children: PhrasingContent[] }).children,
        [...marks, mark],
      );
      if (!children) return null;
      result.push(...children);
    }
    return result;
  };

  const block = (node: RootContent): JSONContent => {
    switch (node.type) {
      case "paragraph": {
        const [only] = node.children;
        if (node.children.length === 1 && only.type === "image") {
          return {
            type: "image",
            attrs: {
              src: only.url,
              alt: only.alt ?? null,
              title: only.title ?? null,
            },
          };
        }
        const content = inline(node.children);
        return content ? { type: "paragraph", content } : raw(node);
      }
      case "heading": {
        const content = inline(node.children);
        return content
          ? { type: "heading", attrs: { level: node.depth }, content }
          : raw(node);
      }
      case "thematicBreak":
        return { type: "horizontalRule" };
      case "blockquote":
        return node.children.length
          ? { type: "blockquote", content: node.children.map(block) }
          : raw(node);
      case "code":
        // Neden: Fence meta bilgisi şemada yok; kaybolmasın diye meta'lı kod bloğu ham kalır.
        if (node.meta) return raw(node);
        return {
          type: "codeBlock",
          attrs: { language: node.lang ?? null },
          content: node.value ? [{ type: "text", text: node.value }] : [],
        };
      case "callout":
        return {
          type: "callout",
          attrs: { icon: node.icon },
          // Neden: Editörde yeni eklenip boş bırakılan callout'un içeriği yok; şema en az bir blok istediği için boş paragraf alır.
          content: node.children.length
            ? node.children.map(block)
            : [{ type: "paragraph" }],
        };
      case "list":
        return list(node) ?? raw(node);
      default:
        return raw(node);
    }
  };

  // Tiptap'te task listesi ayrı bir node; karışık veya numaralı task listesi ve paragrafla başlamayan madde ifade edilemez.
  const list = (node: List): JSONContent | null => {
    const isTask = node.children.every(
      (item) => typeof item.checked === "boolean",
    );
    const isPlain = node.children.every(
      (item) => typeof item.checked !== "boolean",
    );
    if (!(isPlain || (isTask && !node.ordered))) return null;

    const items = node.children.map((item: ListItem) => ({
      type: isTask ? "taskItem" : "listItem",
      ...(isTask ? { attrs: { checked: item.checked } } : {}),
      content: item.children.map((child) => block(child as BlockContent)),
    }));
    if (items.some((item) => item.content[0]?.type !== "paragraph"))
      return null;

    if (isTask) return { type: "taskList", content: items };
    return node.ordered
      ? {
          type: "orderedList",
          attrs: { start: node.start ?? 1 },
          content: items,
        }
      : { type: "bulletList", content: items };
  };

  const content = tree.children.map(block);
  // Neden: Tiptap dokümanı en az bir blok ister; boş gövde boş bir paragraf olur ve boş markdown olarak geri yazılır.
  return {
    type: "doc",
    content: content.length ? content : [{ type: "paragraph" }],
  };
}

export function documentToMarkdown(doc: JSONContent): string {
  const phrasing = (nodes: JSONContent[] = []): PhrasingContent[] => {
    const root: PhrasingContent[] = [];
    const open: { mark: Mark; children: PhrasingContent[] }[] = [];
    const sameMark = (a: Mark, b: Mark) =>
      a.type === b.type && a.attrs?.href === b.attrs?.href;

    for (const node of nodes) {
      const marks = (node.marks ?? []).filter((mark) => mark.type !== "code");
      // Neden: Hâlâ aktif olan mark'lar açık kalır ki "*a **b***" gibi iç içe yapılar aynı şekilde geri yazılsın.
      const firstClosed = open.findIndex(
        (o) => !marks.some((m) => sameMark(m, o.mark)),
      );
      if (firstClosed !== -1) open.length = firstClosed;

      for (const mark of marks) {
        if (open.some((o) => sameMark(o.mark, mark))) continue;
        const children: PhrasingContent[] = [];
        const wrapper: PhrasingContent =
          mark.type === "bold"
            ? { type: "strong", children }
            : mark.type === "italic"
              ? { type: "emphasis", children }
              : mark.type === "strike"
                ? { type: "delete", children }
                : {
                    type: "link",
                    url: mark.attrs?.href,
                    title: mark.attrs?.title ?? null,
                    children,
                  };
        (open.at(-1)?.children ?? root).push(wrapper);
        open.push({ mark, children });
      }

      const leaf: PhrasingContent =
        node.type === "hardBreak"
          ? { type: "break" }
          : node.marks?.some((mark) => mark.type === "code")
            ? { type: "inlineCode", value: node.text ?? "" }
            : { type: "text", value: node.text ?? "" };
      (open.at(-1)?.children ?? root).push(leaf);
    }
    return root;
  };

  const block = (node: JSONContent): RootContent => {
    switch (node.type) {
      case "paragraph":
        return { type: "paragraph", children: phrasing(node.content) };
      case "heading":
        return {
          type: "heading",
          depth: node.attrs?.level,
          children: phrasing(node.content),
        };
      case "image":
        return {
          type: "paragraph",
          children: [
            {
              type: "image",
              url: node.attrs?.src,
              alt: node.attrs?.alt,
              title: node.attrs?.title,
            },
          ],
        };
      case "horizontalRule":
        return { type: "thematicBreak" };
      case "codeBlock":
        return {
          type: "code",
          lang: node.attrs?.language ?? null,
          value: node.content?.map((text) => text.text).join("") ?? "",
        };
      case "blockquote":
        return {
          type: "blockquote",
          children: (node.content ?? []).map(block) as BlockContent[],
        };
      case "callout":
        return {
          type: "callout",
          icon: node.attrs?.icon ?? null,
          children: (node.content ?? []).map(block),
        };
      case "bulletList":
      case "orderedList":
      case "taskList": {
        const items = node.content ?? [];
        return {
          type: "list",
          ordered: node.type === "orderedList",
          start: node.type === "orderedList" ? node.attrs?.start : null,
          spread: items.some(isSpreadItem),
          children: items.map((item) => ({
            type: "listItem",
            spread: isSpreadItem(item),
            checked:
              item.type === "taskItem" ? Boolean(item.attrs?.checked) : null,
            children: (item.content ?? []).map(block) as BlockContent[],
          })),
        };
      }
      case "rawBlock":
        return { type: "html", value: node.attrs?.source ?? "" };
      default:
        throw new Error(`Bilinmeyen doküman node'u: ${node.type}`);
    }
  };

  // Neden: blob: kaynaklı görsel yüklemesi süren görseldir; geçici adres hiçbir zaman dosyaya yazılmaz.
  const withoutUploads = (node: JSONContent): JSONContent => ({
    ...node,
    content: node.content
      ?.filter(
        (child) =>
          !(
            child.type === "image" &&
            String(child.attrs?.src).startsWith("blob:")
          ),
      )
      .map(withoutUploads),
  });
  // Neden: Markdown boş paragraf saklayamaz; editörün sona eklediği veya boş bıraktığı paragraflar yazılmaz.
  const blocks = (withoutUploads(doc).content ?? []).filter(
    (node) => !(node.type === "paragraph" && !node.content?.length),
  );
  return writer.stringify({ type: "root", children: blocks.map(block) });
}
