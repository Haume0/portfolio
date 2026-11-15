import type { List, ListItem, Nodes, Parent, Root, RootContent } from "mdast";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

// Neden: Notion callout ikonu olarak tek başına emoji kullanıyor; satır yalnızca emoji karakterlerinden oluşuyorsa ikon sayılır.
export const calloutEmojiPattern =
  /^(\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Extended_Pictographic}|\p{Emoji_Component}|️|‍)+$/u;

export type CalloutIcon =
  | { type: "emoji"; value: string }
  | { type: "image"; src: string; alt: string; width?: string };

export interface Callout extends Parent {
  type: "callout";
  icon: CalloutIcon | null;
}

declare module "mdast" {
  interface RootContentMap {
    callout: Callout;
  }
  interface BlockContentMap {
    callout: Callout;
  }
}

// Notion export'unda callout şu kardeş node'lar olarak gelir:
// html "<aside>\n<ikon>" → blok node'lar → html "</aside>". Bu dizi tek bir callout node'una çevrilir.
function remarkNotionCallout() {
  const transform = (parent: Parent) => {
    for (let i = 0; i < parent.children.length; i++) {
      const open = parent.children[i];
      if (open.type !== "html" || !open.value.startsWith("<aside>")) continue;

      const closeIndex = parent.children.findIndex(
        (node, j) =>
          j > i && node.type === "html" && node.value.trim() === "</aside>",
      );
      // Neden: Kapanışı bulunamayan aside'a dokunulmaz; rehype-raw onu bugünkü gibi ham HTML olarak render eder.
      if (closeIndex === -1) continue;

      const iconSource = open.value.slice("<aside>".length).trim();
      const imageAttributes = /^<img\s[^>]*>$/.test(iconSource)
        ? Object.fromEntries(
            Array.from(iconSource.matchAll(/(\w+)="([^"]*)"/g), (m) => [
              m[1],
              m[2],
            ]),
          )
        : null;

      let icon: CalloutIcon | null = null;
      if (calloutEmojiPattern.test(iconSource)) {
        icon = { type: "emoji", value: iconSource };
      } else if (imageAttributes?.src) {
        icon = {
          type: "image",
          src: imageAttributes.src,
          alt: imageAttributes.alt ?? "",
          width: imageAttributes.width,
        };
      } else if (iconSource !== "") {
        // Neden: Açılış satırında ikon dışında bir şey varsa şekil tanınmıyor; aside ham HTML olarak kalır.
        continue;
      }

      const callout: Callout = {
        type: "callout",
        icon,
        children: parent.children.slice(i + 1, closeIndex),
        data: {
          hName: "aside",
          // Neden: rehype-raw ağacı HTML üzerinden yeniden kurduğu için property'ler string'e döner; ikon nesnesi JSON olarak taşınır.
          hProperties: icon ? { dataCalloutIcon: JSON.stringify(icon) } : {},
        },
      };
      parent.children.splice(i, closeIndex - i + 1, callout);
    }

    for (const child of parent.children as RootContent[]) {
      if ("children" in child) transform(child);
    }
  };

  return (tree: Root) => transform(tree);
}

// Neden: Notion toggle'ı, ilk satırı özet olan ve altında girintili blokları bulunan bir madde olarak export ediyor.
// Yalnızca iç içe liste taşıyan madde normal liste kalır; task ve numaralı liste maddeleri toggle olmaz.
export function isToggleListItem(item: ListItem, list: List): boolean {
  const [summary, ...body] = item.children;
  return (
    !list.ordered &&
    typeof item.checked !== "boolean" &&
    summary?.type === "paragraph" &&
    body.some((child) => child.type !== "list")
  );
}

function remarkNotionListItems() {
  const transform = (node: Nodes) => {
    if (node.type === "list") {
      for (const item of node.children) {
        const [first] = item.children;
        const firstText =
          first?.type === "paragraph" ? first.children[0] : undefined;
        // Neden: Notion task maddelerini "- [ ]  metin" diye iki boşlukla export ediyor; ikinci boşluk içerik değil.
        if (typeof item.checked === "boolean" && firstText?.type === "text") {
          firstText.value = firstText.value.replace(/^ +/, "");
        }

        if (!isToggleListItem(item, node)) continue;
        // Neden: rehype-raw property'leri string'e çevirdiği için bayrak "true" metniyle taşınır.
        item.data = { ...item.data, hProperties: { dataToggle: "true" } };
        // Neden: Sıkı listelerde mdast-to-hast p'leri açıp özetin sınırını kaybettiriyor; özet ayrı bir element olarak kalsın.
        item.children[0].data = { ...item.children[0].data, hName: "summary" };
      }
    }
    if ("children" in node) {
      for (const child of node.children) transform(child);
    }
  };

  return (tree: Root) => transform(tree);
}

export const notionRemarkPlugins = [
  remarkGfm,
  remarkBreaks,
  remarkNotionCallout,
  remarkNotionListItems,
];
