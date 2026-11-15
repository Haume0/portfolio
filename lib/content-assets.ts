import fs from "node:fs/promises";
import path from "node:path";

// Görsel dosya adı, Notion zip import'undaki kuralla aynı: Türkçe harfler sadeleşir, geri kalan "-" olur.
export function safeAssetName(fileName: string) {
  const extensionStart = fileName.lastIndexOf(".");
  const base =
    extensionStart > 0 ? fileName.slice(0, extensionStart) : fileName;
  const extension =
    extensionStart > 0 ? fileName.slice(extensionStart).toLowerCase() : "";
  const trMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };
  const slug =
    base
      .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (char) => trMap[char] || char)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "gorsel";
  return `${slug}${extension}`;
}

// Neden: Kaydetmede silinecek dosyalar buradan çıkar; yanlış pozitif dosya kaybı demek. Bir dosya,
// assetsUrl'den sonra adı (encode edilmiş ya da edilmemiş) herhangi bir yerde geçiyorsa kullanılıyor sayılır:
// markdown görseli, callout'un <img> ikonu, frontmatter. Başka yazının yolu bu yazının dosyasını tutmaz.
export function unreferencedAssets(
  markdown: string,
  assetsUrl: string,
  fileNames: string[],
) {
  const prefix = assetsUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const referenced = new Set<string>();
  for (const match of markdown.matchAll(
    new RegExp(`${prefix}([^\\s"'()<>\\]]+)`, "g"),
  )) {
    try {
      referenced.add(decodeURIComponent(match[1]));
    } catch {
      referenced.add(match[1]);
    }
  }
  return fileNames.filter(
    (name) => !referenced.has(name) && !markdown.includes(assetsUrl + name),
  );
}

// Yazı kaydedildikten sonra içeriğin assets/ klasöründe artık kullanılmayan dosyaları siler.
// Yalnızca klasörün doğrudan içindeki düz dosyalar aday olur; kapak gibi klasör dışındaki dosyalara dokunulmaz.
export async function removeUnreferencedAssets(
  contentDirectory: string,
  assetsUrl: string,
  markdown: string,
) {
  const assetsDirectory = path.join(contentDirectory, "assets");
  const fileNames = (
    await fs.readdir(assetsDirectory, { withFileTypes: true }).catch(() => [])
  )
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);
  for (const name of unreferencedAssets(markdown, assetsUrl, fileNames)) {
    await fs.rm(path.join(assetsDirectory, name));
  }
}
